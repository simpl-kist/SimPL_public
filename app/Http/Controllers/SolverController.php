<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Solver;
use Auth;

class SolverController extends Controller
{
	public function getSolver($name){
		//TODO security policy
		if(isset($_SERVER["HTTP_REFERER"])){
			return ["Wrong Access"];
		}else if($_SERVER["REMOTE_ADDR"]!=="127.0.0.1"){
			return ["Wrong Access"];
		}
		$solver = Solver::where('name', $name)->first();
		if($solver === null){
			return ["message"=>"Invalid solver name", "status"=>"fail"];
		}
		return $solver;
	}
	public function saveSolver(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$name = $request->name;
		$path = $request->path;
		$exec = $request->exec;
		$version = $request->version;
		$author = $request->author;
		if($name === null || $name === ""){
			return ["message"=>"Name is empty.", "status"=>"Fail"];
		} 
		if($path === null || $path === ""){
			return ["message"=>"Path is empty.", "status"=>"Fail"];
		} 
		if($exec === null){
			$exec = "";
		}
		if($version=== null){
			$version = "";
		}
		if($author=== null){
			$author = "";
		}
		$solver = Solver::where('id',$idx)->first();
		if($solver === null){
			$solver = new Solver;
			if(!$user->can('create',$solver)){
				return ["message"=>"Unauthorized.", "status"=>"Fail"];
			}
			if(Solver::where('name',$name)->count() > 0){
				return ["message"=>"Name already exists.", "status"=>"Fail"];
			}
			if(Solver::where('path',$path)->count() > 0){
				return ["message"=>"Same path already exsists.", "status"=>"Fail"];
			}
		}else{
			if(!$user->can('update',$solver)){
				return ["message"=>"Unauthorized.", "status"=>"Fail"];
			}
			$cnt = Solver::where('name',$name)->count();
			if($cnt > 1){
				return ["message"=>"Name already exists.", "status"=>"Fail"];
			}else if($cnt === 1 && $solver->name !== $name){
				return ["message"=>"Name already exists.", "status"=>"Fail"];
			}
			$cnt = Solver::where('path',$path)->count();
			if($cnt > 1){
				return ["message"=>"Same path already exsists.", "status"=>"Fail"];
			}else if($cnt === 1 && $solver->path !== $path){
				return ["message"=>"Same path already exsists.", "status"=>"Fail"];	
			}
		}

		$solver->name = $name;
		$solver->path = $path;
		$solver->execcmd = $exec;
		$solver->version = $version;
		$solver->author = $author;
		$solver->owner = $user->id;
		$solver->save();
		return ["message" => "Success", "status"=>"Success"];
	}
	public function deleteSolver(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$solver = Solver::where("id",$idx)->first();
		if($solver === null){
			return ["message"=>"Invalid solver", "status"=>"Fail"];
		}
		if($user->can('delete',$solver)){
			$solver->delete();
		}else{
			return ["message"=>"Unauthorized.", "status"=>"Fail"];
		}
		return ["message"=>"Success", "status"=>"Success"];
	}
}
