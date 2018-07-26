@extends('admin.master')
@section('title')
Jobs
@stop
@section('content')
<style>
	#job_table>tbody>tr>td{
		word-break:break-all;
	}
	#job_table{
		table-layout:fixed;
	}
	.hide_job_td{	
		width:17%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		height: 100px;
	}
</style>
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
<table id=job_table class=table style="width:100%;">
	<thead>
		<tr>
			<th style="width:5%;">ID</th>
			<th style="width:5%;">Plugin</th>
			<th style="width:15%;">Jobdir</th>
			<th style="width:5%;">Name</th>
			<th style="width:5%;">Status</th>
			<th style="width:7%;">Queue ID</th>
			<th style="width:14%;">Time Record</th>
			<th style="width:17%;">Input</th>
			<th style="width:17%;">Output</th>
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
			<td style="width:5%;">{{ $job->id }}</td>
			<td style="width:5%;">{{ $job->pluginId}}</td>
			<td style="width:15%;">{{ $job->jobdir }}</td>
			<td style="width:5%;">{{ $job->name }}</td>
			<td style="width:5%;">{!! $stat !!}</td>
			<td style="width:7%;">{!! $qstr !!}</td>
			<td style="width:14%;"><label>Created</label><br>{{ $job->created_at }}<br><label>Updated</label><br>{{ $job->updated_at }}</td>
			<td class=hide_job_td style="width:17%;" onclick="show_all_data($(this));">{{ $job->input }}</td>
			<td class=hide_job_td style="width:17%;">{{ $job->output }}</td>
			<td style="width:5%;">
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
var show_all_data=function(td){
	if(td.hasClass("hide_job_td")){
		td.removeClass("hide_job_td");
	}else{
		td.addClass("hide_job_td");
	}
}

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
