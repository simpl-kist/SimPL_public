@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Solvers</h2>
<table class=table>
<thead>
	<th>ID</th>
	<th>Name</th>
	<th>Path</th>
	<th>Exec Command</th>
	<th>Version</th>
	<th>Author</th>
	<th>Registered</th>
	<th>Delete</th>
</thead>
<tbody>
@forelse($solvers as $solver)
	<tr>
		<td>{{$solver->id}}</td>
		<td>{{$solver->name}}</td>
		<td>{{$solver->path}}</td>
		<td>{{$solver->execcmd}}</td>
		<td>{{$solver->version}}</td>
		<td>{{$solver->author}}</td>
		<td>{{$solver->created_at}}</td>
	</tr>
@empty
	<tr><td colspan=7> Solver not found</td></tr>
@endforelse
</tbody>
<tfoot>
<form method=post action=/admin/solvers/add>
{{ csrf_field() }}
<tr>
	<td><label>Add New</label></td>
	<td><input type=text name=name class='form-control name'></td>
	<td><input type=text name=path class='form-control path'></td>
	<td><input type=text name=execcmd class='form-control execcmd' placeholder='ex : -in input'></td>
	<td><input type=text name=version class='form-control version'></td>
	<td><input type=text name=author class='form-control author'></td>
	<td colspan=2><button type="submit" class="btn btn-primary" onclick='saveEnv();'>Add</button></td>
</tr>
</form>
</tfoot>
</table>


@stop
