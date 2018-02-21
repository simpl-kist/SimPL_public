<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
<script src={{URL::asset('assets/vendor/jquery/dist/jquery.min.js')}}></script>
<!--<script src={{URL::asset('assets/vendor/bootstrap/dist/js/bootstrap.min.js')}}></script>
<link rel=stylesheet href={{URL::asset('assets/vendor/bootstrap/dist/css/bootstrap.min.css')}}>-->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<!--<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>



<link rel=stylesheet href={{ asset("/assets/kcms/vlatoms/css/jquery-ui.min.css") }}>
<link rel=stylesheet href={{ asset("/assets/kcms/vlatoms/css/vlatoms.css") }}>
<script src=https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js></script>
<script src={{ asset("/assets/kcms/vlatoms/js/jquery-3.1.1.min.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/jquery.topzindex.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/jquery-ui.min.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/three.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/TrackballControls.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/vlatoms.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/cif.js") }}></script>
<script src={{ asset("/assets/kcms/vlatoms/js/math.min.js") }}></script>
<script>
	var kCMSAPI = function(){
		var that = this;
		that.callPlugin = function(alias,data,callback){
			$.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': '{{ csrf_token() }}'
			    }
			});
			console.log("Calling Plugin");
			var dataJson = {'alias':alias,'input':data};
			$.ajax({
				url:"/run_plugins",
				dataType : "json",
				method : 'post',
				async : false,
				data : dataJson,
				success : function(ret){
					if(typeof(callback) == "function"){
						callback(ret);
					}
				}
			});

		};
	}
	var kCMS = new kCMSAPI();
	var kCms = kCMS;
</script>
	<title>@yield('title')</title>
@yield('scripts')
@yield('style')

</head>
<body>
@yield('content')	
</body>
</html>
