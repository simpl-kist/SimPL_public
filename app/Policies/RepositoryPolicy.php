<?php

namespace App\Policies;

use App\CmsEnv;
use App\User;
use App\Repository;
use App\Policy;
use Illuminate\Auth\Access\HandlesAuthorization;

class RepositoryPolicy
{
   use HandlesAuthorization;

	public function create(User $user){
		$min_class=CmsEnv::where("var_key","repo_upload_permission")->first()->var_value;
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
	}
	public function read(User $user,$data){
        if($data->ispublic*1 !== 0){
            if($user == null){
                return false;
            }else{
                $_policy=Auth::user()->policy;
                $_ispublic=$data->ispublic*1;
                switch($_policy){
                    case "anonymous":
                        if($_ispublic > 1){
                            return 0;
                        }
                        break;
                    case "user":
                        if($_ispublic > 2){
                            return 0;
                        }
                        break;
                    case "editor":
                        if($_ispublic > 3){
                            return 0;
                        }
                        break;
                    case "admin":
                        if($_ispublic > 4){
                            return 0;
                        }
                        break;
                    default:
                        return 0;
                }
            }
        }
        return 1;
    }
	public function update(User $user,$data){
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_update == 1;
		}else{
			return $policy->oth_data_update == 1;
		}
	}
	public function delete(User $user,$data){
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_delete == 1;
		}else{
			return $policy->oth_data_delete == 1;
		}
	}
}
