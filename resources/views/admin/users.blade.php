@extends('admin.layout')
@section('content')
<div class="container">
	<h3 style="margin:30px 0;">Users</h3>
	<div class="row">
		<div class="col-md-12">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Email</th>
						<th>Name</th>
						<th>Affiliation</th>
						<th>Tel</th>
						<th>Phone</th>
						<th>Policy</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
@forelse($users as $user)
					<tr>
						<td style="padding:1px;">
							<div style="height:58px;width:48px;position:relative;background-color:white;">
@if($user->mypic === null)
								<img style="max-width:100%;max-height:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;" src="/img/anonymous.png">
@else
								<img style="max-width:100%;max-height:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;" src="/preset/userpic/{{$user->mypic}}">
@endif
							</div>

						</td>
						<td>{{$user->email}}</td>
						<td>{{$user->name}}</td>
						<td>{{$user->affiliation}}</td>
						<td>{{$user->tel}}</td>
						<td>{{$user->phone}}</td>
						<td>
							<select class="form-control" onchange='updatePolicy("{{$user->id}}",this);'>
@switch($user->policy)
	@case('admin')
								<option value="admin" selected>Admin</option>
								<option value="editor">Editor</option>
								<option value="user">User</option>
								<option value="anonymous">Anonymous</option>
		@break
	@case('editor')
								<option value="admin">Admin</option>
								<option value="editor"selected>Editor</option>
								<option value="user">User</option>
								<option value="anonymous">Anonymous</option>
		@break
	@case('user')
								<option value="admin">Admin</option>
								<option value="editor">Editor</option>
								<option value="user" selected>User</option>
								<option value="anonymous">Anonymous</option>
		@break
	@case('anonymous')
								<option value="admin">Admin</option>
								<option value="editor">Editor</option>
								<option value="user">User</option>
								<option value="anonymous" selected>Anonymous</option>
		@break
@endswitch
							<select>
						</td>
						<td>
							<i class="fas fa-minus-circle" style="color:red;cursor:pointer;" onclick="deleteUser('{{$user->id}}','{{$user->name}}');"></i>
						</td>
					</tr>
@empty
					<tr>
						<td colspan=8>Empty</td>
					</tr>
@endforelse
				</tbody>
				<tfoot>
					<tr>
						<td colspan=8 style="text-align:center;">{{$users}}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>
<script>
	function updatePolicy(id, target){
		var policy = $(target).find("option:selected").val();
		$.ajax({
			url:"/admin/users/policy",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":id,
				"policy":policy
			},
			success:function(ret){
				alert("Success");
			}
		});
	}
	function deleteUser(id, name){
		if(confirm('User "'+name+'" will be deleted. Do you want to continue?')){
			$.ajax({
				url:"/admin/users/delete",
				type:"post",
				data:{
					"_token":"{{csrf_token()}}",
					"idx":id
				},
				success:function(ret){
					location.reload();
				}
			});
		}
	}
</script>
@endsection
