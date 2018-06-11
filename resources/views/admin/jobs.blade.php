@extends('admin.master')
@section('title')
General
@stop
@section('content')

<h2>Jobs</h2>
<div class="form-inline" style="text-align:left;">
        <select class=form-control id=filter_type>
                <option value=pluginid {{ $type==="pluginid" ? "selected" : "" }}>PluginID</option>
                <option value=pluginalias {{ $type==="pluginalias" ? "selected" : "" }}>PluginAlias</option>
                <option value=name {{ $type==="name" ? "selected" : "" }}>JobName</option>
        </select>
        <input class=form-control id=filter_criteria value={{$value}}>
        <button class="btn btn-default" onclick="search_data();">
	        <i class="glyphicon glyphicon-search" style="font-size:15px"></i>
        </button>
</div>
<table class=table style="width:100%;">
	<thead>
		<tr>
			<th style="width:3%;">ID</th>
			<th style="width:5%;">Plugin</th>
			<th style="width:5%;">Next</th>
			<th style="width:5%;">Name</th>
			<th style="width:5%;">Status</th>
			<th style="width:7%;">Queue ID</th>
			<th style="width:10%;">Submitted</th>
			<th style="width:10%;">Updated</th>
			<th style="width:20%;">Input</th>
			<th style="width:20%;">Output</th>
			<th style="width:5%;"></th>
		</tr>
	</thead>
	<tbody>
@forelse($jobs as $job)
<?php
$qstr = "";
$stat = "";
if(isset($job->qinfo)){
	$qinfo = json_decode($job->qinfo);
	$qstr.=$qinfo->id;
//	$qstr.="Status : ".$qinfo->status;
	if(isset($qinfo->status)){
	$stat=$qinfo->status;
	}
}
?>
		<tr>
			<td>{{ $job->id }}</td>
			<td>{{ $job->pluginId}}</td>
			<td>{{ $job->pluginNext }}</td>
			<td>{{ $job->name }}</td>
			<td>{!! $stat !!}</td>
			<td>{!! $qstr !!}</td>
			<td>{{ $job->created_at }}</td>
			<td>{{ $job->updated_at }}</td>
			<td>{{ $job->input }}</td>
			<td>{{ $job->output }}</td>
			<td>
                        @if(Auth::user()->policy==="admin")
                                <button class="btn btn-danger" onclick="delete_job({{$job->id}})">Delete</button>
                        @endif
			</td>
		</tr>
@empty
		<tr>
			<td colspan=8>There is no job</td>
		</tr>
@endforelse
	</tbody>
</table>
{{$jobs}}
<script>
var search_data = function(){
        location.href="{{url('/admin/jobs')}}"+"?type="+$('#filter_type').val().toLowerCase()+"&value="+$('#filter_criteria').val();
}


var delete_job = function(target_id){
	if(confirm("Job "+target_id+" will be deleted. Continue?")){
		$.ajax({
			"url":"{{url('/admin/jobs/delete')}}",
			"type":"post",
			"data":{
				"_token":"{{csrf_token()}}",
				"id":target_id,
			},
			"success":function(ret){
				location.reload();
			}
		})
	}
}
</script>
@stop
