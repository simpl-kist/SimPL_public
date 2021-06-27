@extends('admin.layout')
@section('content')
<style>
	.simpl-general-title{
		margin:30px 0;
	}
	.simpl-general-label{
		width:220px;
	}
</style>
<div class="container">
	<div class="row">
		<div class="col-12">
			<h3 class="simpl-general-title">Platform Environment</h3>
			<table class="table">
				<tr>
					<th class="simpl-general-label">Service URL</th>
					<td colspan=3><input class="form-control url"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Service Logo</th>
					<td colspan=3><input class="form-control logo"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Default Policy</th>
					<td colspan=3>
						<select class="form-control default_policy">
							<option value="anonymous">Anonymous</option>
							<option value="user">User</option>	
						</select>
					</td colspan=3>
				</tr>
				<tr>
					<th class="simpl-general-label">Required subscription</th>
					<td colspan=3>
						<label class="mr-2">
							<input type="checkbox" class="mr-1 req_affil" > Affiliation
						</label>
						<label>
							<input type="checkbox" class="mr-1 req_phone"> Cell phone
						</label>
					</td>
				</tr>
				<tr>
					<th class="simpl-general-label">Repository Folder</th>
					<td colspan=3><input class="form-control storage"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Repository Upload Permission</th>
					<td colspan=3>
						<select class="form-control repo_upload_permission">
							<option value="anonymous">Anonymous</option>
							<option value="user">User</option>	
							<option value="editor">Editor</option>	
							<option value="admin">Admin</option>	
						</select>
					</td>
				</tr>
				<tr>
					<th class="simpl-general-label">Allow Api Plugin Run</th>
					<td><input type="checkbox" class="allow_api_run"></td>
					<th class="simpl-general-label">Leave Test Files</th>
					<td><input type="checkbox" class="leave_test_file"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Header</th>
					<td colspan=3><textarea class="form-control header"></textarea></th>
				</tr>
				<tr>
					<th class="simpl-general-label">Footer</th>
					<td colspan=3><textarea class="form-control footer"></textarea></th>
				</tr>
			</table>
		</div>
		<div class="col-12">
			<h3 class="simpl-general-title">Job Environment</h3>
			<table class="table">
				<tr>
					<th class="simpl-general-label">Job Directory</th>
					<td><input class="form-control jobdir"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Python2</th>
					<td><input class="form-control python2"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Python3</th>
					<td><input class="form-control python3"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">mpirun</th>
					<td><input class="form-control mpirun"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">External Username</th>
					<td><input class="form-control ex_username" readonly></td>
				</tr>
				<tr>
					<th class="simpl-general-label">External Job Directory</th>
					<td><input class="form-control ex_jobdir"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">Queue name</th>
					<td><input class="form-control qname"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">qsub</th>
					<td><input class="form-control qsub"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">qstat</th>
					<td><input class="form-control qstat"></td>
				</tr>
				<tr>
					<th class="simpl-general-label">qdel</th>
					<td><input class="form-control qdel"></td>
				</tr>
			</table>
		</div>
		<div class="col-12" style="text-align:right;">
			<button class="btn btn-outline-success" onclick="updateGeneral();">Update</button>
		</div>
		<div class="col-12">
			<h3 class="simpl-general-title">Backup</h3>
			<table class="table">
				<tr>
					<th class="simpl-general-label">DB Recover</th>
					<td><input type="file" class="recover_file" accept=".simplbk"></td>
					<td><button class="btn btn-outline-primary" style="width:80px;" onclick="recover();">Recover</button></td>
				</tr>
				<tr>
					<th class="simpl-general-label">DB Backup</th>
					<td>
						<label>
							<input type=checkbox class=backup_object value=user>User
						</label>
						<label>
							<input type=checkbox class=backup_object value=job style="margin-left:5px;">Job(+User)
						</label>
						<label>
							<input type=checkbox class=backup_object value=plugin style="margin-left:5px;">Plugin
						</label>
						<label>
							<input type=checkbox class=backup_object value=page style="margin-left:5px;">Page
						</label>
						<label>
							<input type=checkbox class=backup_object value=solver style="margin-left:5px;">Solver
						</label>
						<label>
							<input type=checkbox class=backup_object value=repository style="margin-left:5px;">Repository
						</label>
					</td>
					<td><button class="btn btn-outline-primary" style="width:80px;" onclick="backup();">Backup</button></td>
				</tr>
			</table>
		</div>
	</div>
