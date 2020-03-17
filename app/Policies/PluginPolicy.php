<?php

namespace App\Policies;

use App\User;
use App\Policy;
use App\Plugin;
use Illuminate\Auth\Access\HandlesAuthorization;

class PluginPolicy{
	use HandlesAuthorization;
	public function create(User $user){
		$policy = Policy::where('type',$user->policy)->first();
		return $policy->own_data_create == 1;
	}
	public function read(User $user, $data){
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_read == 1;
		}else{
			return $policy->oth_data_read == 1;
		}
	}
	public function update(User $user, $data){
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_update == 1;
		}else{
			return $policy->oth_data_update == 1;
		}
	}
	public function delete(User $user, $data){
		$policy = Policy::where('type',$user->policy)->first();
		if($data->author == $user->id){
			return $policy->own_data_delete == 1;
		}else{
			return $policy->oth_data_delete == 1;
		}
	}
	public function run(User $user, $data){
		if($user !== null){
			switch($user->policy){
				case "admin":
					return true;
					break;
				case "editor":
					if($data->is_public <= 3){
						return true;
					}else{
						return false;
					}
					break;
				case "user":
					if($data->is_public <= 2){
						return true;
					}else{
						return false;
					}
    
					break;
				case "anonymous":
					if($data->is_public <= 1){
						return true;
					}else{
						return false;
					}
					break;
			}
		}else{
			if($data->is_public <= 0){
				return true;
			}else{
				return false;
			}
		}
	}
}
