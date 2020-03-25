<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Plugin;
use App\CmsEnv;
use App\Job;
use App\User;
use App\Repository;
class PluginController extends Controller
{
	private $env;
	public function __construct(){
		$environment = CmsEnv::get();
		$this->env = [];
		foreach($environment as $e){
			$this->env[$e->var_key] = $e->var_value;
		}
	}
	public function getList(){
		$plugins = Plugin::get(['id','name']);
		return $plugins;
	}
	public function loadPlugin(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$plugin = Plugin::where("id",$idx)->first();
		if($plugin === null){
			return ["message"=>"Invalid plugin ID","status"=>"Fail"];
		}
		if($user->can('read',$plugin)){
			if($user->can('update',$plugin)){
				return ["message"=>$plugin, "status"=>"Success"];
			}else{
				return ["message"=>$plugin, "status"=>"Unauthorized"];
			}
		}else{
			$plugin->script="Unauthroized";
			return ["message"=>$plugin, "status"=>"Unauthorized"];
		}
	}
	public function savePlugin(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$plugin = Plugin::where("id",$idx)->first();
		$name = $request->name;
		$alias = $request->alias;
		$type = $request->type;
		$includes = $request->includes;
		$is_public = $request->is_public;
		$script = $request->script;
		if($name === null || $name === ""){
			return ["message" => "Name is empty.", "status"=>"Fail"];
		}
		if($alias === null || $alias === ""){
			return ["message" => "Alias is empty.", "status"=>"Fail"];
		}
		if($type === null || $type === ""){
			return ["message" => "Type is empty.", "status"=>"Fail"];
		}
		if($is_public === null || $is_public === ""){
			return ["message" => "Required Qualification is empty.", "status"=>"Fail"];
		}
		if($script === null || $script === ""){
			return ["message" => "Script is empty.", "status"=>"Fail"];
		}
		if($includes === null){
			$includes = "";
		}
		if($plugin === null){
			$plugin = new Plugin;
			if(!$user->can('create', $plugin)){
				return ["message" => "No permission", "status"=>"Fail"];
			}
			$cnt = Plugin::where("name",$name)->count();
			if($cnt > 0){
				return ["message" => "Name already exists.", "status"=>"Fail"];
			}
			$cnt = Plugin::where("alias",$alias)->count();
			if($cnt > 0){
				return ["message" => "Alias already exists.", "status"=>"Fail"];
			}
		}else{
			if(!$user->can('update', $plugin)){
				return ["message" => "No permission", "status"=>"Fail"];
			}
			$cnt = Plugin::where("name",$name)->count();
			if($cnt > 1){
				return ["message" => "Name already exists.", "status"=>"Fail"];
			}else if($cnt === 1 && $name !== $plugin->name){
				return ["message" => "Name already exists.", "status"=>"Fail"];
			}

			$cnt = Plugin::where("alias",$alias)->count();
			if($cnt > 1){
				return ["message" => "Alias already exists.", "status"=>"Fail"];
			}else if($cnt === 1 && $alias !== $plugin->alias){
				return ["message" => "Alias already exists.", "status"=>"Fail"];
			}
		}

		$plugin->name = $name;
		$plugin->alias = $alias;
		$plugin->type = $type;
		$plugin->ispublic = $is_public;
		$plugin->includes = $includes;
		$plugin->role = "calculator";
		$plugin->author = $user->id;
		$plugin->script = $script;
		$plugin->save();
		return ["message" =>$plugin->id,"status"=>"Success"];
	}
	public function deletePlugin(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$plugin = Plugin::where("id",$idx)->first();
		if($user->can('delete',$plugin)){
			$plugin->delete();
			return ["message" => "Success", "status"=>"Success"];
		}else{
			return ["message" => "No permission", "status"=>"Fail"];
		}
	}
// TODO Run Script
	public function getScriptHeader($args){
		$user = Auth::user();
		$queue_addr = explode("://",$this->env['pumat_address']."/queue");
		$queue_addr[1] = preg_replace("/\/+/", "/", $queue_addr[1]);
		$queue_addr = implode("://", $queue_addr);
		$s = [];
		$s[] = 'import os';
		$s[] = 'import json';
		$s[] = 'import requests';
		$s[] = 'import subprocess';
		$s[] = 'def file_get_contents(filename, use_include_path = 0, context = None, offset = -1, maxlen = -1):';
		$s[] = '	if (filename.find("://") > 0):';
		$s[] = '		ret = requests.get(filename)';
		$s[] = '		ret = ret.text';
		$s[] = '		if (offset > 0):';
		$s[] = '			ret = ret[offset:]';
		$s[] = '		if (maxlen > 0):';
		$s[] = '			ret = ret[:maxlen]';
		$s[] = '		return ret';
		$s[] = '	else:';
		$s[] = '		fp = open(filename,"rb")';
		$s[] = '		try:';
		$s[] = '			if (offset > 0):';
		$s[] = '				fp.seek(offset)';
		$s[] = '			ret = fp.read(maxlen)';
		$s[] = '			return ret';
		$s[] = '		finally:';
		$s[] = '			fp.close( )';
		$s[] = 'def getSolver(name):';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/solvers/get/"+str(name))';
		$s[] = '	solver = ret.text';
		$s[] = '	return json.loads(solver)';
		$s[] = 'def qsub(params={}):';
		$s[] = '	if not \'nnodes\' in params:';
		$s[] = '		params[\'nnodes\']=1';
		$s[] = '	if not \'ppn\' in params:';
		$s[] = '		params[\'ppn\']=4';
		$s[] = '	if not \'mpi\' in params:';
		$s[] = '		params[\'mpi\']=True';
		$s[] = '	if not \'solverExec\' in params:';
		$s[] = '		return \'solverExec is not set\'';
		$s[] = '	f = open("qsub","w")';
		$s[] = '	pbsscript ="""#!/bin/sh';
		$s[] = '#PBS -N kCMS_Job';
		$s[] = '#PBS -q '.$this->env['qname'];
		$s[] = '#PBS -l nodes="""+str(params[\'nnodes\'])+""":ppn="""+str(params[\'ppn\'])+"""';
		$s[] = 'NPROCS=`cat $PBS_NODEFILE|wc -l`';
		$s[] = 'cd $PBS_O_WORKDIR';
		$s[] = '"""';
		$s[] = '	if \'pre\' in params:';
		$s[] = '		pbsscript=pbsscript+"\n"+params[\'pre\']';
		$s[] = '	if params[\'mpi\']:';
		$s[] = '		pbsscript=pbsscript+"\n'.$this->env['mpirun'].'"+" -machinefile $PBS_NODEFILE -np $NPROCS "';
		$s[] = '	else:';
		$s[] = '		pbsscript=pbsscript+"\n"';
		$s[] = '	pbsscript = pbsscript+params[\'solverExec\']+" > stdout 2>&1"';
		$s[] = '	pbsscript = pbsscript+"\ntouch finished"';
		$s[] = '	f.write(pbsscript)';
		$s[] = '	f.close()';
		$s[] = '	out = requests.post("'.$queue_addr.'",json={"execcmd":"cd '.$this->env["ex_jobdir"].'/'.$args['jobid'].';'.$this->env['qsub'].' qsub","user":"'.$this->env["ex_username"].'","key":"'.$this->env["pumat_key"].'"})';
		$s[] = '	return out';
		$s[] = 'def qstat(id=-1):';
		$s[] = '	qStat = "'.$this->env['qstat'].' -x"';
		$s[] = '	if(id<0):';
		$s[] = '		qStat = qStat+" -f"';
		$s[] = '	else:';
		$s[] = '		qStat = qStat+" "+str(id)+" 2>/dev/null"';
		$s[] = '	out = requests.post("'.$queue_addr.'",json={"execcmd":qStat,"user":"'.$this->env["ex_username"].'","key":"'.$this->env["pumat_key"].'"})';
		$s[] = '	return out';
		$s[] = 'def qdel(id=-1):';
		$s[] = '	qdel = "'.$this->env['qdel'].'"';
		$s[] = '	if id<0:';
		$s[] = '		return "Wrong QID"';
		$s[] = '	else:';
		$s[] = '		qdel = qdel+" "+str(id)+" 2>/dev/null"';
		$s[] = '	out = requests.post("'.$queue_addr.'",json={"execcmd":qdel,"user":"'.$this->env["ex_username"].'","key":"'.$this->env["pumat_key"].'"})';
		$s[] = '	return out';
		$s[] = 'def callPlugin(pluginAlias,pluginData):';
		$s[] = '	jsonData = {"alias":pluginAlias,"input":pluginData,"key":"'.$args['key'].'","length":'.$args['length'].'}';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/plugins/run",json=jsonData).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getMyInfo():';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/plugins/getMyInfo",json={"key":"'.$args['key'].'"}).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getRepo(alias):';
		$s[] = '	jsonData = {"alias":alias,"key":"'.$args['key'].'"}';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/plugins/getRepoforServer",jsonData).text';
		$s[] = '	return ret';
		$s[] = 'def saveJob(jobInfo):';
		$s[] = '	if "pluginId" not in jobInfo:';
		$s[] = '		jobInfo["pluginId"] = kCms["pluginId"]';
		if($user !== null){
			$s[] = '	jobInfo["owner"] = '.$user->id;
		}else{
			$s[] = '	jobInfo["owner"] = -1';
		}
		$s[] = '	if not "jobdir" in jobInfo : ';
		$s[] = '		jobInfo["jobdir"] = kCms["jobdir"]';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/plugins/saveJob",json=jobInfo).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getJobs(jobInfo):';
		$s[] = '	ret = requests.post("http://127.0.0.1/api/plugins/getJobs",json=jobInfo).text';
		$s[] = '	return ret';
		$s[] = 'kCms = {"pluginId" : -1}';

