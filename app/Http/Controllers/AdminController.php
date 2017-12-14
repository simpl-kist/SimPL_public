<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\CmsEnvModel;
use App\User;
use App\SolverModel;
use App\PluginModel;
use App\JobModel;
use App\PageModel;
use App\Repository;

class AdminController extends Controller
{

	 public function index(){
		return view("admin.index");
	}
	public function jobs(){
		$jobs = JobModel::orderBy('created_at','desc')->select(['id','name','created_at','updated_at','output','pluginId'])->paginate(10);
		return view("admin.jobs",compact('jobs'));
	}
	public function uploadFile(Request $request){
		if( !$request->has('file') ){
			return response()->json("File not passed!",422);
		}
		$alias = $request->file('file')->getClientOriginalName();
		if(count(Repository::where('alias',$alias)->get(['id']))>0){
			return response()->json("Alias already exists",422);
		}
		$filename = $request->file('file')->store("repository");
		Repository::create([
			'owner' => 1,
			'alias' => $alias,
			'filename' => $filename,
			'author' => Auth::user()->id,
		]);
	}
	public function repository(){
		$repos = Repository::get();
		return view('admin.repository',compact('repos'));
	}
	public function dashboard(){
		
		$users = User::where( "created_at", ">=", \Carbon\Carbon::now()->addyears(-1) )->orderBy('created_at','desc')->get(['name','affiliation','mypic','created_at']);
		$plugins = PluginModel::get(['id', 'name']);
		$solvers = SolverModel::get(['id']);
		$pages = PageModel::get(['id']);
		$jobs = JobModel::orderBy('created_at','desc')->get(['id', 'name', 'created_at', 'updated_at', 'parent', 'owner', 'status', 'pluginID']);
		return view('admin.dashboard',['users'=>$users, 'plugins'=>$plugins, 'solvers'=>$solvers, 'pages'=>$pages, 'jobs'=>$jobs]);


	}
/*
									*/

	public function repoChangePublic(Request $request){
		$file=Repository::findOrFail('id',$request->index)->first();
		$this->authorize('update',$file);
		$file->ispublic = $request->ispublic;
		$file->save();
	}
	public function deleteRepo($id){
		$file=Repository::findOrFail($id);
		$this->authorize('delete',$file);
		$file->delete();
		Storage::delete($file->filename);
		return redirect(route('admin.repository'));
	}

	public function getSimPLEnv(){
		$m = CmsEnvModel::get();
		$env = Array();
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}
		return $env;
	}
	public function general(){
		$env = $this->getSimPLEnv();
		return view("admin.general",compact('env'));
	}
	public function users(){
		$users = User::paginate();
		return view("admin.users")->with('users',$users);
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
		foreach(['verifyemail','url','title','logo','header','footer','python','mpirun','qsub','qstat','qdel','jobdir'] as $param){
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
	public static function getLogo(){
		$env = CmsEnvModel::where("var_key","logo")->first(['var_value']);
		return $env->var_value;
	}
	public function myInfo(){
		$user = User::where('id',Auth::user()->id)->first();
		return view('admin.userInfo')->with('user',$user);
	}
    //
}
