<?php

namespace App\Http\Controllers;
use App\User;
use App\CmsEnv;
use App\Repository;
use Illuminate\Http\Request;
use Auth;
use File;
use Response;
use Log;
class RepositoryController extends Controller
{
	private $env;
	public function __construct(){
		$environment = CmsEnv::get();
		$this->env = [];
		foreach($environment as $e){
			$this->env[$e->var_key] = $e->var_value;
		}
	}
	public function webFiles(Request $request){
		$usr = Auth::user();
		$namelist = [];
		$repos = Repository::where('owner',1)->get();
		for($i=0 ; $i<count($repos) ; $i++){
			if(isset($namelist[$repos[$i]["author"]])){
				$name=$namelist[$repos[$i]["author"]];
			}else{
				$user = User::where("id",$repos[$i]["author"])->first();
				if($user === null){
					$name = "Unknown";
				}else{
					$name = $user->name;
				}
				$namelist[$repos[$i]["author"]] = $name;
			}
			$repos[$i]["author"] = $name;
			$repos[$i]["update"] = $usr->can('update',$repos[$i]);
			$repos[$i]["delete"] = $usr->can('delete',$repos[$i]);
		}
		return $repos;
	}
	public function serverFiles(Request $request){
		$usr = Auth::user();
		$namelist = [];
		$repos = Repository::where('owner',0)->get();
		for($i=0 ; $i<count($repos) ; $i++){
			if(isset($namelist[$repos[$i]["author"]])){
				$name=$namelist[$repos[$i]["author"]];
			}else{
				$user = User::where("id",$repos[$i]["author"])->first();
				if($user === null){
					$name = "Unknown";
				}else{
					$name = $user->name;
				}
				$namelist[$repos[$i]["author"]] = $name;
			}
			$repos[$i]["author"] = $name;
			$repos[$i]["update"] = $usr->can('update',$repos[$i]);
			$repos[$i]["delete"] = $usr->can('delete',$repos[$i]);
		}
		return $repos;
	}

	public function showWeb($filename){
		$path = CmsEnv::where("var_key","storage")->first();
		if($path !== null){
			$path = $path->var_value;
		}else{
			abort(404);
		}
		$file = Repository::where('alias',$filename)->first();
		$path = $path."/".$file->filename;
		if (!is_file($path)) {
			abort(404);
		}
		$file = File::get($path);
		$type = File::mimeType($path);
		$response = Response::make($file, 200);
		$response->header("Content-Type", $type);
		return $response;
	}
	public function renameFile(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$name = $request->name;
		$repo = Repository::where('id',$idx)->first();

		if($repo === null){
			return ["message"=>"Invalid file", "status"=>"failed"];
		}

		if(!$user->can('update',$repo)){
			return ["message"=>"No permission", "status"=>"failed"];
		}
		$repo->alias = $name;
		$repo->save();
		return ["message"=>"Success", "status"=>"success"];
	}
	public function uploadFile(Request $request){
		if($request->repos_for=="web"){
			$repos_for=1;
		}else if($request->repos_for=="server"){
			$repos_for=0;
		}

		if( !$request->has('files') ){
			return ["message"=>"File not passed!","status"=>"failed"];
		}
		$files=$request->file('files');
		for($i=0 ; $i<count($files) ; $i++){
			$alias = $files[$i]->getClientOriginalName();
			if(count(Repository::where('owner',$repos_for)->where('alias',$alias)->get(['id']))>0){
				return ["message"=>"Alias already exists","status"=>"failed"];
			}
			if($repos_for == 1){
				$filename = $files[$i]->store("/".$this->env["storage"]."/web",'root');
			}else if($repos_for == 0){
				$filename = $files[$i]->store("/".$this->env["storage"]."/server",'root');
			}else{
				return;
			}
			$filename = "/".$filename;
			$filename = preg_replace("/\/+/","/",$filename);
			$filename = str_replace($this->env["storage"],"/",$filename);
			Repository::create([
				'owner' => $repos_for,
				'alias' => $alias,
				'filename' => $filename,
				'author' => Auth::user()->id,
			]);
		}
		return ["message"=>"Success","status"=>"success"];
	}
	public function deleteFile(Request $request){
		$idx = $request->idx;
		$user = Auth::user();
		$repo = Repository::where("id",$idx)->first();
		if($repo === null){
			return ["message"=>"Invalid file", "status"=>"failed"];
		}
		if(!$user->can('delete',$repo)){
			return ["message"=>"No permission", "status"=>"failed"];
		}
		$repo->delete();
		$path = $this->env["storage"]."/".$repo->filename;
		if (!is_file($path)) {
			return ["message"=>"File not deleted ".$repo->filename, "status"=>"failed"];
			Log::debug($repo->filename);
		}else{
			unlink($path);
		}
		return ["message"=>"Success", "status"=>"success"];
	}
	public function changePublic(Request $request){
		$idx = $request->idx;
		$user = Auth::user();
		$repo = Repository::where("id",$idx)->first();
		if($repo === null){
			return ["message"=>"Invalid file", "status"=>"failed"];
		}
		if(!$user->can('delete',$repo)){
			return ["message"=>"No permission", "status"=>"failed"];
		}
		$repo->ispublic = $request->ispublic;
		$repo->save();
		return ["message"=>"Success", "status"=>"success"];
	}
}