		if(isset($args['pluginId'])){
			if($args['pluginId']>0){
				$s[] = "kCms['pluginId'] = '".$args['pluginId']."'\n";
			}
		}
		if(isset($args['jobdir'])){
			$s[] = "kCms['jobdir'] = '".$args['jobdir']."'\n";
		}
		if(isset($args['jobid'])){
			$s[] = "kCms['jobid'] = '".$args['jobid']."'\n";
		}
		if(isset($args['input'])){
			$inputTmp = json_encode($args['input']);
			$inputTmp = str_replace('\\','\\\\', $inputTmp);
			$inputTmp = str_replace("'", "\'", $inputTmp);
			$s[] = "kCms['input'] = json.loads('".$inputTmp."')";
		}
		return implode("\n",$s);
	}
	public function loginCheckOrByKey($key){
		$__user = User::where('verification_code',$key)->get();
		if(count($__user)>0){
			Auth::loginUsingId($__user[0]->id,true);
		}else{
			return "wrong user";
		}
	}
	public function runPlugin(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			if(strrpos($_SERVER["HTTP_REFERER"],$_SERVER["HTTP_HOST"])===false){
				return "Wrong Access";
			}
		}else if(isset($_SERVER["REMOTE_ADDR"])){
			if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
				$can_access=$this->env["allow_api_run"];
				if($can_access*1 !== 1){
					return "Wrong Access";
				}
			}
		};
		if(!Auth::check()){
			$logincheck=$this->loginCheckOrByKey($request->key);
		}
		$user = Auth::user();
		$pluginId=-1;
		$codeType = "python2";
		$alias = "test";
		if($request->has('alias')){
			$alias = $request->input("alias");
		}
		$inc_data;
		$incContents = "";
		if($request->includes!="" || (isset($plugin) && $plugin->includes!="")){
			if($request->has('includes')){
			}else{
			}
		}

		if( !$request->has('istest') ){
//RUN SCRIPT
			$plugin = Plugin::where("alias",$alias)->first();
			if($plugin === null){
				return Array("output"=>"","error"=>"Plugin \"".$alias."\" Does Not Exist.");
			}
			if((isset($user) && !$user->can('run',$plugin)) || (!isset($user) && $plugin->ispublic*1 !== 0) ){
				return Array("ourput"=>"","error"=>"Unauthorized");
			}
			if($request->has('input')){
				$pluginInput = $request->input('input');
			}
			$inc_data=$plugin->includes;
			$pluginId = $plugin->id;
			$pluginFileContent = $plugin->script;
			$codeType = $plugin->type;
		}else{
//TEST SCRIPT
			if(!$user->can('create',new Plugin)){
				return Array("ourput"=>"","error"=>"Unauthorized");
			}
			if($request->has('script')){
				$pluginFileContent = $request->input('script');
			}
			if($request->has('testinput')){
				$pluginInput = json_decode($request->input('testinput'),true);
			}
			if($request->has('type')){
				$codeType = $request->type;
			}
			if($request->has('includes')){
				$inc_data=$request->input('includes');
			}
		}
		if($codeType !== "python2" && $codeType !== "python3"){
			$codeType = "python2";
		}

		if($request->has('length')){
			$pluginLength = $request->input('length')+1;
		}else{
			$pluginLength = 0;
		}
		if($pluginLength > 10) return Array("output"=>"","error"=>"Too may requests");

		$jobid = date("YmdHis")."_".md5(rand());
		$jobdir = $this->env['jobdir']."/".$jobid;
		mkdir($jobdir);
		chdir($jobdir);
