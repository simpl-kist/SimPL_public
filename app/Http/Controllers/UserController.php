<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
   public function update(Request $request, User $user)
    {
        //
	$user = User::where('id',Auth::user()->id)->first();
        $inputPassword = $request->password;
        $pwhash = $user->password;

        if( Hash::check($inputPassword,$pwhash) ){
            $this->authorize('update',$user);
			if($request->hasFile('file')){
				if($user->mypic!==null){
					Storage::disk('userpic')->delete($user->mypic);
				}
				$filename = $request->file('file')->store("/","userpic");
				$user->mypic = $filename;
			}
            $user->name = urldecode($request->name);
            $user->affiliation = urldecode($request->affiliation);
            $user->tel = urldecode($request->tel);
            $user->phone = urldecode($request->phone);
            if($request->newpassword !=""){
                if($request->newpassword === $request->newpasswordverify){
                    $user->password = bcrypt($request->newpassword);
                }else{
                    return response()->json("newpassword error");
                }
            }
            $user->save();
        }else{
		return redirect()->back()->withErrors(['msg','password error']);
        }
	return back();
    }
	public function changePolicy(Request $request)
	{
		$user = User::where('id',$request->Input('index'))->first();
		$this->authorize('update',$user);
		$user->policy = $request->Input('policy');
		$user->save();
		return redirect()->route('admin.users.page');
	}

	public function deleteMe(Request $request)
	{
		$inputPassword = $request->password;
		$index = $request->index;
		$user = User::where('id',$index)->first();
	        $pwhash = $user->password;
	        if( Hash::check($inputPassword,$pwhash) ){
			if(Auth::user()->id==$index){
				$this->authorize('delete',$user);
				$user->delete();
				return "success";
			}else{
				return "not same";
			}
		}else{
			return "password error";
		}
	}
	public function userInfo($id)
	{
		$user = User::findOrFail($id);
		$this->authorize('read',$user);
		return redirect()->back()->with('user',$user);
	}
	public function defaultPic(Request $request)
	{
		$user = User::findOrFail($request->index);
		$this->authorize('update',$user);
		Storage::delete($user->mypic);
		$user->mypic = null;
		$user->save();
		return redirect()->back()->with('user',$user);
	}

	public function reset_verification_key(Request $request){
		$user=Auth::user();
		if($user===null){
			return;
		}
		$inputPassword = $request->password;
	        $pwhash = $user->password;
	        if( Hash::check($inputPassword,$pwhash) ){
			$user->verification_code=$this->make_rand_string(32);
			$user->save();
			return "success";
		}else{
			return "password error";
		}
	}

	public function make_rand_string($len){
		$rand_str="1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz=";
		$rand_string="";
		for($i=0 ; $i<$len ; $i++){
			$randnum=rand(0,62);
			$rand_string.=$rand_str[$randnum];
		}
		return $rand_string;
	}
}
