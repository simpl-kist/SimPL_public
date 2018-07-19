<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\PluginModel;
use App\CmsEnvModel;
use App\JobModel;
use App\User;
use App\Repository;
class PluginController extends Controller
{
	private function getScriptHeader($args){
		$env = $this->getCmsEnv();
		$s = Array();
		$s[] = 'import os';
		$s[] = 'from urllib2 import urlopen';
		$s[] = 'import urllib2';
		$s[] = 'import json';
		$s[] = 'import requests';
		$s[] = 'import subprocess';
		$s[] = 'def file_get_contents(filename, use_include_path = 0, context = None, offset = -1, maxlen = -1):';
		$s[] = '	if (filename.find("://") > 0):';
		$s[] = '		ret = urllib2.urlopen(filename).read()';
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
		$s[] = '	ret = urlopen("'.$env['url'].'/api/solvers/get/"+str(name)).read()';
		$s[] = '	return json.loads(ret)';
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
		$s[] = '#PBS -q simpl';
		$s[] = '#PBS -l nodes="""+str(params[\'nnodes\'])+""":ppn="""+str(params[\'ppn\'])+"""';
		$s[] = 'NPROCS=`cat $PBS_NODEFILE|wc -l`';
		$s[] = 'cd $PBS_O_WORKDIR';
		$s[] = '"""';
		$s[] = '	if params[\'mpi\']:';
		$s[] = '		pbsscript=pbsscript+"\n'.$env['mpirun'].'"+" -machinefile $PBS_NODEFILE -np $NPROCS "';
		$s[] = '	pbsscript = pbsscript+params[\'solverExec\']+" > stdout 2>&1"';
		$s[] = '	pbsscript = pbsscript+"\ntouch finished"';
		$s[] = '	f.write(pbsscript)';
		$s[] = '	f.close()';
		$s[] = '	proc=subprocess.Popen(["'.$env['qsub'].' qsub"], stdout=subprocess.PIPE, shell=True)';
		$s[] = '	(out,err) = proc.communicate()';
		$s[] = '	return out';
// Qstat
		$s[] = 'def qstat(id=-1):';
		$s[] = '	qStat = "'.$env['qstat'].' -x"';
		$s[] = '	if(id<0):';
		$s[] = '		qStat = qStat+" -f"';
		$s[] = '	else:';
		$s[] = '		qStat = qStat+" "+str(id)+" 2>/dev/null"';
		$s[] = '	proc = subprocess.Popen([qStat], stdout = subprocess.PIPE, shell=True)';
		$s[] = '	(out,err) = proc.communicate()';
		$s[] = '	return out';
		$s[] = 'def callPlugin(pluginAlias,pluginData):';
		$s[] = '	jsonData = {"alias":pluginAlias,"input":pluginData,"key":"'.$args['key'].'","length":'.$args['length'].'}';
//python실행시 인증을 위한 verification_code를 key값으로 입력
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/run",json=jsonData).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getMyInfo():';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/getMyInfo",json={"key":"'.$args['key'].'"}).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getRepo(alias):';
		$s[] = '	jsonData = {"alias":alias,"key":"'.$args['key'].'"}';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/getRepoforServer",jsonData).text';
		$s[] = '	return ret';
		$s[] = 'def saveJob(jobInfo):';
		$s[] = '	if "pluginId" not in jobInfo:';
		$s[] = '		jobInfo["pluginId"] = kCms["pluginId"]';
	if(Auth::user()!=null){
		$s[] = '	jobInfo["owner"] = '.Auth::id();
	}else{
		$s[] = '	jobInfo["owner"] = -1';
	}
		$s[] = '	if not "jobdir" in jobInfo : ';
		$s[] = '		jobInfo["jobdir"] = kCms["jobdir"]';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/saveJob",json=jobInfo).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def getJobs(jobInfo):';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/getJobs",json=jobInfo).text';
		$s[] = '	return ret';
