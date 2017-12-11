<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Gate;
class enterAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
	if(Gate::allows('enter-adminpage')){
	        return $next($request);
	}else{
		return redirect('/');
	}
    }
}