/* Header */
		$headerFileName = 'kCmsHeader_global';
		$headerArgs = [
			'type'=>$codeType,
			'jobid'=>$jobid,
			'jobdir'=>$jobdir
		];
		if(isset($pluginInput)){
			$headerArgs['input']=$pluginInput;
		}
		$headerArgs['pluginId']=$pluginId;
		if($user !== null){
			$headerArgs['key']=$user->verification_code;
		}else{
			$headerArgs['key']=-1;
		}
		$headerArgs['length']=$pluginLength;
		$headerFileContent = $this->getScriptHeader($headerArgs);

		$fp = fopen($headerFileName.".py","w");
		fwrite($fp,$headerFileContent);
		fclose($fp);
/* Header End */
		$incContents=$this->makeInclude($inc_data,$incContents,$headerFileName);
// Write includes
		$pluginFileName = 'kCmsScript_'.Auth::id().'_'.$alias;
		$plugin_merged = "";
		$plugin_merged = "from $headerFileName import *\n";
		$plugin_merged.= $incContents;
		$plugin_merged.= $pluginFileContent;

		$fp = fopen($pluginFileName,"w");
		fwrite($fp,$plugin_merged);
		fclose($fp);
		switch($codeType){
			case "python2":
				$pythonPath = $this->env["python2"];
				break;
			case "python3":
				$pythonPath = $this->env["python3"];
				break;
		}
		if($pythonPath === null){
			$pythonPath = "/";
		}
