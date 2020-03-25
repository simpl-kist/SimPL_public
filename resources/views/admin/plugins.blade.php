@extends('admin.layout')
@section('content')
<style>
	.simpl-listbar{
		width:250px;
		height:100%;
		float:left;
		overflow-y:auto;
		position:relative;
	}
	.simpl-dragbar{
		background-color:black;
		width:10px;
		height:100%;
		float:left;
		cursor:col-resize;
	}
	.simpl-contentbar{
		width:calc(100% - 260px);
		height:100%;
		float:left;
		overflow-y:auto;
	}
	.CodeMirror{
		height:auto !important;
	}
	.simpl-plugin-label{
		width:180px;
	}
	.simpl-plugin-list{
		padding:5px;
		margin:2px;
		background-color:#ECECEC;
		cursor:pointer;
		position:relative;
	}
	.simpl-plugin-folder-list{
		padding:5px;
		margin:2px;
		background-color:#DCDCDC;
		cursor:pointer;
		position:relative;
	}
	.simpl-plugin-list:hover, .simpl-plugin-folder-list:hover{
		background-color:black;
		color:white;
	}
	.simpl-plugin-list.active{
		background-color:black;
		color:white;
	}
	.simpl-plugin-list-new{
		display:inline-block;
		position:absolute;
		left:0;
		right:0;
		top:0;
		bottom:0;
		margin:auto;
		height:fit-content;
		width:fit-content;
	}
	.simpl-plugin-table th, .simpl-plugin-table td{
		vertical-align:middle;
	}
	.built-in-functions-wrapper{
		position:absolute;
		bottom:4px;
		width:100%;
		z-index:1;
		transition:0.5s;
		height:40px;
		background-color:white;
	}
	.built-in-functions{
		display:none;
	}
	.built-in-functions-text{
		position:relative;
		color:white;
		background-color:#888888;
		height:40px;
		cursor:pointer;
		margin:2px;
	}
	.built-in-functions-text:hover{
		background-color:black;
	}
	.built-in-functions-wrapper .fa-caret-up{
		vertical-align:middle;
		font-size:20px;
		margin-right:3px;
		display:inline-block;
	}
	.built-in-functions-wrapper .fa-caret-down{
		vertical-align:middle;
		font-size:20px;
		margin-right:3px;
		display:none;
	}
	.built-in-text{
		position:absolute;
		width:fit-content;
		height:fit-content;
		top:0;
		left:0;
		right:0;
		bottom:0;
		margin:auto;
	}
	.built-in-functions-wrapper.active{
		height:calc(100% - 4px);
	}
	.built-in-functions-wrapper.active .fa-caret-up{
		display:none;		
	}
	.built-in-functions-wrapper.active .fa-caret-down{
		display:inline-block;
	}
	.built-in-functions-wrapper.active .built-in-functions{
		display:block;
	}
	.simpl-plugins-built-in-text{
		padding:5px;
		margin:2px;
		background-color:#ECECEC;
		cursor:pointer;
		position:relative;
	}
	.simpl-plugins-built-in-text:hover{
		background-color:black;
		color:white;
	}
	.simpl-plugins-built-in-list.active .simpl-plugins-built-in-text{
		background-color:black;
		color:white;
	}
	.simpl-plugins-built-in-label{
		margin-top:0.5rem;
		margin-bottom:0.25rem;
		font-weight:bold;
	}
 	.simpl-plugins-built-in-list .simpl-plugins-built-in-description{
		display:none;
	}
 	.simpl-plugins-built-in-list .simpl-plugins-built-in-input{
		display:none;
	}
 	.simpl-plugins-built-in-list .simpl-plugins-built-in-output{
		display:none;
	}
 	.simpl-plugins-built-in-list.active .simpl-plugins-built-in-description{
		display:block;
	}
 	.simpl-plugins-built-in-list.active .simpl-plugins-built-in-input{
		display:block;
	}
 	.simpl-plugins-built-in-list.active .simpl-plugins-built-in-output{
		display:block;
	}

</style>
<script src='/assets/codemirror/lib/codemirror.js'></script>
<script src='/assets/codemirror/mode/python/python.js'></script>
<link href='/assets/codemirror/lib/codemirror.css' rel=stylesheet></script>

