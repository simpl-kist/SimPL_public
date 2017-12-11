@extends('admin.master')
@section('title')
General
@stop
@section('content')
<script>
$(document).ready(function(){
/*	$('.scriptDiv').each(function(i,block){
		hljs.highlightBlock(block);
	});*/
//		var script = $($('.scriptDiv').html().replace(/<br[^>]*>/gi,"\n")).text()
});
function testScript(){
	$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': '{{ csrf_token() }}'
	    }
	});

	$.ajax({
		type:"post",
		dataType:"json",
		url:"/admin/plugins/test",
		async:false,
		data:{
			istest:true,
			testinput:$('.inputdata').val(),
		//	script:$('.script').val()
			script:scriptEditor.getValue()
		},
		success:function(data){
			console.log(data);
			$('#test-result-stdout').val(data['output']);
			$('#test-result-stderr').val(data['error']);
			
		},
		error:function(err){
			console.log(err);
		}
	});
} 
var scriptEditor;
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('script')[0],{
		mode:"python",
		lineNumbers:true
	});
});
</script>
<script src={{asset('assets/vendor/codemirror/lib/')}}/codemirror.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/python/python.js></script>
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<h2>Plugins</h2>

<div class=row>
	<div class='col-md-2'></div>
	<div class='col-md-8'>
	<form method=post action="{{ route('admin.plugins.store') }}">
		<input type=hidden name=pluginId value="{{ $plugin->id or -1 }}">
		{{ csrf_field() }}
		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Name</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=name value="{{ $plugin->name or ""}}">
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{{ $plugin->alias or ""}}">
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Role</label>
			<div class=col-sm-9>
				<select name=role class='form-control'>
					<option value=calculator>Calculator</option>
					<option value=middleware>Middleware</option>
				</select>
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Type</label>
			<div class=col-sm-9>
				<select name=type class='form-control'>
				<!--	<option value=php>PHP</option>-->
					<option value=python>Python</option>
				</select>
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Input(for test)</label>
			<div class=col-sm-9>
				<textarea style='height:150px;overflow-y:auto;' class='form-control inputdata' name=inputdata></textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Script</label>
			<div class=col-sm-9>
				<textarea style='height:450px;overflow-y:auto;' class='form-control script' name=script>{!! isset($plugin->script)?$plugin->script:"" !!}</textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12 style='text-align:right;'>
				<button type="button" class="btn btn-primary" onclick=testScript();>Test</button>
@if(isset($plugin))
@can('update',$plugin)
	@if($plugin->ispublic===1)
				<button type="button" class="btn btn-primary" onclick="changePublic()">Make Private</button>
	@else
				<button type="button" class="btn btn-primary" onclick="changePublic()">Make Public</button>
	@endif
				<button type="submit" class="btn btn-primary">Apply</button>
@endcan
@else
				<button type="submit" class="btn btn-primary">Add</button>
@endif
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12 style='text-align:right;'>
				<label class='col-sm-3 col-form-label'>Test Result</label>
				<div class='col-sm-9'>
					<div class=form-group>
					<label>STDOUT</label>
					<textarea rows=10 class=form-control id='test-result-stdout'></textarea>
					<label>STDERR</label>
					<textarea rows=10 class=form-control id='test-result-stderr'></textarea>
					</div>
				</div>
			</div>
		</div>
	</form>
	</div>
</div>
<script>
@if(isset($plugin))
var changePublic = function(){
	$.ajax({
		url:"{{route('admin.plugins.changePublic')}}",
		type:"POST",
		data:{
			_token:"{{csrf_token()}}",
			index:{{$plugin->id}},
		},
		success:function(){
			location.reload();
		},
		error:function(){},
	})
}
@endif
</script>
@stop
