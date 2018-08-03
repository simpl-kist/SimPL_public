@extends('admin.master')
@section('title')
Edit Page
@stop
@section('content')
<script src={{asset('assets/vendor/codemirror/lib/')}}/codemirror.js></script>
<script src={{asset('assets/vendor/codemirror/lib/')}}/formatting.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/html-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/javascript-hint.js></script>
<script src={{asset('assets/vendor/codemirror/addon/hint/')}}/xml-hint.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/javascript/javascript.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/xml/xml.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/css/css.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/htmlmixed/htmlmixed.js></script>
<script src={{asset('assets/vendor/codemirror/mode/')}}/python/python.js></script>
<script src={{asset('js/fullscreen.js')}}></script>
<script src=https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js></script>
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<style>
	.vls_prop_wrapper{
		display:none;
	}

	.fc_property_wrapper{
		display:none;
	}

	.simpl_btn, .simpl_btn:hover{
		padding:0 10px;
		border:solid 1px #ddd9d8;
		background-color:#ffffff;
		border-radius:7.5px;
	}
	.simpl_btn:focus{
		outline:none;
		box-shadow: 0 0 10px 2px rgba(200, 200, 200, 1);
	}

	.selected_view{
		background-color:black !important;
		color:white !important;
	}

	.simpl_btn_danger, .simpl_btn_danger:hover, .simpl_btn_danger:focus{
		padding:0 10px;
		color:#fafafa;
		border:solid 1px #ddd9d8;
		background-color:#d70f2b;
		border-radius:7.5px;
	}
	.editor_main div, .editor_main canvas{
		padding : 1px;
		border:2px solid red;
		min-height:15px;
	}
  .clicked_element{
    border: 2px solid blue !important; 
  }
	
.CodeMirror-fullscreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9;
}
.modal_prop_label{
	width:90px;
}
.editor_main_wrapper{
	min-height:500px;
	padding:10px;
	border:solid 1px #dedede;
	background-color:white;
	margin-left:-10px;
	margin-right:-10px;
	margin-bottom:-10px;
	border-bottom-left-radius:10px;
	border-bottom-right-radius:10px;
}
.style_new_wrapper{
	width:300px;
	text-align:center;
	display:none;
	position:absolute;
	padding:10px 25px;
	border-radius:10px;
	background-color:white;
	box-shadow: 0 0 10px 2px rgba(200, 200, 200, 1);
}

	.simpl_wysiwyg_input{
		height:23px;
		margin-bottom:2px;
	}
	.simpl_wysiwyg_color{
		height:20px;
		width:20px;
		margin-bottom:2px;
	}
.CodeMirror{
	height:450px;
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
</style>
<link href={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.css rel=stylesheet></script>
<script>
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('contents_wrapper')[0],{
		mode : "htmlmixed",
		lineWrapping:true,
		extraKeys: {
			"Alt-Space": "autocomplete",
			"Ctrl-Enter": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		},
		lineNumbers:true,
	});
	$("input[name=alias]").off();
	$("input[name=alias]").change(function(){
		let forbid=['login','logout','verification','verifyemail','repo','server','simulation','utils','preset','defaultPic','deleteMe','updateMe','admin','repos','userpic'];
		let alias=$(this).val();
		if(forbid.indexOf(alias)>=0){
			alert("You cannot use "+alias+" as alias.");
			$(this).val("");
		}
	})
	$(".fc_helper_select[data-type=trigger]").change();
	$(".fc_helper_select[data-type=func]").change();
	$(".vls_func_select").change();
});
</script>
<?php
	if(!isset($page)){
		$page=new \stdClass;
		$page->title="";
		$page->alias="";
		$page->ispublic=0;
		$page->contents="";
	}
?>
<h2>Pages</h2>
<div class=row>
	<div class='col-md-12'>
	<form method=post action="{{ route('admin.pages.add') }}">
		{{ csrf_field() }}
		<!-- URL  -->
		<input type=hidden name=pageId value={!! $page->id or -1 !!}>
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Title</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=title value="{!! old('title')!==NULL ? old('title') : $page->title !!}">
			</div>
		</div>
		<!-- Service Title -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Alias</label>
			<div class=col-sm-9>
				<input type=text class='form-control' name=alias value="{!! $page->alias !!}">
			</div>
		</div>
		<!-- Service Alias -->
		<div class='form-group row'>
			<label class='col-sm-3 col-form-label'>Required Qualification</label>
			<div class=col-sm-9>
				<select name=require class=form-control>
					<option value=0 {{ $page->ispublic==0 ? "selected" : "" }}>Public</option>
					<option value=1 {{ $page->ispublic==1 ? "selected" : "" }} >Anonymous</option>
					<option value=2 {{ $page->ispublic==2 ? "selected" : "" }} >User</option>
					<option value=3 {{ $page->ispublic==3 ? "selected" : "" }} >Editor</option>
					<option value=4 {{ $page->ispublic==4 ? "selected" : "" }} >Admin</option>
				</select>
			</div>
		</div>
		<div class='form-group row'>
			<div class=col-sm-12>
				<button class='simpl_btn selected_view edit_type' data-type="script" onclick='open_content("script");' type=button>Script</button>
				<button class='simpl_btn edit_type' data-type="editor" onclick='open_content("editor");' type=button>Editor</button>
			</div>
			<div class='col-sm-12 page_editor page_tab' style="display:none;">
				<div style="border:solid 1px #a9a9a9;border-radius:10px;padding:10px;background-color:#f5f5f5">
				<div class="form-inline simpl_wysiwyg_tooltip">
					<button class="simpl_btn add_dom_element" value="div" type="button">Div</button>
					<button class="simpl_btn add_dom_element" value="label" type="button">Label</button>
					<button class="simpl_btn add_dom_element" value="a" type="button">a link</button>
					<button class="simpl_btn add_dom_element" value="button" type="button">Button</button>
					<button class="simpl_btn add_dom_element" value="select" type="button">Select</button>
					<button class="simpl_btn add_dom_element" value="input" type="button">Input</button>
					<button class="simpl_btn add_dom_element" value="textarea" type="button">TextArea</button>
					<button class="simpl_btn add_dom_element" value="br" type="button">Br</button>
					<button class="simpl_btn add_dom_element" value="span" type="button">Text</button>
					<button class="simpl_btn add_dom_element" value="img" type="button">Img</button>
					<button class="simpl_btn add_dom_element" value="ul" type="button">List</button>
					<button class="simpl_btn add_dom_element" value="canvas" type="button">Canvas</button>
					<button class="simpl_btn add_dom_element" value="table" type="button">Table</button>
					<button class="simpl_btn remove_dom_element simpl_btn_danger" value="backspace" type="button">BackSpace</button>
					<button class="simpl_btn remove_dom_element simpl_btn_danger" value="remove" type="button">Remove</button>
					<button class="simpl_btn remove_dom_element simpl_btn_danger" value="delete" type="button">Delete</button>
					<button class="simpl_btn remove_dom_element simpl_btn_danger" value="empty" type="button">Empty</button>
					<br>
					<button class="simpl_btn add_dom_element" value="page" type="button" style="background-color:#F27221;color:white;">Page</button>
					<button class="simpl_btn add_dom_element" value="vlatoms" type="button" style="background-color:#F27221;color:white;">Visualizer</button>
					<button class="simpl_btn edit_properties" type="button" style="background-color:#449B37;color:white;">Properties</button>					
					<button class="simpl_btn move_dom_element" onclick="javascript:dom_move('back');" value="backward" type="button" style="background-color:#1D97DA;color:white;">Backward</button>
					<button class="simpl_btn move_dom_element" onclick="javascript:dom_move('front');" value="forward" type="button" style="background-color:#1D97DA;color:white;">Forward</button>
					<br>
					<label>Num :</label> <input class="form-control simpl_wysiwyg_input" id="divide_num" style="width:75px;">
					<button class="simpl_btn divide_div" type="button">Divide</button>
					<button class="simpl_btn align_dom_element" value="left" type="button" style="background-color:#ab12ab;color:white;">Left</button>
					<button class="simpl_btn align_dom_element" value="center" type="button" style="background-color:#ab12ab;color:white;">Center</button>
					<button class="simpl_btn align_dom_element" value="right" type="button" style="background-color:#ab12ab;color:white;">Right</button>
					<button class="simpl_btn align_dom_element" value="top" type="button">Top</button>
					<button class="simpl_btn align_dom_element" value="middle" type="button">Middle</button>
					<button class="simpl_btn align_dom_element" value="bottom" type="button">Bottom</button>
					<br>
					<label>Background-color : </label>
					<input type="color" class="form-control style_dom_element simpl_wysiwyg_color" data-css="background-color" style="width:30px;height:30px;padding:0">
					<label>Width : </label>
					<input class="form-control style_dom_element simpl_wysiwyg_input" data-css="width" style="width:70px;">
					<label>Height : </label>
					<input class="form-control style_dom_element simpl_wysiwyg_input" data-css="height" style="width:70px;">
					<label>Font-color : </label>
					<input type="color" class="form-control style_dom_element simpl_wysiwyg_color" data-css="color" style="width:30px;height:30px;padding:0">
					<label>Font-size : </label>
					<input class="form-control style_dom_element simpl_wysiwyg_input" data-css="font-size" style="width:70px;">
					<button class="simpl_btn style_label" type=button data-type=padding><i class="glyphicon glyphicon-align-justify" style="margin-right:2px;"></i>Padding</button>
					<button class="simpl_btn style_label" type=button data-type=margin><i class="glyphicon glyphicon-align-justify" style="margin-right:2px;"></i>Margin</button>
					<button class="simpl_btn style_label" type=button data-type=border><i class="glyphicon glyphicon-align-justify" style="margin-right:2px;"></i>Border</button>
				</div>
