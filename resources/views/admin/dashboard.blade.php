@extends('admin.master')
@section('title')
Dashboard
@endsection
@section('scripts')
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.7 -->
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

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
@endsection
@section('content')

    <!-- Main content -->
      <!-- Info boxes -->
      <div class="row">
        <div class="col-md-3 col-sm-6 col-xs-12">
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
        <div class="col-md-3 col-sm-6 col-xs-12">
          <div class="info-box">
            <span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>

            <div class="info-box-content">
              <span class="info-box-text">Monthly visitors</span>
              <span id="monthly-visitors" class="info-box-number"></span>
            </div>
            <!-- /.info-box-content -->
          </div>
          <!-- /.info-box -->
        </div>
        <!-- /.col -->

        <!-- fix for small devices only -->
        <div class="clearfix visible-sm-block"></div>

        <div class="col-md-3 col-sm-6 col-xs-12">
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
        <div class="col-md-3 col-sm-6 col-xs-12">
          <div class="info-box">
            <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

            <div class="info-box-content">
              <span class="info-box-text">concurrent users</span>
              <span id="concurrent-users" class="info-box-number">placeholder</span>
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
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <div class="btn-group">
                  <button type="button" class="btn btn-box-tool dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="/*display:none;*/">
                    <i class="fa fa-wrench"></i></button>
                  <ul class="dropdown-menu" role="menu">
                    <li><a href="javascript:usageChartDraw('today');">Today</a></li>
                    <li class="divider"></li>
                    <li><a href="javascript:usageChartDraw('week');">Week</a></li>
                    <li><a href="javascript:usageChartDraw('month');">Month</a></li>
                    <li><a href="javascript:usageChartDraw('quarter');">Quarter</a></li>
                    <li><a href="javascript:usageChartDraw('year');">Year</a></li>
                  </ul>
                </div>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
              <div class="row">
                <div class="col-md-8" style="display:flex;">
									<div class="col-md-10">
										<p class="text-center">
											<strong id="usage-chart-period"></strong>
										</p>
										<div class="chart">
											<!-- Sales Chart Canvas -->
											<canvas id="usage-chart" style="height: 180px;"></canvas>
										</div>
									</div>
									<!-- /.chart-responsive -->
									<div class="col-md-2" style="display:flex;">
										<div id='usage-chart-legend' style="margin:auto;"></div>
									</div>
                </div>
                <!-- /.col -->
                <div class="col-md-4">
									<a href="javascript:;">
										<div style="float:right;"><span class="glyphicon glyphicon-refresh"></span></div>
									</a>
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
											<!--
												<li><i class="fa fa-circle-o"></i> Chrome</li>
												<li><i class="fa fa-circle-o"></i> IE</li>
												<li><i class="fa fa-circle-o"></i> FireFox</li>
												<li><i class="fa fa-circle-o"></i> Safari</li>
												<li><i class="fa fa-circle-o"></i> Opera</li>
												<li><i class="fa fa-circle-o"></i> Navigator</li>
												-->
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
<!--                    <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> 17%</span>-->
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
              <h3 class="box-title">Latest Jobs(placeholder)</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
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
											<th>Submission</th>
											<th>End</th>
											<th>Status</th>
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
										<!--
										<td>
                      <div class="sparkbar" data-color="#00a65a" data-height="20">90,90,90,0.1</div>
                    </td>
										-->
              <!-- /.table-responsive -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer clearfix" >
              <a href="javascript:void(0)" class="btn btn-sm btn-info btn-flat pull-left" style="display:none;">action placeholder</a>
              <a href="/admin/jobs" class="btn btn-sm btn-default btn-flat pull-right">View More Jobs</a>
            </div>
            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
					<div class="box" style="display:none;">
            <div class="box-header with-border">
              <h3 class="box-title">Visitors Report (arbitrary data)</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              <div class="row">
                <div class="col-md-12 col-sm-12">
								<!-- 오른쪽에 추가 설명 창이 있는 경우
								<div class="col-md-9 col-sm-8">
								-->
                  <div class="pad">
                    <!-- Map will be created here -->
                    <div id="world-map-markers" style="height: 325px;"></div>
                  </div>
                </div>
                <!-- /.col -->
								<!--
                <div class="col-md-3 col-sm-4">
                  <div class="pad box-pane-right bg-green" style="min-height: 280px">
                    <div class="description-block margin-bottom">
                      <div class="sparkbar pad" data-color="#fff">90,70,90,70,75,80,70</div>
                      <h5 class="description-header">8390</h5>
                      <span class="description-text">Visits</span>
                    </div>
                    <div class="description-block margin-bottom">
                      <div class="sparkbar pad" data-color="#fff">90,50,90,70,61,83,63</div>
                      <h5 class="description-header">30%</h5>
                      <span class="description-text">Referrals</span>
                    </div>
                    <div class="description-block">
                      <div class="sparkbar pad" data-color="#fff">90,50,90,70,61,83,63</div>
                      <h5 class="description-header">70%</h5>
                      <span class="description-text">Organic</span>
                    </div>
                  </div>
                </div>
								-->
                <!-- /.col -->
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
              <span class="progress-description">
                    50% Increase in 30 Days
                  </span>
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
              <span class="progress-description">
                    20% Increase in 30 Days
                  </span>
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
              <span class="progress-description">
                    70% Increase in 30 Days
                  </span>
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
              <span class="progress-description">
                    40% Increase in 30 Days
                  </span>
            </div>
            <!-- /.info-box-content -->
          </div>
          <!-- /.info-box -->
</div>
          <div class="box box-default">
            <div class="box-header with-border">
              <h3 class="box-title">Master Node Status(placeholder)</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
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
							<div class="progress-group">
								<span class="progress-text">Place holder</span>
								<span id="placeholder" class="progress-number"><b></b>/</span>

								<div class="progress sm">
									<div id="placeholder-bar" class="progress-bar progress-bar-yellow" style="background-image:none;"></div>
								</div>
							</div>
							<!-- /.progress-group -->
            </div>
            <!-- /.box-body -->
<!--
						<div class="box-footer no-padding">
              <ul class="nav nav-pills nav-stacked">
                <li><a href="#">United States of America
                  <span class="pull-right text-red"><i class="fa fa-angle-down"></i> 12%</span></a></li>
                <li><a href="#">India <span class="pull-right text-green"><i class="fa fa-angle-up"></i> 4%</span></a>
                </li>
                <li><a href="#">China
                  <span class="pull-right text-yellow"><i class="fa fa-angle-left"></i> 0%</span></a></li>
              </ul>
            </div>
-->
            <!-- /.footer -->
          </div>
          <!-- /.box -->

          <!-- PRODUCT LIST -->
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">New Users</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
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
                    <a href="javascript:void(0)" class="product-title">username
                      <span class="label pull-right">ago</span></a>	
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
var solvers = {!! json_encode($solvers) !!};
var pages = {!! json_encode($pages) !!};
var jobs = {!! json_encode($jobs) !!};
</script>

<!-- apply data -->
<script src={{ asset("/js/dashboard.js") }}></script>

@endsection
