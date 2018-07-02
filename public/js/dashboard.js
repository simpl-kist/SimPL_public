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
var latestPage=$(".dashboard_latest_page");
var latestPlugin=$(".dashboard_latest_plugin");
//bootstrap danger, warning, info, success color
var colorTable = {"red":"#dd4b39", "yellow":"#f39c12", "blue":"#00c0ef", "green":"#00a65a"};
//d3 categorialColors
var pieColorTable = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
//	var colorTable = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
//	var colorTable = ['rgb(210, 214, 222, 1)', 'rgba(60,141,188, 1)', 'rgba(33,255,188, 1)', 'rgba(255,0,0,1)', 'rgba(0,255,0,1)'];

//placeholder data
var masterStatus    = {'cpu':[server.cpu.loads[1],server.cpu.cores],'memory':[(server.ram[2]/1024/1024).toFixed(2),(server.ram[1]/1024/1024).toFixed(2)], 'disk':[((server.disk[1]-server.disk[0])/1024/1024/1024).toFixed(2),(server.disk[1]/1024/1024/1024).toFixed(2)]};
// ------------------- make and apply data ----------------------------
console.log(pages,plugins);
pages.forEach(function(e,i,array){
	console.log(i);
	if(i>=5){
		return;
	}
	let date=new Date(e.created);
	latestPage.find("tbody").append("<tr><td>"+e.id+"</td><td>"+e.title+"</td><td>"+(date.getYear()-100)+"-"+(date.getMonth()+1)+"-"+date.getDate()+"</td></tr>")
})
plugins.forEach(function(e,i,array){
	console.log(i);
	if(i>=5){
		return;
	}	
	let date=new Date(e.created_at);
	latestPlugin.find("tbody").append("<tr><td>"+e.id+"</td><td>"+e.name+"</td><td>"+(date.getYear()-100)+"-"+(date.getMonth()+1)+"-"+date.getDate()+"</td></tr>")
})
// top line
var monthlyJoin = 0;
users.forEach(function(d){
		if(!moment.utc(d.created_at, "YYYY-MM-DD hh:mm:ss").diff(moment(), 'months')) monthlyJoin++;
});
$('#monthly-join').text(monthlyJoin);

var monthlyVisitors = "";
$('#monthly-visitors').text(monthlyVisitors);
/*
var concurrentUsers = "placeholder";
$('#concurrent-users').text(concurrentUsers);
*/
// second line charts
// second line bottom
var runningJobs = 0;
jobs.forEach(function(d){
	if(d.status == "running") runningJobs++;
});
$('#runningJobs').text(runningJobs);
$('#njobs').text(jobs_count);
$('#nsolvers').text(solvers.length);
$('#nplugins').text(plugins.length);
$('#npages').text(pages.length);


//third line

//latest jobs
var htmlTemp = "";
jobs.forEach(function(d,i){
if(i>=10){
return;
}
		htmlTemp += "<tr>";
		htmlTemp += "<td><a href='"+d.url+"'></a>"+d.id+"</td>";
		htmlTemp += "<td>"+d.name+"</td>";
		htmlTemp += "<td>"+d.owner+"</td>";
		htmlTemp += "<td>"+pluginName[d.pluginID]+"</td>";
//		htmlTemp += "<td><span class='label' style='background-color:"+d.statusColor+";'>"+d.status+"</span></td>";
		htmlTemp += "<td>"+d.status+"</span></td>";
		htmlTemp += "<td>"+d.created_at+"</td>";
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
			var index = plugins.findIndex(function(x){return x.id == i});
			if(plugins[index] !== undefined){
				PieData.push({value:d, label: plugins[index].name});
			}else{
				PieData.push({value:d, label: "Unknow Plugin"});
			}
		}
});
PieData.sort(function(a,b){ return a.value < b.value ? 1 : a.value > b.value ? -1 : 0; });
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

$('#cpu-bar').css("width",masterStatus.cpu[0]/masterStatus.cpu[1]*100+"%");
$('#memory-bar').css("width",masterStatus.memory[0]/masterStatus.memory[1]*100+"%");
$('#disk-bar').css("width",masterStatus.disk[0]/masterStatus.disk[1]*100+"%");


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


  // -------------
  // - PIE CHART -
  // -------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
  var pieChart       = new Chart(pieChartCanvas);
	var pieColor = [['#f56954','#00a65a','#f39c12','#00c0ef','#3c8dbc','#d2d6de','#ffd6de'],
			['#f56954','#00a65a','#f39c12','#00c0ef','#3c8dbc','#d2d6de','#ffd6de']];
	var legend = $('#plugin-pie-chart-legend');
	var cnt=0;
	for(var i in PieData){
		if(cnt++>9) break;
		PieData[i].color = pieColor[0][i];
		PieData[i].highlight = pieColor[1][i];
		legend.append('<li style="display:flex;overflow:hidden"><i class="fa fa-circle-o" style="color:'+pieColor[0][i]+';"></i>'+PieData[i].label+'</li>')
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
