@extends('layouts.master')

@section('header')
<title>{!! $title !!}</title>

<link rel=stylesheet href="/vlatoms/css/jquery-ui.min.css">
<link rel=stylesheet href="/vlatoms/css/vlatoms.css">
<script src="/vlatoms/js/three.js"></script>
<script src="/vlatoms/js/jscolor.js"></script>
<script src="/vlatoms/js/TrackballControls.js"></script>
<script src="/vlatoms/js/vlatoms.js"></script>
<script src="/vlatoms/js/cif.js"></script>
<script src="/vlatoms/js/math.min.js"></script>
<script src="/js/Chart.min.js"></script>
<script src="/js/chartjs-plugin-zoom.min.js"></script>
@stop
@section('body')
{!! $env['header'] ?? "" !!}
<script>
	var kCMSAPI = function(){
		var that = this;
		that.callPlugin = function(alias,data,callback,async=false){
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
				async : async,
				data : dataJson,
				success : function(ret){
					if(typeof(callback) == "function"){
						callback(ret);
					}
				}
			});

		};
/*		that.uploadFile = function(repos_for,files,callback){
			var formData=new FormData();
			for(var i=0 ; i<files.length ; i++){
				var file=files[i];
				formData.append("files[]",file,file.name);
			}
			formData.append("_token","{{csrf_token()}}");
			formData.append("repos_for",repos_for);
			$.ajax({
				url:"{{url('repositories/uploadFile')}}",
				type:"post",
				data:formData,
				cache:false,
				processData: false,
				contentType: false,
				success : function(ret){
					if(typeof(callback) == "function"){
						callback(ret);
					}
				}
			})
		}
		that.downloadFile = function(repos_for,alias){
			var tmphtml="<form class=file_downloader_"+repos_for+" target=_blank method=post action=/repositories/downloadFile>";
				tmphtml+="<input type=hidden name=repos_for class=downloader_repos_for_"+repos_for+">";
				tmphtml+="<input type=hidden name=alias class=downloader_alias_"+repos_for+">";
				tmphtml+="</form>";
			var tmphtml_=$(document.body).append(tmphtml);
			$('.downloader_repos_for_'+repos_for).val(repos_for);
			$('.downloader_alias_'+repos_for).val(JSON.stringify(alias));
			$('.file_downloader_'+repos_for).submit();
			$('.file_downloader_'+repos_for).remove();
		}
*/
		that.drawChart = function(_chart,data,opt={}){
			_chart.data.datasets=[];
			_chart.data.labels=[];

			for(var i=0, len=data[0].length-1 ; i<len ; i++){
				var borderColor;
				if(opt.colors && opt.colors[i]){
					var borderColor="rgb("+r+","+g+","+b+")";
				}else{
					var r=Math.floor(Math.random()*256);
					var g=Math.floor(Math.random()*256);
					var b=Math.floor(Math.random()*256);
					borderColor="rgb("+r+","+g+","+b+")";
				}
				var label = "";
				if(opt.labels && opt.labels[i]){
					label=opt.labels[i];
				}else{
					label="Data-"+i;
				}
				_chart.data.datasets.push({
					borderColor:borderColor,
					fill:false,
					showLine:true,
					label:label,
					data:[]
				})
			}
			for(var i=0,len=data.length ; i<len ; i++){
				for(var j=1,len2=data[i].length ; j<len2 ; j++){
					_chart.data.datasets[j-1].data.push({
						"x":data[i][0],
						"y":data[i][j],
					})
				}
			}
			_chart.update();
		}
		that.readFile = function(_ele, type="class", callback=function(ret){}){
			var file;
			if(type === "class"){
				file = $("."+_ele)[0];
			}else if(type === "id"){
				file = $("#"+_ele)[0];
			}else{
				return "Wrong element";
			}
			if(file.files.length < 1){
				return "No file";
			}
			file = file.files[0];
			var filename = file.name;
			function processFile(_f){
				var reader = new FileReader();
				reader.onload = function(){
					var ret = reader.result;
					callback(ret);
				};
				reader.readAsText(file, "euc-kr");
			}
			processFile(file);
			return filename;
		}
	}
	var kCMS = new kCMSAPI();
	var kCms = kCMS;

</script>
<div class=container>
{!! $contents !!}
</div>
{!! $env['footer'] ?? "" !!}
@stop
