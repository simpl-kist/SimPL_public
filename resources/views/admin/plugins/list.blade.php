@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Plugins</h2>
<table class=table>
<thead>
	<!--<th>ID</th>-->
	<th>Name</th>
	<th>Alias</th>
	<th>Role</th>
	<th>Registered</th>

	<th colspan=3></th>
</thead>
<tbody>
@forelse($plugins as $plugin)
	<tr>
		<td>{{$plugin->name}}</td>
		<td>{{$plugin->alias}}</td>
		<td>{{$plugin->role}}</td>
		<td>{{$plugin->created_at}}</td>
		<td>
			<a href={{route('admin.plugins.modify',$plugin->id)}}>Modify</a>
			<a href={{route('admin.plugins.delete',$plugin->id)}}>Delete</a>
		</td>
	</tr>
@empty
	<tr><td colspan=7> There is no plugin</td></tr>
@endforelse
</tbody>
<tfoot>
	<td colspan=5><a href=/admin/plugins/new><button type="submit" class="btn btn-primary" onclick='saveEnv();'>Add</button></a></td>
</tfoot>
</table>


@stop
