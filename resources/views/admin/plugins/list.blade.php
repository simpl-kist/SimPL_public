@extends('admin.master')
@section('title')
Plugins
@stop
@section('content')

<h2>Plugins</h2>
<table class=table>
<thead>
	<!--<th>ID</th>-->
	<th>ID</th>
	<th>Name</th>
	<th>Alias</th>
	<th>Role</th>
	<th>Author</th>
	<th>Registered</th>
	
	<th colspan=2></th>
</thead>
<tbody>
@forelse($plugins as $plugin)

	@can('read',$plugin)
	<tr>
		<td>{{$plugin->id}}</td>
		<td>{{$plugin->name}}</td>
		<td>{{$plugin->alias}}</td>
		<td>{{$plugin->role}}</td>
<?php
$user = App\User::where('id',$plugin->author)->first();
?>
		<td>
@if(isset($user))
<a href={{url('admin/userInfo/'.$plugin->author)}}>{{$user->name}}</a>
@else
-Unknown-
@endif
		</td>
		<td>{{$plugin->created_at}}</td>
		<td>
			<a href={{route('admin.plugins.modify',$plugin->id)}}><span class="glyphicon glyphicon-search"></span></a>
		</td>
		<td>
		@can('delete',$plugin)
			<a href={{route('admin.plugins.delete',$plugin->id)}}><span class="glyphicon glyphicon-trash"></span></a>
		@endcan
		</td>
	</tr>
	@endcan

@empty
	<tr><td colspan=7> There is no plugin</td></tr>
@endforelse
</tbody>
<tfoot>
@can('create','App\PluginModel')
	<td colspan=7>
		<div style='text-align:right;'>
			<a href=/admin/plugins/new><button type="submit" class="btn btn-primary">Add</button></a>
		</div>
		<div style='text-align:center;'>
			{!! $plugins->render() !!}
		</div>
	</td>
@endcan
</tfoot>
</table>


@stop
