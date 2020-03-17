<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Plugin;
use App\Page;
use App\Repository;

class AuthServiceProvider extends ServiceProvider
{
	/**
	 * The policy mappings for the application.
	 *
	 * @var array
	 */
	protected $policies = [
		'App\Plugin' => 'App\Policies\PluginPolicy',
		'App\Solver' => 'App\Policies\SolverPolicy',
		'App\Repository' => 'App\Policies\RepositoryPolicy',
		'App\Page' => 'App\Policies\PagePolicy',
		'App\Job' => 'App\Policies\JobPolicy',
		'App\User' => 'App\Policies\UserPolicy',
		// 'App\Model' => 'App\Policies\ModelPolicy',
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
	}
}
