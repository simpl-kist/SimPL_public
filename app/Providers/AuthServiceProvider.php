<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
	'App\PageModel' => 'App\Policies\DataPolicy',
	'App\PluginModel' => 'App\Policies\DataPolicy',
	'App\SolverModel' => 'App\Policies\SolverPolicy',
	'App\Repository' => 'App\Policies\RepoPolicy',
	'App\JobModel' => 'App\Policies\JobPolicy',
	'App\User' => 'App\Policies\UserPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        //
	Gate::define('enter-adminpage',function($user){
		return ($user->policy=="admin" || $user->policy == "editor");
	});
    }
}
