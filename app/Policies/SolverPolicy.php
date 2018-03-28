<?php

namespace App\Policies;

use App\User;
use App\Policy;
use Illuminate\Auth\Access\HandlesAuthorization;

class SolverPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
	public function create(User $user)
	{
		$policy = Policy::where('type',$user->policy)->first();
		return $policy->own_data_create == 1;
	}
	
	public function read(User $user,$data)
	{

	$policy = Policy::where('type',$user->policy)->first();
		if($data->owner == $user->id){
			return $policy->own_data_read == 1;
		}else{
			return $policy->oth_data_read == 1;
		}
	}
	public function update(User $user,$data)
	{
	$policy = Policy::where('type',$user->policy)->first();
		if($data->owner == $user->id){
			return $policy->own_data_update == 1;
		}else{
			return $policy->oth_data_update == 1;
		}
	}
	public function delete(User $user,$data)
	{
		$policy = Policy::where('type',$user->policy)->first();
		if($data->owner == $user->id){
			return $policy->own_data_delete == 1;
		}else{
			return $policy->oth_data_delete == 1;
		}
	}

}
