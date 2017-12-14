//users, plugins, solvers, pages, jobs 
//는 뷰어에서 이 코드 이전에 선언되고 값을 할당해야 한다.
//처음 만들 때는 뷰어에서 php->js로 넘겨주는걸로 만듬.

//to data list needed in function below
var usageChartOptions;
var usageChartData;
var usageChart;
var usageData;	//for node usage graph
var usageChartDraw;
var PieData;

//bootstrap danger, warning, info, success color
var colorTable = {"red":"#dd4b39", "yellow":"#f39c12", "blue":"#00c0ef", "green":"#00a65a"};
//d3 categorialColors
var pieColorTable = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
//	var colorTable = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
//	var colorTable = ['rgb(210, 214, 222, 1)', 'rgba(60,141,188, 1)', 'rgba(33,255,188, 1)', 'rgba(255,0,0,1)', 'rgba(0,255,0,1)'];

//placeholder data
usageData = [{'solverName' : "Total", 'data':[97, 109, 130, 170, 192, 102, 330]},
{'solverName':"SIESTA", 'data':[ 4, 2, 10, 70, 50, 20, 200]},
{'solverName':'Quantum Espresso', 'data':[65, 59, 80, 81, 56, 55, 40]},
{'solverName':'Lammps', 'data':[28, 48, 40, 19, 86, 27, 90]},];
var jobTable = [{"url":"#", "id":"7434", "name":"Quantum espresso test - Ni 111 defect", "user":"user1", "created_at":"13:20:20", "finished":"16:22:21", "status":"Finished", "statusColor":colorTable["green"], "duration":"03:02:01", "nodes":"1", },
														{"url":"#", "id":"7433", "name":"Lammps test - combustion", "user":"user2", "created_at":"11:20:20", "finished":"-", "status":"Waiting", "statusColor":colorTable["yellow"], "duration":"-", "nodes":"2", },
														{"url":"#", "id":"7432", "name":"gold particle(AMD)", "user":"user3", "created_at":"09:20:20", "finished":"10:32:51	", "status":"Error", "statusColor":colorTable["red"], "duration":"01:10:12", "nodes":"3", },
														{"url":"#", "id":"7431", "name":"DFTB C O", "user":"user1", "created_at":"2017-12-14", "finished":"-", "status":"Running", "statusColor":colorTable["blue"], "duration":"17:10:47", "nodes":"4", },
														{"url":"#", "id":"7430", "name":"Plugin(surface search)", "user":"user2", "created_at":"2017-12-14", "finished":"-", "status":"Waiting", "statusColor":colorTable["yellow"], "duration":"-", "nodes":"5", },
														{"url":"#", "id":"7429", "name":"i", "user":"user1", "created_at":"2017-12-13", "finished":"2017-12-14", "status":"Error", "statusColor":colorTable["red"], "duration":"00:00:01", "nodes":"6", },
														{"url":"#", "id":"7428", "name":"QE CoO supercell", "user":"user3", "created_at":"2017-12-13", "finished":"01:10:11", "status":"Finished", "statusColor":colorTable["green"], "duration":"01:10:11", "nodes":"7", }];
/*
var PieData				= [{"value":400, "label":"Plugin1"},
								{"value":600, "label":"Plugin2"},
								{"value":200, "label":"Plugin3"},
								{"value":400, "label":"Plugin4"},
								{"value":800, "label":"Plugin5"},
								{"value":200, "label":"Plugin6"},
								{"value":300, "label":"Plugin7"},
								{"value":100, "label":"Plugin8"},];
//								{"value":100, "label":"Etc"}];
//
*/

				masterStatus	= {'cpu':[2.2,20],'memory':[6,16], 'disk':[1,20], 'placeholder':[300,500] };
// ------------------- make and apply data ----------------------------


// top line
var monthlyJoin = 0;
users.forEach(function(d){
		if(!moment.utc(d.created_at, "YYYY-MM-DD hh:mm:ss").diff(moment(), 'months')) monthlyJoin++;
});
$('#monthly-join').text(monthlyJoin);

var monthlyVisitors = "placeholder";
$('#monthly-visitors').text(monthlyVisitors);

var concurrentUsers = "placeholder";
$('#concurrent-users').text(concurrentUsers);

// second line charts
// second line bottom
var runningJobs = 0;
jobs.forEach(function(d){
		if(d.status == "running") runningJobs++;
});
$('#runningJobs').text(runningJobs);
$('#njobs').text(jobs.length);
$('#nsolvers').text(solvers.length);
$('#nplugins').text(plugins.length);
$('#npages').text(pages.length);


//third line

