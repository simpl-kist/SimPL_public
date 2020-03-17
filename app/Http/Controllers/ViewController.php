<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Solver;
use App\User;
use App\Job;
use App\Plugin;
use App\Repository;

class ViewController extends Controller
{
	public $env;
	public function __construct(){
		$pc = new PlatformController;
		$this->env = $pc->getEnvironment();
	}

	public function dashboard(){
		$pc = new PlatformController;
		$stat = $pc->statistics();
		return view('admin.dashboard')->with(["stat"=>$stat]);
	}
	public function general(){
		return view('admin.general')->with(['env'=>$this->env]);
	}
	public function solvers(){
		$solvers = Solver::paginate(10);
		return view('admin.solvers')->with(['solvers'=>$solvers]);
	}
	public function plugins(){
		return view('admin.plugins');
	}
	public function pages(){
		return view('admin.pages');
	}
	public function users(){
		$users = User::orderBy('id','desc')->paginate(20);
		return view('admin.users')->with(['users'=>$users]);
	}
	public function jobs(){
		$jobs = Job::select(['id','name','pluginId','owner','status','jobdir'])->orderBy('id','desc')->paginate(15);
		for($i=0 ; $i<count($jobs) ; $i++){
			if($jobs[$i]->pluginId === -1){
				$jobs[$i]->pluginName = "Test";
			}else{
				$pl = Plugin::where('id',$jobs[$i]->pluginId)->first();
				if($pl === null){
					$jobs[$i]->pluginName = "Deleted plugin";
				}else{
					$jobs[$i]->pluginName = $pl->name;
				}
			}
			$owner = User::where('id',$jobs[$i]->owner)->first();
			if($owner === null){
				$jobs[$i]->owner = "Deleted user";
			}else{
				$jobs[$i]->owner = $owner->name;
			}
		}
		return view('admin.jobs')->with(['jobs'=>$jobs]);
	}
	public function repositories(){
		$usr = Auth::user();
		$namelist = [];
		$repos=[];
		$name;
		$repos["web"]=Repository::where("owner",1)->get();
		$repos["server"]=Repository::where("owner",0)->get();
		for($i=0 ; $i<count($repos["web"]) ; $i++){
			if(isset($namelist[$repos["web"][$i]["author"]])){
				$name=$namelist[$repos["web"][$i]["author"]];
			}else{
				$user = User::where("id",$repos["web"][$i]["author"])->first();
				if($user === null){
					$name = "Unknown";
				}else{
					$name = $user->name;
				}
				$namelist[$repos["web"][$i]["author"]] = $name;
			}
			$repos["web"][$i]["author"] = $name;
			$repos["web"][$i]["update"] = $usr->can('update',$repos["web"][$i]);
			$repos["web"][$i]["delete"] = $usr->can('delete',$repos["web"][$i]);
		}
		for($i=0 ; $i<count($repos["server"]) ; $i++){
			if(isset($namelist[$repos["server"][$i]["author"]])){
				$name=$namelist[$repos["server"][$i]["author"]];
			}else{
				$user = User::where("id",$repos["server"][$i]["author"])->first();
				if($user === null){
					$name = "Unknown";
				}else{
					$name = $user->name;
				}
				$namelist[$repos["server"][$i]["author"]] = $name;
			}
			$repos["server"][$i]["author"] = $name;
			$repos["server"][$i]["update"] = $usr->can('update',$repos["server"][$i]);
			$repos["server"][$i]["delete"] = $usr->can('delete',$repos["server"][$i]);		
		}
		return view('admin.repositories')->with(["repos"=>$repos]);
	}
	public function repositoriesWeb(){
		return view('admin.repositories_web');
	}
	public function repositoriesServer(){
		return view('admin.repositories_server');
	}
	public function account(){
		$user = Auth::user();
		return view('account')->with(['me'=>$user]);
	}
}
