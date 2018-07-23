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

Route::get('/','PageController@view');
Route::post('/run_plugins',[
	'as'=>'run_plguins',
	'uses'=>'PluginController@run'
]);
Route::get('/repo/{alias}','PageController@getRepoforWeb');
Route::get('/server/{alias}','PluginController@getRepoforServer');
Route::post('/simulation/txtDownloader','AdminController@structureDownload');
Route::post('/utils/txtDownloader','AdminController@structureDownload');
Route::middleware(['auth','checkVerify','NotAnonymous'])->group(function(){

//개인 계정 정보를 수정하는 페이지는 만들어진 페이지를 링크하여 사용하도록 하는 것이 안전할 듯 하여
//preset이라는 prefix로 접근할 수 있게 만들었음. 더 좋은 방법이 있을 것 같습니다.
	Route::group(['prefix' => 'preset', 'as' => 'preset.'],function(){
		Route::get('/myInfo',[
			'as'=>'myInfo',
			'uses'=>'PresetController@myInfo'
		]);
Route::middleware(['can:create,App\Repository'])->group(function(){
		Route::get('/repository',[
			'as'=>'myInfo',
			'uses'=>'PresetController@repository'
		]);
		Route::post('/repository',[
			'as' => 'repository',
			'uses' => 'PresetController@repos_list',
		]);
		Route::post('/deleteRepo','PresetController@deleteRepo');

		Route::group(['prefix'=>'repository','as'=>'repository.'],function(){
			Route::post('/changePublic',[
				'as'=>'changePublic',
				'uses'=>'PresetController@repoChangePublic',
			]);
			Route::get('/web/{criteria?}',[
				'as' => 'web',
				'uses' => 'PresetController@repos_web'
			]);
			Route::get('/server/{criteria?}',[
				'as' => 'server',
				'uses' => 'PresetController@repos_server'
			]);
		});
});

		Route::POST('defaultPic','UserController@defaultPic')->name('defaultPic');
        
		Route::POST('/deleteMe',[
			'as'=>'deleteMe',
			'uses'=>'UserController@deleteMe',
		]);
		Route::POST('updateMe',[
			'as'=>'updateMe',
			'uses'=>'UserController@update',
		]);
	});

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
				'uses' => 'AdminController@dashboard'
			]);
			Route::get('/myInfo',[
				'as'=>'myInfo',
				'uses'=>'AdminController@myInfo'
			]);
			Route::get('/userInfo/{id}','UserController@userInfo');

			Route::get('/jobs',[
				'as' => 'jobs',
				'uses' => 'AdminController@jobs'
			]);
                        Route::post('jobs/delete',[
                                'as' => 'deleteJob',
                                'uses' => 'PluginController@deleteJob',
                        ]);
			Route::get('/general',[
				'as' => 'general',
				'uses' => 'AdminController@general'
			]);
			Route::post('/general/save','AdminController@saveEnv')->middleware('OnlyAdmin');
			Route::post('/general/backup_db','AdminController@backup_db')->middleware('OnlyAdmin');

			Route::post('/general/recover_db','AdminController@recover_db')->middleware('OnlyAdmin');
			Route::get('/dashboard',[
				'as' => 'dashboard',
				'uses' => 'AdminController@dashboard'
			]);

			Route::get('/repository',[
				'as' => 'repository',
				'uses' => 'AdminController@repository',
			]);

			Route::post('/repository',[
				'as' => 'repository',
				'uses' => 'AdminController@repos_list',
			]);

			Route::post('/deleteRepo','AdminController@deleteRepo');

			Route::group(['prefix'=>'repository','as'=>'repository.'],function(){
				Route::post('/changePublic',[
					'as'=>'changePublic',
					'uses'=>'AdminController@repoChangePublic',
				]);
				Route::get('/web/{criteria?}',[
					'as' => 'web',
					'uses' => 'AdminController@repos_web'
				]);
				Route::get('/server/{criteria?}',[
					'as' => 'server',
					'uses' => 'AdminController@repos_server'
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
					Route::POST('reset_key',[
						'as'=>'reset_key',
						'uses'=>'UserController@reset_verification_key'
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
				Route::post('/delete',[
					'as'=>'delete',
					'uses'=>'PluginController@delete'
				]); 
				Route::post('/changePublic',[
					'as' => 'changePublic',
					'uses' => 'PluginController@changePublic',
				]);

				Route::post("/test",'PluginController@run');
			});
			Route::get('/plugins/{type?}/{criteria?}',[
				'as'=> 'plugins',
				'uses'=>'PluginController@list'
			]);
			Route::get('/solvers',[
				'as' => 'solvers',
				'uses' => 'AdminController@solvers'
			]);
			Route::post('/solvers/add','AdminController@saveSolver')->middleware('can:create,App\SolverModel');
			Route::post('/solvers/delete','SolverController@delete_solver');
			Route::group(['prefix'=>'pages','as'=>'pages.'],function(){
				Route::post('/add',[
					'as' => 'add',
					'uses' => 'PageController@add'
				]);
/*				Route::post('/changePublic',[
					'as' => 'changePublic',
					'uses' => 'PageController@changePublic',
				]);
*/
				Route::get('/new',[
					'as'=>'new',
//					'uses'=>function(){return view('admin.pages.new');}
					'uses'=>function(){return view('admin.pages.modify');}
				])->middleware('can:create,App\PageModel');
				Route::get('/setFront/{id}','PageController@setFront');
				Route::get('/modify/{id}','PageController@modify');
				Route::post('/delete','PageController@delete');
			});
			Route::get('/pages/{type?}/{criteria?}',[
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

});

Route::get('repos/web/{filename}', function ($filename){
    $path = storage_path('repos/web/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});
Route::post('repos/upload-file','AdminController@uploadFile')->middleware('can:create,App\Repository');
Route::post('repos/download-file','AdminController@downloadFile');
Route::get('repos/list/{repos_for}','AdminController@getRepoList');
Route::get('userpic/{filename}', function ($filename)
{
    $path = storage_path('userpic/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

Route::get('/{pagealias}','PageController@view');
