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
		$jobs = JobModel::orderBy('created_at','desc')->select(['id','name','created_at','updated_at','output','pluginId','qinfo'])->paginate(10);
		return view("admin.jobs",compact('jobs'));
	}
	public function uploadFile(Request $request){
//todo 임시설정 server=>0 web=>1
		if($request->repos_for=="web"){
			$repos_for=1;
		}else if($request->repos_for=="server"){
			$repos_for=0;
		}

		if( !$request->has('files') ){
			return response()->json("File not passed!",422);
		}
		$files=$request->file('files');
		for($i=0 ; $i<count($files) ; $i++){
			$alias = $files[$i]->getClientOriginalName();
			if(count(Repository::where('owner',$repos_for)->where('alias',$alias)->get(['id']))>0){
				return response()->json("Alias already exists",422);
			}
			if($repos_for == 1){
				$filename = $files[$i]->store("repository/web");
			}else if($repos_for == 0){
				$filename = $files[$i]->store("repository/server");
			}else{
				return;
			}
			Repository::create([
//todo owener와 author 중복 => owner를 Repository for **에서 **으로 
				'owner' => $repos_for,
				'alias' => $alias,
				'filename' => $filename,
				'author' => Auth::user()->id,
			]);
		}
	}
	public function repository(){
		return view('admin.repository');
	}
	public function repos_web($criteria=null){
		$repos = Repository::where('owner',1)
		->when($criteria,function($query) use($criteria){
			return $query->where("alias","like","%".$criteria."%");
		})
		->paginate(18);
		return view('admin.repository_web',compact('repos'));
	}
	public function repos_server($criteria=null){
		$repos = Repository::where('owner',0)
		->when($criteria,function($query) use($criteria){
			return $query->where("alias","like","%".$criteria."%");
		})
		->paginate(18);
		return view('admin.repository_server',compact('repos'));
	}
	public function repos_list(Request $request){
		if($request->repos_for == "web"){
			$repos_for=1;
		}else if($request->repos_for == "server"){
			$repos_for=0;
		}
		$repos=Repository::where('owner',$repos_for)->
		when($request->repos_criteria,function ($query) use($request){
			return $query->where("alias","like","%".$request->repos_criteria."%");
		})->
		paginate(18);
		return $repos;

	}
	public function dashboard(){
                $server=[];

                $exec_free = explode("\n", trim(shell_exec('free')));
                $server["ram"]= preg_split("/[\s]+/", $exec_free[1]);

                $exec_loads = sys_getloadavg();
                $exec_cores = trim(shell_exec("grep -P '^processor' /proc/cpuinfo|wc -l"));
                $server["cpu"]=["loads"=>$exec_loads,"cores"=>$exec_cores];

                $disk=[];
                $disk[]=disk_free_space("/");
                $disk[]=disk_total_space("/");
                $server["disk"]=$disk;

                exec("netstat -an | grep :80.*ESTABLISHED | wc -l",$arr,$ret);
                $concurrent=end($arr);
        // not exactly

                $users = User::where( "created_at", ">=", \Carbon\Carbon::now()->addyears(-1) )->orderBy('created_at','desc')->get(['name','affiliation','mypic','created_at']);
                $plugins = PluginModel::get(['id', 'name']);

		$_plugins=[];
		for($i=0 ; $i<count($plugins) ; $i++){
			$_plugins[$plugins[$i]['id']]=$plugins[$i]['name'];
		}

                $solvers = SolverModel::get(['id']);
                $pages = PageModel::get(['id']);
                $jobs = JobModel::orderBy('created_at','desc')->limit(12)->get(['id', 'name', 'created_at', 'updated_at', 'parent', 'owner', 'status', 'pluginID']);
                $jobs_count=JobModel::count();
                return view('admin.dashboard',[
                        'users'=>$users,
                        'plugins'=>$plugins,
			'pluginName'=>$_plugins,
                        'solvers'=>$solvers,
                        'pages'=>$pages,
                        'jobs'=>$jobs,
                        'jobs_count'=>$jobs_count,
                        'server'=>$server,
                        'concurrent'=>$concurrent,
                ]);

/*	
		$users = User::where( "created_at", ">=", \Carbon\Carbon::now()->addyears(-1) )->orderBy('created_at','desc')->get(['name','affiliation','mypic','created_at']);
		$plugins = PluginModel::get(['id', 'name']);
		$solvers = SolverModel::get(['id']);
		$pages = PageModel::get(['id']);
		$jobs = JobModel::orderBy('created_at','desc')->get(['id', 'name', 'created_at', 'updated_at', 'parent', 'owner', 'status', 'pluginID']);
		return view('admin.dashboard',['users'=>$users, 'plugins'=>$plugins, 'solvers'=>$solvers, 'pages'=>$pages, 'jobs'=>$jobs]);
*/

	}
/*
									*/
	public function repoChangePublic(Request $request){
		$file=Repository::findOrFail($request->index*1);
		$this->authorize('update',$file);
		$file->ispublic = $request->ispublic;
		$file->save();
	}
	public function deleteRepo($id){
		$file=Repository::findOrFail($id);
		$this->authorize('delete',$file);
		$file->delete();
		Storage::delete($file->filename);
		return back();
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
	public function myInfo_preset(){
		$user = User::where('id',Auth::user()->id)->first();
		return view('preset.userInfo')->with('user',$user);
	}

    //
}
