<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use ZipArchive;
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
		$type=isset($_GET['type']) ? $_GET['type'] : "";
		$value=isset($_GET['value']) ? $_GET['value'] : "";
		$url="/admin/jobs";
		if($value !== ""){
			$url.="?type=".$type."&value=".$value;
		}
		$ori_type=$type;
		$ori_value=$value;

		switch($type){
			case "pluginalias":
				$type="pluginId";
				$tmp_plugin=PluginModel::where("alias",$value)->first();
				if($tmp_plugin!==null){
					$value=$tmp_plugin->id;
				}else{
					$value=-2;
				}
				break;
			case "pluginid":
				$type = "pluginId";
				break;
			case "name":
			case "":
				break;
			default:
				$type="pluginId";
				$value=-2;				
		}
		$jobs = JobModel::when(isset($type) and $type!=="", function($query) use($type, $value){
			return $query->where($type,$value);
		})->
		orderBy('created_at','desc')->
		select(['id','name','created_at','updated_at','output','pluginId','qinfo'])->
		paginate(10);

		$jobs->withPath($url);

		return view("admin.jobs")->with(['jobs'=>$jobs,'type'=>$ori_type,'value'=>$ori_value]);
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
				$filename = $files[$i]->store("web","repos");
			}else if($repos_for == 0){
				$filename = $files[$i]->store("server","repos");
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
	public function downloadFile(Request $request){
		$repos_for = $request->repos_for === "web" ? 1 : 0;
		$alias=json_decode($request->alias);
		$repo = Repository::where("owner",$repos_for)->whereIn('alias',$alias)->get();
		if(count($repo)===0){
			return "no file";
		}
		if(count($repo)===1){
			return response()->download(storage_path("repos")."/".$repo[0]->filename,$repo[0]->alias);
		}else{
			$zip=new ZipArchive();
			$opened=$zip->open("SimPL_files_".$request->repos_for.".zip",ZipArchive::CREATE);
			if($opened ===true){
				for($i=0, $len=count($repo) ; $i<$len ; $i++){
					$zip->addFile(storage_path("repos")."/".$repo[$i]->filename,$repo[$i]->alias);
				}
				$zip->close();
				return response()->download("SimPL_files_".$request->repos_for.".zip")->deleteFileAfterSend(true);
			}
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
		->orderBy("id","desc")
		->paginate(18);
		return view('admin.repository_web',compact('repos'));
	}
	public function repos_server($criteria=null){
		$repos = Repository::where('owner',0)
		->when($criteria,function($query) use($criteria){
			return $query->where("alias","like","%".$criteria."%");
		})
		->orderBy("id","desc")
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
	public function deleteRepo(Request $request){
		$id=$request->idx;
		$file=Repository::findOrFail($id);
		$this->authorize('delete',$file);
		$file->delete();
		Storage::disk('repos')->delete($file->filename);
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

		$path = storage_path('backup');
		if(!(is_dir($path))){
			mkdir($path);
		}
		$entrys = array();
		$dirs = dir($path);
		while(false !== ($entry = $dirs->read())){ 
			if(($entry != '.') && ($entry != '..')) { 
				if(is_dir($path.'/'.$entry)) {
				} 
				else {
					if(strrpos($entry,".sql")!==false){
						$entrys[] = $entry; 
					}
				} 
			} 
		} 
		$dirs->close();
		$env['entry']=$entrys;

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
		$solvers = SolverModel::orderBy('id','desc')->get();
		return view("admin.solvers",compact('solvers'));
	}
	public function saveEnv(){
		foreach(['verifyemail','url','title','logo','header','footer','python','mpirun','qsub','qstat','qdel','jobdir','repo_upload_permission'] as $param){
			if(isset($_POST[$param])){
				$env = CmsEnvModel::findOrNew($param);
				$env->var_key = $param;
				$env->var_value= $_POST[$param];
				$env->save();
			}
		}
	}
	public function recover_db(Request $request){
		$filename=escapeshellcmd($request->filename);
		$user=escapeshellcmd(env('DB_USERNAME'));
		$pass=escapeshellcmd(env('DB_PASSWORD'));
		$db=escapeshellcmd(env('DB_DATABASE'));
		$path=storage_path("backup");
		exec("mysql --user=".$user." --password=".$pass." ".$db." <".$path."/".$filename);
	}
	public function backup_db(Request $request){
		$user=escapeshellcmd(env('DB_USERNAME'));
		$pass=escapeshellcmd(env('DB_PASSWORD'));
		$db=escapeshellcmd(env('DB_DATABASE'));
		$backup_target=$request->backup_object;
		$filename=escapeshellcmd($db.(now()->format('Y-m-d_H:i:s'))."(".implode(",",$backup_target).").sql");
		$path=storage_path("backup");
		$tables="";
		if(count($backup_target)===0) return;
		if(array_search("job",$backup_target)!==false && array_search("user",$backup_target)===false){
			array_push($backup_target,"user");
			array_push($backup_target,"password_resets");
		}
		for($i=0 ; $i<count($backup_target) ; $i++){
			$target_table="";
			switch($backup_target[$i]){
				case "env":
					$target_table="vcms_env";
					break;
				case "user":
					$target_table="users password_resets";
					break;
				case "job":
					$target_table="vcms_job";
					break;
				case "plugin":
					$target_table="vcms_plugin";
					break;
				case "page":
					$target_table="vcms_pages";
					break;
				case "solver":
					$target_table="vcms_solvers";
					break;
			}
			$tables.=$target_table." ";
		}
		exec('mysqldump --user='.$user.' --password='.$pass." ".$db.' '.$tables.' > '.$path."/".$filename);
		return $filename;
	}
	public function saveSolver(){
		$solver = new SolverModel;
		$checkExistsName=SolverModel::where('name',$_POST['name'])->get();
		if(count($checkExistsName)>0) return redirect(route('admin.solvers'));
		$solver->name = $_POST['name'];	
		$solver->version = $_POST['version'];	
		$solver->author = $_POST['author'];	
		$solver->owner = Auth::user()->id;
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
        public function structureDownload(Request $request){
                $fp=fopen($request->filename,"w");
                fwrite($fp,$request->content);
                fclose($fp);
                return response()->download($request->filename)->deleteFileAfterSend(true);
        }
    //
}