//latest jobs
var htmlTemp = "";
jobTable.forEach(function(d,i){
		htmlTemp += "<tr>";
		htmlTemp += "<td><a href='"+d.url+"'></a>"+d.id+"</td>";
		htmlTemp += "<td>"+d.name+"</td>";
		htmlTemp += "<td>"+d.user+"</td>";
		htmlTemp += "<td>"+d.created_at+"</td>";
		htmlTemp += "<td>"+d.finished+"</td>";
		htmlTemp += "<td><span class='label' style='background-color:"+d.statusColor+";'>"+d.status+"</span></td>";
		htmlTemp += "<td>"+d.duration+"</td>";
		htmlTemp += "<td>"+d.nodes+"</td>";
		htmlTemp += "</tr>";
});
$('#latest-jobs>tbody').html(htmlTemp);

//PieData
var pluginUsageData = [];
jobs.forEach(function(d,i){
		if(d.pluginID != -1) {
				if(pluginUsageData[d.pluginID] == undefined){
					pluginUsageData[d.pluginID] = 1;
				} else { 
					pluginUsageData[d.pluginID]++;
				}
		}
});
var PieData = [];
pluginUsageData.forEach(function(d,i){
		if(d != undefined){
			var index = plugins.findIndex(x => x.id == i)
			PieData.push({value:d, label: plugins[index].name});
		}
});
PieData.sort((a,b) => { return a.value < b.value ? 1 : a.value > b.value ? -1 : 0; });
// Pie의 legend는 6개로 제한, 넘으면 6번 이하는 etc로 합침
if(PieData.length > 6){
	var etcSum = 0;
	for(var i = 5; i < PieData.length; i++){
		etcSum += PieData[i].value;
	}
	PieData = PieData.splice(0, 5);
	PieData.push({value:etcSum, label:'Etc'});
}


$('#cpu').html("<b>"+masterStatus.cpu[0]+"</b>/"+masterStatus.cpu[1]);
$('#memory').html("<b>"+masterStatus.memory[0]+"</b>/"+masterStatus.memory[1]);
$('#disk').html("<b>"+masterStatus.disk[0]+"</b>/"+masterStatus.disk[1]);
$('#placeholder').html("<b>"+masterStatus.placeholder[0]+"</b>/"+masterStatus.placeholder[1]);

$('#cpu-bar').css("width",masterStatus.cpu[0]/masterStatus.cpu[1]*100+"%");
$('#memory-bar').css("width",masterStatus.memory[0]/masterStatus.memory[1]*100+"%");
$('#disk-bar').css("width",masterStatus.disk[0]/masterStatus.disk[1]*100+"%");
$('#placeholder-bar').css("width",masterStatus.placeholder[0]/masterStatus.placeholder[1]*100+"%");


//new users
var recentUsers = users.length > 4 ? users.slice(0,4) : users;
for(var i in recentUsers){
	recentUsers[i].ago = moment.utc(recentUsers[i].created_at,"YYYY-MM-DD hh:mm:ss").fromNow();
//php code			preg_match('/\d+\s([a-z]+?)s?\s.+/', $recentUsers[$i]['ago'], $matched);
	var matched = /[0-9a-z]+\s([a-z]+?)s?\s.+/.exec(recentUsers[i].ago)[1];
	switch(matched){
		case "year":
			recentUsers[i].agoColor = colorTable.blue;
		break;
		case "month":
			recentUsers[i].agoColor = colorTable.blue;
		break;
		case "week":
			recentUsers[i].agoColor = colorTable.green;
		break;
		case "day":
			recentUsers[i].agoColor = colorTable.yellow;
		break;
		default:
		recentUsers[i].agoColor = colorTable.red;
	}
}

var htmlTemp = "";
recentUsers.forEach(function(d,i){
		htmlTemp += "<li class='item'>";
		htmlTemp += "	<div class='product-img'>";
		htmlTemp += "	<span class='glyphicon glyphicon-user' style='font-size:50px; color:#cecece;'></span>";
		htmlTemp += "	</div>";
		htmlTemp += "	<div class='product-info'>";
		htmlTemp += "	<a href='javascript:void(0)' class='product-title'>"+d.name;
		htmlTemp += "	<span class='label pull-right' style='background-color:"+d.agoColor+"'>"+d.ago+"</span></a>	";
		htmlTemp += "	<span class='product-description'>"+(d.affiliation != null ? d.affiliation : "")+"</span>";
		htmlTemp += "	</div>";
		htmlTemp += "	</li>";
});
$('#new-users-list').html(htmlTemp);


