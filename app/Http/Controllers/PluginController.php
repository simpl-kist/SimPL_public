<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\PluginModel;
use App\CmsEnvModel;
use App\JobModel;
class PluginController extends Controller
{
	private function getScriptHeader($args){
		$env = $this->getCmsEnv();
		$s = Array();
		$s[] = 'import os';
		$s[] = 'from urllib2 import urlopen';
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
		$s[] = 'def getSolver(id):';
		$s[] = '	ret = urlopen("'.$env['url'].'/api/solvers/get/"+str(id)).read()';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def qsub(params={}):';
		$s[] = '	if not \'mpi\' in params:';
		$s[] = '		params[\'mpi\']=True';
		$s[] = '	if not \'solverExec\' in params:';
		$s[] = '		return \'solverExec is not set\'';
		$s[] = '	f = open("qsub","w")';
		$s[] = '	pbsscript ="""#!/bin/sh';
		$s[] = '#PBS -N kCMS_Job';
		$s[] = '#PBS -q full';
		$s[] = '#PBS -l nodes=1:ppn=20';
//		$s[] = '#PBS -h';
		$s[] = 'NPROCS=`cat $PBS_NODEFILE|wc -l`';
		$s[] = 'cd $PBS_O_WORKDIR"""';
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
		$s[] = '		qStat = qStat+" "+str(id)';
		$s[] = '	proc = subprocess.Popen([qStat], stdout = subprocess.PIPE, shell=True)';
		$s[] = '	(out,err) = proc.communicate()';
		$s[] = '	return out';
		$s[] = 'def callPlugin(pluginAlias,pluginData):';
		$s[] = '	jsonData = {"alias":pluginAlias,"input":pluginData}';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/run",json=jsonData).text';
		$s[] = '	return json.loads(ret)';
		$s[] = 'def saveJob(jobInfo):';
		$s[] = '	jobInfo["pluginId"] = kCms["pluginId"]';
		$s[] = '	ret = requests.post("'.$env['url'].'/api/plugin/saveJob",json=jobInfo).text';
		$s[] = '	return ret';
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
			$s[] = "kCms['input'] = json.loads('".str_replace('\\n','\\\n',json_encode($args['input']))."')";
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
		if(isset($_POST['pluginId'])){
			$id = $_POST['pluginId'];
		}else{
			$id = -1;
		}
		$m = PluginModel::findOrNew($id);
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
		$m->save();
//		return redirect(route("admin.plugins"));
		return redirect(route("admin.plugins.modify", $id));
	}
	public function add(){
		return view('admin/plugins/add');
	}
	public function list(){
		$plugins = PluginModel::get();
		return view('admin.plugins.list',compact('plugins'));
		echo "Q";
	}
	public function modify($pluginId){
		$plugin = PluginModel::findOrFail($pluginId);
		$this->authorize('read',$plugin);
		return view('admin/plugins/.add',compact('plugin'));
	}
	public function delete($id){
		return false;
		$plugin = PluginModel::findOrFail($id);
		$this->authorize('delete',$plugin);
		$plugin->delete();
		return redirect(route('admin.plugins'));	
	}
	public function run(Request $request){
		$pluginId=-1;	
		if( !$request->has('istest') ){
			error_log("HERE");
			$plugin = PluginModel::where("alias",$request->input('alias'))->firstOrFail();
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
		
		$env = $this->getCmsEnv();
		$jobid = date("YmdHis")."_".md5(rand());
		$jobdir = $env['jobdir']."/".$jobid;
		error_log($jobdir);
	//	error_log(print_r($request,true));
		mkdir($jobdir);// or die("Could not create job directory");
		chdir($jobdir);

		$headerFileName = 'kCmsHeader_'.md5(rand());
		$headerArgs = [
			'jobid'=>$jobid,
			'jobdir'=>$jobdir,
		];
		if(isset($pluginInput)){
			$headerArgs['pluginId']=$pluginId;
			$headerArgs['input']=$pluginInput;
		}
	
		$headerFileContent = $this->getScriptHeader($headerArgs);
	
		$fp = fopen($headerFileName.".py","w");
		fwrite($fp,$headerFileContent);
		fclose($fp);

		$pluginFileName = 'kCmsScript_'.md5(rand());
		$pluginFileContent = "from $headerFileName import *\n".$pluginFileContent;
		$fp = fopen($pluginFileName,"w");
		fwrite($fp,$pluginFileContent);
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
		$id = -1;
		if( $request->has('id') ){
			$id = $request->input('id');
		}
		$job = JobModel::findOrNew( $id );
		if($id==-1) $id = $job->id;
		$fields = ['project','owner','qinfo','status','pluginId','pluginBefore','pluginNext','input','output','name'];
		foreach($fields as $field){
			if( $request->has($field) ){
				$job->$field = $request->input($field);
	
			}
		}
		$job->save();
		return $id;
	}
	public function getJobs(Request $request){
		$jobs = JobModel::where($request->except('cols'))->get($request->input('cols'));
		return $jobs;
		// R
	}
	public function deleteJob(){
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
	public function changePublic(Request $request){
		$plugin=PluginModel::where('id',$request->index)->first();
		$this->authorize('update',$plugin);
		if($plugin->ispublic === 0){
			$plugin->ispublic=1;
		}else{
			$plugin->ispublic=0;
		}
		$plugin->save();
	}
}
