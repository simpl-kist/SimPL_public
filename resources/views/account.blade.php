@extends('layouts.master')
@section('header')

@endsection
@section('body')
<style>
	.me-input{
		max-width:100%;
	}
</style>
<div class="container">
	<h3 style="margin:30px 0;">My Account</h3>
	<table class="table">
		<tbody>
			<tr>
				<th>Name</th>
				<td><input class="form-control me-input" value="{{ $me->name }}" id="my_name"></td>
				<td rowspan=3 style="width:154px;height:186px;">
					<input id="pic_input" type="file" style="display:none;" accept=".png, .jpg, .jpeg" onchange='updatePic();'>
					<div style="height:100%;position:relative;background-color:white;cursor:pointer;" onclick='$("#pic_input").click();'>
@if($me->mypic === null)
						<img style="max-width:100%;max-height:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;" src="/img/anonymous.png">
@else
						<img style="max-width:100%;max-height:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;" src="/preset/userpic/{{$me->mypic}}">
@endif
					</div>
				</td>
			</tr>
			<tr>
				<th>Affiliation</th>
				<td><input class="form-control me-input" value="{{ $me->affiliation }}" id="my_affiliation"></td>
			</tr>
			<tr>
				<th>Email</th>
				<td><input class="form-control me-input" value="{{ $me->email }}" id="my_email" readonly></td>
			</tr>
			<tr>
				<th>Tel.</th>
				<td colspan=2><input class="form-control me-input" id="my_tel" value="{{ $me->tel }}"></td>
			</tr>
			<tr>
				<th>Cell Phone</th>
				<td colspan=2><input class="form-control me-input" id="my_phone" value="{{ $me->phone }}"></td>
			</tr>
			<tr>
				<th>Key</th>
				<td colspan=2>
					<div class="input-group">
						<input class="form-control me-input" id="my_verification_code" value="{{ $me->verification_code}}" readonly>
						<div class="input-group-append">
							<button class="btn btn-outline-primary" onclick="remakeKey();">Make</button>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>Password</th>
				<td colspan=2><input class="form-control me-input" type="password" id="my_password"></td>
			</tr>
			<tr>
				<th>Password(new)</th>
				<td colspan=2><input class="form-control me-input" type="password" id="my_password_new"></td>
			</tr>
			<tr>
				<th>Password(confirm)</th>
				<td colspan=2><input class="form-control me-input" type="password" id="my_password_new_confirm"></td>
			</tr>
			<tr>
				<td colspan=3 style="text-align:right;">
					<button class="btn btn-outline-primary" onclick="location.href='/';">Home</button>
					<button class="btn btn-outline-success" onclick="updateMe();">Update</button>
				</td>
			</tr>
		</tbody>
	</table>
</div>
<script>
	function updateMe(){
		var name = $("#my_name").val();
		var affiliation = $("#my_affiliation").val();
		var tel = $("#my_tel").val();
		var phone = $("#my_phone").val();
		var my_password = $("#my_password").val();
		var my_password_new = $("#my_password_new").val();
		var my_password_new_confirm = $("#my_password_new_confirm").val();
		if(my_password_new !== "" && my_password_new !== my_password_new_confirm){
			alert("Password confirmation not matched.");
		}
		if(my_password_new === ""){
			my_password_new = undefined;
		}
		$.ajax({
			url:"/preset/account/update",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":"{{$me->id}}",
				"name":name,
				"affiliation":affiliation,
				"tel":tel,
				"phone":phone,
				"my_password":my_password,
				"my_password_new":my_password_new,
			},
			success:function(ret){
				if(ret.status === "Fail"){
					alert(ret.message);
				}else if(ret.status === "Success"){
					alert("Changed!");
				}
			}
		});
	}
	function updatePic(){
		var file = $("#pic_input")[0].files[0];
		if(file === undefined){
			return;
		}
		var name = file.name;
		var formData = new FormData();
		formData.append("file", file);
		formData.append("name", file.name);
		formData.append("_token", "{{csrf_token()}}");
		formData.append("idx", "{{$me->id}}");
		$.ajax({
			"url":"/preset/account/updatePic",
			"data":formData,
			"processData":false,
			"contentType":false,
			"type":"post",
			"success":function(ret){
				location.reload();
			}
		});
	}
	function remakeKey(){
		var my_password = $("#my_password").val();
		$.ajax({
			url:"/preset/account/genkey",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":"{{$me->id}}",
				"my_password":my_password,
			},
			success:function(ret){
				if(ret.status === "Fail"){
					alert(ret.message);
				}else if(ret.status === "Success"){
					alert("Changed!");
					$("#my_verification_code").val(ret.message);
				}
			}
		});
	}
</script>
@endsection
