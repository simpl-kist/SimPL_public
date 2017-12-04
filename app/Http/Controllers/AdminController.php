<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\CmsEnvModel;
use App\User;
use App\SolverModel;
use App\PluginModel;
use App\JobModel;
use App\Repository;
class AdminController extends Controller
{
	public function index(){
		return view("admin.index");
	}
	public function jobs(){
		$jobs = JobModel::get(['id','name','created_at','updated_at','output','pluginId']);
		return view("admin.jobs",compact('jobs'));
	}
	public function uploadFile(Request $request){
		if( !$request->has('file') ){
			return response()->json("File not passed!",422);
		}
		$filename = $request->file('file')->store("repository");
		Repository::create([
			'owner' => 1,
			'alias' => $request->file('file')->getClientOriginalName(),
			'filename' => $filename,
		]);
	}
	public function repository(){
		$repos = Repository::get();
		return view('admin.repository',compact('repos'));
	}
	public function general(){
		$m = CmsEnvModel::get();
		$env = Array();
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}
		return view("admin.general",compact('env'));
	}
	public function users(){
		$user = User::where('id',Auth::user()->id)->first();
		return view("admin.users")->with('user',$user);
	}
	public function pages(){
		return view("admin.pages");
	}
	public function plugins(){
		$plugins = PluginModel::get();
		return view("admin.plugins",compact('plugins'));
	}
	public function solvers(){
		$solvers = SolverModel::get();
		return view("admin.solvers",compact('solvers'));
	}
	public function saveEnv(){
		foreach(['url','title','logo','header','footer','python','mpirun','qsub','qstat','qdel','jobdir'] as $param){
			if(isset($_POST[$param])){
				$env = CmsEnvModel::findOrNew($param);
				$env->var_key = $param;
				$env->var_value= $_POST[$param];
				$env->save();
			}
		}
		
	}
	public function saveSolver(){
		$solver = new SolverModel;
		$solver->name = $_POST['name'];	
		$solver->version = $_POST['version'];	
		$solver->author = $_POST['author'];	
		$solver->owner = 1;
		$solver->path = $_POST['path'];	
		$solver->execcmd = $_POST['execcmd'];	
		$solver->save();
		return redirect(route('admin.solvers'));
	}
    //
}
