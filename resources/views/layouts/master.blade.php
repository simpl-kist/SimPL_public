<!DOCTYPE html>
<html>
<head>
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="/css/app.css">
<link rel="stylesheet" href="/css/fontawesome.css">

<script src="/js/jquery.min.js"></script>
<script src="/js/app.js"></script>
<script src="/vlatoms/js/jquery-ui.min.js"></script>
<script src="/js/fontawesome.js"></script>
@yield('header')
</head>
<body>
<script>
	function objClone(obj){
		return JSON.parse(JSON.stringify(obj));
	}
</script>
@yield('body')
</body>
</html>
