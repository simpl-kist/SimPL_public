<?php

namespace App\Policies;

use App\User;
use App\Policy;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the user.
     *
     * @param  \App\User  $user
     * @param  \App\User  $user
     * @return mixed
     */
    public function read(User $user, User $target_user)
    {
        //
	if($user->id === $target_user->id){
		return true;
	}else if(Policy::where('type',$user->policy)->first()->oth_user_read === 1)
		return true;	
	else{
		return false;
	}
    }

    /**
     * Determine whether the user can create users.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the user.
     *
     * @param  \App\User  $user
     * @param  \App\User  $user
     * @return mixed
     */
    public function update(User $user, User $target_user)
    {
        //
	if($user->id === $target_user->id){
		return true;
	}else if(Policy::where('type',$user->policy)->first()->oth_user_update === 1)
		return true;	
	else{
		return false;
	}
    }

    /**
     * Determine whether the user can delete the user.
     *
     * @param  \App\User  $user
     * @param  \App\User  $user
     * @return mixed
     */
    public function delete(User $user, User $target_user)
    {
        //
	if($user->id === $target_user->id){
		return true;
	}else if(Policy::where('type',$user->policy)->first()->oth_user_delete === 1)
		return true;	
	else{
		return false;
	}
    }
}
