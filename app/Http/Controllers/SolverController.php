<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SolverModel;

class SolverController extends Controller
{
	public function get($name){
		return SolverModel::where('name',$name)->first();
	}
    //
	public function delete_solver(Request $request){
		$solver=SolverModel::findOrFail($request->idx);
		$this->authorize('delete',$solver);
		$solver->delete();
	}
}
