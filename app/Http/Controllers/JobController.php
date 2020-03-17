<?php

namespace App\Http\Controllers;

use App\Job;
use App\User;
use Auth;
use Illuminate\Http\Request;

class JobController extends Controller
{
	public function loadJob(Request $request){
		function getFileList($dir){
			$globbed=glob($dir."/*");
			$files=[];
			$folders=[];
			for($i=0 ; $i<count($globbed) ; $i++){
				if(is_dir($globbed[$i])){
					$folders[]=str_replace($dir."/", "", $globbed[$i]);
					$globbed=array_merge($globbed, glob($globbed[$i]."/*"));
				}else{
					$files[]=str_replace($dir."/", "", $globbed[$i]);
				}
			}
			return ["files"=>$files, "folders"=>$folders];
		}
		$user = Auth::user();
		$idx = $request->idx;
		$job = Job::where('id',$idx)->first();
		if($job === null){
			return ["message"=>"Invalid Job", "status"=>"Fail"];
		}
		if($user->can('read', $job)){
			$jobdir = $job->jobdir;
			if(is_dir($jobdir)){
				$list = getFileList($jobdir);
				return ["message"=>["input"=>$job->input, "output"=>$job->output, "list"=>$list], "status"=>"Success"];
			}else{
				return ["message"=>"Jobdir doesn't exist.", "status"=>"Fail"];
			}
		}else{
			return ["message"=>"No permission", "status"=>"Fail"];
		}
	}
	public function loadFile(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$file = $request->filename;
		$job = Job::where('id',$idx)->first();
		if($job === null){
			return ["message"=>"Invalid Job", "status"=>"Fail"];
		}
		if($user->can('read', $job)){
			$jobdir = $job->jobdir;
			if(is_file($jobdir."/".$file)){
				return ["message"=>mb_convert_encoding(file_get_contents($jobdir."/".$file),'UTF-8', 'UTF-8'),"status"=>"Success"];
			}else{
				return ["message"=>"File doesn't exist.", "status"=>"Fail"];
			}
		}else{
			return ["message"=>"No permission", "status"=>"Fail"];
		}
	}
	public function deleteJob(Request $request){
		$user = Auth::user();
		$jobs=Job::where('id', $request->idx)->first();
		if($jobs ===null){
			return ["message"=>"Invalid Job", "status"=>"Fail"];
		}
		if($user->can('delete',$jobs)){
			$this->deleteDirectory($jobs->jobdir);
			$jobs->delete();
			return ["message"=>"Success", "status"=>"Success"];
		}
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
}
