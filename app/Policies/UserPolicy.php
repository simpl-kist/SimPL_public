<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;
    
    public function delete(User $user, User $model)
    {
		if($model->id == 1){
			return false;
		}else{
			if($user->policy==='admin'){
				return true;
			}else{
				return false;
			}
		}
    }

}
