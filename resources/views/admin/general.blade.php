@extends('admin.master')
@section('title')
General
@stop
@section('content')
<script>
@if(Auth::user()->policy==="admin")
function backup_db(){
	$.ajax({
		url : '/admin/general/backup_db',
		method : 'post',
		data : {
			"_token":"{{csrf_token()}}",
		},
		success:function(a,b){
			alert("success");
			console.log(a,b);
		},
		error:function(ret){
			console.log(ret);
		}
	})
}
function recover_db(){
	if($("#target_backup").val()=="none") return;
	$.ajax({
		url : '/admin/general/recover_db',
		method : 'post',
		data : {
			"_token":"{{csrf_token()}}",
			"filename":$("#target_backup").val(),
		},
		success:function(a,b){
			alert("success");
			console.log(a,b);
		},
		error:function(ret){
			console.log(ret);
		}
	})
}
function saveEnv(){
	$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': '{{ csrf_token() }}'
	    }
	});
	$.ajax({
		url : '/admin/general/save',
//		dataType : 'json',
//dataType:'sjon'이라 success한 경우 return이 error로 가고 있어 alert창이 안뜸
		method : 'post',
		data : {
			url : $('.url').val(),
			title : $('.title').val(),
			logo : $('.logo').val(),
			header : $('.header').val(),
			footer : $('.footer').val(),
			mpirun : $('.mpirun').val(),
			python : $('.python').val(),
			jobdir : $('.jobdir').val(),
			qsub : $('.qsub').val(),
			qstat : $('.qstat').val(),
			qdel : $('.qdel').val(),
			verifyemail : $('#verify_email').is(":checked")?1:0,
		},
		success : function(a,b){
			alert("Success");
			console.log(a,b);
		},
	});
}
@endif
</script>
<h2>General</h2>
<div class=row>
	<div class='col-md-2'></div>
	<div class='col-md-8'>
		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>E-mail Verification</label>
			<div class=col-sm-9>	
				<input type=checkbox id=verify_email {{ ( isset($env['verifyemail']) && $env['verifyemail'] == true)?"checked":"" }}>
			</div>
		</div>

		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Service URL</label>
			<div class=col-sm-9>
				<input type=text class='form-control url' value='{{ $env["url"] or "" }}' placeholder="Enter URL of service">
			</div>
		</div>
		<!-- Service Title -->
<!--		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Service Title</label>
			<div class=col-sm-9>
				<input type=text class='form-control title' value='{{ $env["title"] or "" }}' placeholder='Service Title'>
			</div>
		</div>
-->
		<!-- Service Logo -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Service Logo</label>
			<div class=col-sm-9>
				<input type=text class='form-control logo' value='{{ $env["logo"] or "" }}' placeholder='Service Logo URL'>
			</div>
		</div>
		<!-- Analytics -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Header</label>
			<div class=col-sm-9>
				<textarea class='form-control header'>{{$env["header"] or ""}}</textarea>
			</div>
		</div>
		<!-- Analytics -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Footer</label>
			<div class=col-sm-9>
				<textarea class='form-control footer'>{{$env["footer"] or ""}}</textarea>
			</div>
		</div>
		<hr>
		<!-- Job DIR -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Job Directory</label>
			<div class=col-sm-9>
				<input type=text class='form-control jobdir' value='{{ $env["jobdir"] or ""}}' placeholder='Data Directory'>
			</div>
		</div>
		<!-- MPI -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>python</label>
			<div class=col-sm-9>
				<input type=text class='form-control python' value='{{ $env["python"] or ""}}' placeholder='PATH for python'>
			</div>
		</div>

		<!-- MPI -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>mpirun</label>
			<div class=col-sm-9>
				<input type=text class='form-control mpirun' value='{{ $env["mpirun"] or ""}}' placeholder='PATH for mpirun'>
			</div>
		</div>
		<!-- Qsub -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>qsub</label>
			<div class=col-sm-9>
				<input type=text class='form-control qsub' value='{{ $env["qsub"] or ""}}' placeholder='PATH for qsub'>
			</div>
		</div>
		<!-- Qstat -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>qstat</label>
			<div class=col-sm-9>
				<input type=text class='form-control qstat' value='{{ $env["qstat"] or ""}}' placeholder='PATH for qstat'>
			</div>
		</div>
		<!-- Qdel -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>qdel</label>
			<div class=col-sm-9>
				<input type=text class='form-control qdel' value='{{ $env["qdel"] or ""}}' placeholder='PATH for qdel'>
			</div>
		</div>

		<!-- Buttons -->
		@if(Auth::user()->policy==="admin")
		<div class='form-group row'>
			<div class="form-inline col-sm-12" style='text-align:right;'>
				<button type="button" class="btn btn-primary" onclick='saveEnv();'>Apply</button>
				<button style="margin-left:15px" type="button" class="btn btn-primary" onclick='backup_db();'>BackUp</button>
				<select class=form-control style="width:90px margin-left:15px" id=target_backup>
<option value=none>BACKUP LIST</option>
@forelse($env['entry'] as $entry)
<option>{{$entry}}</option>
@empty
@endforelse
</select>
				<button style="margin-left:15px" type="button" class="btn btn-primary" onclick='recover_db();'>Recover</button>
			</div>
		</div>
		@endif

	</div>

	<div class='col-md-2'></div>
</div>
@stop