#		$s[] = '	return json.loads(ret)';
/*		error_log("hello world!");
		ob_start();
		var_dump($args);
		error_log(ob_get_clean());*/
		
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
			//$s[] = "kCms['input'] = json.loads(".escapeshellarg(json_encode($args['input'])).")";
			//$s[] = "kCms['input'] = json.loads(".$this->escapeShellArg(json_encode($args['input'])).")";
			$inputTmp = json_encode($args['input']);
			$inputTmp = str_replace('\\','\\\\', $inputTmp);
			$inputTmp = str_replace("'", "\'", $inputTmp);
			$s[] = "kCms['input'] = json.loads('".$inputTmp."')";
		}

		return implode("\n",$s);
	}
    protected function escapeShellArg($argument)
    {
        return '\'' . str_replace('\'', '\\\'', $argument) . '\'';
     }
	private function getCmsEnv(){
		$m = CmsEnvModel::get();
		$env = Array();
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}
		return $env;
	}
	public function store(){
		if($_POST['name'] === "" || $_POST['alias'] === "" || $_POST['script'] === null ) return redirect()->back()->withInput($_POST); 
		if(isset($_POST['pluginId'])){
			$id = $_POST['pluginId'];
		}else{
			$id = -1;

		}
		$m = PluginModel::findOrNew($id);
		if($m->alias!==$_POST['alias']){
			if(count(PluginModel::where('alias',$_POST['alias'])->get())>0){
				return redirect()->back()->withInput($_POST);
			}
		}
		if($m->id !== null){
			$this->authorize('update',$m);
		}else{
			$this->authorize('create',$m);
			$m->author=Auth::user()->id;
		}
		$m->name=$_POST['name'];
		$m->role=$_POST['role'];
		$m->type=$_POST['type'];
		$m->script=$_POST['script'];
		$m->alias=$_POST['alias'];
		error_log($_POST['includes']."+++");
		$m->includes=$_POST['includes'];
		error_log($_POST['includes']);
		$m->ispublic=$_POST['require'];
		$m->save();
//		return redirect(route("admin.plugins"));
		$id=$m->id;
		return redirect(route("admin.plugins.modify", $id))->withInput($_POST);
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
	public function add(){
		return view('admin/plugins/add');
	}
/*	public function list(){
		$plugins = PluginModel::orderBy("id","desc")->paginate(10);
		return view('admin.plugins.list',compact('plugins'));
	}
*/
        public function list($type=null,$criteria=null){
                if(($type==="name" || $type === "alias") && isset($criteria)){
                        $plugins = PluginModel::where($type,"like","%".$criteria."%")->orderBy('id','desc')->paginate(10);
                }else{
                        $plugins = PluginModel::orderBy('id','desc')->paginate(10);
                }
//              $pages = $pageM->get();
                return view('admin/plugins/list',[ 'plugins' => $plugins]);
        }
	public function modify($pluginId){
		$plugin = PluginModel::findOrFail($pluginId);
		$this->authorize('read',$plugin);
		return view('admin/plugins/.add',compact('plugin'));
	}
	public function delete(Request $request){
		$id=$request->idx;
		$plugin = PluginModel::findOrFail($id);
		$this->authorize('delete',$plugin);
		$plugin->delete();
		return redirect(route('admin.plugins'));	
	}
	public function writePluginFile(){
	}
	public function run(Request $request){
//python에서 실행한 경우 login이 안되어 있으므로 verification_code를 바탕으로 login
		if(isset($_SERVER["HTTP_REFERER"]) && strrpos($_SERVER["HTTP_REFERER"],$_SERVER["HTTP_HOST"])===false){
			$can_access=CmsEnvModel::where("var_key","allowApiRun")->first()->var_value;
			if($can_access == false){
				return "Wrong Access";
			}
		};

		if(!Auth::check()){
			$logincheck=$this->loginCheckOrByKey($request->key);
		}
//
		$pluginId=-1;	
		$alias = "test";
		if($request->has('alias')){
			$alias = $request->input("alias");
		}
		//

		if( !$request->has('istest') ){
			$plugin = PluginModel::where("alias",$alias)->first();
			if($plugin === null){
				return Array("output"=>"","error"=>"Plugin \"".$alias."\" Does Not Exist.");
			}
//plugin 실행권한 검사
			$can_read=$this->canReadData($plugin);
			if($can_read==0){
				return Array("ourput"=>"","error"=>"UNAUTHORIZED");
			}
//
			$pluginId = $plugin->id;
			$pluginFileContent = $plugin->script;
		}else{ // test
			if( $request->has('script') ){
				$pluginFileContent = $request->input('script');
			}
			error_log("__".$request->input('testinput')."__");
			if( $request->has('testinput') ){
				error_log("Q".$request->input('testinput'));
/*				ob_start();
				var_dump(json_decode($request->input('testinput'),true));
				error_log(ob_get_clean());*/
				$pluginInput = json_decode($request->input('testinput'),true);
			}	
		}
		if(	$request->has('input') ){
			$pluginInput = $request->input('input');
		}
// 무한루프 막기 위해 callPlugin depth가 10이상이면 중지 숫자는 검토 필요

		if(	$request->has('length') ){
			$pluginLength = $request->input('length')+1;
		}else{
			$pluginLength = 0;
		}
		if( $pluginLength > 10 ) return Array("output"=>"","error"=>"Too may requests");

//
		$env = $this->getCmsEnv();
		$jobid = date("YmdHis")."_".md5(rand());
		$jobdir = $env['jobdir']."/".$jobid;
		error_log($jobdir);
	//	error_log(print_r($request,true));
		mkdir($jobdir);// or die("Could not create job directory");
		chdir($jobdir);

		$headerFileName = 'kCmsHeader_global';
		$headerArgs = [
			'jobid'=>$jobid,
			'jobdir'=>$jobdir,
		];
		if(isset($pluginInput)){
			$headerArgs['input']=$pluginInput;
		}
		$headerArgs['pluginId']=$pluginId;
		if(Auth::user() !== null){
			$headerArgs['key']=Auth::user()->verification_code;
		}else{
			$headerArgs['key']=-1;
		}
		$headerArgs['length']=$pluginLength;
//python실행시 로그인 인증용
		$headerFileContent = $this->getScriptHeader($headerArgs);
	
		$fp = fopen($headerFileName.".py","w");
		fwrite($fp,$headerFileContent);
		fclose($fp);

// Write includes
		$incContents = "";
                if($request->includes!="" || (isset($plugin) && $plugin->includes!="")){
                        if($request->has('includes')){
                                $inc_data=$request->input('includes');
                        }else{
                                $inc_data=$plugin->includes;
                        }
			$incContents=$this->makeInclude($inc_data,$incContents,$headerFileName);
		}
		$pluginFileName = 'kCmsScript_'.Auth::id().'_'.$alias;
		$plugin_merged = "";
		$plugin_merged = "from $headerFileName import *\n";
		$plugin_merged.= $incContents;
		$plugin_merged.= $pluginFileContent;
		
		$fp = fopen($pluginFileName,"w");
		fwrite($fp,$plugin_merged);
		fclose($fp);
		if(isset($env['python'])){
			$pythonPath = $env['python'];
		}else{
			$pythonPath = '/';
		}
		error_log($pythonPath."******");
//		$pythonPath = '/opt/rh/python27/root/usr/';
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
   0 => array("pipe", "r"),  // stdin
   1 => array("pipe", "w"),  // stdout
   2 => array("pipe", "w"),  // stderr
);
$process = proc_open('python '.$pluginFileName, $descriptorspec, $pipes, $jobdir, null);
$output = Array('output'=>stream_get_contents($pipes[1]),
				'error'=>stream_get_contents($pipes[2]));
fclose($pipes[1]);
fclose($pipes[2]);


		$saved_jobdir = JobModel::where('jobdir',$jobdir)->get();
		if(count($saved_jobdir)<1){
			$this->deleteDirectory($jobdir);
		}

//		exec("python ".$pluginFileName,$output);
		return $output;
/*		$db->{
			'jobId',
			'pluginId',
			'owner',
			'timestamps',
			'input',
			'output',
		}*/
	// jobdir
	// solver info
	// 
	}
	public function saveJob(Request $request){
		// C, U
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}
		$id = -1;
		if( $request->has('id') ){
			$id = $request->input('id');
		}
		$job = JobModel::findOrNew( $id );
