@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Pages</h2>
	<table class='table'>
	<thead>
		<tr>
			<th>Front</th>
			<th>Title</th>
			<th>Alias</th>
			<th>Registered</th>
			<th colspan=3></th>
		</tr>
	</thead>
	<tbody>
		@forelse($pages as $page)
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
			<td>{{{$page->created}}}</td>
			<td><a href="/{{{$page->alias}}}">Show</a></td>
			<td><a href="/admin/pages/modify/{{{$page->id}}}">Modify</a></td>
			<td><a href="/admin/pages/delete/{{{$page->id}}}">Delete</a></td>
		</tr>
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
			<td colspan=6>
				<a href="{{ route('admin.pages.new') }}"><button type="submit" class="btn btn-primary">Add</button></a>
			</td>
		</tr>
		</tfoot>
		</table>
		

@stop
