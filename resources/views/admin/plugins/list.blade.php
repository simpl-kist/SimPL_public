@extends('admin.master')
@section('title')
Plugins
@stop
@section('content')

<h2>Plugins</h2>
<div class="col-xs-12 form-inline" style="text-align:center">
        <select class=form-control id=filter_type>
                <option>Name</option>
                <option>Alias</option>
        </select>
        <input class=form-control id=filter_criteria>
        <button class="btn btn-default" onclick="search_data();">
        <i class="glyphicon glyphicon-search" style="font-size:15px"></i>
        </button>
</div>
<table class=table>
<thead>
	<!--<th>ID</th>-->
	<th>ID</th>
	<th>Name</th>
	<th>Alias</th>
	<th>Role</th>
	<th>Least Level</th>
	<th>Author</th>
	<th>Registered</th>
	
	<th colspan=2></th>
</thead>
<tbody>
@forelse($plugins as $plugin)

	@can('read',$plugin)
	<tr onmouseover="this.bgColor='#eee'" onmouseout="this.bgColor='#fff'">
		<td>{{$plugin->id}}</td>
		<td>{{$plugin->name}}</td>
		<td>{{$plugin->alias}}</td>
		<td>{{$plugin->role}}</td>
		<td>
<?php
switch($plugin->ispublic){
	case 0:
		echo "Public";

		break;
	case 1:
		echo "Anonymous";

		break;
	case 2:
		echo "User";

		break;
	case 3:
		echo "Editor";

		break;
	case 4:
		echo "Admin";

		break;
	default:
		echo "bug";

}
?>
		</td>
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
		<td>{{date("Ymd",strtotime($plugin->created_at))}}</td>
		<td>
			<a href={{route('admin.plugins.modify',$plugin->id)}}><span class="glyphicon glyphicon-search"></span></a>
		</td>
		<td>
		@can('delete',$plugin)
			<a style="cursor:pointer" onclick=delete_plugin({{$plugin->id}},"{{$plugin->name}}")><span class="glyphicon glyphicon-trash"></span></a>
		@endcan
		</td>
	</tr>
	@endcan

@empty
	<tr><td colspan=8> There is no plugin</td></tr>
@endforelse
</tbody>
<tfoot>
@can('create','App\PluginModel')
	<td colspan=8>
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
<script>
var search_data = function(){
        location.href="{{url('/admin/plugins')}}"+"/"+$('#filter_type').val().toLowerCase()+"/"+$('#filter_criteria').val();
}
var delete_plugin = function(idx,name){
	if(confirm("Plug-in "+name+" will be deleted. Continue?")){
		$.ajax({
			"url":"/admin/plugins/delete",
			"type":"post",
			"data":{
				"_token":"{{csrf_token()}}",
				"idx":idx,
			},
			"success":function(){
				location.reload();
			}
		})		
	}
}
</script>

@stop
