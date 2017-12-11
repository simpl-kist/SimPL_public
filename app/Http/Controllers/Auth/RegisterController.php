<?php

namespace App\Http\Controllers\Auth;
use Mail;
use App\Mail\EmailVerification;

use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use App\Jobs\SendVerificationEmail;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

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

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('verify');
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'verification_code' => base64_encode($data['email']),
        ]);
    }
	public function register(Request $request)
	    {
	        $this->validator($request->all())->validate();
	        $user = $this->create($request->all());
	        $email = new EmailVerification($user);
	        Mail::to($user->email)->send($email);
	        return view('verification');
	
	    }
	    public function verify($token)
	    {
	        $user = User::where('verification_code',$token)->first();
	        if($user->verified === 1)
	            return redirect('/');
	        $user->verified = 1;
	        $user->save();
	        if($user->save()){
	            return view('emailconfirm',['user'=>$user]);
	        }
	    }
}
