@extends('admin.layout')
@section('content')
<style>
	.dashboard-icon{
		width:80px;
		height:80px;
		position:relative;
		display:inline-block;
		float:left;
	}
	.dashboard-value{
		width:calc(100% - 80px);
		height:100%;
		float:left;
	}
	.dashboard-value-wrapper{
		padding:0;
	}
	.dashboard-value-label{
		height:35px;
		padding:5px;
		font-size:16px;
		background-color:#eaeaea;
	}
	.dashboard-value-content{
		height:calc(100% - 35px);
		padding:5px;
		background-color:#f4f4f4;
	}
	.dashboard-icon i{
		font-size:30px;
		top:0;
		bottom:0;
		right:0;
		left:0;
		margin:auto;
		position:absolute;
		width:fit-content;
		height:fit-content;
	}
</style>
<div class="container" style="margin-top:20px;">
	<h3 style="margin-top:20px;margin-bottom:10px;">Total</h3>
	<div class="row" style="margin:0;">
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#FCFCBB;">
				<i class="fas fa-user"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Users
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_users"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#FCBBBB;">
				<i class="fas fa-desktop"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Pages
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_pages"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#BBFCBB;">
				<i class="fas fa-plug"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Plugins
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_plugins"] }}
				</div>
			</div>
		</div>
	</div>
	<div class="row" style="margin:0;">
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#BBBBFC;">
				<i class="fas fa-save"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Files
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_files"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#FCBBFC;">
				<i class="fas fa-calculator"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Solvers
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_solvers"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#BBFCFC;">
				<i class="fas fa-cogs"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Jobs
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_jobs"] }}
				</div>
			</div>
		</div>
	</div>
	<div class="row" style="margin:0;">
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#AACFAA;">
				<i class="fas fa-users"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Total Visitors
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_visitors"]}}
				</div>
			</div>
		</div>
	</div>
	<h3 style="margin-top:20px;margin-bottom:10px;">Today</h3>
	<div class="row" style="margin:0;">
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#CFAAAA;">
				<i class="fas fa-user"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Today's Join
				</div>
				<div class="dashboard-value-content">
					{{ $stat["today_users"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#AACFCF;">
				<i class="fas fa-cog"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Today's Jobs
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_jobs"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#AACFAA;">
				<i class="fas fa-users"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Today's Visitors
				</div>
				<div class="dashboard-value-content">
					{{ $stat["total_visitors"] }}
				</div>
			</div>
		</div>
	</div>
	<h3 style="margin-top:20px;margin-bottom:10px;">Usage</h3>
	<div class="row" style="margin:0;">
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#AAAACF;">
				<i class="fas fa-running"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Running Jobs
				</div>
				<div class="dashboard-value-content">
					{{ $stat["running_jobs"] }}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#CFCFAA;">
				<i class="fas fa-microchip"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Node usage
				</div>
				<div class="dashboard-value-content">
				{{	$stat["node_usage"][0] }} / {{ $stat["node_usage"][1]}}
				</div>
			</div>
		</div>
		<div class="col-md-4 dashboard-value-wrapper">
			<div class="dashboard-icon" style="background-color:#CFAACF;">
				<i class="fas fa-hdd"></i>
			</div>
			<div class="dashboard-value">
				<div class="dashboard-value-label">
					Storage usage
				</div>
				<div class="dashboard-value-content" style="font-size:10px;padding:0;">
					<div style="height:50%;background-color:#CBEDFF;position:relative;">
						<div style="position:absolute;text-align:center;width:100%;">
							Job : {{ $stat["jobdir_usage"][0] }} G / {{ $stat["jobdir_usage"][1] }} G
						</div>
						<div style="background-color:#ABCDEF;width:{{$stat["jobdir_usage"][0]/$stat["jobdir_usage"][1]*100}}%;height:100%;text-align:center;">
						</div>
					</div>
					<div style="height:50%;background-color:#EDFFCB;position:relative;">
						<div style="position:absolute;text-align:center;width:100%;">
							Repos : {{ $stat["repository_usage"][0] }} G / {{ $stat["repository_usage"][1] }} G
						</div>
						<div style="background-color:#CDEFAB;width:{{$stat["repository_usage"][0]/$stat["repository_usage"][1]*100}}%;height:100%;text-align:center;">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row" style="margin-top:20px;">
		<div class="col-md-6">
			<h4 style="margin-bottom:10px;">Latest Jobs</h4>
			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Owner</th>
						<th>Plugin</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
@forelse($stat["latest_jobs"] as $job)
					<tr>
						<td style="text-align:center;">{{$job->id}}</td>
						<td style="text-align:center;">{{$job->name}}</td>
						<td style="text-align:center;">{{$job->owner}}</td>
						<td style="text-align:center;">{{$job->pluginId}}</td>
						<td style="text-align:center;">{{$job->status}}</td>
					</tr>
@empty
					<tr>
						<td colspan=5 style="text-align:center;">Empty</td>
					</tr>
@endforelse
				</tbody>
			</table>
		</div>
		<div class="col-md-6">
			<h4 style="margin-bottom:10px;">Plugin usage</h4>
			<table class="table plugin-usage">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Owner</th>
						<th>Percentage</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
</div>
<script>
	$(document).ready(function(){
		draw_plugin_usage({!! json_encode($stat["plugin_usage"]) !!}, {{ $stat["plugin_usage_total"] }});
	});
	function draw_plugin_usage(data, total){
		data = data.sort(function(a,b){
			return b[1] - a[1];
		});
		var target = $(".plugin-usage>tbody");
		target.empty();
		for(var i=0 ; i<data.length && i<10 ; i++){
			var ih = "<tr>";
			ih += "<td>"+data[i][2]+"</td>";
			ih += "<td>"+data[i][0]+"</td>";
			ih += "<td>"+data[i][3]+"</td>";
			ih += "<td>"+Math.round(data[i][1]*10000 / total)/100+"%</td>";
			ih += "</tr>";
			target.append(ih);
		};
	}
</script>
@endsection
