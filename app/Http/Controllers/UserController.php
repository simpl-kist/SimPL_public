<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;
use File;
use Response;
use Auth;
use Hash;
use App\User;
use App\CmsEnv;
class UserController extends Controller
{
	public function deleteUser(Request $request){
		$idx = $request->idx;
		$user = Auth::user();
		$t_user = User::where('id',$idx)->first();
		if($t_user === null){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		if($user->can('delete',$t_user)){
			$t_user->delete();
			return ["message"=>"Success", "status"=>"Success"];
		}else{
			return ["message" => "No permission", "status"=>"Fail"];
		}
	}

	public function changePolicy(Request $request){
		$idx = $request->idx;
		$policy = $request->policy;
		$user = Auth::user();
		$t_user = User::where("id",$idx)->first();
		if($t_user === null){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		if($user->policy === "admin"){
			if(in_array($policy, ["anonymous", "user", "editor", "admin"])){
				$t_user->policy = $policy;
				$t_user->save();
				return ["message"=>"Success", "status"=>"Success"];
			}
			return ["message"=>"Invalid Policy", "status"=>"Fail"];
		}else{
			return ["message" => "No permission", "status"=>"Fail"];
		}
	}

	public function updateAccount(Request $request){
		if(!$request->has('idx')){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		$user = User::where("id", $request->idx)->first();
		if($user->id !== Auth::user()->id){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		if(!$request->has('my_password')){
			return ["message"=>"No password entered.", "status"=>"Fail"];
		}
		if(!Hash::check($request->my_password, $user->password)){
			return ["message"=>"Invalid password entered.", "status"=>"Fail"];
		}
		$account_list = ["name", "affiliation", "tel", "phone"];
		foreach($account_list as $al){
			if($request->has($al)){
				$user->{$al} = $request->input($al);
			}
		}
		if($request->has('my_password_new')){
			$user->password = Hash::make($request->input('my_password_new'));
		}
		$user->save();
		return ["message"=>"success", "status"=>"Success"];
	}

	public function updatePic(Request $request){
		if(!$request->has('idx')){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		$user = User::where("id", $request->idx)->first();
		if($user->id !== Auth::user()->id){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		$oldfilename = $user->mypic;
		$repos_dir = CmsEnv::where("var_key", "storage")->first()->var_value;
		$userpic_dir = $repos_dir.'/userpic/';
		$userpic_dir = preg_replace("/\/+/","/",$userpic_dir);

		$file = $request->file("file");
		$filename = $file->store($userpic_dir, 'root');
		$filename = "/".$filename;
		$filename = preg_replace("/\/+/","/",$filename);
		$filename = str_replace($userpic_dir,"",$filename);

		$user->mypic = $filename;
		$user->save();
		if(isset($oldfilename)){
			unlink($userpic_dir.$oldfilename);
		}
		return ["message"=>"success", "status"=>"success"];
	}

	public function showPic($filename){
		$path = CmsEnv::where("var_key","storage")->first();
		if($path !== null){
			$path = $path->var_value.'/userpic';
		}else{
			abort(404);
		}
		$path = $path."/".$filename;
		$path = preg_replace("/\/+/","/",$path);
Log::debug($path);
		if (!is_file($path)) {
			abort(404);
		}
		$file = File::get($path);
		$type = File::mimeType($path);
		$response = Response::make($file, 200);
		$response->header("Content-Type", $type);
		return $response;
	}
	public function genKey(Request $request){
		function make_rand($len){
			$str="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			$text="";
			for($i=0; $i<$len; $i++){
				$text.=$str[rand(0,61)];
			}
			return $text;
		}
		if(!$request->has('idx')){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		$user = User::where("id", $request->idx)->first();
		if($user->id !== Auth::user()->id){
			return ["message"=>"Invalid User", "status"=>"Fail"];
		}
		if(!$request->has('my_password')){
			return ["message"=>"No password entered.", "status"=>"Fail"];
		}
		if(!Hash::check($request->my_password, $user->password)){
			return ["message"=>"Invalid password entered.", "status"=>"Fail"];
		}
		$user->verification_code = make_rand(25);
		$user->save();
		return ["message"=>$user->verification_code,"status"=>"Success"];
	}
}
