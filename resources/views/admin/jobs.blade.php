@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Jobs</h2>
<table class=table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Plugin</th>
			<th>Next</th>
			<th>Name</th>
			<th>Status</th>
			<th>Queue</th>
			<th>Submitted</th>
			<th>Updated</th>
			<th>Ouptut</th>
		</tr>
	</thead>
	<tbody>
@forelse($jobs as $job)
		<tr>
			<td>{{ $job->id }}</td>
			<td>{{ $job->pluginId}}</td>
			<td>{{ $job->pluginNext }}</td>
			<td>{{ $job->name }}</td>
			<td>{{ $job->status }}</td>
			<td>{{ $job->qinfo }}</td>
			<td>{{ $job->created_at }}</td>
			<td>{{ $job->updated_at }}</td>
			<td>{{ $job->output }}</td>
		</tr>
@empty
		<tr>
			<td colspan=8>There is no job</td>
		</tr>
@endforelse
	</tbody>
</table>
{{$jobs}}

@stop
