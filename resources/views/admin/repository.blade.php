@extends('admin.master')
@section('title')
Repositories
@stop
@section('content')
<h2>Repository for web</h2>
<hr>
<div class=row>
@forelse($repos as $file)
@can('read',$file)
<div class='file_Wrapper col-xs-4 col-md-2'> <!-- Wrapper -->
	<div style='padding:20px;'> <!-- Frome(padding)-->
	<div class='file_img' style='width:100%;'>
		<img src=/{{ $file->filename }} width=100%>
		<div class=form-group>
			<label>URL : </label>
			<input class=form-control value="/repo/{{$file->alias}}" style='font-size:12px;' onclick=select();>
		<div class=form-inline style="font-size:12px">
			<label>Author : </label>
<?php $user = App\User::where('id',$file->author)->first(); ?>
@if(isset($user))
<a href={{url('admin/userInfo/'.$file->author)}}>{{$user->name}}</a>
@else
-Unknown-
@endif
		</div>
		<div>
@can('delete',$file)
	<a href="{{url('admin/deleteRepo/'.$file->id)}}"><span class="glyphicon glyphicon-trash"></span></a>
@endcan
@can('update',$file)
	<select id=changePublic_{{$file->id}} style='font-family:"FontAwesome",Arial;float:right;font-size:14px;width:40px' onchange=changePublic({{$file->id}});>
	@if($file->ispublic===1)
					<option value=0> &#xf023;&nbsp;&nbsp;Make Private</option>
					<option value=1 selected> &#xf0ac;&nbsp;&nbsp;Make Public</option>
	@else
					<option value=0 selected> &#xf023;&nbsp;&nbsp;Make Private</option>
					<option value=1> &#xf0ac;&nbsp;&nbsp;Make Public</option>
	@endif
				</select>
@endcan
			</div>
		</div>
	</div>
	</div>
</div>
@endcan
@empty
There is no file
@endforelse
</div>
<!-- Uploader -->
@can('create',$file)
<form action={{route("admin.repository.upload-file")}} method=post class=dropzone id=dropzone>
{{ csrf_field() }}
<div class=dz-message style='font-size:20px;'>
Drop files here to upload
</div>
</form>
@endcan
<!-- for server -->
<h2>Repository for server</h2>
<hr>
@can('create','App\Repository')
<script>
var changePublic = function(id){
	$.ajax({
		url:"{{route('admin.repository.changePublic')}}",
		type:"POST",
		data:{
			_token:"{{csrf_token()}}",
			index:id,
			ispublic:$('#changePublic_'+id).val(),
		},
		success:function(){
		},
		error:function(){},
	})
}
$(function(){
	Dropzone.options.dropzone = {
		paramName: "files",
		uploadMultiple:true,
		maxFilesize:10,
		autoProcessQueue: true,
		uploadMultiple: true,
		addRemoveLinks: true,
//		acceptedFiles: ".png, .jpg, .jpeg",
		dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",
		dictRemoveFile: "Remove",
		dictFileTooBig:"Image is bigger than 6MB",

		accept: function(file, done) {
			console.log("Uploaded");
			done();
		},

		init:function() {
		},  
		success: function(file,done){
			console.log("All files done!");
		}
	}
});
</script>
@endcan
@stop
