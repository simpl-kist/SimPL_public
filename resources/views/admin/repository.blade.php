@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Repository for web</h2>
<hr>
<div class=row>
@forelse($repos as $file)
<div class='file_Wrapper col-xs-4 col-md-2'> <!-- Wrapper -->
	<div style='padding:20px;'> <!-- Frome(padding)-->
	<div class='file_img' style='width:100%;'>
		<img src=/{{ $file->filename }} width=100%>
		<div class=form-group>
			<label>URL : </label>
			<input class=form-control value="/repo/{{$file->alias}}" style='font-size:12px;'>
		</div>
	</div>
	</div>
</div>
@empty
There is no file
@endforelse
</div>


<!-- Uploader -->
<form action={{route("admin.repository.upload-file")}} method=post class=dropzone id=dropzone>
{{ csrf_field() }}
<div class=dz-message style='font-size:20px;'>
Drop files here to upload
</div>
</form>

<!-- for server -->
<h2>Repository for server</h2>
<hr>


<script>
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
@stop
