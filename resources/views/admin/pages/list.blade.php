@extends('admin.master')
@section('title')
Pages
@stop
@section('content')

<h2>Pages</h2>
	<table class='table'>
	<thead>
		<tr>
			<th>Front</th>
			<th>Title</th>
			<th>Alias</th>
			<th>Author</th>
			<th>Registered</th>
			<th colspan=3></th>
		</tr>
	</thead>
	<tbody>
		@forelse($pages as $page)

	@can('read',$page)
		<tr>
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
$user = App\User::where('id',$page->author)->first();
?>
@if(isset($user))
<a href={{url('admin/userInfo/'.$page->author)}}>{{$user->name}}</a>
@else
-Unknown-
@endif
			</td>
			<td>{{{$page->created}}}</td>
			<td><a href="/{{{$page->alias}}}"><span class="glyphicon glyphicon-file"></span></a></td>
			<td>
			@can('update',$page)
				<a href="/admin/pages/modify/{{{$page->id}}}"><span class="glyphicon glyphicon-pencil"></span></a>
			@endcan
			</td>
			<td>
			@can('delete',$page)
				<a href="/admin/pages/delete/{{{$page->id}}}"><span class="glyphicon glyphicon-trash"></span></a>
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
@can('create','App\PageModel')
		<tfoot>
		<tr>
			<td colspan=8>
				<a href="{{ route('admin.pages.new') }}"><button type="submit" class="btn btn-primary">Add</button></a>
			</td>
		</tr>
		</tfoot>
@endcan
		</table>
		

@stop
