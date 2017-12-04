<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SimController extends Controller
{
	public function test(){
		exec('ls /',$output);
		print_r($output);
	}
}