<?php
	$header=App\CmsEnvModel::where('var_key','header')->first();
	$footer=App\CmsEnvModel::where('var_key','footer')->first();

	if($header!==null){
		$header=$header->var_value;
		$in_style=false;
		$swi=false;
		for($i=0,$len=strlen($header); $i<$len ; $i++){
			if($swi){
				if($header[$i]!==" " && $header[$i]!=="\n" && $header[$i]!=="<"){
					$newheader=substr($header,0,$i).".editor_main ".substr($header,$i,strlen($header)-$i);
					$header=$newheader;
					$swi=false;
				}
			}
			if($header[$i]==="<"){
				$swi=false;
			}
			if($header[$i]==="}"){
				$swi=true;
			}
			if($header[$i]===">" && substr($header,$i-6,7)==="<style>"){
					$swi=true;
			}
			$len=strlen($header);
		}
	}
	if($footer!==null){
		$footer=$footer->var_value;
		$in_style=false;
		$swi=false;
		for($i=0,$len=strlen($footer); $i<$len ; $i++){
			if($swi){
				if($footer[$i]!==" " && $footer[$i]!=="\n" && $footer[$i]!=="<"){
					$newheader=substr($footer,0,$i).".editor_main ".substr($footer,$i,strlen($footer)-$i);
					$footer=$newheader;
					$swi=false;
				}
			}
			if($footer[$i]==="<"){
				$swi=false;
			}
			if($footer[$i]==="}"){
				$swi=true;
			}
			if($footer[$i]===">" && substr($footer,$i-6,7)==="<style>"){
					$swi=true;
			}
			$len=strlen($footer);
		}
	}
?>
<div class="editor_main_wrapper">
{!! $header !!}
				<div class="editor_main">

				</div>
{!! $footer !!}
</div>
				</div>
			</div>
			<div class='col-sm-12 page_script page_tab'>
				<button class="simpl_btn" type=button style="background-color:#b85c5c;color:white;" onclick="$('#function_helper_modal').modal('show');">Function Helper</button>
				<button class="simpl_btn" type=button style="background-color:#113567;color:white;" onclick="$('#visualizer_helper_modal').modal('show');">Visualizer Helper</button>
				<button class="simpl_btn" type=button style="background-color:#116735;color:white;" onclick="clear_script();">Clear Script</button>
				<textarea class='form-control contents_wrapper' name=contents>{{ old('contents')!==NULL ? old('contents') : $page->contents }}</textarea>
				<label style="font-size:12px;float:left">FullScreen Mode: Ctrl+Enter</label>
			</div>
		</div>
		<div class='form-group row'>
			<div class="col-sm-12 form-inline" style='text-align:right;'>
				<button type="button" id=getFromSimPL class="btn btn-simpl">Get SimPL</button>
@if(isset($page->id))
				<button type="button" id="open_page" class="btn btn-primary" onclick="window.open('{{url($page->alias)}}')">Open</button>
@endif
				<button onclick='javascript:save_script();' type="submit" class="btn btn-primary">Apply</button>
			</div>
		</div>
	</form>
	</div>
</div>
<div class="padding_wrapper style_new_wrapper form-inline">
	<div style="overflow:hidden;">
		<label>Padding</label>
		<i class="glyphicon glyphicon-remove hide_style_new_wrapper" style="float:right;"></i>
	</div>
	<div class=row>
		<label class=col-md-3>Top</label>
		<label class=col-md-3>Right</label>
		<label class=col-md-3>Bottom</label>
		<label class=col-md-3>Left</label>
	</div>
	<div class=row>
		<input class="col-md-3 form-control style_dom_element" data-css="padding-top" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="padding-right" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="padding-bottom" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="padding-left" style="width:70px;">
	</div>
</div>
<div class="margin_wrapper style_new_wrapper form-inline">
	<div style="overflow:hidden;">
		<label>Margin</label>
		<i class="glyphicon glyphicon-remove hide_style_new_wrapper" style="float:right;"></i>
	</div>
	<div class=row>
		<label class=col-md-3>Top</label>
		<label class=col-md-3>Right</label>
		<label class=col-md-3>Bottom</label>
		<label class=col-md-3>Left</label>
	</div>
	<div class=row>
		<input class="col-md-3 form-control style_dom_element" data-css="margin-top" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="margin-right" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="margin-bottom" style="width:70px;">
		<input class="col-md-3 form-control style_dom_element" data-css="margin-left" style="width:70px;">
	</div>
</div>
<div class="border_wrapper style_new_wrapper form-inline">
	<div style="overflow:hidden;">
		<label>Border</label>
		<i class="glyphicon glyphicon-remove hide_style_new_wrapper" style="float:right;"></i>
	</div>
	<div class=row>
		<div class=col-md-3 style="padding:0px;">
			<input class="border_checkbox" data-direction="top" type=checkbox checked><label>Top</label>
		</div>
		<div class=col-md-3 style="padding:0px;">
			<input class="border_checkbox" data-direction="right" type=checkbox checked><label>Right</label>
		</div>
		<div class=col-md-3 style="padding:0px;">
			<input class="border_checkbox" data-direction="bottom" type=checkbox checked><label>Bottom</label>
		</div>
		<div class=col-md-3 style="padding:0px;">
			<input class="border_checkbox" data-direction="left" type=checkbox checked><label>Left</label>
		</div>
	</div>
	<div class=row>
		<label class=col-md-4>Width</label>
		<label class=col-md-4>Color</label>
		<label class=col-md-4>Style</label>
	</div>
	<div class=row>
		<div class="col-md-4">
			<input class="form-control style_dom_element" data-css="border" data-type=width style="width:70px;">
		</div>
		<div class=col-md-4>
			<input type="color" class="form-control style_dom_element" data-css="border" data-type=color style="width:30px;height:30px;padding:0">
		</div>
		<div class=col-md-4>
			<select class="form-control style_dom_element" data-css="border" data-type="style" style="padding:5px 5px;">
				<option value="none">None</option>
				<option value="solid">Solid</option>
				<option value="dotted">Dotted</option>
				<option value="double">Double</option>
				<option value="groove">Groove</option>
				<option value="ridge">Ridge</option>
				<option value="inset">Inset</option>
				<option value="outset">Outset</option>
			</select>
		</div>
	</div>
</div>
<div class="modal" role="dialog" tabindex="-1" id="properties_modal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<label>Properties</label>
				<button aria-label="Close" class="close" data-dismiss="modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<p>Modal body text goes here.</p>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" id="change_properties" type="button">Save changes</button>
				<button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
			</div>
		</div>
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
<div class="modal" role="dialog" tabindex="-1" id="visualizer_helper_modal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<label>SimPL Page Repository</label>
				<button aria-label="Close" class="close" data-dismiss="modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body form-inline">
				<div>
					<label style="width:120px;">Function</label>
					<select class="form-control vls_func_select">
						<option value=get_str_data>Structure Data-Get</option>
						<option value=set_str_data>Structure Data-Set</option>
						<option value=get_atoms>Atoms-Get</option>
						<option value=add_atoms>Atoms-Add</option>
						<option value=remove_atoms>Atoms-Remove</option>
						<option value=get_element_list>Atoms-Element List</option>
						<option value=inside_test>Atoms-to Inside</option>
						<option value=str_to_cif>Structure-to CIF</option>
						<option value=str_to_poscar>Structure-to Poscar</option>
						<option value=cif_to_str>Structure-from CIF</option>
						<option value=poscar_to_str>Structure-from Poscar</option>
						<option value=xyz_to_str>Structure-from XYZ</option>
						<option value=readfiles>Structure-ReadFiles</option>
						<option value=get_volume>Cell-Get Volumn</option>
						<option value=update_cam>Camera-Optimal Position</option>
						<option value=update_atoms>Draw-Atoms</option>
						<option value=update_bonds>Draw-Bonds</option>
					</select>
				</div>
				<div class=vls_prop_wrapper data-type=vls>
					<label style="width:120px;">Target Visualizer</label>
					<input class="form-control vls_prop_input" data-type=vls>
				</div>
				<div class=vls_prop_wrapper data-type=idx>
					<label style="width:120px;">Index</label>
					<input class="form-control vls_prop_input" data-type=idx>
				</div>
				<div class=vls_prop_wrapper data-type=variable>
					<label style="width:120px;">Variable</label>
					<input class="form-control vls_prop_input" data-type=variable>
				</div>
				<div class=vls_prop_wrapper data-type=atom_prop>
					<label style="width:120px;">Property</label>
					<input class="form-control vls_prop_input" data-type=atom_prop style="width:100px;" data-to=x placeholder=x>
					<input class="form-control vls_prop_input" data-type=atom_prop style="width:100px;" data-to=y placeholder=y>
					<input class="form-control vls_prop_input" data-type=atom_prop style="width:100px;" data-to=z placeholder=z>
					<input class="form-control vls_prop_input" data-type=atom_prop style="width:100px;" data-to=element placeholder=Element>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" id="vls_add_btn" type="button">Add Function</button>
				<button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
			</div>
		</div>
	</div>
