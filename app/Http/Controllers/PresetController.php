<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Repository;
use App\User;
class PresetController extends Controller
{
    //
	public function myInfo(){
		$user = User::where('id',Auth::user()->id)->first();
		return view('preset.userInfo')->with('user',$user);
	}
	public function repository(){
		return view('preset.repository');
	}
	public function repos_web($criteria=null){
		$user = Auth::user();
		if($user===null){
			return [];
		}
		$repos = Repository::where('owner',1)->where('author',$user->id)->
		when($criteria,function($query) use($criteria){
			return $query->where("alias","like","%".$criteria."%");
		})
		->orderBy("id","desc")
		->paginate(18);
		return view('preset.repository_web',compact('repos'));
	}
	public function repos_server($criteria=null){
		$user = Auth::user();
		if($user===null){
			return [];
		}
		$repos = Repository::where('owner',0)->where('author',$user->id)->
		when($criteria,function($query) use($criteria){
			return $query->where("alias","like","%".$criteria."%");
		})
		->orderBy("id","desc")
		->paginate(18);
		return view('preset.repository_server',compact('repos'));
	}
	public function repos_list(Request $request){
		$user = Auth::user();
		if($user===null){
			return [];
		}
		if($request->repos_for == "web"){
			$repos_for=1;
		}else if($request->repos_for == "server"){
			$repos_for=0;
		}
		$repos=Repository::where('owner',$repos_for)->where('author',$user->id)->
		when($request->repos_criteria,function ($query) use($request){
			return $query->where("alias","like","%".$request->repos_criteria."%");
		})->
		paginate(18);
		return $repos;
	}
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

}