</div>
<script>
$(document).ready(function(){
	var env ={!! json_encode($env) !!};
	for(var e  in env){
		var target = $("."+e);
		switch(e){
			case "req_affil":
			case "req_phone":
			case "allow_api_run":
			case "leave_test_file":
				if(+env[e] === 0){
					target.prop("checked",false);
				}else{
					target.prop("checked",true);
				}
				break;
			case "repo_upload_permission":
			case "default_policy":
				target.find("option[value='"+env[e]+"']").prop("selected",true);
				break;
			default:
				target.val(env[e]);
		}		
	}
});
function updateGeneral(){
	var url=$(".url").val();
	var logo=$(".logo").val();
	var default_policy=$(".default_policy").find("option:selected").val();
	var repo_upload_permission=$(".repo_upload_permission").find("option:selected").val();
	var allow_api_run=$(".allow_api_run").prop("checked") ? 1 : 0;
	var leave_test_file=$(".leave_test_file").prop("checked") ? 1 : 0;
	var header=$(".header").val();
	var footer=$(".footer").val();
	var jobdir=$(".jobdir").val();
	var python2=$(".python2").val();
	var python3=$(".python3").val();
	var mpirun=$(".mpirun").val();
	var ex_jobdir=$(".ex_jobdir").val();
	var qname=$(".qname").val();
	var qsub=$(".qsub").val();
	var qstat=$(".qstat").val();
	var qdel=$(".qdel").val();
	var storage=$(".storage").val();
	var req_affil = $(".req_affil").prop("checked") ? 1 : 0;
	var req_phone = $(".req_phone").prop("checked") ? 1 : 0;
	$.ajax({
		url:"/admin/general/update",
		type:"post",
		data:{
			_token:"{{csrf_token()}}",
			url:url,
			logo:logo,
			default_policy:default_policy,
			repo_upload_permission:repo_upload_permission,
			allow_api_run:allow_api_run,
			leave_test_file:leave_test_file,
			header:header,
			footer:footer,
			jobdir:jobdir,
			python2:python2,
			python3:python3,
			mpirun:mpirun,
			ex_jobdir:ex_jobdir,
			qname:qname,
			qsub:qsub,
			qstat:qstat,
			qdel:qdel,
			storage:storage,
			req_affil:req_affil,
			req_phone:req_phone
		},
		success:function(ret){
			alert(ret.message);
		}
	})
}
function backup(){
	if(!confirm("DB will be backup. Continue?")) return;
	var backup_object=[];
	var checked=$(".backup_object:checked");
	for(var i=0 ; i<checked.length ; i++){
		backup_object.push($(checked[i]).val())
	}
	var tmphtml = "<form class=downloader target=_blank method=post action='/admin/general/backup'>";
	tmphtml += "<input type=hidden name=_token id=csrf_token value='{{csrf_token()}}'>";
	tmphtml += "<input type=hidden name=backup_object class=backup_objects>";
	tmphtml += "</form>";
	$(document.body).append(tmphtml);
	$(".backup_objects").val(JSON.stringify(backup_object));
	$(".downloader").submit();
	$(".downloader").remove();
}
function recover(){
	var formData = new FormData();
	formData.append("file", $(".recover_file")[0].files[0]);
	formData.append("_token", "{{csrf_token()}}");
	$.ajax({
		"url":"/admin/general/recover",
		"data":formData,
		"processData":false,
		"contentType":false,
		"type":"post",
		"success":function(ret){
			alert(ret.message);
		}
	});
}
</script>
@endsection
