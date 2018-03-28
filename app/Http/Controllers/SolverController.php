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
	public function delete_solver(Request $request){
		$solver=SolverModel::findOrFail($request->idx);
		$this->authorize('delete',$solver);
		$solver->delete();
	}
}
