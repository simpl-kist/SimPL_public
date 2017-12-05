@extends('admin.master')
@section('title')
Dashboard
@endsection
@section('scripts')
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.7 -->
  <link rel="stylesheet" href={{ asset("/assets/vendor/bootstrap/dist/css/bootstrap.min.css") }}>
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
              <span class="info-box-number">90</span><!--<small>%</small></span>-->
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
              <span class="info-box-text">Monthly visits</span>
              <span class="info-box-number">41,410</span>
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
              <span class="info-box-number">9</span>
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
              <span class="info-box-text">?current users?</span>
              <span class="info-box-number">20</span>
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
              <h3 class="box-title">Monthly Nodes Usage Report</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <div class="btn-group">
                  <button type="button" class="btn btn-box-tool dropdown-toggle" data-toggle="dropdown" style="/*display:none;*/">
                    <i class="fa fa-wrench"></i></button>
                  <ul class="dropdown-menu" role="menu">
                    <li><a href="#">Real Time</a></li>
                    <li><a href="#">Weekly</a></li>
                    <li><a href="#">Monthly</a></li>
                    <li class="divider"></li>
                    <li><a href="#">Quarter</a></li>
                  </ul>
                </div>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
              <div class="row">
                <div class="col-md-8">
                  <p class="text-center">
                    <strong>1 Jan, 2014 - 30 Jul, 2014</strong>
                  </p>

                  <div class="chart">
                    <!-- Sales Chart Canvas -->
                    <canvas id="usageChart" style="height: 180px;"></canvas>
                  </div>
                  <!-- /.chart-responsive -->
                </div>
                <!-- /.col -->
                <div class="col-md-4">
								<div style="float:right; cursor:pointer;"><span class="glyphicon glyphicon-refresh"></span></div>
                  <p class="text-center">
                    <strong>Master Node Status</strong>
                  </p>

                  <div class="progress-group">
                    <span class="progress-text">CPU</span>
                    <span id="cpu-usage" class="progress-number"><b>160</b>/200</span>

                    <div class="progress sm">
                      <div id="cpu-usage-bar" class="progress-bar progress-bar-aqua" style="width: 80%; background-image:none;"></div>
                    </div>
                  </div>
                  <!-- /.progress-group -->
                  <div class="progress-group">
                    <span class="progress-text">Memory</span>
                    <span id="memory-usage" class="progress-number"><b>310</b>/400</span>

                    <div class="progress sm">
                      <div id="memory-usage-bar" class="progress-bar progress-bar-red" style="width: 80%; background-image:none;"></div>
                    </div>
                  </div>
                  <!-- /.progress-group -->
                  <div class="progress-group">
                    <span class="progress-text">Disk</span>
                    <span id="disk-usage" class="progress-number"><b>480</b>/800</span>

                    <div class="progress sm">
                      <div id="disk-usage-bar" class="progress-bar progress-bar-green" style="width: 80%; background-image:none;"></div>
                    </div>
                  </div>
                  <!-- /.progress-group -->
                  <div class="progress-group">
                    <span class="progress-text">Place holder</span>
                    <span id="place-holder" class="progress-number"><b>250</b>/500</span>

                    <div class="progress sm">
                      <div id="place-holder-bar" class="progress-bar progress-bar-yellow" style="width: 80%; background-image:none;"></div>
                    </div>
                  </div>
                  <!-- /.progress-group -->
                </div>
                <!-- /.col -->
              </div>
              <!-- /.row -->
            </div>
            <!-- ./box-body -->
						<div class="box-footer">
              <div class="row">
                <div class="col-sm-3 col-xs-6">
                  <div class="description-block border-right">
