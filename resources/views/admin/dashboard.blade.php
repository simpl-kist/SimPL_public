@extends('admin.master')
@section('title')
Dashboard
@endsection
@section('scripts')
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<!--  <link rel="stylesheet" href={{ asset("/assets/vendor/bootstrap/dist/css/bootstrap.min.css") }}> --> <!-- admin.mater has this. -->
<!-- Font Awesome -->
<link rel="stylesheet" href={{ asset("/assets/vendor/font-awesome/css/font-awesome.min.css") }}>
<!-- Ionicons -->
<link rel="stylesheet" href={{ asset("/assets/vendor/Ionicons/css/ionicons.min.css") }}>
<!-- jvectormap -->
<link rel="stylesheet" href={{ asset("/assets/vendor/jvectormap/jquery-jvectormap.css") }}>
<!-- Theme style -->
<link rel="stylesheet" href={{ asset("/assets/vendor/admin-lte/dist/css/AdminLTE.min.css") }}>
<!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
<link rel="stylesheet" href={{ asset("/assets/vendor/admin-lte/dist/css/skins/_all-skins.min.css") }}>
<style>
	.job-description{
		display:block;
		margin:0;
		padding:0;
		font-weight:600;
		font-size:21px;
	}
</style>
  <!-- Google Font -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
@endsection
@section('content')
<!-- Main content -->
<!-- Info boxes -->
<div class="row">
	<div class="col-md-4 col-sm-6 col-xs-12">
		<div class="info-box">
			<span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>
			<div class="info-box-content">
				<span class="info-box-text">Total Users</span>
				<span class="info-box-number">{{ count($users) }}</span><!--<small>%</small></span>-->
			</div>
<!-- /.info-box-content -->
		</div>
<!-- /.info-box -->
	</div>
<!-- /.col -->
<!-- /.col -->
<!-- fix for small devices only -->
	<div class="clearfix visible-sm-block"></div>
	<div class="col-md-4 col-sm-6 col-xs-12">
		<div class="info-box">
			<span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>
			<div class="info-box-content">
				<span class="info-box-text">Monthly join</span>
				<span id="monthly-join" class="info-box-number"></span>
			</div>
<!-- /.info-box-content -->
		</div>
<!-- /.info-box -->
	</div>
<!-- /.col -->
	<div class="col-md-4 col-sm-6 col-xs-12">
		<div class="info-box">
			<span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>
			<div class="info-box-content">
				<span class="info-box-text">concurrent users</span>
				<span id="concurrent-users" class="info-box-number">{{$concurrent}}</span>
			</div>
<!-- /.info-box-content -->
		</div>
<!-- /.info-box -->
	</div>
<!-- /.col -->
</div>
<!-- /.row -->
<div class="row">
	<div class="col-md-12">
		<div class="box">
			<div class="box-header with-border">
				<h3 id="usage-chart-title" class="box-title">Nodes Usage Report</h3>
				<div class="box-tools pull-right btn-group">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
<!-- /.box-header -->
			<div class="box-body">
				<div class="row">
<!-- /.col -->
					<div class="col-md-4">
						<p class="text-center">
							<strong>Latest Pages</strong>
						</p>
						<div class="row">
							<div class="col-md-12">
								<table class="table dashboard_latest_page">
									<thead>
										<tr>
											<th>ID</th>
											<th>Title</th>
											<th>Created</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
<!-- /.col -->
						</div>
<!-- /.row -->
					</div>

					<div class="col-md-4">
						<p class="text-center">
							<strong>Latest Plugins</strong>
						</p>
						<div class="row">
							<div class="col-md-12">
								<table class="table dashboard_latest_plugin">
									<thead>
										<tr>
											<th>ID</th>
											<th>Name</th>
											<th>Created</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>

							</div>
<!-- /.col -->
						</div>
<!-- /.row -->
					</div>

					<div class="col-md-4">
						<p class="text-center">
							<strong>Plugin Usage</strong>
						</p>
						<div class="row">
							<div class="col-md-8">
								<div class="chart-responsive">
									<canvas id="pieChart" height="150"></canvas>
								</div>
<!-- ./chart-responsive -->
							</div>
<!-- /.col -->
							<div class="col-md-4">
								<ul id="plugin-pie-chart-legend" class="chart-legend clearfix">
								</ul>
							</div>
<!-- /.col -->
						</div>
<!-- /.row -->
					</div>
<!-- /.col -->
				</div>
<!-- /.row -->
			</div>
