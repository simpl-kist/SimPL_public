<!DOCTYPE html>
<html lang="en">
<head>


<link href=“https://fonts.googleapis.com/css?family=Roboto” rel=“stylesheet”>
<style>
.brand_gray{
color:#555;
}
a{
    color:inherit;
}

a:hover
{
    color:inherit;
}
.navbar {
    border-radius: 4px;
    background-color: black;
}
.navbar-brand {
    float: left;
    height: 50px;
    padding: 15px 15px;
    font-size: 18px;
    line-height: 20px;
    margin-right: 27px;
}
.navbar-nav {
	color:#fff;
    float: left;
    margin: 14px;
}
.a {
}
.nav-item{
    color: #fff;
	margin-right:8px;
}
</style>
	<meta charset="UTF-8">
<script src={{URL::asset('assets/vendor/jquery/dist/jquery.min.js')}}></script>
<link rel=stylesheet type=text/css href={{URL::asset('assets/vendor/dropzone/dist/dropzone.css')}}>
<script src={{URL::asset('assets/vendor/dropzone/dist/dropzone.js')}}></script>
<!--<script src={{URL::asset('assets/vendor/bootstrap/dist/js/bootstrap.min.js')}}></script>
<link rel=stylesheet href={{URL::asset('assets/vendor/bootstrap/dist/css/bootstrap.min.css')}}>-->
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
-->
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script src={{ asset("/assets/vendor/highlightjs/highlight.pack.js") }}></script>
<link rel=stylesheet type=text/css href={{ asset("/assets/vendor/highlightjs/styles/default.css") }}>
<script src="https://use.fontawesome.com/8a5728027f.js"></script>
<style>

</style>



	<title>Admin - @yield('title')</title>
@yield('scripts')
@yield('style')

<style>
h2{
	margin-bottom:50px;
}
	body{
		font-family:Raleway;
	}
</style>
</head>
<body>
@include('admin.nav')
<div class=container style='padding:50px 0;'>

@yield('content')	
</div>
</body>
</html>