<!--                    <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> 17%</span>-->
                    <h5 class="description-header text-yellow">30</h5>
                    <span class="description-text">RUNNING JOBS</span>
                  </div>
                </div>
                <div class="col-sm-3 col-xs-6">
                  <div class="description-block border-right">
                    <h5 class="description-header text-green">1,210</h5>
                    <span class="description-text">TOTAL JOBS</span>
                  </div>
                </div>
                <div class="col-sm-3 col-xs-6">
                  <div class="description-block border-right">
                    <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> 20%</span>
                    <h5 class="description-header">$24,813.53</h5>
                    <span class="description-text">RUNNING PLUGIN</span>
                  </div>
                </div>
                <div class="col-sm-3 col-xs-6">
                  <div class="description-block">
                    <span class="description-percentage text-red"><i class="fa fa-caret-down"></i> 18%</span>
                    <h5 class="description-header">1200</h5>
                    <span class="description-text">TOTAL PLUGIN</span>
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
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
              <div class="table-responsive">
                <table class="table no-margin">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Job name</th>
                    <th>User</th>
										<th>Start</th>
										<th>End</th>
                    <th>Status</th>
										<th>Duration</th>
										<th title="nodes">N</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7434</a></td>
                    <td>Quantum espresso test - Ni 111 defect</td>
										<td>user1</td>
										<td>13:20:20</td>
										<td>16:22:21</td>
                    <td><span class="label label-success">Finished</span></td>
										<td>03:02:01</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7433</a></td>
                    <td>Lammps test - combustion</td>
										<td>user2</td>
										<td>11:20:20</td>
										<td>-</td>
                    <td><span class="label label-warning">Waiting</span></td>
										<td>-</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7432</a></td>
                    <td>gold particle(AMD)</td>
										<td>user3 very long</td>
										<td>09:20:20</td>
										<td>10:32:51</td>
                    <td><span class="label label-danger">Error</span></td>
										<td>01:12:31</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7431</a></td>
                    <td>DFTB C O</td>
										<td>user2</td>
										<td>2017-12-14</td>
										<td>-</td>
                    <td><span class="label label-info">Running</span></td>
										<td>17:10:47</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7430</a></td>
                    <td>Plugin(surface search)</td>
										<td>user1</td>
										<td>2017-12-14</td>
										<td>-</td>
                    <td><span class="label label-warning">Waiting</span></td>
										<td>-</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7429</a></td>
                    <td>i</td>
										<td>user1</td>
										<td>2017-12-13</td>
										<td>2017-12-14</td>
                    <td><span class="label label-danger">Error</span></td>
										<td>00:00:01</td>
										<td>3</td>
                  </tr>
                  <tr>
                    <td><a href="pages/examples/invoice.html">7428</a></td>
                    <td>QE CoO supercell</td>
										<td>user3 very long</td>
										<td>2017-12-13</td>
										<td>01:10:11</td>
                    <td><span class="label label-success">Finished</span></td>
										<td>37:41:10</td>
										<td>
                      <div class="sparkbar" data-color="#00a65a" data-height="20">90,90,90,0.1</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.table-responsive -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer clearfix" >
              <a href="javascript:void(0)" class="btn btn-sm btn-info btn-flat pull-left" style="display:none;">Place New Order</a>
              <a href="javascript:void(0)" class="btn btn-sm btn-default btn-flat pull-right">View More Jobs</a>
            </div>
            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
					<div class="box">
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
                <div class="col-md-9 col-sm-8">
                  <div class="pad">
                    <!-- Map will be created here -->
                    <div id="world-map-markers" style="height: 325px;"></div>
                  </div>
                </div>
                <!-- /.col -->
                <div class="col-md-3 col-sm-4" style="display:none;">
                  <div class="pad box-pane-right bg-green" style="min-height: 280px">
                    <div class="description-block margin-bottom">
                      <div class="sparkbar pad" data-color="#fff">90,70,90,70,75,80,70</div>
                      <h5 class="description-header">8390</h5>
                      <span class="description-text">Visits</span>
                    </div>
                    <!-- /.description-block -->
                    <div class="description-block margin-bottom">
                      <div class="sparkbar pad" data-color="#fff">90,50,90,70,61,83,63</div>
                      <h5 class="description-header">30%</h5>
                      <span class="description-text">Referrals</span>
                    </div>
                    <!-- /.description-block -->
                    <div class="description-block">
                      <div class="sparkbar pad" data-color="#fff">90,50,90,70,61,83,63</div>
                      <h5 class="description-header">70%</h5>
                      <span class="description-text">Organic</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                </div>
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
              <h3 class="box-title">Plugin Usage</h3>

              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
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
              <ul class="products-list product-list-in-box">
                <li class="item">
                  <div class="product-img">
                    <img src={{ asset("/assets/vendor/admin-lte/dist/img/default-50x50.gif") }} alt="Product Image">
                  </div>
                  <div class="product-info">
                    <a href="javascript:void(0)" class="product-title">user4 mid family
                      <span class="label label-warning pull-right">1 hour ago</span></a>	
                    <span class="product-description">
                          place holder University
                        </span>
                  </div>
                </li>
                <!-- /.item -->
                <li class="item">
                  <div class="product-img">
                    <img src={{ asset("/assets/vendor/admin-lte/dist/img/default-50x50.gif") }} alt="Product Image">
                  </div>
                  <div class="product-info">
                    <a href="javascript:void(0)" class="product-title">user3 Giant Ridley
                      <span class="label label-info pull-right">4 day ago</span></a>
                    <span class="product-description">
                          placeholder Research
                        </span>
                  </div>
                </li>
                <!-- /.item -->
                <li class="item">
                  <div class="product-img">
                    <img src={{ asset("/assets/vendor/admin-lte/dist/img/default-50x50.gif") }} alt="Product Image">
                  </div>
                  <div class="product-info">
                    <a href="javascript:void(0)" class="product-title">user2 One Two<span
                        class="label label-danger pull-right">2 month ago</span></a>
                    <span class="product-description">
                          placeholder Company
                        </span>
                  </div>
                </li>
                <!-- /.item -->
                <li class="item">
                  <div class="product-img">
                    <img src={{ asset("/assets/vendor/admin-lte/dist/img/default-50x50.gif") }} alt="Product Image">
                  </div>
                  <div class="product-info">
                    <a href="javascript:void(0)" class="product-title">user1 Ground Station
                      <span class="label label-success pull-right">1 year ago</span></a>
                    <span class="product-description">
                          placeholder. inc.
                        </span>
                  </div>
                </li>
                <!-- /.item -->
              </ul>
            </div>
            <!-- /.box-body -->
            <div class="box-footer text-center">
              <a href="javascript:void(0)" class="uppercase">View All Users</a>
            </div>
            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->


  


<!-- jQuery 3 -->
<script src={{ asset("/assets/vendor/jquery/dist/jquery.min.js") }}></script>
<!-- Bootstrap 3.3.7 -->
<script src={{ asset("/assets/vendor/bootstrap/dist/js/bootstrap.min.js") }}></script>
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
<!-- AdminLTE dashboard demo (This is only for demo purposes) -->
<!--<script src={{ asset("/assets/vendor/admin-lte/dist/js/pages/dashboard2.js") }}></script>-->
<script src={{ asset("/js/dashboard.js") }}></script>
<!-- AdminLTE for demo purposes -->
<!--<script src={{ asset("/assets/vendor/admin-lte/dist/js/demo.js") }}></script>-->
<!--<script src={{ asset("/js/demo.js") }}></script>-->
@endsection