</div>
<div class="modal" role="dialog" tabindex="-1" id="function_helper_modal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<label>Javascript Function Helper</label>
				<button aria-label="Close" class="close" data-dismiss="modal" type="button">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="form-group form-inline fc_helper_wrapper" data-type="trigger">
					<label style="width:120px;">Trigger</label>
					<select class="form-control fc_helper_select" data-type=trigger>
						<option value=none>None</option>
						<option value=callByName>Call By Name</option>
						<option value=click>Click</option>
						<option value=change>Change</option>
						<option value=documentready>Document Ready</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_trigger_wrapper" data-type=name>
					<label style="width:120px;">Name</label>
					<input class="form-control fc_trigger_input" data-type=name>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_trigger_wrapper" data-type=in>
					<label style="width:120px;">Input Properties</label>
					<input class="form-control fc_trigger_input" data-type=in>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_trigger_wrapper" data-type=target>
					<label style="width:120px;">Target Element</label>
					<select class="form-control fc_trigger_select" data-type=target>
						<option>ID</option>
						<option>Class</option>
						<option>Custom</option>
					</select>
					<input class="form-control fc_trigger_input" data-type=target>
				</div>
				<hr>
				<div class="form-group form-inline fc_helper_wrapper" data-type="func">
					<label style="width:120px;">Function</label>
					<select class="form-control fc_helper_select" data-type=func>
						<option value=call_plugin>Call Plugin</option>
						<option value=append>Append</option>
						<option value=console_log>Console log</option>
						<option value=alert>Alert</option>
						<option value=get_value>Get Value</option>
						<option value=get_selected>Get Selected</option>
						<option value=get_checked>Get Checked</option>
						<option value=get_files>Get Files</option>
						<option value=set_value>Set Value</option>
						<option value=select_option>Select Option</option>
						<option value=check_input>Check Input</option>
						<option value=upload_file>File-Upload</option>
						<option value=download_file>File-Download</option>
						<option value=json_parse>Convert-Str to JSON</option>
						<option value=json_stringify>Convert-JSON to Str</option>
						<option value=make_chart>Chart-Make</option>
						<option value=add_chart_dataset>Chart-Add DataSet</option>
						<option value=add_chart_data>Chart-Add Data</option>
						<option value=remove_chart_data>Chart-Remove Data</option>
						<option value=hide>Hide</option>
						<option value=show>Show</option>
						<option value=none>None</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=target>
					<label style="width:120px;">Target Element</label>
					<select class="form-control fc_property_select" data-type=target>
						<option>ID</option>
						<option>Class</option>
						<option>Custom</option>
					</select>
					<input class="form-control fc_property_input" data-type=target>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=position>
					<label style="width:120px;">Position</label>
					<select class="form-control fc_property_select" data-type=position>
						<option>End</option>
						<option>Beginning</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=append_type>
					<label style="width:120px;">Append Type</label>
					<select class="form-control fc_property_select" data-type=append_type>
						<option>Option</option>
						<option>Table Row</option>
						<option>Custom</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=append_option data-wrapper=append>
					<hr>
					<label style="width:120px;">Text</label>
					<select class="form-control fc_property_select" data-type=append_option data-to=text>
						<option>Variable</option>
						<option>String</option>
					</select>
					<input class="form-control fc_property_input" data-type=append_option data-to=text><br/>
					<label style="width:120px;">Property</label>
					<input class="form-control fc_property_input" data-type=append_option data-to=prop_key placeholder=Key style="width:120px;">
					<select class="form-control fc_property_select" data-type=append_option data-to=property>
						<option>Variable</option>
						<option>String</option>
					</select>
					<input class="form-control fc_property_input" data-type=append_option data-to=prop_val placeholder=Value style="width:120px;"><br/>
					<hr>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=property>
					<label style="width:120px;">Property</label>
					<input class="form-control fc_property_input" data-type=property data-to=prop_key placeholder=Key>
					<input class="form-control fc_property_input" data-type=property data-to=prop_val placeholder=Value>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=append_table_row data-wrapper=append>
					<label style="width:120px;">Append Data</label><br/>
					<div class=fc_table_wrapper>
						<div>
							<label style="width:120px;">Table Cell</label>
							<select class="form-control fc_property_select" data-type=append_table_row>
								<option>Variable</option>
								<option>String</option>
							</select>
							<input class="form-control fc_property_input" data-type=append_table_row>
						</div>
					</div>
					<div style="text-align:center;">
						<i class="glyphicon glyphicon-plus-sign table_cell_add" style="color:#00CC00;cursor:pointer;"></i>
					</div>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=append_custom data-wrapper=append>
					<label style="width:120px;">Append Data</label>
					<input class="form-control fc_property_input" data-type=append_custom><br/>
				</div>
 
				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=repo_type>
					<label style="width:120px;">Repo Type</label>
					<select class="form-control fc_property_select" data-type=repo_type>
						<option value=web>Web</option>
						<option value=server>Server</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=alias>
					<label style="width:120px;">Alias</label>
					<input class="form-control fc_property_input" data-type=alias>
				</div>


				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=data>
					<label style="width:120px;">Data</label>
					<div class=fc_data_wrapper>
						<div>
							<input class="form-control fc_property_input" data-type=data data-to=key placeholder=key>
							<select class="form-control fc_property_select" data-type=data data-to=val_type>
								<option>Variable</option>
								<option>String</option>
							</select>
							<input class="form-control fc_property_input" data-type=data data-to=val>
						</div>
					</div>
					<div style="text-align:center;">
						<i class="glyphicon glyphicon-plus-sign data_value_add" style="color:#00CC00;cursor:pointer;"></i>
					</div>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=value>
					<label style="width:120px;">Value</label>
					<select class="form-control fc_property_select" data-type=value>
						<option>Variable</option>
						<option>String</option>
					</select>
					<input class="form-control fc_property_input" data-type=value>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=variable>
					<label style="width:120px;">Variable</label>
					<input class="form-control fc_property_input" data-type=variable>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=chart_label>
					<label style="width:120px;">Label</label>
					<input class="form-control fc_property_input" data-type=chart_label>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=chart_type>
					<label style="width:120px;">Chart Type</label>
					<select class="form-control fc_property_select" data-type=chart_type>
						<option value=scatter>Line</option>
						<option value=bar>Bar</option>
					</select>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=idx>
					<label style="width:120px;">Dataset Index</label>
					<input class="form-control fc_property_input" data-type=idx>
				</div>

				<div class="form-group form-inline fc_helper_wrapper fc_property_wrapper" data-type=chart_data>
					<label style="width:120px;">Chart Data</label>
					<select class="form-control fc_property_select" data-type=chart_data data-to=x_axis_type>
						<option>Variable</option>
						<option>String</option>
					</select>
					<input class="form-control fc_property_input" data-type=chart_data data-to=x_axis_val placeholder="X value" style="width:100px;">
					<select class="form-control fc_property_select" data-type=chart_data data-to=y_axis_type>
						<option>Variable</option>
						<option>String</option>
					</select>
					<input class="form-control fc_property_input" data-type=chart_data data-to=y_axis_val placeholder="Y value" style="width:100px;">
				</div>

			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" id="add_function" type="button">Add Function</button>
				<button class="btn btn-secondary" data-dismiss="modal" type="button">Close</button>
			</div>
		</div>
	</div>
</div>

<script>
class wysiwyg_info{
	constructor(){
		this.ctrl_pressed=false;
		this.shift_pressed=false;
		this.alt_pressed=false;
		this.type="script";
	}
}
let wysiwyg_data=new wysiwyg_info;
function dom_move(direction){
	let target = $(".clicked_element");
	if(target[0] === undefined){
		return false;
	}
	switch(direction){
		case "back":
			let prev=target.prev();
			if(prev[0]===undefined){
				if(target.parent().hasClass("editor_main")){
					return false;
				}else{
					$(target[0]).insertBefore(target.parent());
				}
			}else{
				if(prev[0].tagName==="DIV"){
					prev.append(target[0])
				}else{
					$(target[0]).insertBefore(prev);
				}
			}
			break;
		case "front":
			let next=target.next();
			if(next[0]===undefined){
				if(target.parent().hasClass("editor_main")){
					return false;
				}else{
					$(target[0]).insertAfter(target.parent());
				}
			}else{
				if(next[0].tagName==="DIV"){
					next.prepend(target[0])					
				}else{
					$(target[0]).insertAfter(next);
				}
			}
			break;
		default:
	}
}
var document_ready=function(script,on){
	if(on){
		script=script.replace(/var simpl_document_temp\=/g,"$(document).ready");
	}else{
		script=script.replace(/\$\(document\).ready/g,"var simpl_document_temp=");
	}
	return script;
}

var clear_script = function(){
	scriptEditor.autoFormatRange({"line":0,"ch":0},{"line":scriptEditor.lineCount()});
}
var save_script = function(){
	let type=$(".selected_view").data('type');
	switch(type){
		case "script":
			break;
		case "editor":
			target=$(".clicked_element");
			if(target.length!==0){
				target.removeClass("clicked_element");
				if(target[0].className===""){
					target.removeAttr("class");
				}
			}
			scriptEditor.setValue(document_ready($(".editor_main").html(),true));
			scriptEditor.save();	
			break;
	}
}
var script_change = function(){
//	$(".clicked_element").removeClass("clicked_element");
	scriptEditor.setValue($(".editor_main").html());
	scriptEditor.save();
}
var open_content = function(type){
	if($(".selected_view").data('type')===type) return;
	$(".selected_view").removeClass("selected_view");
	$(".edit_type[data-type="+type+"]").addClass("selected_view");
	$(".page_tab").hide();
	$(".page_"+type).show();
	if(type==="script"){
		target=$(".clicked_element");
		if(target.length !==0){
			target.removeClass("clicked_element");
			if(target[0].className===""){
				target.removeAttr("class");
			}
		}
		scriptEditor.setValue(document_ready($(".editor_main").html(),true));
		scriptEditor.save();
		wysiwyg_data.type="script";
	}else if(type==="editor"){
		scriptEditor.save();
		$(".contents_wrapper").val(scriptEditor.getValue());
		$(".editor_main").html(document_ready($(".contents_wrapper").val(),false));
		wysiwyg_data.type="editor";
		add_event();
	}
}
$("#getFromSimPL").click(function(){
	$("#simpl_modal").modal('show');
})

$("#SimPLtoContent").click(function(){
	$.ajax({
		"url":"http://simpl.vfab.org/api/plugin/run",
		"type":"post",
		"data":{
			"input":{
				"id":$("#simpl_repo_id").val(),
				"type":"Page"
			},
			"alias":"ret_simpl_content",
		},
		"success":function(ret){
			open_content("script");
		  	scriptEditor.setValue(ret.output);			
		}
	})
	$("#simpl_modal").modal('hide');
});
$(window).keydown(function(e){
	if($(".clicked_element").length===0) return;
	if(wysiwyg_data.type==="script") return;	
	if(e.keyCode==17){
		wysiwyg_data.ctrl_pressed=true;
	}
	if(e.keyCode==86){
		if(wysiwyg_data.ctrl_pressed){
			copy_element();
		}
	}
	if(e.keyCode==46){
		$(".remove_dom_element[value=remove]").click()
	}
});
function copy_element(){
	var target=$(".clicked_element");
	target.removeClass("clicked_element");
	var ih=target[0].outerHTML;
	target.addClass("clicked_element");
	$(ih).insertAfter(".clicked_element");
	add_event();
}
$("body").keyup(function(e){
	if(e.keyCode==17){
		wysiwyg_data.ctrl_pressed=false;
	}
});

