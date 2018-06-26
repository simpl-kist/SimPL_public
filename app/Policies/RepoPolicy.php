<?php

namespace App\Policies;

use App\User;
use App\Policy;
use App\Repository;
use App\CmsEnvModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class RepoPolicy
{
    use HandlesAuthorization;
    public function __construct()
    {
        //
    }
	public function create(User $user)
	{
		$min_class=CmsEnvModel::where("var_key","repo_upload_permission")->first()->var_value;
		switch($user->policy){
			case "admin":
				return true;
			case "editor":
				if($min_class==="admin") return false;
				return true;
			case "user":
				if($min_class==="admin" || $min_class==="editor") return false;
				return true;
			case "anonymous":
				if($min_class==="anonymous") return true;
				return false;
			default:
				return false;
		}
//		$policy = Policy::where('type',$user->policy)->first();
//		return $policy->own_data_create == 1;
	}
	
	public function read(User $user,$data)
	{
	$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_read == 1;
		}else{
			return $policy->oth_data_read == 1;
		}
	}
	public function update(User $user,$data)
	{
	$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_update == 1;
		}else{
			return $policy->oth_data_update == 1;
		}
	}
	public function delete(User $user,$data)
	{
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_delete == 1;
		}else{
			return $policy->oth_data_delete == 1;
		}
	}

}
