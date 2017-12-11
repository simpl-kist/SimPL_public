@extends('admin.master')
@section('title')
Users
@stop
@section('content')
<h2>Users</h2>
<table class='table'>
	<thead>
		<tr>
			<th>Picture</th>
			<th>Name</th>
			<th>Email</th>
			<th>Affiliation</th>
			<th>Tel</th>
			<th>Phone</th>
			<th>Policy</th>
		</tr>
	</thead>
	<tbody>
	@forelse($users as $user)
		<tr>
			<td>
@if(isset($user->mypic))
				<img src="{{url('/')}}/{{$user->mypic}}" style='max-width:50px;max-height:50px;'>
@else
	<span class="glyphicon glyphicon-user" style='font-size:48px;color:#cecece'></span>
@endif
			</td>
			<td>{!! $user->name !!}</td>
			<td>{{$user->email}}</td>
			<td>{!! $user->affiliation !!}</td>
			<td>{!! $user->tel !!}</td>
			<td>{!! $user->phone !!}</td>
			<td>
				<form method="POST" action="{{route('admin.users.changePolicy')}}">
					{{csrf_field()}}
				<input type=hidden name="index" value={{$user->id}}>
				<select class='form-control' style='width:125px' onchange="this.form.submit()" name='policy'>
				@switch($user->policy)
					@case('admin')
					<option value='admin' selected>Admin</option>
					<option value='editor'>Editor</option>
					<option value='user'>User</option>
					<option value='anonymous'>Anonymous</option>
						@break
					@case('editor')
					<option value='admin'>Admin</option>
					<option value='editor' selected>Editor</option>
					<option value='user'>User</option>
					<option value='anonymous'>Anonymous</option>
						@break
					@case('user')
					<option value='admin'>Admin</option>
					<option value='editor'>Editor</option>
					<option value='user' selected>User</option>
					<option value='anonymous'>Anonymous</option>
						@break
					@case('anonymous')
					<option value='admin'>Admin</option>
					<option value='editor'>Editor</option>
					<option value='user'>User</option>
					<option value='anonymous' selected>Anonymous</option>
						@break
				@endswitch
				</select>
				</form>
			</td>
			<td>
<!--위험해서 주석화함
				<form method="POST" action="{{route('admin.users.deleteUser')}}">
					{{csrf_field()}}
				<input type=hidden name=index value={{$user->id}}> -->
				<button type=submit class='btn btn-danger'>Delete</button>
<!--				</form> -->
			</td>
		</tr>
	@empty
	@endforelse
	</tbody>
</table>
{{$users}}
@stop