//TODO
		$sysEnv = [
				'PATH'=>getenv("PATH"),
				'LD_LIBRARY_PATH'=>getenv('LD_LIBRARY_PATH'),
				'XDG_DATA_DIRS'=>getenv('XDG_DATA_DIRS'),
				'MANPATH'=>getenv('MANPATH'),
				'PKG_CONFIG_PATH'=>getenv('PKG_CONFIG_PATH'),
		];
		putenv('PATH='.$pythonPath.'/usr/bin/:'.$sysEnv['PATH']);
		putenv('LD_LIBRARY_PATH='.$pythonPath.'/usr/lib64/:'.$sysEnv['LD_LIBRARY_PATH'].":/usr/local/intel/composer_xe_2013.5.192/mkl/lib/intel64/");
		putenv('XDG_DATA_DIRS='.$pythonPath.'/usr/share/:'.$sysEnv['XDG_DATA_DIRS']);
		putenv('PKG_CONFIG_PATH='.$pythonPath.'/usr/lib64/pkgconfig/');
		putenv('MANPATH='.$pythonPath.'/usr/share/man');
		$descriptorspec = array(
			0 => array("pipe", "r"),// stdin
			1 => array("pipe", "w"),// stdout
			2 => array("pipe", "w"),// stderr
		);
		$process = proc_open($pythonPath.' '.$pluginFileName, $descriptorspec, $pipes, $jobdir, null);
		$output = Array('output'=>stream_get_contents($pipes[1]),
						'error'=>stream_get_contents($pipes[2]));
		fclose($pipes[1]);
		fclose($pipes[2]);
		$saved_jobdir = Job::where('jobdir',$jobdir)->get();
		if(count($saved_jobdir)<1 && $this->env["leave_test_file"]*1 !== 1){
			$this->deleteDirectory($jobdir);
		}
		return $output;
	}
	public function deleteJob(Request $request){
		$jobs=JobModel::findOrFail($request->id);
		if(Auth::user()->policy !== "admin") return;
		$this->deleteDirectory($jobs->jobdir);
		$jobs->delete();
		return redirect(route('admin.jobs'));
	}

	public function deleteDirectory($dir) {
		if (!file_exists($dir)) {
			return true;
		}
		if (!is_dir($dir)) {
			return unlink($dir);
		}
		foreach (scandir($dir) as $item) {
			if ($item == '.' || $item == '..') {
				continue;
			}
			if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
				return false;
			}
		}
		return rmdir($dir);
	}
	public function makeInclude($inc_data,$incContents,$headerFileName){
		$user = Auth::user();
		foreach($this->strToArr($inc_data) as $inc){
			if($inc == "") continue;
			$_plugin = Plugin::where("alias",$inc)->first();
			if($_plugin === null) abort(404,"Included Plugin does not exist. Please check the alias.");
			if(!$user->can('run',$_plugin)) continue;
			$_incFileName = "kCmsIncludes_".$inc;
			$_incFileContent = "from $headerFileName import *\n"; //headerFile include
			$incContents .= "from kCmsIncludes_".$inc." import *\n";
			if(file_exists($_incFileName.".py")){
				continue;
			}
			$fp = fopen( $_incFileName.'.py', "w");
			fclose($fp);
			if($_plugin->includes!=""){
				$_incFileContent=$this->makeInclude($_plugin->includes,$_incFileContent,$headerFileName);
			}
			$_incFileContent .= $_plugin->script;
			$fp = fopen( $_incFileName.'.py', "w");
			fwrite($fp, $_incFileContent );
			fclose($fp);
		}
		return $incContents;
	}
	public function strToArr($str){
		$str = preg_replace( '/^\s+/', '', $str);
		$str = preg_replace( '/\s+$/', '', $str);
		$str = preg_replace( '/\r+/', ' ', $str);
		$str = preg_replace( '/,/', ' ', $str);
		$str = preg_replace( '/;/', ' ', $str);
		$str = preg_replace( '/\s+/', ' ', $str);
		return explode(" ",$str);
	}
	public function saveJob(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}else if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
			return ["Wrong Access"];
		}
		$id = -1;
		if( $request->has('id') ){
			$id = $request->input('id');
		}
		$job = Job::findOrNew($id);
		$fields = ['qinfo','status','pluginId','pluginAlias','jobBefore','jobNext','input','output','name','jobdir','owner'];
		$job->project = 1;
		foreach($fields as $field){
			if( $request->has($field) ){
				if($field === "pluginAlias"){
					$pl = Plugin::where("alias", $request->input($field))->first();
					if($pl !== null){
						$job->pluginId = $pl->id;
					}
				}else{
					$job->$field = $request->input($field);
				}
			}
		}
		$job->save();
		if($id==-1) $id = $job->id;
		return $id;
	}
	public function getJobs(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}else if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
			return ["Wrong Access"];
		}
		if(null !== $request->pluginAlias){
			$__pluginByAlias=Plugin::where("alias",$request->pluginAlias)->first();
			if($__pluginByAlias !== null){
				$request['pluginId']=$__pluginByAlias->id;
			}else{
				$request['pluginId']=-2;
			}
		}
		$jobs = Job::where($request->except(['cols','criteria','order','limit','pluginAlias']))
			->when($request->criteria,function($query) use($request){
				for($i=0 ; $i<count($request->criteria) ; $i++){
						$query=$query->whereRaw($request->criteria[$i]);
				}
				return $query;
			})
			->when($request->input('cols'),function($query) use ($request){
				return $query->select($request->input('cols'));
			})
			->when($request->order, function($query) use ($request){
				return $query->orderBy($request->order[0],$request->order[1]);
			})
			->when($request->limit,function ($query) use ($request){
				return $query->offset($request->limit[0])->limit($request->limit[1])->get();
			},function($query) use ($request){
				return $query->get();
			});
		if($request->cols==null || in_array("pluginId",$request->cols)){
//TODO
			for($i=0 ; $i<count($jobs) ; $i++){
				if($jobs[$i]->pluginId == -1){
					$__plugin_name = "TEST";
				}else{
					$__p = Plugin::where("id",$jobs[$i]->pluginId)->select(["id","name"])->first();
					if($__p === null){
						$__plugin_name=$__p->name;
					}else{
						$__plugin_name="Deleted Plugin";
					}
				}
				$jobs[$i]['pluginName'] = $__plugin_name;
			}
		}
		return $jobs;
	}
	public function getMyInfo(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}else if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
			return ["Wrong Access"];
		}
		$ret=[];
		if(!Auth::check()){
			$logincheck=$this->loginCheckOrByKey($request->key);
			if($logincheck == "no user"){
				$ret["id"]=-1;
				return $ret;
			}
		}
		$ret=Auth::user();
		return $ret;
	}
	public function getRepoforServer(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}else if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
			return ["Wrong Access"];
		}
		if(!Auth::check()){
			$logincheck=$this->loginCheckOrByKey($request->key);
			if($logincheck == "no user") return;
		}
		$user = Auth::user();
		$file = Repository::where('owner',0)->where("alias",$request->alias)->first();
		if($file===null){
			return "File does not exist.";
		}
		if(!$user->can('read',$file)){
			return "Unauthorized";
		}
		if(file_exists($this->env["storage"]."/".$file->filename)){
			return file_get_contents($this->env["storage"]."/".$file->filename);
		}else{
			return "File does not exist.";
		}
	}
}