$(window).click(function() {
	$(".clicked_element").removeClass("clicked_element");
	$(".style_new_wrapper").hide();
});

$(".style_label").off();
$(".style_label").click(function(e){
	$(".style_new_wrapper").hide();
	let type=$(this).data('type');
	let target=$("."+type+"_wrapper");
	target.css("left",e.pageX);
	target.css("top",e.pageY);
	$("."+type+"_wrapper").show();
	e.stopPropagation();
});
$(".style_new_wrapper").off();
$(".style_new_wrapper").click(function(e){
	e.stopPropagation();
});
$(".hide_style_new_wrapper").off();
$(".hide_style_new_wrapper").click(function(){
	$(this).parents(".style_new_wrapper").hide();
});
function add_event() {
	var a = [$(".editor_main")[0]];
	for (var i = 0; i < a.length; i++) {
  		if (i !== 0) {
  			$(a[i]).off();
  			$(a[i]).click(function(e) {
				let target=$(".clicked_element");
				if(target===$(this)){
					return;
				}
				if(target.hasClass("clicked_element")){
	  				target.removeClass("clicked_element");
					if(target[0].className===""){
						target.removeAttr("class");
					}
				}
  				$(this).addClass("clicked_element");

				target=$(this);
				let bg_color=target.css("background-color").replace(/[rgba() ]/g,"").split(",");
				let bg_color_hex="#";
				for(let j=0 ; j<3 ; j++){
					bg_color[j]=parseInt(bg_color[j]).toString("16");
					if(bg_color[j].length ===1){
						bg_color[j] = "0"+bg_color[j];
					}
					bg_color_hex+=bg_color[j];
				}
				$(".style_dom_element[data-css=background-color]").val(bg_color_hex);

				$(".style_dom_element[data-css=width]").val(target.prop('style').width);
				$(".style_dom_element[data-css=height]").val(target.prop('style').height);

				let f_color=target.css("color").replace(/[rgba() ]/g,"").split(",");
				let f_color_hex="#";
				for(let j=0 ; j<3 ; j++){
					f_color[j]=parseInt(f_color[j]).toString("16");
					if(f_color[j].length ===1){
						f_color[j] = "0"+f_color[j];
					}
					f_color_hex+=f_color[j];
				}
				$(".style_dom_element[data-css=color]").val(f_color_hex);
				$(".style_dom_element[data-css=font-size]").val(target.css("font-size").replace("px",""));

				$(".style_dom_element[data-css=padding-top]").val(target.css("padding-top").replace("px",""));
				$(".style_dom_element[data-css=padding-right]").val(target.css("padding-right").replace("px",""));
				$(".style_dom_element[data-css=padding-bottom]").val(target.css("padding-bottom").replace("px",""));
				$(".style_dom_element[data-css=padding-left]").val(target.css("padding-left").replace("px",""));

				$(".style_dom_element[data-css=margin-top]").val(target.css("margin-top").replace("px",""));
				$(".style_dom_element[data-css=margin-right]").val(target.css("margin-right").replace("px",""));
				$(".style_dom_element[data-css=margin-bottom]").val(target.css("margin-bottom").replace("px",""));
				$(".style_dom_element[data-css=margin-left]").val(target.css("margin-left").replace("px",""));
				$(".style_new_wrapper").hide();
  				e.stopPropagation();
  				e.preventDefault();
				$(".clicked_element").dblclick(function(e){
					$(".edit_properties").click();
				});
  			});
  		}
		if($(a[i]).prop("tagName")!=="TABLE"){
	  		var child = $(a[i]).children();
  			for (var j = 0; j < child.length; j++) {
  				a.push(child[j]);
	  		}
		}
  	}
	script_change();
  }
$(".style_dom_element").off();
$(".style_dom_element").change(function(e){
	e.stopPropagation();
	if($(".clicked_element")[0] === undefined) return;
	switch($(this).data('css')){
		case "height":
			$(".clicked_element").prop('style').height=$(this).val();
			break;
		case "width":
			$(".clicked_element").prop('style').width=$(this).val();
			break;
		case "font-size":
		case "margin-top":
		case "margin-right":
		case "margin-bottom":
		case "margin-left":
		case "padding-top":
		case "padding-right":
		case "padding-bottom":
		case "padding-left":
			$(".clicked_element").css($(this).data('css'),$(this).val()+"px");
			break;
		case "border":
			let checkbox=$(".border_checkbox:checked");
			let element=['width','color','style'];
			let data={};
			data['width']=$(".style_dom_element[data-css=border][data-type=width]").val()+"px";
			data['color']=$(".style_dom_element[data-css=border][data-type=color]").val();
			data['style']=$(".style_dom_element[data-css=border][data-type=style]").val();
			for(let i=0 ; i<checkbox.length ; i++){
				let direction=$(checkbox[i]).data('direction');
				for(let j=0 ; j<element.length  ; j++){
					$(".clicked_element").css("border-"+direction+"-"+element[j],data[element[j]]);
				}
			}			
			break;
		default:
			$(".clicked_element").css($(this).data('css'),$(this).val());		
	}
  	scriptEditor.setValue($(".editor_main").html());
	scriptEditor.autoFormatRange({"line":0,"ch":0},{"line":scriptEditor.lineCount()});
	scriptEditor.save();
	
});


