<?php

use Illuminate\Http\Request;

Route::group(['prefix'=>'solvers'],function(){
	Route::post('get/{name}','SolverController@getSolver');
});
Route::group(['prefix'=>'plugins'],function(){
	Route::post('run','PluginController@runPlugin');
	Route::post('saveJob','PluginController@saveJob');
	Route::post('getJobs','PluginController@getJobs');
	Route::post('getMyInfo','PluginController@getMyInfo');
	Route::post('getRepoforServer','PluginController@getRepoforServer');
});
