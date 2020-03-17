<?php
use App\Repository;
?>
<h2>Account Info</h2>
<table class=table style='width:625px'>
	<tbody>
	<form method="POST" action="{{route('preset.updateMe')}}" enctype="multipart/form-data">
		{{csrf_field()}}
		<tr>
			<td>Picture</td>
			<td id=mypic>
<span style=position:relative>
@isset($user->mypic)
				<label id=picspan><img src="/userpic/{{$user->mypic}}" style='max-width:100px;max-height:100px;vertical-align:bottom'>
@else
				<label id=picspan class="glyphicon glyphicon-user" style="font-size:100px;color:#cecece">
@endif
				<input name='file' type='file' style="display:none" id='picUpload'>
				</label>

@if($user->id===Auth::user()->id)
				<span class="glyphicon glyphicon-remove" style="font-size:15px;color:red;vertical-align:top" onclick="defaultPic()"></span>
</span>
</span>
@endif
			</td>
		</tr>
<?php
$properties = ['email','name','affiliation','tel','phone','policy'];
?>
	@forelse($properties as $property)
		<tr>
			<td>{{ucfirst($property)}}</td>
			<td>
		@if($user->id===Auth::user()->id)
			@if($property == "policy")
				<span type=text id=simpl_users_{{$property}} name={{$property}}>{{ $user[$property] }}</span>
			@else
				<input class=form-control type=text id=simpl_users_{{$property}} name={{$property}} value="{{ $user[$property] }}">
			@endif
		@else
			"{{ $user[$property] }}"
		@endif
			</td>
		</tr>
	@empty
	@endforelse
	@if($user->id===Auth::user()->id)
		@if($from==="admin")
		<tr>
			<td>Key</td>
			<td><input class=form-control value={{$user["verification_code"]}} style="width:300px;display:inline-block;" readonly><button class="btn btn-success" style="float:right;" type=button onclick="reset_key();">Reset</button>
			</td>
		</tr>
		@endif
		<tr>
			<td>Password</td>
			<td><input class=form-control type='password' id=simpl_users_password name=password></td>
		</tr>
		<tr>
			<td>New Password</td>
			<td><input class=form-control type='password' id=simpl_users_newpassword name=newpassword></td>
		</tr>
		<tr>
			<td>New Password Verify</td>
			<td><input class=form-control type='password' id=simpl_users_newpasswordverify name=newpasswordverify></td>
		</tr>
		<tr>
			<td></td>
			<td>
				<button class='btn btn-default' type=submit>Apply</button>
				<button class='btn btn-danger' type=button onclick="deleteMe()">Delete Your Account</button>
			</td>
		</tr>
	@endif
	</tbody>
	</form>
</table>
<script>
@if($user->id===Auth::user()->id)
	@if($from==="admin")
		function reset_key(){
			$.ajax({
				type:"POST",
				url:"{{route('admin.users.reset_key')}}",
				data:{
					_token:"{{csrf_token()}}",
					password:$('#simpl_users_password').val(),
				},
				success:function(ret){
					if(ret==="success"){
						location.reload();
					}else{
						alert(ret);
					}
				}
			});
		}
	@endif
function deleteMe(){
	if(confirm('Your account will be deleted. Continue?')){
		$.ajax({
			type:"POST",
			url:"{{route('preset.deleteMe')}}",
			data:{
				_token:"{{csrf_token()}}",
				index:"{{$user->id}}",
				password:$('#simpl_users_password').val(),
			},
			success:function(ret){
				if(ret==="success"){
					location.href="{{url('/')}}";
				}else{
					alert(ret);
				}
			}
		});
	};
}
function defaultPic(){
	if(confirm('Will you change your picture to default?')){
		$.ajax({
			type:"POST",
			url:"{{route('preset.defaultPic')}}",
			data:{
				_token:"{{csrf_token()}}",
				index:"{{$user->id}}",
			},
			success:function(ret){
				location.reload();
			}
		});
	}
}
picUpload.onchange = function (e) {
  e.preventDefault();
  var file = picUpload.files[0],
      reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;
    // note: no onload required since we've got the dataurl...I think! :)
	$('#picspan>img').remove();
    $('#picspan').append(img);
	$('#picspan').removeClass('glyphicon');
	$('#picspan').removeClass('glyphicon-user');
	$('#picspan').css('font-size','');
	$('#picspan').css('color','');
    $('#picspan>img').css('vertical-align','bottom');
    $('#picspan>img').css('max-width','100px');
    $('#picspan>img').css('max-height','100px');
  };
  reader.readAsDataURL(file);
  return false;
};
@endif
</script>
