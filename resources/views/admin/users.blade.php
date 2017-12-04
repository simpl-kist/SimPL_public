@extends('admin.master')
@section('title')
General
@stop
@section('content')
<?php
$user = json_decode($user)
?>
{{Auth::user()}}
<h2>Users</h2>
<table class=table>
	<thead>
		<th>
	</thead>
	<tbody>
		@forelse($user as $key => $val)
			<tr><td>{{$key}}</td><td>{{$val}}</td></tr>
		@empty
		@endforelse
	</table>


@stop
