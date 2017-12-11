<?php

namespace Illuminate\Auth\Access;

use Exception;

class AuthorizationException extends Exception
{
    //
	public function __construct(){
	abort(404);
	}
}

