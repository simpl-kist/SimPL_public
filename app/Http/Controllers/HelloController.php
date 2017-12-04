<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HelloController extends Controller
{
		public function mino(Request $request){
					var_dump($request->mino);
					return ['World'];
				}
    //
}