//		$fields = ['qinfo','status','pluginId','pluginBefore','pluginNext','input','output','name','jobdir','owner'];
		$fields = ['qinfo','status','pluginId','jobBefore','jobNext','input','output','name','jobdir','owner'];
		$job->project = 1;
//		$job->owner = Auth::id();

		foreach($fields as $field){
			if( $request->has($field) ){
				$job->$field = $request->input($field);
	
			}
		}
//		if($job->pluginId===-1) $job->jobdir=null;
		$job->save();
		if($id==-1) $id = $job->id;
		return $id;
	}
	public function getJobs(Request $request){
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}
		if(null!==$request->pluginAlias){
			$__pluginByAlias=PluginModel::where("alias",$request->pluginAlias)->first();
			if($__pluginByAlias !== null){
				$request['pluginId']=$__pluginByAlias->id;
			}
		}
                $jobs = JobModel::where($request->except(['cols','criteria','order','limit','pluginName']))
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
			$__plugins=PluginModel::get(['id','name']);
			$_plugins=[];
			for($i=0 ; $i<count($__plugins) ; $i++){
				$_plugins[$__plugins[$i]['id']]=$__plugins[$i]['name'];
			}
			for($i=0 ; $i<count($jobs) ; $i++){
				if($jobs[$i]->pluginId == -1){
					$__plugin_name = "TEST";
				}else{
					if(isset($_plugins[$jobs[$i]->pluginId])){
						$__plugin_name=$_plugins[$jobs[$i]->pluginId];
					}else{
						$__plugin_name="Deleted Plugin";
					}
				}
				$jobs[$i]['pluginName'] = $__plugin_name;
			}
		}
		return $jobs;