$(function () {

  'use strict';

  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  // -----------------------
  // - MONTHLY SALES CHART -
  // -----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var usageChartCanvas = $('#usage-chart').get(0).getContext('2d');
  // This will get the first returned node in the jQuery collection.
  usageChart       = new Chart(usageChartCanvas);

	//usageData 는 뷰어에서 이 코드 이전에 선언되고 값이 할당되어 있어야 한다.
	//sort
	for(var i in usageData){
		var sum = 0;
		for(var j in usageData[i].data){
			sum += usageData[i].data[j];
		}
		usageData[i].dataSum = sum;
	}
	usageData.sort(function(a, b){
		return a.dataSum > b.dataSum ? -1 : a.dataSum < b.dataSum ? 1 : 0;
	});

	var chartDatasets = [];
	var opacity = 255;
	for(var i in usageData){
		chartDatasets[i] = {
			label               : usageData[i].solverName,
			fillColor           : pieColorTable[i] + opacity.toString(16),
			strokeColor         : pieColorTable[i] + (opacity-16).toString(16),
			pointColor          : pieColorTable[i],
			pointStrokeColor    : pieColorTable[i],
			pointHighlightFill  : '#fff',
			pointHighlightStroke: pieColorTable[i],
			data								: usageData[i].data,
		};
		opacity -= 16*2;
		if(opacity < 16) opacity = 16;
	}
	usageChartData = {
    labels  : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],	//x-axis placeholder
		datasets: chartDatasets,
	};

  usageChartOptions = {
    // Boolean - If we should show the scale at all
    showScale               : true,
    // Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines      : true,
    // String - Colour of the grid lines
    scaleGridLineColor      : 'rgba(0,0,0,.05)',
    // Number - Width of the grid lines
    scaleGridLineWidth      : 1,
    // Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    // Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines  : false,
    // Boolean - Whether the line is curved between points
    bezierCurve             : true,
    // Number - Tension of the bezier curve between points
    bezierCurveTension      : 0.3,
    // Boolean - Whether to show a dot for each point
    pointDot                : true,
    // Number - Radius of each point dot in pixels
    pointDotRadius          : 4,
    // Number - Pixel width of point dot stroke
    pointDotStrokeWidth     : 1,
    // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,
    // Boolean - Whether to show a stroke for datasets
    datasetStroke           : true,
    // Number - Pixel width of dataset stroke
    datasetStrokeWidth      : 2,
    // Boolean - Whether to fill the dataset with a color
    datasetFill             : true,
    // String - A legend template
    legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend" style="list-style:none;padding-left:0px;"><% for (var i=0; i<datasets.length; i++){%><li><span><i class="fa fa-square" style="color:<%=datasets[i].fillColor%>;"></i></span><%=datasets[i].label%></li><%}%></ul>',
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio     : true,
    // Boolean - whether to make the chart responsive to window resizing
    responsive              : true
  };

  // Create the line chart
//	var usageChartLegend = usageChart.Line(usageChartData, usageChartOptions);
//	document.getElementById('usage-chart-legend').innerHTML = usageChartLegend.generateLegend();


	//wrench icon
	var chartLabels = {};
	chartLabels.today = ['', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', ''];
	usageChartDraw = function(mode)	{
		var title;
		var formatter = new Intl.DateTimeFormat(navigator.language);
		var chartPeriod = formatter.format(new Date());
		switch(mode){
			case "today":
				title = "Today";
				usageChartOptions.pointDot = false;
				usageChartData.labels = chartLabels.today;
				break;
			case "week":
				title = "Week";
				chartPeriod = " - "+chartPeriod;
				usageChartOptions.pointDot = true;
				break;
			case "month":
				title = "Month";
				usageChartOptions.pointDot = true;
				break;
			case "quarter":
				title = "Quarter";
				usageChartOptions.pointDot = true;
				break;
		}
		title = "placeholder"; //TODO
		$('#usage-chart-title').text('Nodes Usage Report ('+title+')');
		$("#usage-chart-period").text(chartPeriod);
		return usageChart.Line(usageChartData, usageChartOptions);
	}

	//draw chart and legend
	var usageChartLegend = usageChartDraw('today');
	document.getElementById('usage-chart-legend').innerHTML = usageChartLegend.generateLegend();



  // ---------------------------
  // - END MONTHLY SALES CHART -
  // ---------------------------


  // -------------
  // - PIE CHART -
  // -------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
  var pieChart       = new Chart(pieChartCanvas);
	var pieColor = [['#f56954','#00a65a','#f39c12','#00c0ef','#3c8dbc','#d2d6de','#ffd6de'],
			['#f56954','#00a65a','#f39c12','#00c0ef','#3c8dbc','#d2d6de','#ffd6de']];
	var legend = $('#plugin-pie-chart-legend');
	for(var i in PieData){
		PieData[i].color = pieColor[0][i];
		PieData[i].highlight = pieColor[1][i];
		legend.append('<li><i class="fa fa-circle-o" style="color:'+pieColor[0][i]+';"></i>'+PieData[i].label+'</li>')
	}
  var pieOptions     = {
    // Boolean - Whether we should show a stroke on each segment
    segmentShowStroke    : true,
    // String - The colour of each segment stroke
    segmentStrokeColor   : '#fff',
    // Number - The width of each segment stroke
    segmentStrokeWidth   : 1,
    // Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    // Number - Amount of animation steps
    animationSteps       : 100,
    // String - Animation easing effect
    animationEasing      : 'easeOutBounce',
    // Boolean - Whether we animate the rotation of the Doughnut
    animateRotate        : true,
    // Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale         : false,
    // Boolean - whether to make the chart responsive to window resizing
    responsive           : true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio  : false,
    // String - A legend template
    legendTemplate       : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
    // String - A tooltip template
    tooltipTemplate      : '<%=label%> - <%=value %>'//  users'
  };
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);
  // -----------------
  // - END PIE CHART -
  // -----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */
  $('#world-map-markers').vectorMap({
    map              : 'world_mill_en',
    normalizeFunction: 'polynomial',
    hoverOpacity     : 0.7,
    hoverColor       : false,
    backgroundColor  : 'transparent',
    regionStyle      : {
      initial      : {
        fill            : 'rgba(210, 214, 222, 1)',
        'fill-opacity'  : 1,
        stroke          : 'none',
        'stroke-width'  : 0,
        'stroke-opacity': 1
      },
      hover        : {
        'fill-opacity': 0.7,
        cursor        : 'pointer'
      },
      selected     : {
        fill: 'yellow'
      },
      selectedHover: {}
    },
    markerStyle      : {
      initial: {
        fill  : '#00a65a',
        stroke: '#111'
      }
    },
    markers          : [
      { latLng: [41.90, 12.45], name: 'Vatican City' },
      { latLng: [43.73, 7.41], name: 'Monaco' },
      { latLng: [-0.52, 166.93], name: 'Nauru' },
      { latLng: [-8.51, 179.21], name: 'Tuvalu' },
      { latLng: [43.93, 12.46], name: 'San Marino' },
      { latLng: [47.14, 9.52], name: 'Liechtenstein' },
      { latLng: [7.11, 171.06], name: 'Marshall Islands' },
      { latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' },
      { latLng: [3.2, 73.22], name: 'Maldives' },
      { latLng: [35.88, 14.5], name: 'Malta' },
      { latLng: [12.05, -61.75], name: 'Grenada' },
      { latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines' },
      { latLng: [13.16, -59.55], name: 'Barbados' },
      { latLng: [17.11, -61.85], name: 'Antigua and Barbuda' },
      { latLng: [-4.61, 55.45], name: 'Seychelles' },
      { latLng: [7.35, 134.46], name: 'Palau' },
      { latLng: [42.5, 1.51], name: 'Andorra' },
      { latLng: [14.01, -60.98], name: 'Saint Lucia' },
      { latLng: [6.91, 158.18], name: 'Federated States of Micronesia' },
      { latLng: [1.3, 103.8], name: 'Singapore' },
      { latLng: [1.46, 173.03], name: 'Kiribati' },
      { latLng: [-21.13, -175.2], name: 'Tonga' },
      { latLng: [15.3, -61.38], name: 'Dominica' },
      { latLng: [-20.2, 57.5], name: 'Mauritius' },
      { latLng: [26.02, 50.55], name: 'Bahrain' },
      { latLng: [0.33, 6.73], name: 'São Tomé and Príncipe' }
    ]
  });

  /* SPARKLINE CHARTS
   * ----------------
   * Create a inline charts with spark line
   */

  // -----------------
  // - SPARKLINE BAR -
  // -----------------
  $('.sparkbar').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type    : 'bar',
      height  : $this.data('height') ? $this.data('height') : '30',
      barColor: $this.data('color')
    });
  });

  // -----------------
  // - SPARKLINE PIE -
  // -----------------
  $('.sparkpie').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type       : 'pie',
      height     : $this.data('height') ? $this.data('height') : '90',
      sliceColors: $this.data('color')
    });
  });

  // ------------------
  // - SPARKLINE LINE -
  // ------------------
  $('.sparkline').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type     : 'line',
      height   : $this.data('height') ? $this.data('height') : '90',
      width    : '100%',
      lineColor: $this.data('linecolor'),
      fillColor: $this.data('fillcolor'),
      spotColor: $this.data('spotcolor')
    });
  });
});
