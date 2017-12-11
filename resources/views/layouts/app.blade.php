<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SimPL') }}</title>
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
<style>
	body{
		background:white;
	}
	.btn,.btn-link,.btn-link:hover,.btn-link:focus{
		color:black;
	}

</style>
</head>
<body>
    <div style="position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        height: 400px;
        margin: auto;">
        <div class="container">
            <div class="col-md-8 col-md-offset-2">
                <div style="text-align:center; margin-bottom:90px">
			<a href={{url('/')}}>
                    <img src='{{asset("/assets/kcms/img/simpl_logo.png")}}' style=width:275px>
			</a>
                </div>
        @yield('content')
            </div>
        </div>
    </div>
    </div>
    <!-- Scripts -->
</body>
</html>
