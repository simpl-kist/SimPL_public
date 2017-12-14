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
					Storage::delete($user->mypic);
				}
				$filename = $request->file('file')->store("userpic");
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
	return redirect()->route('admin.myInfo');
    }
	public function changePolicy(Request $request)
	{
		$user = User::where('id',$request->Input('index'))->first();
		$this->authorize('update',$user);
		$user->policy = $request->Input('policy');
		$user->save();
		return redirect()->route('admin.users.page');
	}
	public function deleteUser(Request $request)
	{
		$user = User::where('id',$request->Input('index'))->first();
		$this->authorize('update',$user);
		$user->delete();
		return redirect()->route('admin.users');
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
		return view('admin.userInfo')->with('user',$user);
	}
	public function defaultPic(Request $request)
	{
		$user = User::findOrFail($request->index);
		$this->authorize('update',$user);
		Storage::delete($user->mypic);
		$user->mypic = null;
		$user->save();
		return route('admin.myInfo');
	}
}
