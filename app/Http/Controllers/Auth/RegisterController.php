<?php

namespace App\Http\Controllers\Auth;
use App\CmsEnv;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Log;
class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';
	public function redirectTo(){
		if(auth()->user()->policy === 'admin'){
			return '/admin/general';
		}else{
			return '/';
		}
	}
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
	public function make_rand($len){
		$str="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$text="";
		for($i=0; $i<$len; $i++){
			$text.=$str[rand(0,61)];
		}
		return $text;
	}
    protected function create(array $data)
    {
		$policy = CmsEnv::where("var_key","default_policy")->first();
		if($policy === null){
			$policy = "anonymous";
		}else{
			$policy = $policy->var_value;
		}
		if(User::count() === 0){
			$policy = "admin";
			$this->init();
		}
		Log::debug($policy);
		Log::debug($data);
		$verification_code = $this->make_rand(25);
		while(User::where("verification_code", $verification_code)->count() >0){
			$verification_code = $this->make_rand(25);
		}

		$affiliation = "";
		if(isset($data["affiliation"])){
			$affiliation = $data["affiliation"];
		}

		$phone = "";
		if(isset($data["phone"])){
			$phone = $data["phone"];
		}

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
	    'verification_code' => $verification_code,
            'password' => Hash::make($data['password']),
	    'policy' => $policy,
	    'affiliation' => $affiliation,
	    'phone' => $phone
        ]);
    }
	protected function init(){
		$envlist = ["url","logo","default_policy","repo_upload_permission","allow_api_run","leave_test_file","header","footer","jobdir","python2","python3","mpirun","pumat_type","pumat_address","pumat_key","ex_jobdir","ex_username","qname","qsub","qstat","qdel","storage"];
		foreach($envlist as $env){
			if(CmsEnv::where("var_key",$env)->count() > 0){
				if($env === "pumat_address" || $env === "pumat_key" || $env === "ex_username"){
					continue;
				}else{
					$cmsenv = CmsEnv::where("var_key",$env)->first();
				}
			}else{
				$cmsenv = new CmsEnv;
				$cmsenv->var_key = $env;
			}

			switch($env){
				case "url":
					$cmsenv->var_value = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/";
					break;
				case "storage":
					$cmsenv->var_value = "/data/repos/";
					break;
				case "repo_upload_permission":
					$cmsenv->var_value = "editor";
					break;
				case "jobdir":
					$cmsenv->var_value = "/data/jobs/";
					break;
				case "leave_test_file":
					$cmsenv->var_value = 0;
					break;
				case "allow_api_run":
					$cmsenv->var_value = 0;
					break;
				case "python2":
					$cmsenv->var_value = "python2";
					break;
				case "python3":
					$cmsenv->var_value = "python3";
					break;
				case "default_policy":
					$cmsenv->var_value = "anonymous";
					break;
				case "pumat_type":
					$cmsenv->var_value = "local";
					break;
				case "pumat_address":
					$cmsenv->var_value = "http://172.17.0.1:5001/";
					break;
				default:
					$cmsenv->var_value = "";
					break;
			}
			$cmsenv->save();
		}
	}
}
