@extends('admin.master')
@section('title')
Pages
@stop
@section('content')

<h2>Pages</h2>
<div class="col-xs-12 form-inline" style="text-align:center">
        <select class=form-control id=filter_type>
                <option>Title</option>
                <option>Alias</option>
        </select>
        <input class=form-control id=filter_criteria>
        <button class="btn btn-default" onclick="search_data();">
        <i class="glyphicon glyphicon-search" style="font-size:15px"></i>
        </button>
</div>
<table class='table'>
	<thead>
		<tr>
			<th>Front</th>
			<th>Page Title</th>
			<th>Alias</th>
			<th>Least Level</th>
			<th>Author</th>
			<th>Registered</th>
			<th colspan=3></th>
		</tr>
	</thead>
	<tbody>
		@forelse($pages as $page)

	@can('read',$page)
		<tr onmouseover="this.bgColor='#eee'" onmouseout="this.bgColor='#fff'">
			<td>
@if($page->isfront)
	<a style='color:red;font-weight:bold;'>Front</a>
@else
	<a style='color:#aaa;' href="/admin/pages/setFront/{{{$page->id}}}">Set to Front</a>
@endif
			</td>
			<td>{{{$page->title}}}</td>
			<td>{{{$page->alias}}}</td>
			<td>
<?php
switch($page->ispublic){
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
			<td>
<?php
$user = App\User::where('id',$page->author)->first();
?>
@if(isset($user))
<a href={{url('admin/userInfo/'.$page->author)}}>{{$user->name}}</a>
@else
-Unknown-
@endif
			</td>
			<td>{{ date("Ymd",strtotime($page->created)) }}</td>
			<td>
				<a href="/{{$page->alias}}" target="_blank">
				<span class="glyphicon glyphicon-file"></span>
				</a>
			</td>
			<td>
			@can('update',$page)
				<a href="/admin/pages/modify/{{{$page->id}}}"><span class="glyphicon glyphicon-pencil"></span></a>
			@endcan
			</td>
			<td>
			@can('delete',$page)
				<a style="cursor:pointer" onclick="delete_page({{$page->id}},{{$page->title}});"><span class="glyphicon glyphicon-trash"></span></a>
			@endcan
			</td>
		</tr>
	@endcan
		@empty
		<tr>
			<td colspan=6>
			There is no pages.
			</td>
		</tr>
		@endforelse
		
	</tbody>
		<tfoot>
		<tr>
			<td colspan=8>
@can('create','App\PageModel')
				<div style=text-align:right;'>
					<a href="{{ route('admin.pages.new') }}"><button type="submit" class="btn btn-primary">Add</button></a>
				</div>
@endcan
				<div style='text-align:center;'>
					{!! $pages->render() !!}
				</div>
			</td>
		</tr>
	</tfoot>
</table>
<script>
var search_data = function(){
        location.href="{{url('/admin/pages')}}"+"/"+$('#filter_type').val().toLowerCase()+"/"+$('#filter_criteria').val();
}
var delete_page = function(idx,title){
	if(confirm("Page "+title+" will be deleted. Continue?")){
		$.ajax({
			"url":"/admin/pages/delete",
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
