<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SolverModel;

class SolverController extends Controller
{
	public function get($id){
		return SolverModel::findOrFail($id);
	}
    //
}
