@extends('admin.master')
@section('title')
Edit Page
@stop
@section('content')
<script src={{asset('assets/vendor/codemirror/lib/')}}/codemirror.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/html-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/javascript-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/xml-hint.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/javascript/javascript.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/xml/xml.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/css/css.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/htmlmixed/htmlmixed.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/python/python.js></script>
<script src={{asset('js/fullscreen.js')}}></script>
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<style>
.CodeMirror-fullscreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9;
}
</style>
<link href={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.css rel=stylesheet></script>
<script>
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('contents')[0],{
		mode : "htmlmixed",
		lineWrapping:true,
		extraKeys: {
			"Alt-Space": "autocomplete",
			"Ctrl-Enter": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		},
		lineNumbers:true,
	});
});
</script>

<h2>Pages</h2>

<div class=row>
	<div class='col-md-2'></div>
	<div class='col-md-8'>
	<form method=post action="{{ route('admin.pages.add') }}">
		{{ csrf_field() }}
		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Title</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=title value="{{old('title')}}">
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{{old('alias')}}">
			</div>
		</div>
		<!-- Service Alias -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Required Qualification</label>
			<div class=col-sm-9>
				<select name=require class=form-control>
					<option value=0>Public</option>
					<option value=1>Anonymous</option>
					<option value=2>User</option>
					<option value=3>Editor</option>
					<option value=4>Admin</option>
				</select>
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-sm-12 col-form-label'>Script</label>
			<div class=col-sm-12>
				<textarea class='contents form-control' name=contents>{{old('contents')}}</textarea>
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12 style='text-align:right'>
				<label style="font-size:12px;float:left">FullScreen Mode: Ctrl+Enter</label>
					<button type="submit" class="btn btn-primary">Apply</button>
			</div>
		</div>
	</form>
	</div>
</div>
@stop
