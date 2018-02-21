@extends('admin.master')
@section('title')
General
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
		<input type=hidden name=pageId value={!! $page->id or -1 !!}>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Title</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=title value="{!! $page->title !!}">
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{!! $page->alias !!}">
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Required Qualification</label>
			<div class=col-sm-9>
				<select name=require class=form-control>
					<option value=0 {{ $page->ispublic==0 ? "selected" : "" }}>Public</option>
					<option value=1 {{ $page->ispublic==1 ? "selected" : "" }} >Anonymous</option>
					<option value=2 {{ $page->ispublic==2 ? "selected" : "" }} >User</option>
					<option value=3 {{ $page->ispublic==3 ? "selected" : "" }} >Editor</option>
					<option value=4 {{ $page->ispublic==4 ? "selected" : "" }} >Admin</option>
				</select>
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-12 col-form-label'>Content</label>
			<div class=col-sm-12>
				<textarea class='form-control contents' name=contents>{{ $page->contents }}</textarea>
			</div>
		</div>
		<div class='form-group row'>
			<div class="col-sm-12 form-inline" style='text-align:right;'>
				<label style="font-size:12px;float:left">FullScreen Mode: Ctrl+Enter</label>
				<button type="button" id="open_page" class="btn btn-primary" onclick="window.open('{{url($page->alias)}}')">Open</button>
				<button type="submit" class="btn btn-primary">Apply</button>
			</div>
		</div>
	</form>
	</div>
</div>
<script>
var changePublic = function(){
	$.ajax({
		url:"{{route('admin.pages.changePublic')}}",
		type:"POST",
		data:{
			_token:"{{csrf_token()}}",
			index:{{$page->id}},
		},
		success:function(){
			location.reload();
		},
		error:function(){},
	})
}
</script>
@stop
