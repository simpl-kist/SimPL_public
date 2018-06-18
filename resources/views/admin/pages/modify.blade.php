@extends('admin.master')
@section('title')
Edit Page
@stop
@section('content')
<script src={{asset('assets/vendor/codemirror/lib/')}}/codemirror.js></script>
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
<link href={{asset('assets/vendor/codemirror/lib/')}}/codemirror.css rel=stylesheet></script>
<style>
	.test_main div{
		border:1px solid red;
		min-height:15px;
	}
  .clicked_element{
    border: 1px solid blue !important; 
  }
.CodeMirror-fullscreen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  height: auto;
  z-index: 9;
}
.modal_prop_label{
	width:75px;
}
</style>
<link href={{asset('assets/vendor/codemirror/addon/hint/')}}/show-hint.css rel=stylesheet></script>
<script>
$('document').ready(function(){
	scriptEditor=CodeMirror.fromTextArea(document.getElementsByClassName('contents')[0],{
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
			<label class='col-form-label' onclick='open_content("script");'>Script</label>
			<label class='col-form-label' onclick='open_content("view");'>View</label>
			</div>
			<div class='col-sm-12 page_view page_tab' style="display:none;">
				<div class="row form-inline simpl_wysiwyg_tooltip">
					<button class="btn btn-primary add_dom_element" value="div" type="button">Div</button>
					<button class="btn btn-primary add_dom_element" value="label" type="button">Label</button>
					<button class="btn btn-primary add_dom_element" value="a" type="button">a link</button>
					<button class="btn btn-primary add_dom_element" value="button" type="button">Button</button>
					<button class="btn btn-primary add_dom_element" value="select" type="button">Select</button>
					<button class="btn btn-primary add_dom_element" value="input" type="button">Input</button>
					<button class="btn btn-primary add_dom_element" value="textarea" type="button">TextArea</button>
					<button class="btn btn-primary add_dom_element" value="br" type="button">Br</button>
					<button class="btn btn-primary add_dom_element" value="span" type="button">Text</button>
					<button class="btn btn-primary add_dom_element" value="img" type="button">Img</button>
					<button class="btn btn-danger remove_dom_element" value="backspace" type="button">BackSpace</button>
					<button class="btn btn-danger remove_dom_element" value="delete" type="button">Delete</button>
					<br>
					<button class="btn btn-primary add_dom_element" value="page" type="button">Page</button>
					<button class="btn btn-primary add_dom_element" value="vlatoms" type="button">Visualizer</button>
					<button class="btn btn-primary edit_properties" type="button">Properties</button>					
					<br>
					<label>Num :</label> <input class="form-control" id="divide_num" style="width:75px;">
					<button class="btn btn-primary divide_div" type="button">Divide</button>
					<button class="btn btn-primary align_dom_element" value="left" type="button">Left</button>
					<button class="btn btn-primary align_dom_element" value="center" type="button">Center</button>
					<button class="btn btn-primary align_dom_element" value="right" type="button">Right</button>
					<button class="btn btn-primary align_dom_element" value="top" type="button">Top</button>
					<button class="btn btn-primary align_dom_element" value="middle" type="button">Middle</button>
					<button class="btn btn-primary align_dom_element" value="bottom" type="button">Bottom</button>
				</div>	
				<div class="test_main">
				</div>
			</div>
			<div class='col-sm-12 page_script page_tab'>
				<textarea class='form-control contents' name=contents>{{ old('contents')!==NULL ? old('contents') : $page->contents }}</textarea>
				<label style="font-size:12px;float:left">FullScreen Mode: Ctrl+Enter</label>
			</div>
		</div>
		<div class='form-group row'>
			<div class="col-sm-12 form-inline" style='text-align:right;'>
@if(isset($page->id))
				<button type="button" id="open_page" class="btn btn-primary" onclick="window.open('{{url($page->alias)}}')">Open</button>
@endif
				<button type="submit" class="btn btn-primary">Apply</button>
			</div>
		</div>
	</form>
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
<script>
var open_content = function(type){
	$(".page_tab").hide();
	$(".page_"+type).show();
	if(type==="script"){
		scriptEditor.setValue(formatFactory($(".test_main").html()));
		scriptEditor.save();
	}else if(type==="view"){
		scriptEditor.save();
		$(".test_main").html($(".contents").val());
		add_event();
	}
}


  $(window).click(function() {
  	$(".clicked_element").removeClass("clicked_element");
  });
  //https://codepen.io/davidkacha/pen/zzNBxq
  function formatFactory(html) {
  	function parse(html, tab = 0) {
  		var tab;
  		var html = $.parseHTML(html);
  		var formatHtml = new String();

  		function setTabs() {
  			var tabs = new String();
  			for (i = 0; i < tab; i++) {
  				tabs += '  ';
  			}
  			return tabs;
  		};
  		$.each(html, function(i, el) {
  			if (el.nodeName == '#text') {
  				if (($(el).text().trim()).length) {
  					formatHtml += setTabs() + $(el).text().trim() + '\n';
  				}
  			} else {
  				var innerHTML = $(el).html().trim();
  				$(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));
  				if ($(el).children().length) {
  					$(el).html('\n' + parse(innerHTML, (tab + 1)) + setTabs());
  					var outerHTML = $(el).prop('outerHTML').trim();
  					formatHtml += setTabs() + outerHTML + '\n';
  				} else {
  					var outerHTML = $(el).prop('outerHTML').trim();
  					formatHtml += setTabs() + outerHTML + '\n';
  				}
  			}
  		});
  		return formatHtml;
  	};
  	return parse(html.replace(/(\r\n|\n|\r)/gm, " ").replace(/ +(?= )/g, ''));
  };
  //
  function add_event() {
  	var a = [$(".test_main")[0]];
  	for (var i = 0; i < a.length; i++) {
  		if (i !== 0) {
  			$(a[i]).off();
  			$(a[i]).click(function(e) {
  				$(".clicked_element").removeClass("clicked_element");
  				$(this).addClass("clicked_element");
  				console.log(this.tagName);
  				e.stopPropagation();
  				e.preventDefault();
  			});
  		}
  		var child = $(a[i]).children();
  		for (var j = 0; j < child.length; j++) {
  			a.push(child[j]);
  		}
  	}
	$(".clicked_element").removeClass("clicked_element");
  	scriptEditor.setValue(formatFactory($(".test_main").html()));
	scriptEditor.save();
  }
function editProperties(){
  	let target = $(".clicked_element");
  	if (target.length===0) return;
	let tagName=target.prop("tagName");
	console.log(tagName);
	let ih="<div class=form-inline>";
	ih+="<div><label class=modal_prop_label>Class</label><input id=modal_class_input class=form-control value='"+target.prop("class").replace("clicked_element","").trim()+"'></div>";
	ih+="<div><label class=modal_prop_label>ID</label><input id=modal_id_input class=form-control value='"+target.prop("id")+"'></div>";
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
			ih+="<div><label class=modal_prop_label>Placeholder</label><input id=modal_input_placeholder class=form-control value='"+target.prop('placeholder')+"'></div>";
			ih+="<div><label class=modal_prop_label>Checked</label><input type=checkbox id=modal_input_checked class=form-control "+(target.prop('checked')?"checked":"")+"></div>";
			break;
		case "DIV":
			ih+="<div><label class=modal_prop_label>Text</label><input id=modal_div_text class=form-control value='"+target.text()+"'></div>";
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
	}
	ih+="</div>";
	$("#properties_modal").find(".modal-body").html(ih);
	$("#properties_modal").modal("show");
}
$(".modal").off();
$(".modal").click(function(e){
	e.stopPropagation();
});

$("#change_properties").off();
$("#change_properties").click(function(){
	let target=$(".clicked_element");
	target.prop("class","clicked_element "+$("#modal_class_input").val());
	target.prop("id",$("#modal_id_input").val());
	let tagName=target.prop("tagName");
	switch(tagName){
		case "INPUT":
			target.prop("name",$("#modal_input_name").val());
			target.prop("type",$("#modal_input_type").val());
			target.prop("placeholder",$("#modal_input_placholder").val());
			target.prop("checked",$("#modal_input_checked").prop("checked"));
			break;
		case "DIV":
			target.text($("#modal_div_text").val());
			break;
		case "A":
			target.attr("href",$("#modal_a_href").val());
			target.text($("#modal_a_text").val());
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
			target.prop("title",$("#modal_img_title").val());
			break;
	}
	$("#properties_modal").modal('hide');
});

$(".edit_properties").off();
$(".edit_properties").click(function(){
	editProperties();
});
  function divide_div(target, num) {
  	let width = Math.floor((100 / num) * 100) / 100;
  	let ih = "";
  	for (let i = 0; i < num; i++) {
  		ih += "<div style='width:" + width + "%;float:left;'>Div</div>";
  	}
  	target.empty();
  	target.append(ih);
  }
  $(".simpl_wysiwyg_tooltip").off();
  $(".simpl_wysiwyg_tooltip").click(function(e) {
  	e.stopPropagation();
  });
  $(".align_dom_element").off();
  $(".align_dom_element").click(function() {
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
  		if (opt === "delete") {
  			$(target).remove();
  		} else if (opt === "backspace") {
  			$(target).prev().remove();
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
  	console.log(dom_ele, target_tag);
  	let ih = "";
  	switch (dom_ele) {
  		case "br":
  			ih += "<br/>";
  			break;
  		case "select":
  			ih += "<select><option>Select</option></select>";
  			break;
  		case "input":
  			ih += "<input value=Input>";
  			break;
  		case "vlatoms":
  			ih += "<div style='height:500px;'>";
  			ih += "&#123;&#123;kCMS|VLATOMS|vla|widht:500,height:500}}";
  			ih += "</div>";
  			break;
  		case "page":
			ih += "<div>";
  			ih += "&#123;&#123;kCMS|PAGE|pagealias}}";
			ih += "</div>";
  			break;
		case "img":
			ih += "<img src=/repo/about_logo.png />";
			break;
  		default:
  			ih += "<" + dom_ele + ">" + dom_ele + "</" + dom_ele + ">";
  	};
  	switch (target_tag) {
  		case "DIV":
  			$(target).prepend(ih);
  			break;
  		case "BODY":
  			$(".test_main").append(ih);
  			break;
  		default:
  			$(ih).insertAfter($(target));
  	}
  	add_event();
  });

//var tool_script=new script_tool($(".page_script"),$(".contents"));

</script>
@stop