function editProperties(){
  	let target = $(".clicked_element");
  	if (target.length===0) return;
	let tagName=target.prop("tagName");
	let ih="<div class=form-inline>";
	ih+="<div><label class=modal_prop_label>Class</label><input id=modal_class_input class=form-control value='"+target.prop("class").replace("clicked_element","").trim()+"'></div>";
	ih+="<div><label class=modal_prop_label>ID</label><input id=modal_id_input class=form-control value='"+target.prop("id")+"'></div>";
	let data=target.data();
	console.log(data);
	ih+="<div><label class=modal_prop_label>Data</label><br/>"
	for(var i in data){
		ih+="<div class=modal_data_wrapper><label class=modal_prop_label></label><input class='modal_data_key form-control' value='"+i+"'>";
		ih+="<input class='modal_data_val form-control' value='"+data[i]+"'>";
		ih+="<i style='cursor:pointer;color:red;' class='glyphicon glyphicon-minus-sign delete_data_prop'></i></div>";
	}
	ih+="<div style='text-align:center;'>";
	ih+="<i style='cursor:pointer;color:green;' class='glyphicon glyphicon-plus-sign add_data_prop'></i>";
	ih+="</div>";
	ih+="</div>";
	switch(tagName){
		case "INPUT":
			ih+="<div><label class=modal_prop_label>Name</label><input id=modal_input_name class=form-control value='"+target.prop('name')+"'></div>";
			ih+="<div><label class=modal_prop_label>TYPE</label>";
			ih+="<select id=modal_input_type class=form-control>";
			ih+="<option value=text "+(target.prop("type")==="text"?"selected":"")+">TEXT</option>";
			ih+="<option value=radio "+(target.prop("type")==="radio"?"selected":"")+">Radio</option>";
			ih+="<option value=checkbox "+(target.prop("type")==="checkbox"?"selected":"")+">Checkbox</option>";
			ih+="<option value=file "+(target.prop("type")==="file"?"selected":"")+">File</option>";
			ih+="</select></div>";
			ih+="<div id=modal_input_value_wrapper><label class=modal_prop_label>Value</label><input id=modal_input_value class=form-control value='"+target.val()+"'></div>";
			ih+="<div id=modal_input_placeholder_wrapper><label class=modal_prop_label>Placeholder</label><input id=modal_input_placeholder class=form-control value='"+target.prop('placeholder')+"'></div>";
			ih+="<div id=modal_input_checked_wrapper><label class=modal_prop_label>Checked</label><input type=checkbox id=modal_input_checked class=form-control "+(target.prop('checked')?"checked":"")+"></div>";
			break;
		case "DIV":
			ih+="<div><label class=modal_prop_label>HtmlText</label><textarea id=modal_div_html class=form-control style='width:450px;'>"+target.html()+"</textarea></div>";
			break;
		case "A":
			ih+="<div><label class=modal_prop_label>href</label><input id=modal_a_href class=form-control value='"+target.attr("href")+"'></div>";
			ih+="<div><label class=modal_prop_label>Text</label><input id=modal_a_text class=form-control value='"+target.text()+"'></div>";
			break;
		case "LABEL":
			ih+="<div><label class=modal_prop_label>Text</label><input id=modal_label_text class=form-control value='"+target.text()+"'></div>";
			break;
		case "SPAN":
			ih+="<div><label class=modal_prop_label>Text</label><input id=modal_text_text class=form-control value='"+target.text()+"'></div>";
			break;
		case "BUTTON":
			ih+="<div><label class=modal_prop_label>Text</label><input id=modal_button_text class=form-control value='"+target.text()+"'></div>";
			break;
		case "IMG":
			ih+="<div><label class=modal_prop_label>Src</label><input id=modal_img_src class=form-control value='"+target.attr("src")+"'></div>";
			ih+="<div><label class=modal_prop_label>Alt</label><input id=modal_img_alt class=form-control value='"+target.prop("alt")+"'></div>";
			ih+="<div><label class=modal_prop_label>Title</label><input id=modal_img_title class=form-control value='"+target.prop("title")+"'></div>";
			break;
		case "SELECT":
			ih+="<div><label class=modal_prop_label>Size</label><input id=modal_select_size class=form-control value='"+target.prop("size")+"'></div>";
			var options=target.find('option');
	console.log(options);
			ih+="<div><label class=modal_prop_label style='vertical-align:top;'>Options</label><div id=modal_select_options_wrapper style='display:inline-block;'>";
			for(let i=0 ; i<options.length ; i++){
				ih+="<div><input class='form-control modal_select_options_value' value='"+$(options[i]).val()+"'><input class='form-control modal_select_options_text' value='"+$(options[i]).text()+"'><input name=modal_select_option_selected type=radio "+($(options[i]).val()===target.val()?"checked":"")+"><i class='glyphicon glyphicon-minus-sign modal_select_delete_option'></i></div>";
			}
			ih+="<i class='glyphicon glyphicon-plus-sign modal_select_add_option'></i>";
			ih+="</div></div>";
			break;
		case "TEXTAREA":
			ih+="<div><label class=modal_prop_label>Textarea</label><textarea id=modal_textarea_val class=form-control style='width:450px;'>"+target.val()+"</textarea></div>";
			break;
		case "UL":
			var lists=target.find('li');
			ih+="<div><label class=modal_prop_label style='vertical-align:top;'>List</label><div id=modal_ul_lists_wrapper style='display:inline-block;'>";
			for(let i=0 ; i<lists.length ; i++){
				ih+="<div><input class='form-control modal_ul_li' value='"+$(lists[i]).text()+"'><i class='glyphicon glyphicon-minus-sign modal_ul_delete_list'></i></div>";
			}
			ih+="<i class='glyphicon glyphicon-plus-sign modal_ul_add_list'></i>";
			ih+="</div></div>";
			break;
		case "TABLE":
			let element=['THead','TBody','TFoot'];
			let table=[];
			table['THead']=target.find('thead').find('tr');
			table['TBody']=target.find('tbody').find('tr');
			table['TFoot']=target.find('tfoot').find('tr');
			ih+="<div class=modal_table_wrapper>";
			for(let i=0 ; i<element.length ; i++){
				ih+="<div><label class=modal_prop_label style='vertical-align:top;'>"+element[i]+"</label><div id=modal_table_"+element[i].toLowerCase()+"_wrapper style='display:inline-block;max-width:calc(100% - 90px);'>";
				for(var j=0, len=table[element[i]].length; j<len ; j++){
					ih+="<div class=modal_table_tr_wrapper>";
					let td=[];
					if(element[i]==="THead" || element[i]==="TFoot"){
						td=$(table[element[i]][j]).find('th');
					}else{
						td=$(table[element[i]][j]).find('td');
					}
					for(var k=0, len2=td.length ; k<len2 ; k++){
						ih+="<input class='form-control table_data_input' value='"+$(td[k]).text()+"'>";
					}
					ih+="<i class='glyphicon glyphicon-minus-sign modal_table_delete_row'></i>"
					ih+="</div>";
				}
				ih+="<button class='btn btn-primary add_table_row'>Add Row</button></div></div>";
			}
			ih+="</div>";
			ih+="<button class='btn btn-primary add_table_column'>Add Column</button>";
			ih+="<button class='btn btn-danger remove_table_column'>Remove Column</button>";
			break;
	}
	ih+="</div>";
	$("#properties_modal").find(".modal-body").html(ih);
	$(".delete_data_prop").click(function(){
		$(this).parent().remove();	
	});
	$(".add_data_prop").click(function(){
		$("<div class=modal_data_wrapper><label class='modal_prop_label'></label><input class='modal_data_key form-control'><input class='modal_data_val form-control'><i style='color:red;' class='glyphicon glyphicon-minus-sign delete_data_prop'></i></div>").insertBefore($(this).parent());
		$(".delete_data>prop").off();
		$(".delete_data_prop").click(function(){
			$(this).parent().remove();	
		});
	});
	switch(tagName){
		case "INPUT":
			$("#modal_input_type").off();
			$("#modal_input_type").change(function(){
				let type_=$(this).val();
				if(type_==="text"){
					$("#modal_input_placeholder_wrapper").show();
					$("#modal_input_value_wrapper").show();
					$("#modal_input_checked_wrapper").hide();
				}else if(type_==="file"){
					$("#modal_input_value_wrapper").hide();
					$("#modal_input_placeholder_wrapper").hide();
					$("#modal_input_checked_wrapper").show();
				}else{
					$("#modal_input_value_wrapper").show();
					$("#modal_input_placeholder_wrapper").hide();
					$("#modal_input_checked_wrapper").show();
				}
			});
			$("#modal_input_type").change();
			break;
		case "SELECT":
			$(".modal_select_add_option").off();
			$(".modal_select_add_option").click(function(){
				$("<div><input class='form-control modal_select_options_value'><input class='form-control modal_select_options_text'><input name=modal_select_option_selected type=radio><i class='glyphicon glyphicon-minus-sign modal_select_delete_option'></i></div>").insertBefore($(this));
			});
			$(".modal_select_delete_option").off();
			$(".modal_select_delete_option").click(function(){
				$(this).parent().remove();
			});
			break;
		case "UL":
			$(".modal_ul_add_list").off();
			$(".modal_ul_add_list").click(function(){
				$("<div><input class='form-control modal_ul_li'><i class='glyphicon glyphicon-minus-sign modal_ul_delete_list'></i></div>").insertBefore($(this));
			});
			$(".modal_ul_delete_list").off();
			$(".modal_ul_delete_list").click(function(){
				$(this).parent().remove();
			});
			break;
		case "TABLE":
			$(".modal_table_delete_row").off();
			$(".modal_table_delete_row").click(function(){
				$(this).parent().remove();
			});
			$(".add_table_row").off();
			$(".add_table_row").click(function(){
				let copy_target=$('.modal_table_wrapper').find('.modal_table_tr_wrapper')[0];
				if(copy_target === undefined){

				}else{
					$(copy_target.outerHTML).insertBefore($(this).parent().find('button'));
				}
			});
			$(".add_table_column").off();
			$(".add_table_column").click(function(){
				$("<input class='form-control table_data_input'>").insertBefore($(".modal_table_tr_wrapper").find('i'));
			});
			$(".remove_table_column").off();
			$(".remove_table_column").click(function(){
				let tr=$(".modal_table_tr_wrapper");
				for(let i=0 ; i<tr.length ; i++){
					let td=$(tr[i]).find('.table_data_input');
					$(td[td.length-1]).remove();
				}
			});
			break;
	}
	$("#properties_modal").modal("show");
}
$(".modal").off();
$(".modal").keydown(function(e){
	e.stopPropagation();
});
$(".modal").click(function(e){
	e.stopPropagation();
});

$("#change_properties").off();
$("#change_properties").click(function(){
	let target=$(".clicked_element");
	if($("#modal_class_input").val()!==""){
		target.prop("class","clicked_element "+$("#modal_class_input").val());
	}else{
		target.prop("class","clicked_element");
	}
	if($("#modal_id_input").val()!==""){
		target.prop("id",$("#modal_id_input").val());
	}else{
		target.removeAttr("id");
	}
	let data=$(".modal_data_wrapper");
	console.log(data);
		target.removeData();
	for(var i=0 ; i<data.length ; i++){
		target.data($(data[i]).find(".modal_data_key").val(),$(data[i]).find(".modal_data_val").val());
		target.attr("data-"+$(data[i]).find(".modal_data_key").val(),$(data[i]).find(".modal_data_val").val());
	}
	let tagName=target.prop("tagName");
	switch(tagName){
		case "INPUT":
			target.attr("value",$("#modal_input_value").val());
			target.val($("#modal_input_value").val());
			if($("#modal_input_name").val()!==""){
				target.prop("name",$("#modal_input_name").val());
			}else{
				target.removeAttr("name");
			}

			target.prop("type",$("#modal_input_type").val());
			if($("#modal_input_placeholder").val()!==""){
				target.prop("placeholder",$("#modal_input_placeholder").val());
			}else{
				target.removeAttr("placeholder");
			}

			target.prop("checked",$("#modal_input_checked").prop("checked"));
			target.attr("checked",$("#modal_input_checked").prop("checked"));
			break;
		case "DIV":
			target.html($("#modal_div_html").val());
			break;
		case "A":
			target.attr("href",$("#modal_a_href").val());
			if($("#modal_a_text").val()===""){
				target.text("a");
			}else{
				target.text($("#modal_a_text").val());
			}
			break;
		case "LABEL":
			target.text($("#modal_label_text").val());
			break;
		case "SPAN":
			target.text($("#modal_text_text").val());
			break;
		case "BUTTON":
			target.text($("#modal_button_text").val());
			break;
		case "IMG":
			target.attr("src",$("#modal_img_src").val());
			target.prop("alt",$("#modal_img_alt").val());
			if($("#modal_img_title").val()!==""){
				target.prop("title",$("#modal_img_title").val());
			}else{
				target.removeAttr("title");
			}
			break;
		case "SELECT":
			target.prop("size",$("#modal_select_size").val());
			target.empty();
			var options=$("#modal_select_options_wrapper").children();
			for(let i=0 ; i<options.length-1 ; i++){
				if($(options[i]).find(".modal_select_options_text").val()===""){
				console.log($(options[i]).find(".modal_select_options_text").val())

					continue;
				}
				var __ih="<option ";
				if($(options[i]).find(".modal_select_options_value").val()!==""){
					__ih+="value='"+$(options[i]).find('.modal_select_options_value').val()+"' ";
				}
				__ih+=($(options[i]).find("input[name=modal_select_option_selected]").prop("checked")?"selected":"")+">"+$(options[i]).find('.modal_select_options_text').val()+"</option>"
				target.append(__ih);
			}
			break;
		case "TEXTAREA":
			target.text($("#modal_textarea_val").val());
			break;
		case "UL":
			target.empty();
			let lists=$("#modal_ul_lists_wrapper").children();
			for(let i=0 ; i<lists.length - 1 ; i++){
				target.append("<li>"+$(lists[i]).find('.modal_ul_li').val()+"</li>");
			}	
			break;
		case "TABLE":
			target.empty();
			let element=['thead','tbody','tfoot'];
			let table=[];
			for(let i=0 ; i<element.length ; i++){
				target.append("<"+element[i]+"></"+element[i]+">");
				let new_target=target.find(element[i]);
				let tr_=$("#modal_table_"+element[i]+"_wrapper").find(".modal_table_tr_wrapper");
				for(let j=0 ; j<tr_.length ; j++){
					let ih="<tr>";
					let td_=$(tr_[j]).find(".table_data_input");
					for(let k=0 ; k<td_.length ; k++){
						if(element[i]==="tbody"){
							ih+="<td>"+$(td_[k]).val()+"</td>";
						}else{
							ih+="<th>"+$(td_[k]).val()+"</th>";
						}
					}
					ih+="</tr>";				
					new_target.append(ih);		
				}
			}

			break;
	}
	script_change();

	$("#properties_modal").modal('hide');
	add_event();
});

