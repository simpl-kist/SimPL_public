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
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<link href={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.css rel=stylesheet></script>
<script>
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('contents')[0],{
		mode : "htmlmixed",
		extraKeys: {"Alt-Space": "autocomplete"},
		lineNumbers:true
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
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{!! $page->alias !!}">
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-12 col-form-label'>Content</label>
			<div class=col-sm-12>
				<textarea class='form-control contents' name=contents>{{ $page->contents }}</textarea>
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12 style='text-align:right;'>
				<button type="button" id="open_page" class="btn btn-primary" onclick="window.open('{{url($page->alias)}}')">Open</button>
				<button type="button" id="change_public" class="btn btn-primary" onclick=changePublic()>
		@if($page->ispublic===0)
Make Public
		@else
Make Private
		@endif
				</button>
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
