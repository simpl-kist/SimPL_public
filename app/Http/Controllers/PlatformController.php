<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CmsEnv;
use App\User;
use App\Page;
use App\Plugin;
use App\Job;
use App\Repository;
use App\Solver;
use Log;
use ZipArchive;
class PlatformController extends Controller
{
	public function getEnvironment(){
		$env = [];
		$cmsenv = CmsEnv::get();
		foreach($cmsenv as $_e){
			$env[$_e["var_key"]]=$_e["var_value"];
		}
		return $env;
	}
	public function updateEnvironment(Request $request){
		$Env = ["url","logo","default_policy","repo_upload_permission","allow_api_run","leave_test_file","header","footer","jobdir","python2","python3","mpirun","ex_jobdir","qname","qsub","qstat","qdel","storage","req_affil", "req_phone"];
		$data = [];
		foreach($Env as $e){
			if($request->input($e) !== null){
				$_env = CmsEnv::findOrNew($e);
				$_env->var_key = $e;
				$_env->var_value = $request->input($e);
				$_env->save();
			}else{
				$_env = CmsEnv::findOrNew($e);
				$_env->var_key = $e;
				$_env->var_value = "";
				$_env->save();
			}
		}
		return ["message"=>"Success","status"=>"Success"];
	}
	public function statistics(){
		$env = $this->getEnvironment();
		$stat = [];
		$stat["total_users"] = User::count();
		$stat["total_pages"] = Page::count();
		$stat["total_plugins"] = Plugin::count();
		$stat["total_files"] = Repository::count();
		$stat["total_solvers"] = Solver::count();
		$stat["total_jobs"] = Job::count();
		$stat["total_visitors"] = 0;
		$today = preg_split("/\s+/",Date(now()))[0];
		$stat["today_users"] = User::where("created_at", ">" , $today)->count();
		$stat["today_jobs"] = Job::where("created_at", ">" , $today)->count();
		$stat["today_visitors"] = 0;
		$stat["running_jobs"] = Job::where("status","running")->count();
		$stat["node_usage"] = [0,1];
		$pumat_addr = $env["pumat_address"]."/queue";
		$pumat_addr = explode("://",$pumat_addr);
		$pumat_addr[1] = preg_replace("/\/+/","/",$pumat_addr[1]);
		$pumat_addr = implode("://",$pumat_addr);
		if(isset($env["pumat_address"]) && $env["pumat_address"] !== ""){
			if(isset($env["pumat_key"]) && $env["pumat_key"] !== ""){
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $pumat_addr);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
				$response = json_decode(trim(curl_exec($ch)));
				curl_close($ch);
				$stat["node_usage"] = $response;
			}
		}
		$disk=[];
		if(isset($env["jobdir"]) && is_dir($env["jobdir"])){
			$disk[]=round(disk_free_space($env["jobdir"])/1073741824,2);
			$disk[]=round(disk_total_space($env["jobdir"])/1073741824,2);
		}else{
			$disk=[0,1];
		}
		$stat["jobdir_usage"] = $disk;
		$disk2=[];
		if(isset($env["storage"]) && is_dir($env["storage"])){
			$disk2[]=round(disk_free_space($env["storage"])/1073741824,2);
			$disk2[]=round(disk_total_space($env["storage"])/1073741824,2);
		}else{
			$disk2=[0,1];
		}
		$stat["repository_usage"] = $disk2;
		$jobs = Job::orderBy("id","desc")->limit(10)->get(['id','owner','pluginId','status','name']);
		for($i=0 ; $i<count($jobs) ; $i++){
			$user = User::where("id",$jobs[$i]->owner)->first();
			$name = "Unknown";
			if($user !== null){
				$name = $user->name;
			}
			$jobs[$i]->owner = $name;
			$pluginId = $jobs[$i]->pluginId;
			$plugin = Plugin::where("id",$jobs[$i]->pluginId)->first();
			$pname = "Unknown";
			if($pluginId === -1){
				$pname = "TEST";
			}else if($plugin !== null){
				$pname = $plugin->name;
			}
			$jobs[$i]->pluginId=$pname;
		}
		$stat["latest_jobs"]=$jobs;
		$joblist = Job::where("pluginId","!=",-1)->get(['id','pluginId']);
		$jobstat = [];
		for($i=0; $i<count($joblist) ; $i++){
			if(!isset($jobstat[$joblist[$i]->pluginId])){
				$jobstat[$joblist[$i]->pluginId]=0;
			}
			$jobstat[$joblist[$i]->pluginId]++;
		}
		$plugin_usage_total = 0;
		$plugin_usage = [];
		foreach($jobstat as $k => $v){
			$plugin = Plugin::where("id",$k)->first();
			$pname = "Unknown-".$k;
			$author = "Unknown";
			if($plugin !== null){
				$pname = $plugin->name;
				$author = $plugin->author;
				$u = User::where("id",$author)->first();
				if($u !== null){
					$author = $u->name;
				}
			}
			$plugin_usage_total+=$v;
			$plugin_usage[]=[$pname,$v,$k,$author];
		}
		$stat["plugin_usage"] = $plugin_usage;
		$stat["plugin_usage_total"] = $plugin_usage_total;
		return $stat;
	}
	public function backup(Request $request){
		$env = $this->getEnvironment();
		$tmpfolder = md5(now());
		mkdir("/data/SimPL/".$tmpfolder);
		$user=escapeshellcmd(env('DB_USERNAME'));
		$pass=escapeshellcmd(env('DB_PASSWORD'));
		$db=escapeshellcmd(env('DB_DATABASE'));
		$backup_target=json_decode($request->backup_object,true);
		if($backup_target===null){
			 return "Please Select At Least One Table.";
		}
		$filename=escapeshellcmd($db.(now()->format('Y-m-d_H-i-s'))."_".implode(",",$backup_target).".sql");
		$tables="";
		if(array_search("job",$backup_target)!==false && array_search("user",$backup_target)===false){
			array_push($backup_target,"user");
			array_push($backup_target,"password_resets");
		}
		for($i=0 ; $i<count($backup_target) ; $i++){
			$target_table="";
			switch($backup_target[$i]){
				case "user":
					$target_table="users password_resets";
					$zip = new ZipArchive;
					$res = $zip->open("/data/SimPL/".$tmpfolder."/users.zip", ZipArchive::CREATE);
					if($res === TRUE){
						$userpic = User::get(['mypic']);
						for($j=0 ; $j<count($userpic) ; $j++){
							if(is_file($env["storage"]."/userpic/".$userpic[$j]->mypic)){
								$pic = $userpic[$j]->mypic;
								$pic = preg_replace("/\/+/", "/", $pic);
								if($pic[0] === "/"){
									$pic = substr($pic, 1);
								}
								$zip->addFile($env["storage"]."/userpic/".$userpic[$j]->mypic, $pic);
							}
						}
						$zip->close();
					}else{
						Log::debug("Error while making zip file ".$res);
					}
					break;
				case "job":
					$target_table="vcms_job";
					break;
				case "plugin":
					$target_table="vcms_plugin";
					break;
				case "page":
					$target_table="vcms_pages";
					break;
				case "solver":
					$target_table="vcms_solvers";
					break;
				case "repository":
					$target_table="repositories";
					$zip = new ZipArchive;
					$res = $zip->open("/data/SimPL/".$tmpfolder."/repository.zip", ZipArchive::CREATE);
					if($res === TRUE){
						$repos = Repository::get();
						for($j=0 ; $j<count($repos) ; $j++){
							$fname = $repos[$j]->filename;
							$fname = preg_replace("/\/+/", "/", $fname);
							if($fname[0] === "/"){
								$fname = substr($fname, 1);
							}
							$zip->addFile($env["storage"]."/".$repos[$j]->filename, $fname);
						}
						$zip->close();
					}else{
						Log::debug("Error while making zip file ".$res);
					}
					break;

			}
			$tables.=$target_table." ";
		}
		exec('mysqldump --user='.$user.' --password='.$pass." ".$db.' '.$tables.' > /data/SimPL/'.$tmpfolder.'/'.$filename);
		$file_name = "/data/SimPL/backup-".(now()->format('Y-m-d_H-i-s')).".simplbk";
		$zip2 = new ZipArchive;
		$res2 = $zip2->open($file_name, ZipArchive::CREATE);
		if($res2 === TRUE){
			if(is_file("/data/SimPL/".$tmpfolder."/repository.zip")){
				$zip2->addFile("/data/SimPL/".$tmpfolder."/repository.zip", "repository.zip");
			}
			if(is_file("/data/SimPL/".$tmpfolder."/users.zip")){
				$zip2->addFile("/data/SimPL/".$tmpfolder."/users.zip", "users.zip");
			}

			$zip2->addFile("/data/SimPL/".$tmpfolder."/".$filename, $filename);
			$zip2->close();
		}
		if(is_file("/data/SimPL/".$tmpfolder."/repository.zip")){
			unlink("/data/SimPL/".$tmpfolder."/repository.zip");
		}
		if(is_file("/data/SimPL/".$tmpfolder."/users.zip")){
			unlink("/data/SimPL/".$tmpfolder."/users.zip");
		}

		unlink("/data/SimPL/".$tmpfolder."/".$filename);
		rmdir("/data/SimPL/".$tmpfolder);
		return response()->download($file_name)->deleteFileAfterSend(true);
	}
	public function recover(Request $request){
		$file = $request->file("file");
		$tmpfolder = "/data/SimPL/recover/".md5(now());
		while(is_dir($tmpfolder)){
			$tmpfolder = "/data/SimPL/recover/".md5(now());
		}
		mkdir($tmpfolder);
		$file->storeAs($tmpfolder, "recover.zip", 'root');
		$zip = new ZipArchive;
		$res = $zip->open($tmpfolder."/recover.zip");
		if($res === TRUE){
			$zip->extractTo($tmpfolder);
			$zip->close();
		}
		$flist = glob($tmpfolder."/*.sql");
		if(count($flist)>0){
			$this->recover_db($flist[0]);
		}
		if(is_file($tmpfolder."/repository.zip")){
			$this->recover_file($tmpfolder."/repository.zip");
		}
		if(is_file($tmpfolder."/users.zip")){
			$this->recover_file($tmpfolder."/users.zip", "userpic");
		}

		exec("rm -rf ".$tmpfolder);
		return ["message"=>"Recovery success", "status"=>"success"];
	}
	public function recover_db($filename){
		$user=escapeshellcmd(env('DB_USERNAME'));
		$pass=escapeshellcmd(env('DB_PASSWORD'));
		$db=escapeshellcmd(env('DB_DATABASE'));
		exec("mysql --user=".$user." --password=".$pass." ".$db." <".$filename, $output);
		return $output;
	}
	public function recover_file($filename, $sub=""){
		$env = $this->getEnvironment();
		$zip = new ZipArchive;
		$res = $zip->open($filename);
		if($res === TRUE){
			$zip->extractTo($env["storage"]."/".$sub);
			$zip->close();
		}
	}
	public function downloadTxt(Request $request){

		$filename = "";
		$content = "";
		if(isset($request->filename)){
			$filename = $request->filename;
		}
		if(isset($request->content)){
			$content = $request->content;
		}
		if($filename === "" || $content === ""){
			return;
		}else{
			Header("Content-Length: ".strlen($content));
			Header("content-Disposition: attachment; filename=$filename");
			Header("Content-type: text/plain");

			Header("Pragma: no-cache");
			Header("Expires: 0");
			echo $content;
			exit();
		}
	}
}