$(".edit_properties").off();
$(".edit_properties").click(function(){
	editProperties();
});
  function divide_div(target, num) {
  	let width = Math.floor((100 / num) * 100) / 100;
  	let ih = "";
  	for (let i = 0; i < num; i++) {
  		ih += "<div style='width:" + width + "%;float:left;'></div>";
  	}
  	target.empty();
	target.css("overflow","hidden");
  	target.append(ih);
  }
$(".simpl_wysiwyg_tooltip").off();
$(".simpl_wysiwyg_tooltip").keydown(function(e){
	e.stopPropagation();
});
$(".simpl_wysiwyg_tooltip").click(function(e){
	$(".style_new_wrapper").hide();
	e.stopPropagation();
});
  $(".align_dom_element").off();
  $(".align_dom_element").click(function() {
	if($(".clicked_element")[0] === undefined) return;
  	let target = $(".clicked_element")[0];
  	if (target.tagName !== "DIV") return;
  	let align = $(this).val();
  	if (align === "left" || align === "center" || align === "right") {
  		$(target).css("text-align", align);
  	} else if (align === "top" || align === "middle" || align === "bottom") {
  		let target_ch = $(target).children();
  		for (let i = 0; i < target_ch.length; i++) {
  			$(target_ch[i]).css("vertical-align", align);
  		}
  	}
  	add_event();
  });
  $(".divide_div").off();
  $(".divide_div").click(function() {
  	let target = $(".clicked_element")[0];
  	if (target.tagName !== "DIV") return;
  	let num = $("#divide_num").val();
  	if (target === undefined || !(num > 0)) {
  		return;
  	} else {
  		divide_div($(target), num);
  		add_event();
  	}
  });
  $(".remove_dom_element").off();
  $(".remove_dom_element").click(function() {
  	let target = $(".clicked_element")[0];
  	if (target === undefined) {
  		return;
  	} else {
  		let opt = $(this).val();
		switch(opt){
			case "remove":
	  			$(target).remove();
				break;
			case "backspace":
	  			$(target).prev().remove();
				break;
			case "delete":
  				$(target).next().remove();
				break;
			case "empty":
  				$(target).empty()
				break;
		}
  		if (opt === "delete") {
  		} else if (opt === "backspace") {
  		}
  		add_event();
  	}
  });
  $(".add_dom_element").off();
  $(".add_dom_element").click(function() {
  	let dom_ele = $(this).val();
  	let target = $(".clicked_element")[0];
  	let target_tag;
  	if (target === undefined) {
  		target_tag = "BODY";
  	} else {
  		target_tag = $(".clicked_element")[0].tagName;
  	}
  	let ih = "";
  	switch (dom_ele) {
  		case "br":
  			ih += "\n<br/>";
  			break;
  		case "select":
  			ih += "\n<select>\n<option>Select</option>\n</select>";
  			break;
  		case "input":
  			ih += "<input>";
  			break;
  		case "vlatoms":
  			ih += "\n<div style='height:500px;'>\n";
  			ih += "&#123;&#123;kCMS|VLATOMS|vla|widht:500,height:500}}\n";
  			ih += "</div>";
  			break;
  		case "page":
			ih += "\n<div>\n";
  			ih += "&#123;&#123;kCMS|PAGE|pagealias}}\n";
			ih += "</div>";
  			break;
		case "img":
			ih += "<img src=/repo/about_logo.png />";
			break;
		case "ul":
			ih += "\n<ul>\n<li>list</li>\n</ul>";
			break;
		case "table":
			ih += "\n<table>\n<tr>\n<td>table</td>\n</tr>\n</table>";
			break;
		case "div":
			ih += "\n<div>\n</div>";
			break;
		case "canvas":
			ih += "\n<canvas></canvas>";
			break;
  		default:
  			ih += "<" + dom_ele + ">" + dom_ele + "</" + dom_ele + ">";
  	};
  	switch (target_tag) {
  		case "DIV":
  			$(target).append(ih);
  			break;
  		case "BODY":
  			$(".editor_main").append(ih);
  			break;
  		default:
  			$(ih).insertAfter($(target));
  	}
  	add_event();
  });