<link href='/assets/codemirror/theme/theme.css' rel=stylesheet></script>
<div style="height:calc(100vh - 70px);">
	<div class="simpl-listbar">
	</div>
	<div class="simpl-dragbar">

	</div>
	<div class="simpl-contentbar">
		<table class="table simpl-plugin-table">
			<tbody>
				<tr>
					<th class="simpl-plugin-label">Name</th>
					<td colspan=3>
						<div class="input-group">
							<input class="form-control plugin_name">
							<div class="input-group-append">
								<button title="Ctrl + S" class="btn btn-outline-primary save_btn" onclick="savePlugin();">SAVE</button>
								<button class="btn btn-outline-danger delete_btn" style="display:none;" onclick="deletePlugin();">DELETE</button>
								<button title="Ctrl + E" class="btn btn-outline-secondary test_btn" onclick="testPlugin();">TEST</button>
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<th class="simpl-plugin-label">Alias</th>
					<td colspan=3><input class="form-control plugin_alias"></td>
				</tr>
				<tr>
					<th class="simpl-plugin-label">Includes</th>
					<td colspan=3><input class="form-control plugin_includes"></td>
				</tr>
				<tr>
					<th class="simpl-plugin-label">Type</th>
					<td>
						<select class="form-control plugin_type">
							<option value="python2">Python2</option>
							<option value="python3" selected>Python3</option>
						</select>
					</td>
					<th class="simpl-plugin-label">Required Qualification</th>
					<td>
						<select class="form-control plugin_required">
							<option value=0>Public</option>
							<option value=1>Anonymous</option>
							<option value=2>User</option>
							<option value=3>Editor</option>
							<option value=4>Admin</option>
						</select>
					</td>
				</tr>
			</tbody>
		</table>
		<textarea class="form-control plugin_script">&#13;&#13;&#13;&#13;&#13;&#13;&#13;&#13;&#13;</textarea>
	</div>
</div>
<div class="modal fade" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document" style="max-width:900px;width:900px;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Plugin Test</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-6">
						<h5>TEST Input</h5>
						<textarea class="form-control testinput" style="height:100%;resize:vertical;height:500px;"></textarea>
					</div>
					<div class="col-6">
						<h5>TEST Output</h5>
						<textarea class="form-control" id="test-result-stdout" style="height:100%;resize:vertical;height:245px;"></textarea>
						<h5>TEST Error</h5>
						<textarea class="form-control" id="test-result-stderr" style="height:100%;resize:vertical;height:245px;"></textarea>

					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onclick="runTest();">Run</button>
			</div>
		</div>
	</div>
</div>