//		$jobs = JobModel::where($request->except('cols'))->get($request->input('cols'));
//		return $jobs;
		// R
	}

        public function deleteJob(Request $request){
                $jobs=JobModel::findOrFail($request->id);
		if(Auth::user()->policy !== "admin") return;
//              $this->authorize('delete',$jobs);
                $this->deleteDirectory($jobs->jobdir);
                $jobs->delete();
                return redirect(route('admin.jobs'));
        }
	public function test(){
		return false; // obsolated
		$env = $this->getCmsEnv();
		$tmpdir = $env['jobdir']."/PluginTest_".md5(rand());
		mkdir($tmpdir) or die('Could not create directory');
		$script = ['type'=>'python','contents'=>$_POST['script']];
		
		chdir($tmpdir);
		$fp = fopen("script","w");
		fwrite($fp,$script['contents']);
		fclose($fp);
		exec("python script",$o);
		$result = $o[0];
		return $result;	
	}
    //
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
	public function getMyInfo(Request $request){
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
	public function loginCheckOrByKey($key){
		$__user = User::where('verification_code',$key)->get();
		if(count($__user)>0){
			Auth::loginUsingId($__user[0]->id,true);
		}else{
			return "no user";
		}
	}	
	public function getRepoforServer(Request $request){
		if(!Auth::check()){
			$logincheck=$this->loginCheckOrByKey($request->key);
			if($logincheck == "no user") return;
		}
		$file = Repository::where('owner',0)->where("alias",$request->alias)->first();
		if($file===null){
			return "File does not exist.";
		}
		$can_read=$this->canReadData($file);
		if($can_read==0){
			return "UNAUTHORIZED";
		}
		$target_file = fopen(storage_path("repos/").$file->filename,"r") or die("Unable to open file!");
		$file_data=fread($target_file,filesize(storage_path("repos/").$file->filename));
		fclose($target_file);
		return $file_data;
	}
	public function canReadData($data){
		if($data->ispublic*1 !== 0){
			if(Auth::user() == null){
				return 0;
			}else{
				$_policy=Auth::user()->policy;
				$_ispublic=$data->ispublic*1;
				switch($_policy){
					case "anonymous":
						if($_ispublic > 1){
							return 0;
						}
						break;
					case "user":
						if($_ispublic > 2){
							return 0;
						}				
						break;
					case "editor":
						if($_ispublic > 3){
							return 0;
						}				
						break;
					case "admin":
						if($_ispublic > 4){
							return 0;
						}			
						break;
					default:
						return 0;
				}
			}
		}
		return 1;
	}

	public function makeInclude($inc_data,$incContents,$headerFileName){
		foreach($this->strToArr($inc_data) as $inc){
			if($inc == "") continue;
			$_plugin = PluginModel::where("alias",$inc)->first();
			if($_plugin === null) abort(404,"Included Plugin does not exist. Please check the alias.");
			$can_read=$this->canReadData($_plugin);
			if($can_read==0) continue;
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
}
