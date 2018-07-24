<link rel=stylesheet type=text/css href={{URL::asset('assets/vendor/dropzone/dist/dropzone.css')}}>
<script src={{URL::asset('assets/vendor/dropzone/dist/dropzone.js')}}></script>


<style>
	.search_wrapper{
		margin-top:25px;
	}
</style>
<h2>Repository for Server</h2>
<div id="repos_server_search" class="form-inline search_wrapper">
	<input id=repos_server_search_input class=form-control>
	<button id=repos_server_search_button class="btn btn-primary" onclick="search_repos($('#repos_server_search_input').val())">
		<i class="glyphicon glyphicon-search"></i>
	</button>
</div>
<hr>
<div class=row>
@forelse($repos as $file)
@can('read',$file)
	<div class='file_Wrapper col-sm-2' style='padding:30px;'> <!-- Wrapper -->
<?php
$arr=explode(".",$file->alias);
$suffix=array_pop($arr);
?>
		<div class=form-group>
			<label>Alias : </label>
			<input class=form-control value="{{$file->alias}}" style='font-size:12px;' onclick=select();>
			<label>Suffix : </label><span> {{$suffix}}</span>
			<div style="font-size:14px;width:100%;overflow:hidden;white-space:nowrap;">
				<label>Author : </label>
				<span>
<?php $user = App\User::where('id',$file->author)->first(); ?>
@if(isset($user))
	@if($from==="admin")
				<a href={{url('admin/userInfo/'.$file->author)}}>{{$user->name}}</a>
	@elseif($from==="preset")
				{{$user->name}}
	@endif
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
<form action={{url("repos/upload-file")}} method=post class=dropzone id=dropzone>
{{ csrf_field() }}
	<input type=hidden name=repos_for value="server">
	<div class=dz-message style='font-size:20px;'>
	Drop files here to upload
	</div>
</form>
@endcan
@can('create','App\Repository')
<script>
var changePublic = function(id){
	$.ajax({
	@if($from==="admin")
		url:"{{route('admin.repository.changePublic')}}",
	@elseif($from==="preset")
		url:"{{route('preset.repository.changePublic')}}",
	@endif

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
	@if($from==="admin")
	location.href="/admin/repository/server/"+criteria;
	@elseif($from==="preset")
	location.href="/preset/repository/server/"+criteria;
	@endif
}
var delete_repo = function(idx,name){
	if(confirm("File "+name+" will be deleted. Continue?")){
		$.ajax({
	@if($from==="admin")
			'url':"{{url('/admin/deleteRepo')}}",
	@elseif($from==="preset")
			'url':"{{url('/preset/deleteRepo')}}",
	@endif
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