<script>
	var scriptEditor;
	$('document').ready(function(){
		scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('plugin_script')[0],{
			mode:"python",
			theme:"material",
			lineNumbers:true,
			lineWrapping:true
		});
		getPluginList();
	});
	var filelist = [];
	var dragging=false;
	var pluginNow=-1;
	var ctrlpressed=false;
	$(window).keydown(function(e){
		if(e.keyCode === 17){
			ctrlpressed = true;
		}else if(e.keyCode === 83){
			if(ctrlpressed){
				savePlugin();
				ctrlpressed = false;
				e.preventDefault();
			}
		}else if(e.keyCode === 69){
			if(ctrlpressed){
				testPlugin();
				ctrlpressed = false;
				e.preventDefault();
			}
		}
	});
	$(window).keyup(function(e){
		if(e.keyCode === 17){
			ctrlpressed=false;
		}
	});
	var folder = "/";
	$(".simpl-dragbar").mousedown(function(e){
		dragging=true;
	});
	$(".simpl-dragbar").mouseup(function(e){
		dragging=false;
	});
	$(window).mousemove(function(e){
		if(dragging){
			$(".simpl-listbar").css("width",e.pageX+"px");
			$(".simpl-contentbar").css("width","calc(100% - "+(e.pageX+10)+"px)");
		}
	});
	function getPluginList(){
		$.ajax({
			url:"/admin/plugins/list",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}"
			},
			success:function(ret){
				filelist = ret;
				drawPluginList();
			}
		});
	}
	function getFiles(){
		var ret = {"file":[],"folder":[]};
		var _folder = folder.slice(1);
		if(_folder === ""){
			for(var i=0 ; i<filelist.length ; i++){
				if(filelist[i]["name"].indexOf("/")<=0){
					ret["file"].push(filelist[i]);
				}else{
					var _f = filelist[i]["name"].split("/")[0];
					if(ret["folder"].indexOf(_f)<0){
						ret["folder"].push(_f);
					}
				}
			}
		}else{
			ret["folder"].push(".")
			ret["folder"].push("..")
			for(var i=0 ; i<filelist.length ; i++){
				if(filelist[i]["name"].indexOf(_folder)===0){
					var _tf = objClone(filelist[i]);
					_tf["name"]=_tf["name"].replace(_folder,"");
					if(_tf["name"].indexOf("/")<=0){
						ret["file"].push(_tf);
					}else{
						var _f = _tf["name"].split("/")[0];
						if(ret["folder"].indexOf(_f)<0){
							ret["folder"].push(_f);
						}
					}
				}
			}
		}
		return ret;
	}
	function drawPluginList(){
		var target = $(".simpl-listbar");
		var ih = "<div class='built-in-functions-wrapper'><div class='built-in-functions-text'><span class='built-in-text'><i class='fas fa-caret-up'></i><i class='fas fa-caret-down'></i>Built-in functions</span></div><div class='built-in-functions'>";
        for(var i=0,len=built_in_functions_arr.length;i<len ; i++){
				ih += "<div class='simpl-plugins-built-in-list'>";
				ih += "<div class='simpl-plugins-built-in-text'>"+built_in_functions_arr[i].name+"</div>";
				ih += "<div class='simpl-plugins-built-in-description'><label class='simpl-plugins-built-in-label'>Description</label><br/>"+built_in_functions_arr[i].description+"</div>";
				ih += "<div class='simpl-plugins-built-in-input'><label class='simpl-plugins-built-in-label'>Input</label><br/>"+built_in_functions_arr[i].input+"</div>";
				ih += "<div class='simpl-plugins-built-in-output'><label class='simpl-plugins-built-in-label'>Output</label><br/>"+built_in_functions_arr[i].output+"</div>";
				ih += "</div>";
        }
		ih += "</div></div>";
		target.empty();
		var lists = getFiles();
		var files = lists["file"];
		var folders = lists["folder"];
		if(pluginNow === -1){
			ih += "<div class='simpl-plugin-list active' data-idx='-1' style='height:50px;'><span class='simpl-plugin-list-new'>New</span></div>";
		}else{
			ih += "<div class='simpl-plugin-list' data-idx='-1' style='height:50px;'><span class='simpl-plugin-list-new'>New</span></div>";
		}
		ih += "<input class='form-control' value='"+folder+"' readonly>";
		for(var i=0 ; i<folders.length ; i++){
			ih+="<div class='simpl-plugin-folder-list' data-folder='"+folders[i]+"'><i class='far fa-folder-open' style='margin-right:5px;'></i>"+folders[i]+"</div>";
		}
		for(var i=0 ; i<files.length ; i++){
			if(pluginNow === files[i].id){
				ih+="<div class='simpl-plugin-list active' data-idx='"+files[i].id+"'>"+files[i].name+"</div>";
			}else{
				ih+="<div class='simpl-plugin-list' data-idx='"+files[i].id+"'>"+files[i].name+"</div>";
			}
		}
		target.html(ih);
		target.find(".simpl-plugin-folder-list").click(function(){
			var f = $(this).data("folder");
			if(f === "."){
				folder = folder.slice(0,folder.length-1);
				folder = folder.slice(0,folder.lastIndexOf("/")+1)
			}else if(f === ".."){
				folder = "/";
			}else{
				folder = folder + f + "/";
			}
			drawPluginList();
		});
		target.find(".built-in-functions-text").click(function(){
			if($(".built-in-functions-wrapper").hasClass('active')){
				$(".built-in-functions-wrapper").removeClass('active');
			}else{
				$(".built-in-functions-wrapper").addClass('active');
			}
		});
		target.find(".simpl-plugins-built-in-text").click(function(){
			var t=$(this).parent();
			if(t.hasClass('active')){
				t.removeClass('active');
			}else{
				t.addClass('active');
			}
		});
		target.find(".simpl-plugin-list").click(function(){
			var idx = $(this).data('idx');
			pluginNow = idx*1;
			target.find(".simpl-plugin-list").removeClass("active");
			target.find(".simpl-plugin-list[data-idx='"+idx+"']").addClass("active");
			if(idx === -1){
				fillPlugin({
					"name":"",
					"alias":"",
					"type":"python2",
					"required":0,
					"includes":"",
					"script":"\n\n\n\n\n\n\n\n\n",
					"status":"New"
				});
			}else{
				loadPlugin(idx);
			}
		});
	}
	function loadPlugin(idx){
		$.ajax({
			url:"/admin/plugins/load",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":idx	
			},
			success:function(ret){
				fillPlugin({
					"name":ret["message"]["name"],
					"alias":ret["message"]["alias"],
					"type":ret["message"]["type"],
					"includes":ret["message"]["includes"],
					"required":ret["message"]["ispublic"],
					"script":ret["message"]["script"],
					"status":ret["status"]
				});
			}
		});
	}
	function fillPlugin(data){
		for(var prop in data){
			var target = $(".plugin_"+prop);
			switch(prop){
				case "name":
				case "alias":
				case "script":
				case "includes":
					target.val(data[prop]);
					break;
				case "type":
				case "required":
					target.find("option[value="+data[prop]+"]").prop("selected",true);
					break;
			}
			if(prop === "script"){
				scriptEditor.setValue(data[prop]);
				scriptEditor.setSize();
			}
		}
		if(data.status === "Unauthorized"){
			$(".save_btn").hide();
			$(".delete_btn").hide();
		}else{
			$(".save_btn").show();
			if(data.status === "New"){
				$(".delete_btn").hide();
			}else{
				$(".delete_btn").show();
			}
		}
	}
	function savePlugin(){
		var idx= pluginNow;
		var name = $(".plugin_name").val();
		var alias = $(".plugin_alias").val();
		var includes = $(".plugin_includes").val();
		var type = $(".plugin_type").find("option:selected").val();
		var is_public = $(".plugin_required").find("option:selected").val();
		var script = scriptEditor.getValue();
		$.ajax({
			url:"/admin/plugins/save",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":idx,
				"alias":alias,
				"name":name,
				"type":type,
				"is_public":is_public,
				"includes":includes,
				"script":script
			},
			success:function(ret){
				if(ret.status === "Success"){
					alert("Success");
					pluginNow = ret.message;
					getPluginList();
				}else{
					alert(ret.message);
				}
			}
		});
	}
	function deletePlugin(){
		var idx=$(".simpl-plugin-list.active").data('idx');
		$.ajax({
			url:"/admin/plugins/delete",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":idx,
			},
			success:function(ret){
				if(ret.status === "Success"){
					alert("Success");
					$(".simpl-plugin-list[data-idx=-1]").click();
					getPluginList();
				}else{
					alert(ret.message);
				}
			}
		});
	}
	function testPlugin(){
		$(".modal").modal('show');
	}
	function runTest(){
		var includes = $('.plugin_includes').val();
		var type = $(".plugin_type").find("option:selected").val();
		var script = scriptEditor.getValue();
		var testinput = $(".testinput").val().trim();
		if(testinput !== ""){
			try{
				testinput = JSON.stringify(JSON.parse(testinput.replace(/\n/gi,"\\n"))).replace(/\n/gi,"\\n");
			}catch(e){
				alert("Wrong test input");
				return;
			}
		}
		$.ajax({
			type:"post",
			dataType:"json",
			url:"/admin/plugins/test",
			async:true,
			data:{
				"_token":"{{csrf_token()}}",
				"istest":true,
				"testinput":testinput,
				"includes":includes,
				"type":type,
				"script":script
			},
			success:function(data){
				$('#test-result-stdout').val(data['output']);
				$('#test-result-stderr').val(data['error']);
			},
		});
	}
	var built_in_functions_arr = [{
		'name': 'file_get_contents',
		'description': 'Read File data',
		'input': 'filename, use_include_path = 0, context = None, offset = -1, maxlen = -1',
		'output': 'File Context',
	}, {
		'name': 'getSolver',
		'description': 'Import registered Solver information for using.',
		'input': 'solvername',
		'output': 'Sover Information',
	}, {
		'name': 'qsub',
		'description': 'Submit the job to the scheduler.',
		'input': 'params={<br/>mpi : True|False,<br/>solverExec : [execution command for solver],<br/># ppn : processors per node,<br/>#  nnodes : number of nodes<br/>}',
		'output': 'Queue ID',
	}, {
		'name': 'qstat',
		'description': 'Check the status of jobs in the scheduler.',
		'input': 'id=-1',
		'output': 'Status of the job in Scheduler',
	}, {
		'name': 'callPlugin',
		'description': 'Call another plugin.',
		'input': 'Plugin Alias, Input Data',
		'output': 'Output of the called Plugin',
	}, {
		'name': 'getMyInfo',
		'description': 'Load the information of the user who called the plugin ',
		'input': '-',
		'output': 'User information',
	}, {
		'name': 'getRepo',
		'description': 'Read the file in the Repository for Server.',
		'input': 'Alias of file in Repository for server',
		'output': 'File Contents',
	}, {
		'name': 'saveJob',
		'description': 'Save Data to DB.',
		'input': 'args={<br/>qinfo:[value],<br/>status:[value],<br/>pluginId:[value],<br/>jobBefore:[value],<br/>jobNext:[value],<br/>input:[value],<br/>output:[value],<br/>name:[value],<br/>jobdir:[value]<br/>}',
		'output': 'DB id of Job',
	}, {
		'name': 'getJobs',
		'description': 'Load Saved Job Data from DB.',
		'input': 'args={<br/>"cols":[column list you want to get],<br/>"order": [key, ("asc" or "desc"),<br/>"limit": ["offset", "limit"],<br/>"criteria": ["array of criteria(Raw Where Query)"],<br/>[columns]: [value]<br/>}',
		'output': 'Jobs that meet the conditions.',
	}];
</script>
@endsection
