<!DOCTYPE html>
<?php
use App\CmsEnv;
use App\Repository;
$env = CmsEnv::where('var_key', 'logo')->first();
?>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SimPL') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

	<link rel="stylesheet" href="/css/fontawesome.css">
	<script src="/js/fontawesome.js"></script>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<style>
	.body{
		background-color:white;
	}
	.btn-simpl{
		background-color:black;
		color:white !important;
	}
	.btn-simpl:hover, .btn-simpl:focus{
		background-color:#4A4A4A;
	}
	</style>
</head>
<body>
    <div style="position:absolute; left:0; right:0; top:0; bottom: 0; height:400px; margin:auto; text-align:center;">
		<a href="{{url('/')}}">
@if(isset($env) && $env->var_value !== "")
<?php
$filename = "/img/simpl_logo.png";
$filename=$env->var_value;
?>
			<img src="{{$filename}}" style="max-height:200px;">
@else
			<img src="/img/simpl_logo.png" style="width:300px;">
@endif
		</a>
        <main class="py-4">
			<div class="justify-content-center" style="width:700px; margin:auto;">
	            @yield('content')
			</div>
        </main>
    </div>
</body>
</html>
