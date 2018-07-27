@extends('admin.master')
@section('title')
Edit Plugin
@stop
@section('content')
<script>
$(document).ready(function(){
/*	$('.scriptDiv').each(function(i,block){
		hljs.highlightBlock(block);
	});*/
//		var script = $($('.scriptDiv').html().replace(/<br[^>]*>/gi,"\n")).text()
});
function testScript(){
	$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': '{{ csrf_token() }}'
	    }
	});

	var includes = $('#includes').val();//.replace(/^\s+/gi,"").replace(/\s+$/gi,"").replace(/,/gi," ").replace(/;/gi," ").replace(/\s+/gi," ").split(" ");
	$.ajax({
		type:"post",
		dataType:"json",
		url:"/admin/plugins/test",
		async:false,
		data:{
			istest:true,
			testinput:$('.inputdata').val().replace(/\n/gi,"\\n"),
			includes:includes,
		//	script:$('.script').val()
			script:scriptEditor.getValue()
		},
//		charset:'utf-8',
		success:function(data){
			console.log(data);
			$('#test-result-stdout').val(data['output']);
			$('#test-result-stderr').val(data['error']);
			
		},
		error:function(err){
			console.log(err);
		}
	});
} 
var scriptEditor;
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('script')[0],{
		mode:"python",
		lineNumbers:true,
		lineWrapping:true,
		extraKeys: {
			"Ctrl-Enter": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		},
	});
});
</script>
<script src={{asset('assets/vendor/codemirror/lib/')}}/codemirror.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/python/python.js></script>
<script src={{asset('js/fullscreen.js')}}></script>
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<style>
.CodeMirror{
	height:450px;
}
.CodeMirror-fullscreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9;
}
.btn-simpl{
	background-image: -webkit-linear-gradient(top,#505050 0,#070707 100%);
	background-image: -o-linear-gradient(top,#505050 0,#070707 100%);
	background-image: -webkit-gradient(linear,left top,left bottom,from(#505050),to(#070707));
	background-image: linear-gradient(to bottom,#505050 0,#070707 100%);
	border-color:black;
	color:white;
}
.btn-simpl:hover, .btn-simpl:focus, .btn-simpl:active, .btn-simpl:visited{
	background-image:none;
	background-color:#070707;
	color:white;
}
.built-in-label:hover{
	text-decoration:underline;
	cursor:pointer;
}
.built-in-functions-wrapper{
	padding:10px;
	-webkit-box-shadow: 4px 4px 14px 4px rgba(206,206,206,1);
	-moz-box-shadow: 4px 4px 14px 4px rgba(206,206,206,1);
	box-shadow: 4px 4px 14px 4px rgba(206,206,206,1);
	background-color:white;
	display:none;
	top:0;
	right:0;
	position:fixed;
	width:600px;
	overflow:auto;
	height:750px;
	z-index:999;
}
</style>
<h2>Plugins</h2>

<div class=row>
	<div class='col-md-10'>
	<form method=post action="{{ route('admin.plugins.store') }}">
		<input type=hidden name=pluginId value="{{ $plugin->id or -1 }}">
		{{ csrf_field() }}
		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Name</label>
			<div class=col-md-9>
				<input type=text class='form-control' name=name value="{{ $plugin->name or old('name')}}">
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Alias</label>
			<div class=col-md-9>
				<input type=text class='form-control' name=alias value="{{ $plugin->alias or old('alias')}}">
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Role</label>
			<div class=col-md-9>
				<select name=role class='form-control'>
					<option value=calculator>Calculator</option>
					<option value=middleware>Middleware</option>
				</select>
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Type</label>
			<div class=col-md-9>
				<select name=type class='form-control'>
				<!--	<option value=php>PHP</option>-->
					<option value=python>Python</option>
				</select>
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Required Qualification</label>
			<div class=col-md-9>
				<select name=require class=form-control>
					<option value=0 {{ !isset($plugin) || $plugin->ispublic==0 ? "selected" : "" }} >Public</option>
					<option value=1 {{ isset($plugin) && $plugin->ispublic==1 ? "selected" : "" }} >Anonymous</option>
					<option value=2 {{ isset($plugin) && $plugin->ispublic==2 ? "selected" : "" }} >User</option>
					<option value=3 {{ isset($plugin) && $plugin->ispublic==3 ? "selected" : "" }} >Editor</option>
					<option value=4 {{ isset($plugin) && $plugin->ispublic==4 ? "selected" : "" }} >Admin</option>
				</select>
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Input(for test)</label>
			<div class=col-md-9>
				<textarea style='height:150px;overflow-y:auto;' class='form-control inputdata' name="inputdata" placeholder="Standard JSON format is supported">{!! old('inputdata') !!}</textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Includes</label>
			<div class=col-md-9>
				<textarea class='form-control' name='includes' id=includes>{{ $plugin->includes or old('includes')}}</textarea>
			</div>
		</div>

		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-md-3 col-form-label'>Script</label>
			<div class=col-md-9>
				<textarea style='height:450px;overflow-y:auto;' class='form-control script' name=script>{!! $plugin->script or old('script') !!}</textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
				<label style="font-size:12px">FullScreen Mode: Ctrl+Enter</label>
				<label class=built-in-label style="float:right;font-size:12px;">Built-in Functions</label>
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-md-12 style='text-align:right;'>
			<button type="button" id=getFromSimPL class="btn btn-simpl">Get SimPL</button>
				<button type="button" class="btn btn-primary" onclick=testScript();>Test</button>
@if(isset($plugin))
@can('update',$plugin)
				<button type="submit" class="btn btn-primary">Apply</button>
@endcan
@else
				<button type="submit" class="btn btn-primary">Add</button>
@endif
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-md-12 style='text-align:right;'>
				<label class='col-md-3 col-form-label'>Test Result</label>
				<div class='col-md-9'>
					<div class=form-group>
					<label>STDOUT</label>
					<textarea rows=10 class=form-control id='test-result-stdout'></textarea>
					<label>STDERR</label>
					<textarea rows=10 class=form-control id='test-result-stderr'></textarea>
					</div>
				</div>
			</div>
		</div>
	</form>
	</div>
</div>
<div class="modal" role="dialog" tabindex="-1" id="simpl_modal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<label>SimPL Page Repository</label>
				<button aria-label="Close" class="close" data-dismiss="modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body form-inline">
				<label>SimPL Repo ID</label><input class=form-control id=simpl_repo_id>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" id="SimPLtoContent" type="button">SimPL to Content</button>
				<button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
			</div>
		</div>
	</div>
</div>
<div class=built-in-functions-wrapper>
<div style="text-align:right;">
	<i class="glyphicon glyphicon-remove hide-built-in-wrapper" style="font-size:15px;cursor:pointer;"></i>
</div>
<div>
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Input</th>
      <th>Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>file_get_contents</td>
      <td>Read File data</td>
      <td>filename, use_include_path = 0, context = None, offset = -1, maxlen = -1</td>
      <td>File Context</td>
    </tr>
    <tr>
      <td>getSolver</td>
      <td>Import registered Solver information for using.</td>
      <td>solvername</td>
      <td>Sover Information</td>
    </tr>
    <tr>
      <td>qsub</td>
      <td>Submit the job to the scheduler.</td>
      <td>params={<br/>mpi : True|False,<br/>solverExec : [execution command for solver],<br/># ppn : processors per node,<br/>#  nnodes : number of nodes<br/>}</td>
      <td>Queue ID</td>
    </tr>
    <tr>
      <td>qstat</td>
      <td>Check the status of jobs in the scheduler.</td>
      <td>id=-1</td>
      <td>Status of the job in Scheduler</td>
    </tr>
    <tr>
      <td>callPlugin</td>
      <td>Call another plugin.</td>
      <td>Plugin Alias, Input Data</td>
      <td>Output of the called Plugin</td>
    </tr>
    <tr>
      <td>getMyInfo</td>
      <td>Load the information of the user who called the plugin </td>
      <td>-</td>
      <td>User information</td>
    </tr>
    <tr>
      <td>getRepo</td>
      <td>Read the file in the Repository for Server.</td>
      <td>Alias of file in Repository for server</td>
      <td>File Contents</td>
    </tr>
    <tr>
      <td>saveJob</td>
      <td>Save Data to DB.</td>
      <td>args={qinfo, status, pluginId, jobBefore, jobNext, input, output, name, jobdir}</td>
      <td>DB id of Job</td>
    </tr>
    <tr>
      <td>getJobs</td>
      <td>Load Saved Job Data from DB.</td>
      <td>args=<br/>{"cols":[column list you want to get],<br/>
"order":[key,("asc" or "desc"),<br/>
"limit":["offset","limit"],<br/>
"criteria":["array of criteria(Raw Where Query)"],<br/>
[columns]:[value]<br/>
}</td>
      <td>Jobs that meet the conditions.</td>
    </tr>
  </tbody>
</table>
</div>
<script>
$(".built-in-functions-wrapper").draggable();
$(".built-in-label").click(function(){
	$(".built-in-functions-wrapper").show();
});
$(".hide-built-in-wrapper").click(function(){
	$(".built-in-functions-wrapper").hide();
});
@if(isset($plugin))
var changePublic = function(){
	$.ajax({
		url:"{{route('admin.plugins.changePublic')}}",
		type:"POST",
		data:{
			_token:"{{csrf_token()}}",
			index:{{$plugin->id}},
		},
		success:function(){
			location.reload();
		},
		error:function(){},
	})
}
@endif
$("#getFromSimPL").click(function(){
	$("#simpl_modal").modal('show');
})

$("#SimPLtoContent").click(function(){
	console.log($("#simpl_repo_id").val());
	$.ajax({
		"url":"http://simpl.vfab.org/api/plugin/run",
		"type":"post",
		"data":{
			"input":{
				"id":$("#simpl_repo_id").val(),
				"type":"Plugin"
			},
			"alias":"ret_simpl_content",
		},
		"success":function(ret){
		  	scriptEditor.setValue(ret.output);			
		}
	})
	$("#simpl_modal").modal('hide');
});

</script>
@stop
