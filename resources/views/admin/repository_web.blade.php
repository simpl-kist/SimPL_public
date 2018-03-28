@extends('admin.master')
@section('title')
Repositories
@stop
@section('content')
<style>
	.search_wrapper{
		margin-top:25px;

	}

</style>
<h2>Repository for Web</h2>
<div id="repos_web_search" class="form-inline search_wrapper">
	<input id=repos_web_search_input class=form-control>
	<button id=repos_web_search_button class="btn btn-primary" onclick="search_repos($('#repos_web_search_input').val())">
		<i class="glyphicon glyphicon-search"></i>
	</button>
</div>
<hr>
<div class=row>
@forelse($repos as $file)
@can('read',$file)
	<div class='file_Wrapper col-sm-2' style='padding:30px;'> <!-- Wrapper -->
		<div style="position:relative;width:100%;padding-bottom:100%">
			<div style="position:absolute;width:100%;height:100%;text-align:center">
				<img src=/repo/{{$file->alias}} style="position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;max-width:100%;max-height:100%;width:auto;height:auto">
			</div>
		</div>
		<div class=form-group>
			<label>URL : </label>
			<input class=form-control value="/repo/{{$file->alias}}" style='font-size:12px;' onclick=select();>
			<div style="font-size:14px;width:100%;overflow:hidden;white-space:nowrap;">
				<label>Author : </label>
				<span>
<?php $user = App\User::where('id',$file->author)->first(); ?>
@if(isset($user))
				<a href={{url('admin/userInfo/'.$file->author)}}>{{$user->name}}</a>
@else
-Unknown-
@endif
				</span>
			</div>
			<div>

@can('update',$file)
				<select name=require class=form-control id=changePublic_{{$file->id}} onchange="changePublic({{$file->id}})">
					<option value=0 {{$file->ispublic==0 ? "selected" : "" }} >Public</option>
					<option value=1 {{$file->ispublic==1 ? "selected" : "" }} >Anonymous</option>
					<option value=2 {{$file->ispublic==2 ? "selected" : "" }} >User</option>
					<option value=3 {{$file->ispublic==3 ? "selected" : "" }} >Editor</option>
					<option value=4 {{$file->ispublic==4 ? "selected" : "" }} >Admin</option>
				</select>
@endcan
@can('delete',$file)
				<a style="cursor:pointer" onclick=delete_repo({{$file->id}},"{{$file->alias}}") ><span class="glyphicon glyphicon-trash"></span></a>
@endcan
			</div>
		</div>
	</div>
@endcan
@empty
There is no file
@endforelse
</div>
<div style="text-align:center">
{{$repos}}
</div>

<!-- Uploader -->
@can('create','App\Repository')
<form action={{route("admin.repository.upload-file")}} method=post class=dropzone id=dropzone>
{{ csrf_field() }}
	<input type=hidden name=repos_for value="web">
	<div class=dz-message style='font-size:20px;'>
	Drop files here to upload
	</div>
</form>
@endcan
@can('create','App\Repository')
<script>
var changePublic = function(id){
	$.ajax({
		url:"{{route('admin.repository.changePublic')}}",
		type:"POST",
		data:{
			_token:"{{csrf_token()}}",
			index:id*1,
			ispublic:$('#changePublic_'+id).val()*1,
		},
		success:function(ret){
			console.log(ret)
		},
		error:function(ret){console.log(ret)},
	})
}
Dropzone.options.dropzone = {
	paramName: "files",
	uploadMultiple:true,
	maxFilesize:10,
	autoProcessQueue: true,
	addRemoveLinks: true,
//		acceptedFiles: ".png, .jpg, .jpeg",
	dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",
	dictRemoveFile: "Remove",
	dictFileTooBig:"Image is bigger than 10MB",

	accept: function(file, done) {
		console.log("Uploaded");
		done();
	},

	init:function() {
		this.on("error",function(file,ret){
			console.log(ret);
		});
	},  
	success: function(file,done){
		if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
			location.reload();
		}
	},
}
var search_repos = function(criteria){
	location.href="/admin/repository/web/"+criteria;
}
var delete_repo = function(idx,name){
	if(confirm("File "+name+" will be deleted. Continue?")){
		$.ajax({
			'url':"{{url('/admin/deleteRepo')}}",
			'type':'post',
			'data':{
				'_token':'{{csrf_token()}}',
				'idx':idx,
			},
			'success':function(ret){
				location.reload();
			},
			'error':function(ret){
				console.log(ret);
			}
		});
	}
}
</script>
@endcan
@stop
