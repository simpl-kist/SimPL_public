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
			'author' => Auth::user()->id,
		]);
	}
	public function repository(){
		$repos = Repository::get();
		return view('admin.repository',compact('repos'));
	}
	public function dashboard(){
		//bootstrap danger, warning, info, success color
		$colorTable = ["red"=>"#dd4b39", "yellow"=>"#f39c12", "blue"=>"#00c0ef", "green"=>"#00a65a"];

//get data from db
		$jobsQuarter = JobModel::select('id', 'name', 'created_at', 'updated_at', 'parent', 'owner', 'status', 'pluginID')->orderBy('created_at','desc')->get();
//		$jobsMonth = ;
//		$jobsWeek = ;
//		$jobsToday = ;
		$_users = new User;
		$users = $_users->orderBy('created_at','desc');
		$nusers = $users->count();
		$recentUsers = $users->limit(4)->get(['name','affiliation','mypic','created_at']);
		
		$totalUsers = User::select('name', 'affiliation', 'mypic', 'created_at')->orderBy('created_at','desc')->get();
//		$recentUsers = array_slice($totalUsers->toArray(), 0, 4); 
		$pluginNumber = PluginModel::count();
		$solverNumber = SolverModel::count();
		$jobNumber = JobModel::count();
//process data
		
		for($i = 0; $i < $recentUsers->count(); $i++){
			// test code TODO
			// end of test code
			$recentUsers[$i]->ago = \Carbon\Carbon::parse($recentUsers[$i]->created_at)->diffForHumans();
			preg_match('/\d+\s([a-z]+?)s?\s.+/', $recentUsers[$i]['ago'], $matched);
			switch($matched[1]){
				case "year":
					$recentUsers[$i]->agoColor = $colorTable['blue'];
					break;
				case "month":
					$recentUsers[$i]->agoColor = $colorTable['blue'];
					break;
				case "week":
					$recentUsers[$i]->agoColor = $colorTable['green'];
					break;
				case "day":
					$recentUsers[$i]->agoColor = $colorTable['yellow'];
					break;
				default:
					$recentUsers[$i]->agoColor = $colorTable['red'];
			}
		}
//bind to view
		return view('admin.dashboard',[
				//for test TODO
//				'test' => print_r($recentUsers->toArray()),
				'NUsers'				=> ['totalUsers'=>$nusers, 'monthlyVisitors'=>'41,410', 'monthlyJoin'=>'8', 'concurrentUsers'=>'20'],
				'NJobs'					=> ['runningJobs'=>'11', 'totalJobs'=>$jobNumber, 'solver'=>$solverNumber, 'plugin'=>$pluginNumber],
 				'usageData'			=> [['solverName'=>"SIESTA", 'data'=>[ 4, 2, 10, 70, 50, 20, 200]],
		             		     ['solverName'=>'Quantum Espresso', 'data'=>[65, 59, 80, 81, 56, 55, 40]],
    		            		 ['solverName'=>'Lammps', 'data'=>[28, 48, 40, 19, 86, 27, 90]],],
				'masterStatus'	=> ['cpu'=>[2.2,20],'memory'=>[6,16], 'disk'=>[1,20], 'placeholder'=>[300,500] ],
				'PieData'				=>[["value"=>700, "label"=>"Plugin1"],
													["value"=>500, "label"=>"Plugin2"],
													["value"=>400, "label"=>"Plugin3"],
													["value"=>600, "label"=>"Plugin4"],
													["value"=>300, "label"=>"Plugin5"],
													["value"=>100, "label"=>"Etc"]],
				'newUsers'			=>$recentUsers,
				'jobTable'			=> [["url"=>"#", "id"=>"7434", "name"=>"Quantum espresso test - Ni 111 defect", "user"=>"user1", "created_at"=>"13:20:20", "finished"=>"16:22:21", "status"=>"Finished", "statusColor"=>$colorTable["green"], "duration"=>"03:02:01", "nodes"=>"1", ],
														["url"=>"#", "id"=>"7433", "name"=>"Lammps test - combustion", "user"=>"user2", "created_at"=>"11:20:20", "finished"=>"-", "status"=>"Waiting", "statusColor"=>$colorTable["yellow"], "duration"=>"-", "nodes"=>"2", ],
														["url"=>"#", "id"=>"7432", "name"=>"gold particle(AMD)", "user"=>"user3", "created_at"=>"09:20:20", "finished"=>"10:32:51	", "status"=>"Error", "statusColor"=>$colorTable["red"], "duration"=>"01:10:12", "nodes"=>"3", ],
														["url"=>"#", "id"=>"7431", "name"=>"DFTB C O", "user"=>"user1", "created_at"=>"2017-12-14", "finished"=>"-", "status"=>"Running", "statusColor"=>$colorTable["blue"], "duration"=>"17:10:47", "nodes"=>"4", ],
														["url"=>"#", "id"=>"7430", "name"=>"Plugin(surface search)", "user"=>"user2", "created_at"=>"2017-12-14", "finished"=>"-", "status"=>"Waiting", "statusColor"=>$colorTable["yellow"], "duration"=>"-", "nodes"=>"5", ],
														["url"=>"#", "id"=>"7429", "name"=>"i", "user"=>"user1", "created_at"=>"2017-12-13", "finished"=>"2017-12-14", "status"=>"Error", "statusColor"=>$colorTable["red"], "duration"=>"00:00:01", "nodes"=>"6", ],
														["url"=>"#", "id"=>"7428", "name"=>"QE CoO supercell", "user"=>"user3", "created_at"=>"2017-12-13", "finished"=>"01:10:11", "status"=>"Finished", "statusColor"=>$colorTable["green"], "duration"=>"01:10:11", "nodes"=>"7", ]],
		]);
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
		return false;
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
