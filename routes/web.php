<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/','IndexController@index'); 
/*Route::get('/admin/', function () {
    return view('admin.index');
});*/
Route::group(['prefix' => 'admin', 'as' => 'admin.'],function(){
	Route::get('/',[
		'as' => 'index',
		'uses' => 'AdminController@index'
	]);
	Route::get('/jobs',[
		'as' => 'jobs',
		'uses' => 'AdminController@jobs'
	]);
	Route::get('/general',[
		'as' => 'general',
		'uses' => 'AdminController@general'
	]);
	Route::get('/repository',[
		'as' => 'repository',
		'uses' => 'AdminController@repository'
	]);
	Route::group(['prefix'=>'repository','as'=>'repository.'],function(){
		Route::post('/upload-file',[
			'as'=>'upload-file',
			'uses'=>'AdminController@uploadFile'
		]);
	});
	Route::post('/general/save','AdminController@saveEnv');
	Route::get('/users',[
		'as' => 'users',
		'uses' => 'AdminController@users'
	]);
	Route::group(['prefix'=>'plugins','as'=>'plugins.'],function(){
		Route::post('/store',[
			'as'=>'store',
			'uses'=>'PluginController@store'
		]);
		Route::get('/new','PluginController@add');
		Route::get('/modify/{id}',[
			'as'=>'modify',
			'uses'=>'PluginController@modify']);
		Route::get('/delete/{id}',[
			'as'=>'delete',
			'uses'=>'PluginController@delete']);

		Route::post("/test",'PluginController@run');
	});
	Route::get('/plugins',[
		'as'=> 'plugins',
		'uses'=>'PluginController@list'
	]);
	Route::get('/solvers',[
		'as' => 'solvers',
		'uses' => 'AdminController@solvers'
	]);
	Route::post('/solvers/add','AdminController@saveSolver');
	Route::group(['prefix'=>'pages','as'=>'pages.'],function(){
		Route::post('/add',[
			'as' => 'add',
			'uses' => 'PageController@add'
		]);
		Route::get('/new',[
			'as'=>'new',
			'uses'=>function(){return view('admin.pages.new');}
		]);
		Route::get('/setFront/{id}','PageController@setFront');
		Route::get('/modify/{id}','PageController@modify');
		Route::get('/delete/{id}','PageController@delete');
	});
	Route::get('/pages',[
		'as' => 'pages',
		'uses' => 'PageController@list'
	]);
//	Route::post('/pages/add','PageController@add');
});
Route::get('/simulation','SimController@test');
Route::get('/','PageController@view');
Route::get('/{pagealias}','PageController@view');
Route::get('/repo/{alias}','PageController@getRepo');
/*Route::group(['prefix'=>'api','as'=>'api.'],function(){
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
	});
});*/
