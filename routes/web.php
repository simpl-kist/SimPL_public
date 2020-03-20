<?php
Auth::routes();
Route::get('/logout', 'Auth\LoginController@logout');
Route::get('repo/{alias}','RepositoryController@showWeb')->where('alias','.*');
Route::post('/run_plugins','PluginController@runPlugin');
Route::group(['prefix'=>'admin','middleware'=>['auth', 'onlyEditor']], function(){
	Route::get('/','ViewController@dashboard');
	Route::get('dashboard','ViewController@dashboard');
	Route::group(['prefix'=>'general','middleware'=>['onlyAdmin']], function(){
		Route::get("/",'ViewController@general');
		Route::post("/update","PlatformController@updateEnvironment");
		Route::post("/backup","PlatformController@backup");
		Route::post("/recover","PlatformController@recover");
	});
	Route::group(['prefix'=>'solvers'], function(){
		Route::get('/','ViewController@solvers');
		Route::post('/save','SolverController@saveSolver');
		Route::post('/delete','SolverController@deleteSolver');
	});
	Route::group(['prefix'=>'plugins'], function(){
		Route::get('/','ViewController@plugins');
		Route::post('/list','PluginController@getList');
		Route::post('/load','PluginController@loadPlugin');
		Route::post('/save','PluginController@savePlugin');
		Route::post('/delete','PluginController@deletePlugin');
		Route::post('/test','PluginController@runPlugin');
	});
	Route::group(['prefix'=>'pages'], function(){
		Route::get('/','ViewController@pages');
		Route::post('/list','PageController@getList');
		Route::post('/load','PageController@loadPage');
		Route::post('/save','PageController@savePage');
		Route::post('/delete','PageController@deletePage');
		Route::post('/front','PageController@makeFront');
	});
	Route::group(['prefix'=>'users', 'middleware'=>['onlyAdmin']], function(){
		Route::get('/','ViewController@users');
		Route::post('/delete','UserController@deleteUser');
		Route::post('/policy','UserController@changePolicy');
	});
	Route::group(['prefix'=>'jobs'], function(){
		Route::get('/','ViewController@jobs');
		Route::post('/delete','JobController@deleteJob');
		Route::post('/load','JobController@loadJob');
		Route::post('/file','JobController@loadFile');
	});
	Route::group(['prefix'=>'repositories'], function(){
		Route::get('/','ViewController@repositories');
		Route::post('webFiles','RepositoryController@webFiles');
		Route::get('web/{criteria?}','RepositoryController@repos_web');
		Route::post('serverFiles','RepositoryController@serverFiles');
		Route::get('server/{criteria?}','RepositoryController@repos_server');
		Route::post('renameFile','RepositoryController@renameFile');
		Route::post('uploadFile','RepositoryController@uploadFile');
		Route::post('deleteFile','RepositoryController@deleteFile');
		Route::post('changePublic','RepositoryController@changePublic');
	});
});
Route::group(['prefix'=>'preset','middleware'=>['auth']],function(){
	Route::get('userpic/{alias}','UserController@showPic');
	Route::group(['prefix'=>'account'],function(){
		Route::get('/', 'ViewController@account');
		Route::post('update','UserController@updateAccount');
		Route::post('updatePic','UserController@updatePic');
		Route::post('genkey','UserController@genKey');
	});
	Route::group(['prefix'=>'repositories'], function(){

	});
});
/*
Route::group(['prefix'=>'preset', 'middleware'=>['auth']], function(){
	Route::group(['prefix'=>'repositories'], function(){
		Route::get('/','PresetController@repositories');
		Route::get('web/{criteria?}','RepositorytController@repos_web');
		Route::get('server/{criteria?}','RepositoryController@repos_server');
	});
});
Route::group(['prefix'=>'repos'],function(){
	Route::post('upload-file','AdminController@uploadFile')->middleware('can:create,App\Repository');
	Route::post('download-file','AdminController@downloadFile');
	Route::get('list/{repos_for}','AdminController@getRepoList');
});
*/

Route::post('/simulation/txtDownloader','PlatformController@downloadTxt');
Route::get('/{page?}','PageController@openPage');