<!-- ./box-body -->
			<div class="box-footer">
				<div class="row">
					<div class="col-sm-2 col-xs-6">
						<div class="description-block border-right">
							<span class="description-text">RUNNING JOBS</span>
							<h5 id="runningJobs" class="job-description text-yellow"></h5>
						</div>
					</div>
					<div class="col-sm-2 col-xs-6">
						<div class="description-block border-right">
							<span class="description-text">TOTAL JOBS</span>
							<h5 id="njobs" class="job-description text-blue"></h5>
						</div>
					</div>
					<div class="col-sm-2 col-xs-6">
						<div class="description-block border-right">
							<span class="description-text"></span>
							<h5 class="job-description text-blue"> </h5>
						</div>
					</div>
					<div class="col-sm-2 col-xs-6">
						<div class="description-block border-left border-right">
							<span class="description-text">SOLVER</span>
							<h5 id="nsolvers" class="job-description text-green"></h5>
						</div>
					</div>
					<div class="col-sm-2 col-xs-6">
						<div class="description-block border-right">
							<span class="description-text">PLUGIN</span>
							<h5 id="nplugins" class="job-description text-red"></h5>
						</div>
					</div>
					<div class="col-sm-2 col-xs-6">
						<div class="description-block">
							<span class="description-text">PAGE</span>
							<h5 id="npages" class="job-description text-aqua"></h5>
						</div>
					</div>
				</div>
			</div>
<!-- /.box-footer -->
		</div>
<!-- /.box -->
	</div>
<!-- /.col -->
</div>
<!-- /.row -->
<!-- Main row -->
<div class="row">
<!-- Left col -->
	<div class="col-md-8">
<!-- MAP & BOX PANE -->
<!-- TABLE: LATEST ORDERS -->
		<div class="box">
			<div class="box-header with-border">
				<h3 class="box-title">Latest Jobs</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
<!-- /.box-header -->
			<div class="box-body">
				<div class="table-responsive">
					<table id="latest-jobs" class="table no-margin">
						<thead>
							<tr>
								<th>ID</th>
								<th>Job name</th>
								<th>User</th>
								<th>PluginName</th>
								<th>Status</th>
								<th>Submission</th>
								<th>Duration</th>
								<th title="nodes">N</th>
							</tr>
						</thead>
						<tbody>
<!-- TODO -->
							<tr>
								<td><a href="">id</a></td>
								<td>name</td>
								<td>user</td>
								<td>created_at</td>
								<td>finished</td>
								<td><span class="label" style="/*background-color:*/">status</span></td>
								<td>duration</td>
								<td>nodes</td>
							</tr>
						</tbody>
					</table>
				</div>
            </div>
<!-- /.box-body -->
			<div class="box-footer clearfix" >
				<a href="javascript:void(0)" class="btn btn-sm btn-info btn-flat pull-left" style="display:none;">action</a>
				<a href="/admin/jobs" class="btn btn-sm btn-default btn-flat pull-right">View More Jobs</a>
			</div>
<!-- /.box-footer -->
		</div>
<!-- /.box -->
		<div class="box" style="display:none;">
			<div class="box-header with-border">
				<h3 class="box-title">Visitors Report (arbitrary data)</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
<!-- /.box-header -->
			<div class="box-body no-padding">
				<div class="row">
					<div class="col-md-12 col-sm-12">
						<div class="pad">
						</div>
					</div>
				</div>
<!-- /.row -->
			</div>
<!-- /.box-body -->
		</div>
<!-- /.box -->
<!-- /.row -->
	</div>
<!-- /.col -->
	<div class="col-md-4">
		<div style="display:none;">
<!-- Info Boxes Style 2 -->
			<div class="info-box bg-yellow">
				<span class="info-box-icon"><i class="ion ion-ios-pricetag-outline"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">Inventory</span>
					<span class="info-box-number">5,200</span>
					<div class="progress">
						<div class="progress-bar" style="width: 50%"></div>
					</div>
					<span class="progress-description">50% Increase in 30 Days</span>
				</div>
<!-- /.info-box-content -->
			</div>
<!-- /.info-box -->
			<div class="info-box bg-green">
				<span class="info-box-icon"><i class="ion ion-ios-heart-outline"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">Mentions</span>
					<span class="info-box-number">92,050</span>
					<div class="progress">
						<div class="progress-bar" style="width: 20%"></div>
					</div>
					<span class="progress-description">20% Increase in 30 Days</span>
				</div>
<!-- /.info-box-content -->
			</div>
<!-- /.info-box -->
			<div class="info-box bg-red">
				<span class="info-box-icon"><i class="ion ion-ios-cloud-download-outline"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">Downloads</span>
					<span class="info-box-number">114,381</span>
					<div class="progress">
						<div class="progress-bar" style="width: 70%"></div>
					</div>
					<span class="progress-description">70% Increase in 30 Days</span>
				</div>