function make_jquery_selector(value, type){
	var ih="$(";
	switch(type){
		case "Custom":
			ih+=value+")";
			break;
		case "ID":
			ih+="'#"+value+"')";
			break;
		case "Class":
			ih+="'."+value+"')";
			break;
	}
	return ih;
}
//var tool_script=new script_tool($(".page_script"),$(".contents"));
$("#add_function").click(function(){
	let func=$(".fc_helper_select[data-type=func]").find('option:selected').val();
	let trigger=$(".fc_helper_select[data-type=trigger]").find('option:selected').val();
	let _trigger;
	let __space="";
	for(let i=0 ; i<scriptEditor.getCursor().ch ; i++){
		__space+=" ";
	}
	ih="";

	switch(trigger){
		case "none":
			ih+="";
			break;
		case "callByName":
			__space+="  ";
			ih+="function "+$(".fc_trigger_input[data-type=name]").val()+"("+$(".fc_trigger_input[data-type=in]").val()+"){\n"+__space;
			break;
		case "click":
			__space+="  ";
			ih+="";
			_trigger=$(".fc_trigger_select[data-type=target]").find('option:selected').val();
			ih+=make_jquery_selector($(".fc_trigger_input[data-type=target]").val(),_trigger);
			ih+=".click(function(){\n"+__space;
			break;
		case "change":
			__space+="  ";
			ih+="";
			_trigger=$(".fc_trigger_select[data-type=target]").find('option:selected').val();
			ih+=make_jquery_selector($(".fc_trigger_input[data-type=target]").val(),_trigger);
			ih+=".change(function(){\n"+__space;
			break;
		case "documentready":
			__space+="  ";
			ih+="$(document).ready(function(){\n"+__space;
			break;
		default:
	}
	switch(func){
		case "call_plugin":
			ih+='kCms.callPlugin("'+$(".fc_property_input[data-type=alias]").val()+'",\n'+__space;
			let keys=$(".fc_property_input[data-type=data][data-to=key]");
			let types=$(".fc_property_select[data-type=data][data-to=val_type]")
			let vals=$(".fc_property_input[data-type=data][data-to=val]");
			ih+="  {\n"+__space;
			for(let i=0, len=keys.length ;i<len ; i++){
				let _vals=$(vals[i]).val();
				if(_vals==="" && $(keys[i]).val()===""){
					continue;
				}
				if($(types[i]).val()==="String"){
					_vals='"'+_vals+'"';
				}
				ih+='    "'+$(keys[i]).val()+'":'+_vals+",\n"+__space;
			}
			ih+="  },";
			ih+="function(ret){\n    "+__space+"\n"+__space+"  }\n"+__space;
			ih+=")\n";
			break;
		case "alert":
			var v_type=$(".fc_property_select[data-type=value]").find('option:selected').val();
			var variable=$(".fc_property_input[data-type=value]").val();
			ih+="alert(";
			if(v_type==="String"){
				ih+='"';
			}
			ih+=variable;
			if(v_type==="String"){
				ih+='"';
			}
			ih+=");\n";
			break;
		case "console_log":
			var v_type=$(".fc_property_select[data-type=value]").find('option:selected').val();
			var variable=$(".fc_property_input[data-type=value]").val();
			ih+="console.log(";
			switch(v_type){
				case "String":
					ih+="'"+variable+"'";
				case "Variable":
					ih+="'"+variable+"',"+variable;
			}
			ih+=");\n";
			break;
		case "get_value":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			ih+=make_jquery_selector(t_val,t_type);
			ih+=".val();\n";
			break;
		case "set_value":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			var o_type=$(".fc_property_select[data-type=value]").find('option:selected').val();
			var o_val=$(".fc_property_input[data-type=value]").val();
			ih+=make_jquery_selector(t_val,t_type);
			if(o_type==='String'){
				o_val="'"+o_val+"'";
			}
			ih+=".val("+o_val+");\n";
			break;
		case "get_files":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			ih+=make_jquery_selector(t_val,t_type);
			ih+="[0].files;\n";
			break;
		case "append":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			ih+=make_jquery_selector(t_val,t_type);
			var a_type=$(".fc_property_select[data-type=append_type]").find('option:selected').val();
			switch(a_type){
				case "Table Row":
					ih+=".find('tbody').";
					break;
				default:
					ih+=".";
					break;
			}
			var _pos=$(".fc_property_select[data-type=position]").find('option:selected').val();
			switch(_pos){
				case "Beginning":
					ih+="prepend('";
					break;
				case "End":
					ih+="append('";
					break;
			}
			switch(a_type){
				case "Option":
					var op_text_type=$(".fc_property_select[data-type=append_option][data-to=text]").val();
					var op_text_val=$(".fc_property_input[data-type=append_option][data-to=text]").val();
					if(op_text_type==="Variable"){
						op_text_val="'+"+op_text_val+"+'";
					}
					var op_prop_type=$(".fc_property_select[data-type=append_option][data-to=property]").find('option:selected').val();
					var op_prop_key=$(".fc_property_input[data-type=append_option][data-to=prop_key]").val();
					var op_prop_val=$(".fc_property_input[data-type=append_option][data-to=prop_val]").val();
					if(op_prop_type!=="String"){
						op_prop_val="'+"+op_prop_val+"+'";
					}
					ih+="<option "+op_prop_key+"="+op_prop_val+">"+op_text_val+"</option>";
					break;
				case "Table Row":
					ih+="<tr>";
					var tbl_types=$(".fc_property_select[data-type=append_table_row]");
					var tbl_values=$(".fc_property_input[data-type=append_table_row]");
					for(var i=0, len=tbl_types.length ; i<len; i++){
						var __val=$(tbl_values[i]).val();
						var __type=$(tbl_types[i]).find('option:selected').val();
						if(__type==="Variable"){
							__val="'+"+__val+"+'";
						}
						ih+="<td>"+__val+"</td>";
					}
					ih+="</tr>";
					break;
				case "Custom":
					var custom_val=$(".fc_property_input[data-type=append_custom]").val();
					ih+=custom_val;
					break;
			}
			ih+="');\n";
			break;
		case "download_file":
			ih+="kCms.downloadFile('"+$(".fc_property_select[data-type=repo_type]").find('option:selected').val()+"','"+$(".fc_property_input[data-type=alias]").val()+"')";
			break;
		case "upload_file":
			ih+="kCms.uploadFile('"+$(".fc_property_select[data-type=repo_type]").find('option:selected').val()+"', ";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			ih+=make_jquery_selector(t_val,t_type);
			ih+="[0].files, function(ret){\n"+__space+"  \n"+__space+"})\n";
			break;
		case "select_option":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			ih+=make_jquery_selector(t_val,t_type);
			ih+=".find('option["+$(".fc_property_input[data-type=property][data-to=prop_key]").val()+"="+$(".fc_property_input[data-type=property][data-to=prop_val]").val()+"]').prop('selected',true);\n";
			break;
		case "check_input":
			ih+="$('";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			switch(t_type){
				case "Custom":
					break;
				case "ID":
					ih+="#";
					break;
				case "Class":
					ih+=".";
					break;
			}
			ih+=t_val;
			ih+="["+$(".fc_property_input[data-type=property][data-to=prop_key]").val()+"="+$(".fc_property_input[data-type=property][data-to=prop_val]").val()+"]').prop('checked',true);\n";
			break;
		case "get_selected":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();

			ih+=make_jquery_selector(t_val,t_type);
			ih+=".find('option:selected').val();\n";
			break;
		case "get_checked":
			ih+="$('";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			switch(t_type){
				case "Custom":
					break;
				case "ID":
					ih+="#";
					break;
				case "Class":
					ih+=".";
					break;
			}
			ih+=t_val;
			ih+=":checked').val();\n";
			break;
		case "json_parse":
			var o_type=$(".fc_property_select[data-type=value]").find('option:selected').val();
			var o_val=$(".fc_property_input[data-type=value]").val();
			if(o_type==='String'){
				o_val="'"+o_val+"'";
			}
			ih+="JSON.parse("+o_val+");\n";
			break;
		case "json_stringify":
			var o_type=$(".fc_property_select[data-type=value]").find('option:selected').val();
			var o_val=$(".fc_property_input[data-type=value]").val();
			if(o_type==='String'){
				o_val="'"+o_val+"'";
			}
			ih+="JSON.stringify("+o_val+");\n";
			break;
		case "hide":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();

			ih+=make_jquery_selector(t_val,t_type);
			ih+=".hide();\n";
			break;
		case "show":
			ih+="";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();

			ih+=make_jquery_selector(t_val,t_type);
			ih+=".show();\n";
			break;
		case "make_chart":
			ih+=$(".fc_property_input[data-type=variable]").val()+" = new Chart(document.";
			var t_type=$(".fc_property_select[data-type=target]").find('option:selected').val();
			var t_val=$(".fc_property_input[data-type=target]").val();
			switch(t_type){
				case "Custom":
					alert("Please use ID or Class.");
					return;
					break;
				case "ID":
					ih+="getElementById('";
					break;
				case "Class":
					ih+="getElementsByClass('";
					break;
			}
			ih+=t_val;
			ih+="').getContext('2d'),{\n"+__space;
			ih+="  type:'"+$(".fc_property_select[data-type=chart_type]").find('option:selected').val()+"',\n"+__space;
			ih+="  data:{},\n"+__space;
			ih+="  options:{\n"+__space;
			ih+="    scales:{\n"+__space;
			ih+="      yAxes: [{\n"+__space;
			ih+="        ticks: {\n"+__space;
			ih+="          beginAtZero:true\n"+__space;
			ih+="        }\n"+__space;
			ih+="      }]\n"+__space;
			ih+="    }\n"+__space;
			ih+="  },\n"+__space;
			ih+="})\n";
			break;
		case "add_chart_data":
			var type = $(".fc_property_select[data-type=chart_type]").find('option:selected').val();
			var idx=$(".fc_property_input[data-type=idx]").val();

			let x_axis=$(".fc_property_input[data-type=chart_data][data-to=x_axis_val]").val();
			let x_type=$(".fc_property_input[data-type=chart_data][data-to=x_axis_type]").find('option:selected').val();
			let y_axis=$(".fc_property_input[data-type=chart_data][data-to=y_axis_val]").val();
			let y_type=$(".fc_property_input[data-type=chart_data][data-to=y_axis_type]").find('option:selected').val();
			if(x_type!=="String"){
				x_type="'+"+x_axis+"+'";
			}
			if(y_type!=="String"){
				y_type="'+"+y_axis+"+'";
			}
			switch(type){
				case "scatter":
					ih+=$(".fc_property_input[data-type=variable]").val()+".data.datasets["+idx+"].data.push({\n"+__space;
					ih+="  x:"+x_axis+",\n"+__space;
					ih+="  y:"+y_axis+"\n"+__space;
					ih+="});\n"+__space;
					break;
				case "bar":
					if(x_axis!==""){
						ih+=$(".fc_property_input[data-type=variable]").val()+".data.labels.push("+x_axis+");\n"+__space;
					}
					ih+=$(".fc_property_input[data-type=variable]").val()+".data.datasets["+idx+"].data.push("+y_axis+");\n"+__space;
					break;
			}
			ih+=$(".fc_property_input[data-type=variable]").val()+".update();\n";
			break;
		case "add_chart_dataset":
			var type = $(".fc_property_select[data-type=chart_type]").find('option:selected').val();
			switch(type){
				case "scatter":
					break;
				case "bar":
					ih+=$(".fc_property_input[data-type=variable]").val()+".data.labels=[];\n"+__space;
					break;
			}
			ih+=$(".fc_property_input[data-type=variable]").val()+".data.datasets.push({\n"+__space;
			ih+="  label:'"+$(".fc_property_input[data-type=chart_label]").val()+"',\n"+__space;
			ih+="  data:[],\n"+__space;
			ih+="  borderColor:"+'"rgb('+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+')",\n'+__space;
			switch(type){
				case "scatter":
					ih+="  showLine:true,\n"+__space;
					ih+="  fill:false\n"+__space;
					break;
				case "bar":
					ih+="  backgroundColor:"+'"rgb('+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+')",\n'+__space ;
					break;
			}
			ih+="});\n"+__space;
			ih+=$(".fc_property_input[data-type=variable]").val()+".update();\n";
			break;
		case "remove_chart_data":
			var idx=$(".fc_property_input[data-type=idx]").val();
			ih+="if("+$(".fc_property_input[data-type=variable]").val()+".data.labels!==undefined){\n"+__space;
			ih+="  let __delete_label=true;\n"+__space;
			ih+="  for(let __i=0,__len="+$(".fc_property_input[data-type=variable]").val()+".data.datasets.length ; __i<__len ; __i++){\n"+__space;
			ih+="    if("+$(".fc_property_input[data-type=variable]").val()+".data.datasets[__i].data.length !==0){\n"+__space;
			ih+="      __delete_label=false;\n"+__space;
			ih+="      break;\n"+__space;
			ih+="    }\n"+__space;
			ih+="  };\n"+__space;
			ih+="  if(__delete_label){\n"+__space;
			ih+="    "+$(".fc_property_input[data-type=variable]").val()+".data.labels=[];\n"+__space;
			ih+="  }\n"+__space;
			ih+="};\n"+__space;
			ih+=$(".fc_property_input[data-type=variable]").val()+".data.datasets["+idx+"].data=[];\n"+__space;
			ih+=$(".fc_property_input[data-type=variable]").val()+".update();\n";
			break;
		default:
	}
	__space=__space.substring(0,__space.length-2);
	switch(trigger){
		case "none":
			break;
		case "callByName":
			ih+=__space+"}\n";
			break;
		case "click":
			ih+=__space+"})\n";
			break;
		case "change":
			ih+=__space+"})\n";
			break;
		case "documentready":
			ih+=__space+"})\n";
			break;
		default:
	}
	ih+=__space;
	scriptEditor.addString(ih);
	$('#function_helper_modal').modal('hide');
});

$(".fc_helper_wrapper[data-type=trigger]").change(function(){
	let trigger=$(this).find('option:selected').val();
	$(".fc_trigger_wrapper>select").prop("disabled",true);
	$(".fc_trigger_wrapper>input").prop("readonly",true);
	switch(trigger){
		case "none":
			break;
		case "callByName":
			$(".fc_trigger_wrapper[data-type=name]>input").prop("readonly",false);
			$(".fc_trigger_wrapper[data-type=in]>input").prop("readonly",false);
			break;
		case "click":
			$(".fc_trigger_wrapper[data-type=target]>input").prop("readonly",false);
			$(".fc_trigger_wrapper[data-type=target]>select").prop("disabled",false);
			break;
		case "change":
			$(".fc_trigger_wrapper[data-type=target]>input").prop("readonly",false);
			$(".fc_trigger_wrapper[data-type=target]>select").prop("disabled",false);
			break;
		case "documentready":
			break;
		default:
	}
})

