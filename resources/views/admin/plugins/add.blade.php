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
.CodeMirror-fullscreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9;
}
</style>
<h2>Plugins</h2>

<div class=row>
	<div class='col-md-2'></div>
	<div class='col-md-8'>
	<form method=post action="{{ route('admin.plugins.store') }}">
		<input type=hidden name=pluginId value="{{ $plugin->id or -1 }}">
		{{ csrf_field() }}
		<!-- URL  -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Name</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=name value="{{ $plugin->name or old('name')}}">
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{{ $plugin->alias or old('alias')}}">
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Role</label>
			<div class=col-sm-9>
				<select name=role class='form-control'>
					<option value=calculator>Calculator</option>
					<option value=middleware>Middleware</option>
				</select>
			</div>
		</div>

		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Type</label>
			<div class=col-sm-9>
				<select name=type class='form-control'>
				<!--	<option value=php>PHP</option>-->
					<option value=python>Python</option>
				</select>
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Required Qualification</label>
			<div class=col-sm-9>
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
			<label class='col-sm-3 col-form-label'>Input(for test)</label>
			<div class=col-sm-9>
				<textarea style='height:150px;overflow-y:auto;' class='form-control inputdata' name="inputdata" placeholder="Standard JSON format is supported">{!! old('inputdata') !!}</textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
			</div>
		</div>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Includes</label>
			<div class=col-sm-9>
				<textarea class='form-control' name='includes' id=includes>{{ $plugin->includes or old('includes')}}</textarea>
			</div>
		</div>

		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Script</label>
			<div class=col-sm-9>
				<textarea style='height:450px;overflow-y:auto;' class='form-control script' name=script>{!! $plugin->script or old('script') !!}</textarea>
<!--				<div style='height:350px;overflow-y:auto;' class='form-control scriptDiv' contenteditable>{!! isset($plugin->script)?nl2br($plugin->script):"" !!}</div>
			</div>
				<input type=hidden name=script class=script>-->
				<label style="font-size:12px">FullScreen Mode: Ctrl+Enter</label>
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12 style='text-align:right;'>
			<button type="button" id=getFromSimPL class="btn btn-info">Get SimPL</button>
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
			<div class=col-sm-12 style='text-align:right;'>
				<label class='col-sm-3 col-form-label'>Test Result</label>
				<div class='col-sm-9'>
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
<script>
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
