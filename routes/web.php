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
Auth::routes();


Route::get('logout','Auth\LoginController@logout');
Route::get('verification',function(){
	if(Auth::user()->verified===1){
		return redirect('/');
	}else{
		return view('verification');
	}
});

Route::get('/verifyemail/{token}','Auth\RegisterController@verify');

Route::middleware(['auth','checkVerify','NotAnonymous'])->group(function(){
	Route::get('/','IndexController@index'); 
	Route::get('/','PageController@view');
	/*Route::get('/admin/', function () {
	    return view('admin.index');
	});*/
	Route::group(['prefix' => 'admin', 'as' => 'admin.'],function(){
		Route::middleware('enterAdmin')->group(function(){
			Route::get('/logo',[
				'as' => 'logo',
				'uses' => function(){
					return redirect(App\Http\Controllers\AdminController::getLogo());
				}//'AdminController@getLogo'
			]);
			Route::get('/',[
				'as' => 'index',
				'uses' => 'AdminController@index'
			]);
			Route::get('/myInfo',[
				'as'=>'myInfo',
				'uses'=>'AdminController@myInfo'
			]);
			Route::get('/userInfo/{id}','UserController@userInfo');
			Route::POST('defaultPic','UserController@defaultPic')->name('defaultPic');

			Route::POST('/deleteMe',[
				'as'=>'deleteMe',
				'uses'=>'UserController@deleteMe',
			]);
			Route::POST('updateMe',[
				'as'=>'updateMe',
				'uses'=>'UserController@update',
			]);
			Route::get('/jobs',[
				'as' => 'jobs',
				'uses' => 'AdminController@jobs'
			]);
			Route::get('/general',[
				'as' => 'general',
				'uses' => 'AdminController@general'
			]);
			Route::post('/general/save','AdminController@saveEnv')->middleware('OnlyAdmin');
			Route::get('/repository',[
				'as' => 'repository',
				'uses' => 'AdminController@repository'
			]);
			Route::get('/dashboard',[
				'as' => 'dashboard',
				'uses' => 'AdminController@dashboard'
			]);

			Route::get('/deleteRepo/{id}','AdminController@deleteRepo');
			Route::group(['prefix'=>'repository','as'=>'repository.'],function(){
				Route::post('/upload-file',[
					'as'=>'upload-file',
					'uses'=>'AdminController@uploadFile'
				])->middleware('can:create,App\Repository');
				Route::post('/changePublic',[
					'as'=>'changePublic',
					'uses'=>'AdminController@repoChangePublic',
				]);
			});


			Route::group(['prefix'=>'users','as'=>'users.'],function(){
				Route::middleware('OnlyAdmin')->group(function(){
					Route::get('/page',[
						'as' => 'page',
						'uses' => 'AdminController@users'
					]);
					Route::POST('changePolicy',[
						'as'=>'changePolicy',
						'uses'=>'UserController@changePolicy',
					]);
					Route::POST('deleteUser',[
						'as'=>'deleteUser',
						'uses'=>'UserController@deleteUser',
					]);
				});
			});
//관리자권한필요
			Route::group(['prefix'=>'plugins','as'=>'plugins.'],function(){
				Route::post('/store',[
					'as'=>'store',
					'uses'=>'PluginController@store'
				]);
				Route::get('/new','PluginController@add')->middleware('can:create,App\PluginModel'); 
				Route::get('/modify/{id}',[
					'as'=>'modify',
					'uses'=>'PluginController@modify'
				]);
				Route::get('/delete/{id}',[
					'as'=>'delete',
					'uses'=>'PluginController@delete'
				]); 
				Route::post('/changePublic',[
					'as' => 'changePublic',
					'uses' => 'PluginController@changePublic',
				]);

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
			Route::post('/solvers/add','AdminController@saveSolver')->middleware('can:create,App\SolverModel');
			Route::group(['prefix'=>'pages','as'=>'pages.'],function(){
				Route::post('/add',[
					'as' => 'add',
					'uses' => 'PageController@add'
				]);
				Route::post('/changePublic',[
					'as' => 'changePublic',
					'uses' => 'PageController@changePublic',
				]);
				Route::get('/new',[
					'as'=>'new',
					'uses'=>function(){return view('admin.pages.new');}
				])->middleware('can:create,App\PageModel');
				Route::get('/setFront/{id}','PageController@setFront');
				Route::get('/modify/{id}','PageController@modify');
				Route::get('/delete/{id}','PageController@delete');
			});
			Route::get('/pages',[
				'as' => 'pages',
				'uses' => 'PageController@list'
			]);
		});
//	//	Route::post('/pages/add','PageController@add');
	});

	Route::get('/simulation','SimController@test');
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
	Route::get('/{pagealias}','PageController@view');
	Route::get('/repo/{alias}','PageController@getRepo');
});