<!-- /.info-box-content -->
			</div>
<!-- /.info-box -->
			<div class="info-box bg-aqua">
				<span class="info-box-icon"><i class="ion-ios-chatbubble-outline"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">Direct Messages</span>
					<span class="info-box-number">163,921</span>
					<div class="progress">
						<div class="progress-bar" style="width: 40%"></div>
					</div>
					<span class="progress-description">40% Increase in 30 Days</span>
				</div>
<!-- /.info-box-content -->
			</div>
<!-- /.info-box -->
		</div>
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="box-title">Master Node Status</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
<!-- /.box-header -->
			<div class="box-body">
				<div class="progress-group">
					<span class="progress-text">CPU</span>
					<span id="cpu" class="progress-number"><b></b>/</span>
					<div class="progress sm">
						<div id="cpu-bar" class="progress-bar progress-bar-aqua" style="background-image:none;"></div>
					</div>
				</div>
<!-- /.progress-group -->
				<div class="progress-group">
					<span class="progress-text">Memory</span>
					<span id="memory" class="progress-number"><b></b>/</span>
					<div class="progress sm">
						<div id="memory-bar" class="progress-bar progress-bar-red" style="background-image:none;"></div>
					</div>
				</div>
<!-- /.progress-group -->
				<div class="progress-group">
					<span class="progress-text">Disk</span>
					<span id="disk" class="progress-number"><b></b>/</span>
					<div class="progress sm">
						<div id="disk-bar" class="progress-bar progress-bar-green" style="background-image:none;"></div>
					</div>
				</div>
<!-- /.progress-group -->
			</div>
            <!-- /.footer -->
		</div>
 <!-- /.box -->

 <!-- PRODUCT LIST -->
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">New Users</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
<!-- /.box-header -->
			<div class="box-body">
				<ul id="new-users-list" class="products-list product-list-in-box">
<!-- TODO -->
					<li class="item">
						<div class="product-img">
							<span class='glyphicon glyphicon-user' style='font-size:50px; color:#cecece;'></span>
						</div>
						<div class="product-info">
							<a href="javascript:void(0)" class="product-title">username<span class="label pull-right">ago</span></a>	
							<span class="product-description">affiliation</span>
						</div>
					</li>
<!-- /.item -->
				</ul>
			</div>
<!-- /.box-body -->
			<div class="box-footer text-center">
				<a href="admin/users/page" class="uppercase">View All Users</a>
			</div>
<!-- /.box-footer -->
		</div>
<!-- /.box -->
	</div>
<!-- /.col -->
</div>
<!-- /.row -->


  


<!-- jQuery 3 -->
<!--<script src={{ asset("/assets/vendor/jquery/dist/jquery.min.js") }}></script> --> <!-- admin.mater has this. -->
<!-- Bootstrap 3.3.7 -->
<!--<script src={{ asset("/assets/vendor/bootstrap/dist/js/bootstrap.min.js") }}></script>--> <!-- admin.mater has this. -->
<!-- FastClick -->
<script src={{ asset("/assets/vendor/fastclick/lib/fastclick.js") }}></script>
<!-- AdminLTE App -->
<script src={{ asset("/assets/vendor/admin-lte/dist/js/adminlte.min.js") }}></script>
<!-- Sparkline -->
<script src={{ asset("/assets/vendor/jquery-sparkline/dist/jquery.sparkline.min.js") }}></script>
<!-- jvectormap  -->
<script src={{ asset("/assets/vendor/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js") }}></script>
<script src={{ asset("/assets/vendor/admin-lte/plugins/jvectormap/jquery-jvectormap-world-mill-en.js") }}></script>
<!-- SlimScroll -->
<script src={{ asset("/assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js") }}></script>
<!-- ChartJS -->
<script src={{ asset("/assets/vendor/chart.js/Chart.js") }}></script>
<!-- momentJS -->
<script src={{ asset("/assets/vendor/moment/moment.js") }}></script>

<!-- get row data -->
<script>
var users = {!! json_encode($users) !!};
var plugins = {!! json_encode($plugins) !!};
var pluginName = {!! json_encode($pluginName) !!};
var solvers = {!! json_encode($solvers) !!};
var pages = {!! json_encode($pages) !!};
var jobs = {!! json_encode($jobs) !!};
var jobs_count = {!! json_encode($jobs_count) !!};
var server = {!! json_encode($server) !!};
console.log(jobs);
</script>

<!-- apply data -->
<script src={{ asset("/js/dashboard.js") }}></script>

@endsection
