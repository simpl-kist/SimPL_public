<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix'=>'solvers','as'=>'solvers.'],function(){
	Route::get('/get/{id}',[
		'as'=>'get',
		'uses'=>'SolverController@get'
	]);
});
Route::group(['prefix'=>'plugin','as'=>'plugin.'],function(){
	Route::post('/run',[
		'as'=>'run',
		'uses'=>'PluginController@run'
	]);
	Route::post('/saveJob',[
		'as'=>'saveJob',
		'uses'=>'PluginController@saveJob'
	]);
	Route::post('/getJobs',[
		'as'=>'getJobs',
		'uses'=>'PluginController@getJobs'
	]);
	Route::post('/getMyInfo',[
		'as'=>'getMyInfo',
		'uses'=>'PluginController@getMyInfo'
	]);
	Route::post('/getRepoforServer',[
		'as'=>'getRepoforServer',
		'uses'=>'PluginController@getRepoforServer'
	]);
});



