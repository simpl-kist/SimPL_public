@extends('admin.layout')
@section('content')
<style>
	.jobFileList{
		padding:10px;
	}
	.jobFileContent{
		padding:10px;
	}
	tbody> tr:hover{
		background-color:#ececec;
	}
	.active-tr{
		background-color:#ececec;
	}
</style>
<div class="container">
	<h3 style="margin:30px 0;">Jobs</h3>
	<div class="row">
		<div class="col-12">
			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Plugin</th>
						<th>Owner</th>
						<th>Status</th>
						<th>Jobdir</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
@forelse($jobs as $job)
					<tr data-idx='{{$job->id}}' onclick="loadJob('{{$job->id}}', '{{$job->jobdir}}');" style="cursor:pointer;">
						<td>{{$job->id}}</td>
						<td>{{$job->name}}</td>
						<td>{{$job->pluginName}} ({{$job->pluginId}})</td>
						<td>{{$job->owner}}</td>
						<td>{{$job->status}}</td>
						<td>{{$job->jobdir}}</td>
						<td>
@can('delete', $job)
							<i class="fas fa-minus-circle" style="color:red;cursor:pointer;" onclick="deleteJob('{{$job->id}}','{{$job->name}}',event);"></i>
@endcan
						</td>
					</tr>
@empty
					<tr>
						<td colspan=7>Empty</td>
					</tr>
@endforelse
				</tbody>
				<tfoot>
					<tr>
						<td colspan=7 style="text-align:center;">{{$jobs}}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
	<div class="row jobDetail" style="height:600px;">
		<div class="col-md-3 jobFileList">
		</div>
		<div class="col-md-9 jobFileContent">
			<input class="form-control fileName" style="width:100%;" readonly>
			<textarea class="form-control fileContent" style="height:100%;"></textarea>
		</div>
	</div>
</div>
<script>
	var dirnow = "";
	var jobnow = -1;
	var flist = {};
	function deleteJob(id, name,e){
		if(confirm('Job "'+name+'" will be deleted. Do you want to continue?')){
			$.ajax({
				url:"/admin/jobs/delete",
				type:"post",
				data:{
					"_token":"{{csrf_token()}}",
					"idx":id
				},
				success:function(ret){
					if(ret.status === "Success"){
						location.reload();
					}else{
						alert(ret.message);
					}
				}
			});
		}
		e.stopPropagation();
	}

	function loadJob(id, jobdir){
		$("tr").removeClass("active-tr");
		$("tr[data-idx="+id+"]").addClass("active-tr");
		$.ajax({
			url:"/admin/jobs/load",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":id
			},
			success:function(ret){
				if(ret.status === "Success"){
					jobnow = id;
					dirnow = "";
					flist = ret["message"]["list"];
					flist["folders"].sort();
					flist["files"].sort();
					listJobFile();
				}else{
					alert(ret.message);
				}
			}
		});
	}

	function listJobFile(){
		var target = $(".jobFileList");
		target.empty();
		var refdir = dirnow;
		if(refdir!== ""){
			refdir += "/";
		}
		target.append("<div><input class='form-control' style='width:100%;' value='"+refdir+"' readonly></div>");
		if(dirnow !== ""){
			target.append("<div class='simpl-jobs-folder' data-folder='.'><i class='fas fa-folder' style='margin-right:5px;'></i>.</div>");
			target.append("<div class='simpl-jobs-folder' data-folder='..'><i class='fas fa-folder' style='margin-right:5px;'></i>..</div>");
		}
		
		for(var i=0 ; i<flist["folders"].length ; i++){
			var folder = flist["folders"][i];
			if(folder.indexOf(refdir)<0){
				continue;
			}
			var folder = folder.replace(refdir, "");
			if(folder.indexOf("/")<0){
				target.append("<div class='simpl-jobs-folder' data-folder='"+folder+"'><i class='fas fa-folder' style='margin-right:5px;'></i>"+folder+"</div>");
			}
		}
		for(var i=0 ; i<flist["files"].length ; i++){
			var file = flist["files"][i]; 
			if(file.indexOf(refdir)<0){
				continue;
			}
			file = file.replace(refdir, "");
			if(file.indexOf("/")<0){
				target.append("<div class='simpl-jobs-file' data-file='"+file+"'><i class='fas fa-file' style='margin-right:5px;'></i>"+file+"</div>");
			}
		}
		target.find(".simpl-jobs-folder").click(function(){
			var dir = $(this).data('folder');
			if(dir === "."){
				var _d = dirnow.split("/");
				_d.pop();
				dirnow = _d.join('/');
			}else if(dir === ".."){
				dirnow = "";
			}else{
				dirnow = refdir + dir;
			}
			listJobFile();
		});
		target.find(".simpl-jobs-file").click(function(){
			var file = $(this).data('file');
			loadFile(refdir + file);
		});
	}

	function loadFile(file){
		$.ajax({
			url:"/admin/jobs/file",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":jobnow,
				"filename":file
			},
			success:function(ret){
				if(ret.status === "Success"){
					$(".fileName").val(file);
					$(".fileContent").val(ret.message);
				}else{
					alert(ret.message);
				}
			}
		});
	
	}
</script>
@endsection