$(".fc_helper_wrapper[data-type=func]").change(function(){
	let func=$(this).find('option:selected').val();
	$(".fc_property_wrapper").hide();
	switch(func){
		case "none":
			break;
		case "call_plugin":
			$(".fc_property_wrapper[data-type=alias]").show();
			$(".fc_property_wrapper[data-type=data]").show();
			break;
		case "append":
			$(".fc_property_wrapper[data-type=target]").show();
			$(".fc_property_wrapper[data-type=position]").show();
			$(".fc_property_wrapper[data-type=append_type]").show();
			$(".fc_property_select[data-type=append_type]").change();
			break;
		case "console_log":
			$(".fc_property_wrapper[data-type=value]").show();
			break;
		case "alert":
			$(".fc_property_wrapper[data-type=value]").show();
			break;
		case "get_value":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "set_value":
			$(".fc_property_wrapper[data-type=target]").show();
			$(".fc_property_wrapper[data-type=value]").show();
			break;
		case "get_files":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "upload_file":
			$(".fc_property_wrapper[data-type=repo_type]").show();
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "download_file":
			$(".fc_property_wrapper[data-type=repo_type]").show();
			$(".fc_property_wrapper[data-type=alias]").show();				
			break;
		case "select_option":
			$(".fc_property_wrapper[data-type=target]").show();
			$(".fc_property_wrapper[data-type=property]").show();
			break;
		case "check_input":
			$(".fc_property_wrapper[data-type=target]").show();
			$(".fc_property_wrapper[data-type=property]").show();
			break;
		case "get_selected":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "get_checked":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "json_parse":
			$(".fc_property_wrapper[data-type=value]").show();
			break;
		case "json_stringify":
			$(".fc_property_wrapper[data-type=value]").show();
			break;
		case "hide":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "show":
			$(".fc_property_wrapper[data-type=target]").show();
			break;
		case "make_chart":
			$(".fc_property_wrapper[data-type=target]").show();
			$(".fc_property_wrapper[data-type=chart_type]").show();
			$(".fc_property_wrapper[data-type=variable]").show();
			break;
		case "add_chart_dataset":
			$(".fc_property_wrapper[data-type=chart_type]").show();
			$(".fc_property_wrapper[data-type=variable]").show();
			$(".fc_property_wrapper[data-type=chart_label]").show();
			break;
		case "add_chart_data":
			$(".fc_property_wrapper[data-type=idx]").show();
			$(".fc_property_wrapper[data-type=chart_type]").show();
			$(".fc_property_wrapper[data-type=chart_data]").show();
			$(".fc_property_wrapper[data-type=variable]").show();
			break;
		case "remove_chart_data":
			$(".fc_property_wrapper[data-type=idx]").show();
			$(".fc_property_wrapper[data-type=variable]").show();
			break;
	}
})
$(".fc_property_select[data-type=append_type]").change(function(){
	let _type= $(this).find('option:selected').val();
	$(".fc_property_wrapper[data-wrapper=append]").hide();
	switch(_type){
		case "Option":
			$(".fc_property_wrapper[data-type=append_option]").show();
			break;
		case "Table Row":
			$(".fc_property_wrapper[data-type=append_table_row]").show();
			break;
		case "Custom":
			$(".fc_property_wrapper[data-type=append_custom]").show();
			break;
	}
});
$(".data_value_add").click(function(){
	$(".fc_data_wrapper").append('<div><input class="form-control fc_property_input" data-type=data data-to=key placeholder=key> <select class="form-control fc_property_select" data-type=data data-to=val_type><option>Variable</option><option>String</option></select> <input class="form-control fc_property_input" data-type=data data-to=val> <i class="glyphicon glyphicon-minus-sign data_value_remove" style="color:#FF0000;cursor:pointer;"></i></div>');
	$(".data_value_remove").off();
	$(".data_value_remove").click(function(){
		$(this).parent().remove();
	});

})
$(".table_cell_add").click(function(){
	$(".fc_table_wrapper").append('<div><label style="width:120px;">Table Cell</label> <select class="form-control fc_property_select" data-type=append_table_row><option>Variable</option><option>String</option></select> <input class="form-control fc_property_input" data-type=append_table_row> <i class="glyphicon glyphicon-minus-sign table_cell_minus" style="color:#FF0000;cursor:pointer;"></i></div>');
	$(".table_cell_minus").off();
	$(".table_cell_minus").click(function(){
		$(this).parent().remove();
	});
});

$(".vls_func_select").change(function(){
	let func=$(this).find('option:selected').val();
	$(".vls_prop_wrapper").hide();
	switch(func){
		case "get_str_data":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "set_str_data":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=variable]").show();
			break;
		case "get_atoms":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "add_atoms":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=atom_prop]").show();
			break;
		case "remove_atoms":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=idx]").show();
			break;
		case "get_element_list":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "str_to_cif":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "str_to_poscar":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "cif_to_str":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=variable]").show();
			break;
		case "poscar_to_str":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=variable]").show();
			break;
		case "xyz_to_str":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=variable]").show();
			break;
		case "inside_test":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "get_volume":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "update_cam":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "readfiles":
			$(".vls_prop_wrapper[data-type=vls]").show();
			$(".vls_prop_wrapper[data-type=variable]").show();
			break;
		case "update_atoms":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
		case "update_bonds":
			$(".vls_prop_wrapper[data-type=vls]").show();
			break;
	}
});
$("#vls_add_btn").click(function(){
	let func=$(".vls_func_select").find('option:selected').val();
	let vls="";
	let vari="";
	let idx="";
	let __space="";
	for(let i=0 ; i<scriptEditor.getCursor().ch ; i++){
		__space+=" ";
	}
	ih="";
	switch(func){
		case "get_str_data":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=  vls+".Structure;\n";
			break;
		case "set_str_data":
			vls=$(".vls_prop_input[data-type=vls]").val();
			vari=$(".vls_prop_input[data-type=variable]").val();
			ih+=vls+".Structure = VLatoms.Utils.redefineStructure("+vari+");\n";
			ih+=__space+vls+".update.atomsChanged=true;\n";
			ih+=__space+vls+".update.bondsChanged=true;\n";
			ih+=__space+vls+".setOptimalCamPosition();\n";
			break;
		case "get_atoms":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=vls+".Structure.atoms;\n";
			break;
		case "add_atoms":
			vls=$(".vls_prop_input[data-type=vls]").val();
			let ele=$(".vls_prop_input[data-type=atom_prop][data-to=element]").val();
			let pos_x=$(".vls_prop_input[data-type=atom_prop][data-to=x]").val();
			let pos_y=$(".vls_prop_input[data-type=atom_prop][data-to=y]").val();
			let pos_z=$(".vls_prop_input[data-type=atom_prop][data-to=z]").val();
			ih+=vls+".Structure.atoms.push(new VLatoms.Atom("+pos_x+","+pos_y+","+pos_z+",'"+ele+"');\n";
			break;
		case "remove_atoms":
			vls=$(".vls_prop_input[data-type=vls]").val();
			idx=$(".vls_prop_input[data-type=idx]").val()*1;
			if(Number.isNaN(idx) || !Number.isInteger(idx) || idx<0){
				alert("Index must be an Integer 0 or above.");
				$(".vls_prop_input[data-type=idx]").val("");
				return;
			}
			ih+=vls+"Structure.atoms.split("+idx+",1);\n";
			break;
		case "get_element_list":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+="Object.keys("+vls+".Structure.formula.formulaArr);\n";
			break;
		case "str_to_cif":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+="VLatoms.Utils.Structure.toCIF("+vls+".Structure"+");\n";
			break;
		case "str_to_poscar":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+="VLatoms.Utils.Structure.toPoscar("+vls+".Structure"+");\n";
			break;
		case "cif_to_str":
			vls=$(".vls_prop_input[data-type=vls]").val();
			vari=$(".vls_prop_input[data-type=variable]").val();
			ih+=vls+".Structure=VLatoms.Utils.Structure.cifToVLatoms("+vari+");\n";
			break;
		case "poscar_to_str":
			vls=$(".vls_prop_input[data-type=vls]").val();
			vari=$(".vls_prop_input[data-type=variable]").val();
			ih+=vls+".Structure=VLatoms.Utils.Structure.poscarToVLatoms("+vari+");\n";
			break;
		case "xyz_to_str":
			vls=$(".vls_prop_input[data-type=vls]").val();
			vari=$(".vls_prop_input[data-type=variable]").val();
			ih+=vls+".Structure=VLatoms.Utils.Structure.xyzToVLatoms("+vari+");\n";
			break;
		case "inside_test":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=vls+".Manipulate.insideTest("+vls+".Structure.atoms,{'onEscape':true});\n";
			break;
		case "get_volume":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+="VLatoms.Utils.getVolume("+vls+".Structure);\n";
			break;
		case "update_cam":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=vls+".setOptimalCamPosition();\n";
			break;
		case "readfiles":
			vls=$(".vls_prop_input[data-type=vls]").val();
			vari=$(".vls_prop_input[data-type=variable]").val();
			ih+=vls+".IO.readFiles("+vari+");\n";
			break;
		case "update_atoms":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=vls+".update.atomsChanged=true;\n";
			break;
		case "update_bonds":
			vls=$(".vls_prop_input[data-type=vls]").val();
			ih+=vls+".update.bondsChanged=true;\n";
			break;
	}
	scriptEditor.addString(ih);
	$("#visualizer_helper_modal").modal("hide");
});
$(".simpl_wysiwyg_input").keypress(function(e){
	if(e.keyCode===13){
		if($(this).hasClass('style_dom_element')){
			$(this).change();
		}
		e.stopPropagation();
		e.preventDefault();
	}
});

</script>
@stop
