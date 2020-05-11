// Avoid `console` errors in browsers that lack a console.

var timeCheckArr = [];
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

//Get Path of this file

var VLATOMS_PATH="";
if(document.currentScript){
	VLATOMS_PATH = document.currentScript.src;
}else{
	var scripts = document.getElementsByTagName('script');
	VLATOMS_PATH = scripts[scripts.length-1].src;
}
if(VLATOMS_PATH=="" || VLATOMS_PATH == undefined){
	console.warn("Path is not defined");
	VLATOMS_PATH = "/";
}else{
	VLATOMS_PATH = VLATOMS_PATH.substr(0, VLATOMS_PATH.lastIndexOf("/"));
}


CX=2;
CY=2;
CZ=1;
var _abcTo012={
	'a':0,'b':1,'c':2
};
var _012Toabc=['a','b','c'];
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

var arrClone = function(arr) {
	return arr.slice(0);
};
var objClone = function(obj){
	return JSON.parse(JSON.stringify(obj));
}
String.prototype.removeSpace = function()
{
	return this.replace(/\s+/g," ").replace(/^\s+/,"").replace(/\s+$/,"");
}
/*
*/
if(NVLScreens === undefined){
	var NVLScreens = 0; // Number of VL Screens
}
console.log('VL Screen #', NVLScreens);



var VLatoms = function(option){
	var v = this;
	v.that = this;
	v.option = option || { resolution : 8 };
	if(v.option.shadow === undefined) v.option.shadow = false;
	if(v.option.resolution===undefined) v.option.resolution=8;
	//if(v.option.onEscape===undefined) v.option.onEscape="expand";
	if(v.option.step === undefined) v.option.step = { rotate:15, move:1 };
	v.option.camera = v.option.camera || { fov : 3, aspect : 1, near : 1, far : 1<<30 };
	v.option.onUpdate = option.onUpdate || [];
	v.option.placeholder = option.placeholder || "Click here to upload structure file <br>or<br>Drop your structure file here!";
	v.option.atomDisplay = [];
	v.option.customAtomParam = {};
	v.option.area = option.area || null;
	v.bondpairs = [];
	v.bondpairs_display = [];

	v.option.onUpdate.push(function(){
		v.Structure.formula = VLatoms.Utils.Structure.toFormula(v.Structure);
	});
	v.option.onUpdate.push(function(){
		var tmp = v.Structure.spacegroup;
		v.Structure.spacegroup = VLatoms.Utils.Structure.getSpaceGroup(v);
		if(tmp != v.Structure.spacegroup ){
			v.update.cellInfo();
		}
	});
	v.option.onUpdate.push(function(){

		//check diff
		var elementsList =  Object.keys( v.Structure.formula.formulaArr );
		var atomDisplayKeys = Object.keys(v.option.atomDisplay);
		if (elementsList.length == atomDisplayKeys.length){
			var _diff = false;
			for(var i in elementsList){
				if(atomDisplayKeys.indexOf(i) == -1 ) _diff = true; 
			}
			if(!_diff) return false;
		}

		//init
		var target = v.ctxMenu.find(".atom_design_config_wrapper");
		v.option.atomDisplay = {};

		//get old check status
		var _checkboxDOM = target.find('input');
		var _checkValue = {};
		_checkboxDOM.each(function(){
			var _element = $(this).data().element;
			var _checked = this.checked;
			_checkValue[_element] = _checked;
		});

		//refresh DOM of elements
		let atomDetailBox = v.ctxMenu.find('.atom_design_detail');
		//이전 상태 저장
		let detailBoxElement = atomDetailBox.data('targetelement');
		let detailBoxDisplay = atomDetailBox.css('display');
		//초기화
		atomDetailBox.hide();
		atomDetailBox.insertAfter(target);
		target.empty();
		for(var i in elementsList){
			target.append("<div class='atom_design_config' data-element="+elementsList[i]+" data-index="+i+" style='display:inline-block; width:33%'><label><input checked type=checkbox class='atom_toggle' data-element="+elementsList[i]+"><span style='margin:0 4px;'>"+elementsList[i]+"</span></label><span class='fas fa-caret-down atom_design_toggle' style='cursor:pointer;color:#999;'></span></div>");
		}
//		target.children('div').css('width','33%');


		v.ctxMenu.find('.atom_design_toggle').bind('click',function(){
			if($(this).hasClass('fa-caret-up')){
				$(this).addClass('fa-caret-down');
				$(this).removeClass('fa-caret-up');
				atomDetailBox.hide();
				return true;
			} else {
				let toggleList = v.ctxMenu.find('.atom_design_toggle');	
				//다른 원소가 먼저 선택되어 있으면 세모 닫기
				toggleList.each(function(){
					if($(this).hasClass('fa-caret-up')){
						$(this).addClass('fa-caret-down');
						$(this).removeClass('fa-caret-up');
					}
				});
				//세모 열기
				$(this).addClass('fa-caret-up');
				$(this).removeClass('fa-caret-down');

				//detail box 값 입력
				let thisElement = $(this).parent().data('element');
				let thisColor = AtomParam[thisElement].color.split('x')[1];
				let thisRadius = AtomParam[thisElement].radius;
				atomDetailBox.data('targetelement', thisElement);
				atomDetailBox.find('.element_color').val(thisColor);
				atomDetailBox.find('.element_radius').val(thisRadius);
				v.IO.ctxMenuCfg.jscolor.atom.fromString(thisColor);

				//detail box 이동
				let thisIndex = $(this).parent().data('index');
				let atomDetailBoxPosition = (Math.ceil( (thisIndex+1) / 3) ) * 3 - 1;
				atomDetailBox.insertAfter(toggleList.eq(atomDetailBoxPosition).parent()[0] != undefined ? toggleList.eq(atomDetailBoxPosition).parent() : toggleList.eq(toggleList.length - 1).parent());
				if(atomDetailBox.css('display') == 'none') atomDetailBox.show();
			}
			
		});

		//apply old check status
		for(var i in _checkValue){
			if(!_checkValue[i]){
				target.find('input[data-element="'+i+'"]').prop('checked',false);
			}
		}

		//Reflect current status
		let checkboxDOM = target.find('input');
		checkboxDOM.each(function(){
			let element = $(this).data().element;
			let checked = this.checked;
			v.option.atomDisplay[element] = checked; 
		});
		
		//bind click event
		v.ctxMenu.find(".atom_toggle").change(function(){
			//Reflect current status
			let checkboxDOM = target.find('input');
			checkboxDOM.each(function(){
				let element = $(this).data().element;
				let checked = this.checked;
				v.option.atomDisplay[element] = checked; 
			});

			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
		});
		
		//apply old detail box status
		if(detailBoxDisplay != 'none'){
			target.find('.atom_design_config[data-element="'+detailBoxElement+'"]').find('.fa-caret-down').click();
			v.ctxMenu.find('.element_radius').focus();
		}
		
	});
	
	v.option.onUpdate.push(function(){
		var target = v.ctxMenu.find(".bondpairs");
		var elements =  Object.keys( v.Structure.formula.formulaArr );
		v.bondpairs = [];
		v.bondpairs_display = [];
		//get old check status
		var bondpairs_data = target.find('input');
		var bondpairs_checked ={};
		bondpairs_data.each(function(){
						var _pairs=$(this).data().ij;
						var _checked=this.checked;
						bondpairs_checked[_pairs]=_checked;
		});
		//end of old check status
		for(var i=0;i<elements.length;i++){
			for(var j=0;j<=i;j++){
				v.bondpairs.push({ display:true, pair:[ elements[i], elements[j] ]});
				v.bondpairs_display.push(elements[i]+""+elements[j]);
				if(elements[i]!=elements[j]){
					v.bondpairs_display.push(elements[j]+""+elements[i]);
				}
			}
		}


		target.empty();
		var cp;
		for(var i=0;i<v.bondpairs.length;i++){
			cp = v.bondpairs[i];
//			target.append("<input checked type=checkbox class='bondpair' data-idx="+i+" data-ij="+cp.pair[0]+""+cp.pair[1]+" data-ji="+cp.pair[1]+""+cp.pair[0]+" data-i="+cp.pair[0]+" data-j="+cp.pair[1]+"> "+cp.pair[0]+"-"+cp.pair[1]+"<br>");
//	schan
			target.append("<div style='display:inline-block; width:33%;'><label><input checked type=checkbox class='bondpair' data-idx="+i+" data-ij="+cp.pair[0]+""+cp.pair[1]+" data-ji="+cp.pair[1]+""+cp.pair[0]+" data-i="+cp.pair[0]+" data-j="+cp.pair[1]+">"+cp.pair[0]+"-"+cp.pair[1]+"</label></div>");
		}
		//apply old check status
		for(var i in bondpairs_checked){
			if(!bondpairs_checked[i]){
				for(var j = 0; j < v.bondpairs_display.length; j++){
					if(i == v.bondpairs_display[j]){
						v.bondpairs_display.splice(j,1);
					}
				}
			}
		}
		var _checklist = target.find('input');
		for(var i in bondpairs_checked){
			if(!bondpairs_checked[i]){
				for(var j = 0; j < _checklist.length; j++){
					if(i == _checklist.eq(j).data().ij){
						_checklist.eq(j).prop('checked', false);
					}
				}
			}
		}
		// end of apply	
		v.ctxMenu.find(".bondpair").unbind();
		v.ctxMenu.find(".bondpair").change(function(){
			v.bondpairs_display = [];
			v.ctxMenu.find(".bondpair").each(function(){
				if( $(this).is(":checked") ){
					v.bondpairs_display.push($(this).data("ij"));
					v.bondpairs_display.push($(this).data("ji"));
				}
			});
			v.update.bondsChanged=true;
			v.animateControl.once();
		});
		
	});

/* Create wrapper div */
/* If wrapper is not defined, create div element into current position */
	var div = document.createElement('div');

	if( v.option.wrapper === undefined ){
		var scripts = document.getElementsByTagName('script');
		var this_script = scripts[scripts.length-1];

		var myParentNode = this_script.parentNode, myParentStyle = myParentNode.style;

	}else{
		// if jquery element
		if( v.option.wrapper.get !== undefined){
			console.warn("JQ");
			var myParentNode =  v.option.wrapper.get(0);
		}else if( v.option.wrapper.insertBefore !== undefined){
			console.warn("Native JS");
			var myParentNode = v.option.wrapper;
		}else{
			console.error("Could not detect the type of wrapper");
		}

	}


	if(v.option.history === undefined) v.option.history=false;

//	console.log(myParentNode);
	v.wrapper = myParentNode.insertBefore(div, this_script);
	v.wrapper.id = "VLScreen" + NVLScreens;
	if(v.option.area === null ) v.option.area = "#"+v.wrapper.id;
	v.option.backgroundcolor = v.option.backgroundcolor || 0xffffff;
	$(v.wrapper).addClass("vlv_wrapper");



	v.wrapperStyle = {};//v.wrapper.style;

	v.option.BinSize = v.option.BinSize || 3 ; // 3Angstrom
	v.shiftPressed=false;

	v.option.radius = v.option.radius || { bond : 0.1, atom : 0.6 };
	if(v.option.atoms===undefined) v.option.atoms = true;
	if(v.option.bonds===undefined) v.option.bonds = true;
	if(v.option.axis===undefined) v.option.axis = true;
	if(v.option.selectInfo===undefined) v.option.selectInfo = true;
	if(v.option.cell===undefined) v.option.cell = true;
	if(v.option.perspective===undefined) v.option.perspective = true;
	if(v.option.cellInfo===undefined) v.option.cellInfo = true;
	if(v.option.cellInfoSpaceGroup===undefined) v.option.cellInfoSpaceGroup = false;
	if(v.option.ghosts ===undefined) v.option.ghosts=false;
	if(v.option.ghosts_direction ===undefined) v.option.ghosts_direction=[2,2,2];
	if(v.option.calculate_gofr ===undefined) v.option.calculate_gofr=false;
	if(v.option.gofr_resolution ===undefined) v.option.gofr_resolution = 0.05;

	if(v.option.shift===undefined) v.option.shift = false;

	if(v.option.strList===undefined) v.option.strList = false;
	if(v.option.strListInfo===undefined) v.option.strListInfo = false;
	if(v.option.strListSlide===undefined) v.option.strListSlide = false;
	if(v.option.strListDel===undefined) v.option.strListDel = true;

	if(v.option.shift_val === undefined) v.option.shift_val = [0,0,0];
//	if(v.option.light ===undefined) v.option.light=[false, false, false];
	if(v.option.light ===undefined) v.option.light=[{pos:{x:0,y:0}, on:true, intensity: 0.333},
													{pos:{x:0,y:0}, on:true, intensity: 0.333},
													{pos:{x:0,y:0}, on:true, intensity: 0.333}];



	v.analysis = {};



//  History button
	//v.wrapper.parentNode.append("<div><img src=img/vis_history.png></div>");
		$(v.wrapper).append("<div id=VLScreen_cellInfo"+NVLScreens+"></div>");
		v.cellInfoWrapper = $('#VLScreen_cellInfo'+NVLScreens);
		v.cellInfoWrapper.css({
			position:"absolute",
			"font-size":"9px"
		});
	if(!v.option.cellInfo){
		v.cellInfoWrapper.hide();
	}
		$(v.wrapper).append('<div class="VLScreen_selectInfo" style="position: absolute; font-size: 9px; left: 0.5em; top: 0.5em; width: 160px; height: 55px; text-align: left;"></div>');
	

		$(v.wrapper).append('<div class="VLScreen_listInfo" style="position: absolute; font-size: 9px; right: 0.5em; top: 0.5em; width: 160px; height: 55px; text-align: right;"><i class="fas fa-list-ul structure_list_info" style="font-size:15px;"></i></div>');
		v.strInfoWrapper=$(v.wrapper).find(".VLScreen_listInfo");
		if(!v.option.strListInfo){
			v.strInfoWrapper.hide();
		}
		v.strInfoWrapper.find(".structure_list_info").click(function(e){
			v.showStructureList();
			e.stopPropagation();
			e.preventDefault();
		});

		v.showStructureList=function(){
			var p_target=$(v.wrapper).parents(".visualizer_wrapper");
			if(v.structureListWrapper===undefined){
				p_target.append("<div class=strlist_wrapper><label>Structure List</label><i style='float:right;cursor:pointer;' class='fas fa-play strlist_slide_start'></i><i style='float:right;cursor:pointer;display:none;' class='fas fa-pause strlist_slide_stop'></i><table class=table><thead><tr><th>Name</th><th>Formula</th><th>a</th><th>b</th><th>c</th><th></th></tr></thead><tbody></tbody></table></div>");
				v.structureListWrapper=p_target.find(".strlist_wrapper");
				if(v.option.strListDel){
					v.structureListWrapper.find("tbody").sortable({
						update:function(event,ui){
							var __newlist = $(event.target).find(".strlist_tr");
							var __nlist=[];
							for(let i=0 ; i<__newlist.length ; i++){
								__nlist.push($(__newlist[i]).data('idx'));
							}
							var new_strlist=objClone(v.strlist);
							v.strlist.length=0;
							for(let i=0 ; i<__nlist.length ; i++){
								if(__nlist[i]===v.strNum){
									v.strNum=i;
									break;
								}
							}
							for(let i=0 ; i<__nlist.length ; i++){
								v.strlist.push(new_strlist[__nlist[i]]);
							}
							v.drawStructureList();
						}
					});
				}
				v.structureListWrapper.find(".strlist_slide_start").click(function(){
					$(this).hide();
					$(this).parent().find(".strlist_slide_stop").show();
					v.option.strListSlide=true;
					v.strListSlide();
				});
				v.structureListWrapper.find(".strlist_slide_stop").click(function(){
					$(this).hide();
					$(this).parent().find(".strlist_slide_start").show();
					v.option.strListSlide=false;
				});
			}
			v.drawStructureList();
			if(v.option.strList){
				v.structureListWrapper.hide();
			}else{
				v.structureListWrapper.show();				
			}
			v.option.strList=!v.option.strList;
			console.log(p_target);
			console.log("clicked");
		};
		v.drawStructureList=function(){
			v.structureListWrapper.find('table>tbody').empty();
			for(var i=0 ; i<v.strlist.length ; i++){
				if(v.strlist[i]["history"].length === 0){
					continue;
				}
				let str_str=objClone(v.strlist[i]["history"][v.strlist[i]["Structure"]].Structure);
				for(var j=0 ; j<3 ; j++){
					str_str.a[j]=str_str.a[j].toFixed(2)*1;
					str_str.b[j]=str_str.b[j].toFixed(2)*1;
					str_str.c[j]=str_str.c[j].toFixed(2)*1;
				}
				let str_formula=VLatoms.Utils.Structure.toFormula(str_str);
				var ih="";
				ih+="<tr class='strlist_tr "+(v.strNum===i?"selected_strlist":"")+"' data-idx="+i+">";
				ih+="<td><span class=str_name_span data-idx="+i+">"+v.strlist[i]["name"]+"</span><input class=str_name_input data-idx="+i+" style='display:none;width:75px;'></td>";
				ih+="<td>"+str_formula.formulaStr+"</td>";
				ih+="<td>"+str_str.a.join("<br>")+"</td>";
				ih+="<td>"+str_str.b.join("<br>")+"</td>";
				ih+="<td>"+str_str.c.join("<br>")+"</td>";
				if(v.option.strListDel){
					ih+="<td><i style='color:red;cursor:pointer;' class='fas fa-minus-circle delete_str_list'></i></td>";
				}else{
					ih+="<td></td>";
				}
				ih+="</tr>";
				v.structureListWrapper.find("table>tbody").append(ih);
			}
			v.structureListWrapper.find("table>tbody").append("<tr data-idx=-1><td colspan=6 style='text-align:center;'><i style='color:green;font-size:20px;' class='fas fa-plus-circle add_str_list'></i></td></tr>");
			v.structureListWrapper.find("table>tbody").find(".delete_str_list").click(function(e){
				let _idx=$(this).parents("tr").data('idx');
				v.removeStrlist(_idx);
				v.drawStructureList();
				e.stopPropagation();
			});

			v.structureListWrapper.find("table>tbody>tr").find(".str_name_span").click(function(e){
				let _idx=$(this).data('idx');
				$(this).hide();
				$(this).parent().find("input").val($(this).text());
				$(this).parent().find("input").show();
				$(this).parent().find("input").focus();
				e.stopPropagation();
			});

			v.structureListWrapper.find("table>tbody>tr").find(".str_name_input").focusout(function(){
				console.log("focusout")
				let _idx=$(this).data('idx');
				let n_name=$(this).val();
				$(this).hide();
				$(this).parent().find("span").text(n_name);
				$(this).parent().find("span").show();
				v.strlist[_idx].name=n_name;
			});
			v.structureListWrapper.find("table>tbody>tr").find(".str_name_input").mousedown(function(e){
				e.stopPropagation();
			});
			v.structureListWrapper.find("table>tbody>tr").find(".str_name_input").click(function(e){
				e.stopPropagation();
			});

			v.structureListWrapper.find("table>tbody>tr").click(function(){
				let _idx=$(this).data('idx');
				if(_idx===-1) return;
				if(_idx===v.strNum){
					return;
				}
				v.loadStrlist(_idx);
				v.structureListWrapper.find("table>tbody").find(".selected_strlist").removeClass("selected_strlist");
				$(this).addClass("selected_strlist");
			});
			v.structureListWrapper.find("table>tbody>tr").find(".add_str_list").click(function(){
				v.addStrlist();
				v.drawStructureList();
			});

		}
		v.addStrlist = function(){
			v.strlist.push({"name":"Structure-"+v.strlist.length,"Structure":0,"history":[]});
			v.loadStrlist(v.strlist.length -1);
		}
		v.loadStrlist = function(idx){
			if(idx>=v.strlist.length){
				console.log("returned");
				return false;
			}
			if(v.strNum>=v.strlist.length){
				v.strNum=0;
			}
			if(v.strNum !== idx){
				v.strlist[v.strNum]["history"]=JSON.parse(JSON.stringify(v.Manipulate.history));
				v.strNum=idx;
			}
			v.Manipulate.history=v.strlist[v.strNum]['history'];
			if(v.Manipulate.history.length===0 && idx!== 0){
				v.Manipulate.addHistory({
					mode:"New Structure",
					args:{},
					Structure:objClone(v.Structure),
				});	
			}
			if(v.strlist[v.strNum]["history"].length>0){
				v.Structure=VLatoms.Utils.redefineStructure(v.strlist[v.strNum]["history"][v.strlist[v.strNum]["Structure"]]["Structure"]);
			}
			v.Manipulate.updateHistoryTbl();
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
		}
		v.strListSlide=function(){
			if(v.option.strListSlide){
				let next=v.strNum*1+1;
				if(next>=v.strlist.length){
					next=0;
				}
				v.loadStrlist(next);
				v.drawStructureList();
				setTimeout(function(){
					v.strListSlide();
				},500);
			}
		}
		v.removeStrlist = function(idx){
			if(!v.option.strListDel){
				return;
			}
			if(v.strlist.length===1){
				return false;
			}
			v.strlist.splice(idx,1);
			v.drawStructureList();
			if(idx<v.strNum){
				v.strNum=v.strNum-1;
			}else if(idx===v.strNum){
				v.strNum=0;
			}
			v.loadStrlist(v.strNum);
		}

/* Structure List */
	NVLScreens++;
// -------------------------------------------------------------------------------- //

/* Initialize Renderer */

	var render_option =  {	antialias : true,
							preserveDrawingBuffer :  true,
							sortobjects : false
							};
	if (window.WebGLRenderingContext){
		v.renderer  =  new THREE.WebGLRenderer(render_option);
	}else{
		alert("Canvas Renderer!");
		v.renderer  =  new THREE.CanvasRenderer(render_option);
	}
	v.renderer.setClearColor( v.option.backgroundcolor ,1);
	v.renderer.sortObjects=false;
	v.renderer.shadowMap.enabled=true;
	v.renderer.shadowMap.type=THREE.PCFSoftShadowMap;

	v.setSize = function(w,h){
		if(h==undefined){
			v.wrapperStyle.width = $(myParentNode).width();
			v.wrapperStyle.height = $(myParentNode).height();
		}else{
			v.wrapperStyle.width = w; 
			v.wrapperStyle.height = h;
		}
		if(v.option.size!==undefined){
			v.wrapperStyle.width = v.option.size.width;
			v.wrapperStyle.height = v.option.size.height;
		}
		v.option.camera.aspect = v.wrapperStyle.width/v.wrapperStyle.height;
		if(v.camera instanceof THREE.PerspectiveCamera){
			 v.camera.aspect=v.option.camera.aspect;
		}else if(v.camera instanceof THREE.OrthographicCamera){
			v.OrthographicCamera.left = v.wrapperStyle.width / -2;
			v.OrthographicCamera.right = v.wrapperStyle.width / 2;
			v.OrthographicCamera.top = v.wrapperStyle.height / 2;
			v.OrthographicCamera.bottom = v.wrapperStyle.height / -2;
		}
		$(v.wrapper).width(v.wrapperStyle.width);
		$(v.wrapper).height(v.wrapperStyle.height);
		$(v.wrapper).css("overflow","hidden");
		$(v.wrapper).css("position","relative");
		$(v.wrapper).css("-webkit-box-shadow"," 0px 0px 10px 1px rgba(189,189,189,1)");
		$(v.wrapper).css("-moz-box-shadow"," 0px 0px 10px 1px rgba(189,189,189,1)");
		$(v.wrapper).css("box-shadow"," 0px 0px 10px 1px rgba(189,189,189,1)");
		v.renderer.setSize( v.wrapperStyle.width, v.wrapperStyle.height );
		// Cell Info Window
		v.cellInfoWrapper.css({
		//	"left":v.wrapperStyle.width-135,
			"right":"0.5em",
			"bottom":"0.5em",
			"width":160,
			"text-align":"right"
		});
		// Message window
		
		if(v.messageWrapper ===undefined){
			$(v.wrapper).append("<div id=VLScreen_message"+NVLScreens+" class=VLScreen_message><div class='messagebox'></div></div>");
			v.messageWrapper = $("#VLScreen_message"+NVLScreens);
		}
		v.messageWrapper.css({
			width:v.wrapperStyle.width,
			height:v.wrapperStyle.height,
		});
		v.messageWrapper.find(".messagebox").html(v.option.placeholder);
		v.messageWrapper.find(".messagebox").unbind();
		v.messageWrapper.find(".messagebox").click(function(){
			var tmp_input_file = $(document.createElement("input"));
			tmp_input_file.attr("type","file");
			tmp_input_file[0].addEventListener("change",function(){
				v.IO.readFiles( this.files );
			});
			tmp_input_file.trigger("click");
			tmp_input_file.remove();

//	e.preventDefault();
//			var files = e.dataTransfer.files;
//			v.IO.readFiles( files );

			return false;
		});
	}
	v.setSize();
	v.wrapper.appendChild(v.renderer.domElement);

// -------------------------------------------------------------------------------- //

/* Drawing Functions */

	v.scene = new THREE.Scene();
	v.PerspectiveCamera = new THREE.PerspectiveCamera(	v.option.camera.fov, v.option.camera.aspect, v.option.camera.near, v.option.camera.far );
	v.OrthographicCamera = new THREE.OrthographicCamera(	v.wrapperStyle.width/-2, v.wrapperStyle.width/2, v.wrapperStyle.height/2, v.wrapperStyle.height/-2, 0.0001, 99999999 );
	var orgdist = -1;
	v.setPerspectiveCamera = function(){
		v.camera = v.PerspectiveCamera;
		v.controls.object = v.camera;
		v.camera.up.copy(v.OrthographicCamera.up);
		v.camera.position.copy(v.OrthographicCamera.position.normalize().multiplyScalar(orgdist));

		v.controls.object = v.camera;
	}
	v.setOrthographicCamera = function(){
		v.camera = v.OrthographicCamera; 
		v.camera.up.copy(v.PerspectiveCamera.up);
		v.camera.position.copy(v.PerspectiveCamera.position);
		orgdist = v.camera.position.length();
console.log('orgdis',orgdist);
		v.camera.zoom=10;
		v.camera.position.normalize().multiplyScalar(30);
		v.camera.updateProjectionMatrix();
		v.controls.object = v.camera;
	}
	//v.setPerspectiveCamera();
	v.camera=v.PerspectiveCamera;
	//v.camera = new THREE.CombinedCamera( v.wrapperStyle.width, v.wrapperStyle.height, v.option.camera.fov, v.option.camera.near, v.option.camera.far, 0.001, 100000);
	//v.setOrthographicCamera();

//jh
	v.scene.add(v.camera);
	v.light=[];
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	//v.light = new THREE.PointLight( 0xffffff, 1 );

	v.controls = new THREE.TrackballControls( v.camera, v.renderer.domElement );
//js
v.controls.visualizer=v;
	v.controls.rotateSpeed  =  1.2;
	v.controls.zoomSpeed  =  1.2;
	v.controls.panSpeed  =  1;
	v.controls.noZoom  =  false;
	v.controls.noPan  =  false;
	v.controls.staticMoving  =  true;
	v.controls.dynamicDampingFactor  =  0.3;
	v.controls.wheelEvent = function(){ v.animateControl.once(); };
	for(var i=0;i<3;i++){
	v.light[i].castShadow=true;
	v.light[i].shadow.bias = 0.0001;
	v.light[i].shadow.mapSize.width=1024;
	v.light[i].shadow.mapSize.height=512;
	v.scene.add( v.light[i] );
	}

	
	//window.addEventListener('resize',v.onWindowResize,false);
	$(window).on("resize",function(){
			v.onWindowResize();
	});
	v.onWindowResizeAction = [];	//schan
	v.onWindowResize = function(){
		v.setSize();
		v.controls.handleResize();

		v.camera.updateProjectionMatrix();
	
		v.onWindowResizeAction.forEach(function(e){e();});	

		v.animateControl.once();
		v.draw.Axis();
	}


	//v.Sphere = new THREE.SphereGeometry( 1, v.option.resolution*2, v.option.resolution, 0, Math.PI*2 );
	//v.Cylinder = new THREE.CylinderGeometry(1, 1, 1, 0, 0, false );
	var _Sphere = new THREE.SphereGeometry( 1, v.option.resolution*2, v.option.resolution, 0, Math.PI*2 );
	//var _Sphere = new THREE.IcosahedronGeometry(1,1);
	v.Sphere = new THREE.BufferGeometry().fromGeometry(_Sphere);

	v.Axis=[];
	var _Cylinder = new THREE.CylinderGeometry(1, 1, 1, 0, 0, false );
	var _Cone = new THREE.CylinderGeometry(1, 0, 1, 0, 0, false );
	v.Cylinder = new THREE.BufferGeometry().fromGeometry(_Cylinder);
	v.Cone = new THREE.BufferGeometry().fromGeometry(_Cone);
	v.atomMeshes = Array(); // Mesh Array
	v.bondMeshes = Array(); // Mesh Array
	v.ghostMeshes = Array(); // Mesh Array
	v.customMeshes = Array();

	v.update = {
		atomsChanged : false,
		bondsChanged : false,
		bondsScaleChanged : false,
		cellInfo: function(){
			var _t = v.cellInfoWrapper;
			if(!v.option.cellInfo){
				_t.html("");
				_t.hide();
				return;
			}
			_t.show();
			var la = VLatoms.Math.len(v.Structure.a);
			var lb = VLatoms.Math.len(v.Structure.b);
			var lc = VLatoms.Math.len(v.Structure.c);
			var al = Math.acos( VLatoms.Math.dot(v.Structure.b, v.Structure.c) / lb / lc)*180/Math.PI;
			var be = Math.acos( VLatoms.Math.dot(v.Structure.c, v.Structure.a) / lc / la)*180/Math.PI;
			var gam= Math.acos( VLatoms.Math.dot(v.Structure.a, v.Structure.b) / la / lb)*180/Math.PI;

			//for density
			let elementInfo = {};
			v.Structure.atoms.forEach((v,i,a)=>{
				if(elementInfo[v.element] === undefined){
					elementInfo[v.element] = {mass:v.mass, n:1};
				}else{
					elementInfo[v.element].n++;
				}
			});


			let mass = 0;
			for(let i in elementInfo){
				mass += elementInfo[i].mass * elementInfo[i].n;
			}
			let volume = Math.abs(math.dot(math.cross(v.Structure.a, v.Structure.b), v.Structure.c));
			let Navogadro = 6.022140857 // *10^23
			let density = Math.round(mass / volume / Navogadro *10 * 10000)/10000;
/*			
			var _s = v.IO.selectedAtoms;

			var selTxt="";
			if(_s.length>0) selTxt+="Selected : ";
			var selArr={};
			for(var i in _s){
				var element = v.Structure.atoms[_s[i]].element;
				if(selArr[element]===undefined){ selArr[element]=1;}
				else{ selArr[element]++;}
			}
			for(i in selArr){
				selTxt+=i+""+selArr[i]+" ";
			}
*/
			var innerhtml="";
			innerhtml += v.Structure.spacegroup == false || v.Structure.spacegroup == undefined ? "" : "Space group : "+SpaceGroups[v.Structure.spacegroup*1-1]+"("+v.Structure.spacegroup+")<br>";
			//		innerhtml+="Atoms : "+v.Structure.atoms.length+"<br>";
			innerhtml += v.Structure.formula ? JSON.stringify(v.Structure.formula.formulaArr).replace(/"/g,'').replace(/[{}]/g,"").replace(/:/g," : ").replace(/,/g,", ") + "<br>" : "<br>";
			innerhtml += "a,b,c (&#8491;) : <span style='color:rgb(200,0,0)'>"+la.toFixed(2)+"</span>, <span style='color:rgb(0,155,0)'>";
			innerhtml += lb.toFixed(2)+"</span>, <span style='color:rgb(0,0,155)'>";
			innerhtml += lc.toFixed(2)+"</span><br>";
			innerhtml += "&alpha;,&beta;,&gamma; (&deg;) : "+al.toFixed(2)+", ";
			innerhtml += be.toFixed(2)+", ";
			innerhtml += gam.toFixed(2)+"<br>";
			innerhtml += "Density : " + density + " g/cm<sup>3</sup>";
			//				innerhtml+=selTxt;
			_t.html(innerhtml);

		},
		selectInfo : function(){
//			v.option.selectInfo = !v.option.selectInfo;
			var target = $(v.wrapper).find(".VLScreen_selectInfo");
			target.empty();   
			if(!v.option.selectInfo){
				target.hide();   
				return;
			}
			target.show();
			if(v.IO.selectMode!="none"){
				var _t = "<font style='weight:bold;color:red;"+(v.IO.isMobile?"font-size:14px;":"")+"'>Press ESC key or touch <span class=VLatoms_mobile_esc>THIS</span><br> to exit select mode<br>"+(v.IO.isMobile?"<span class=VLatoms_mobile_delete>Delete selected atoms</span>":"")+"</font><br>";
				switch(v.IO.selectMode){
					case 'atom':
						target.html(_t+"Select mode - Single<br>");
						break;
					case 'rect':
						target.html(_t+"Select mode - Rectangular<br>");
						break;
					case 'circ':
						target.html(_t+"Select mode - Circle<br>");
						break;
					case 'element':
						target.html(_t+"Select mode - Element<br>");
						break;
					case 'hex':
						target.html(_t+"Select mode - Hexagon<br>");
						break;
					case 'lasso':
						target.html(_t+"Select mode - Lasso<br>");
						break;
					case 'sphere':
						target.html(_t+"Select mode - Sphere (Distance:"+v.IO.distance.toFixed(2)+"<br>");
						break;
					case 'pos':
						target.html(_t+"Select mode - Center Atom<br>");
						break;
				}
				if(v.ctlPressed===true){
					target.append('Reverse<br>');
				}
				target.find('.VLatoms_mobile_esc').unbind();
				target.find('.VLatoms_mobile_esc').bind("click",function(){
							v.ctxMenu.hide();
							v.IO.exitSelectMode();
				});
				target.find('.VLatoms_mobile_delete').unbind();
				target.find('.VLatoms_mobile_delete').bind("click",function(){
							v.manipulateAtom.removeSelectedAtoms();
				});

				var _selected_atoms=[];
				v.IO.selectedAtoms.forEach(function(_atom){ 
					for(var i=0;i<_selected_atoms.length;i++){
						if(_selected_atoms[i].element == v.Structure.atoms[_atom].element){
							_selected_atoms[i].count+=1;
							return;
						}
					}
					_selected_atoms.push({"element":v.Structure.atoms[_atom].element,"count":1});
				});
				var ih="";
				for(var i=0;i<_selected_atoms.length;i++){
					ih+=_selected_atoms[i].element +"="+ _selected_atoms[i].count+", ";
				}

				_ih=ih.substr(0,ih.length-2);
				if(_ih!=""){
					target.append(_ih);
				}
			}
		},
		applyStructure : function(structure){
			v.clear.atomsInStructure();//
			var _s = objClone(structure);
			v.Structure.a = _s.a;
			v.Structure.b = _s.b;
			v.Structure.c = _s.c;
			for(var i=0;i<_s.atoms.length;i++){
				var ca = _s.atoms[i];
				v.Structure.atoms.push( new VLatoms.Atom( ca.x, ca.y, ca.z, ca.element ) );
			}
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
		},
		atomPosition : function(newStructure){
			var ns = newStructure;
				for(var i=0;i<ns.atoms.length;i++){
					var ca = ns.atoms[i];
					if(v.option.shift){
						v.Structure.atoms[i].x = ca.x - v.option.shift_val[0];
						v.Structure.atoms[i].y = ca.y - v.option.shift_val[1];
						v.Structure.atoms[i].z = ca.z - v.option.shift_val[2];
					}else{
						v.Structure.atoms[i].x = ca.x;
						v.Structure.atoms[i].y = ca.y;
						v.Structure.atoms[i].z = ca.z;
					}

				}
//			v.update.atomsChanged=true;		//이걸 키면 원자 mesh를 다 새로 그리기 때문에 매우 느려지고, 이 함수는 원자가 바뀌지 않은 상황에서 위치만 바꾸기 위해 사용하는 함수기 때문에 킬 이유가 없음.
			v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
				for(var i=0;i<ns.atoms.length;i++){
					if(v.option.atoms){
						v.atomMeshes[i].position.set( v.Structure.atoms[i].x, v.Structure.atoms[i].y, v.Structure.atoms[i].z );
						v.set.toSceneCenter(v.atomMeshes[i]);
					}
				}
			v.update.bondsChanged=true;
			v.animateControl.once();

			for(var i=0;i<v.option.onUpdate.length;i++){
				v.option.onUpdate[i]();
			}
		//	console.log("QQQ");
		//console.log(v.Structure.atoms[0]);
		},
		atom : function(){
				v.draw.Cell();
				v.draw.Axis();
// 예전의 drawatom
				v.clear.atomsInScene();
				v.update.atomsChanged = false;
				if(!v.option.atoms) {  return false;}
				var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0x666666, shininess : 100, color : 0xff0000 });
				//var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0xffffff, shininess : 10, color : 0xff0000 });
				//var material = new THREE.MeshLambertMaterial({ reflectivity : 1.00 ,specular : 0x000000, shininess : 10, color : 0xff0000 });
				var ca, tmpmesh;
				let Natom = v.natoms();
				for( var i = 0 ; i < Natom ; i++ ){
					ca = v.Structure.atoms[i];
					if(v.option.atomDisplay[ca.element] == false) continue;
					tmpmesh = new THREE.Mesh( v.Sphere, material.clone() );
					tmpmesh.material.color.setHex( ca.color );

					tmpmesh.castShadow = true;
					tmpmesh.receiveShadow = true;

					tmpmesh.scale.set( ca.radius * v.option.radius.atom, ca.radius * v.option.radius.atom, ca.radius * v.option.radius.atom );
					tmpmesh.position.set( ca.x*1, ca.y*1, ca.z*1 );
					tmpmesh.atomid = i; // 나중에 Mouse Event로부터  ID를 추적하여 사용하기 위함
					v.atomMeshes.push( tmpmesh );
					v.set.toSceneCenter(tmpmesh);
					v.scene.add( tmpmesh );
				}
				if(v.natoms() == 0 ){
					v.messageWrapper.show();
				}else{
					v.messageWrapper.hide();
				}
				if(v.option.ghosts) v.update.ghosts();
				v.update.cellInfo();
				v.update.selectInfo();
				v.IO.highlightSelectedAtoms();
				for(var i=0;i<v.option.onUpdate.length;i++){
					v.option.onUpdate[i]();
				}

			},
		ghosts : function(){
			var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0xffffff, shininess : 100, color : 0xff0000, opacity:0.5 ,transparent : true});
			var ca, tmpmesh;
			var gidx = 0;
			var nghosts=v.option.ghosts_direction;
			for(var xx=nghosts[0]+1;xx<nghosts[0];xx++){
				for(var yy=nghosts[1]+1;yy<nghosts[1];yy++){
					for(var zz=nghosts[2]+1;zz<nghosts[2];zz++){
						for( var i = 0 ; i < v.natoms() ; i++ ){
							ca = objClone(v.Structure.atoms[i]);
							tmpmesh = new THREE.Mesh( v.Sphere, material.clone() );
							tmpmesh.material.color.setHex( ca.color );
							tmpmesh.scale.set( ca.radius * v.option.radius.atom, ca.radius * v.option.radius.atom, ca.radius * v.option.radius.atom );
							newpos = [ ca.x, ca.y, ca.z ];
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( xx, v.Structure.a ) )
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( yy, v.Structure.b ) )
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( zz, v.Structure.c ) )
							tmpmesh.position.set( newpos[0], newpos[1], newpos[2] );
							ca.x = newpos[0];
							ca.y = newpos[1];
							ca.z = newpos[2];
//HERE
							if(v.Structure.ghosts===undefined) v.Structure.ghosts=[];
							v.Structure.ghosts.push(ca);
							tmpmesh.atomid = gidx; // 나중에 Mouse Event로부터  ID를 추적하여 사용하기 위함
							v.ghostMeshes.push( tmpmesh );
							v.set.toSceneCenter(tmpmesh);
							v.scene.add( tmpmesh );
							gidx++;
						}
					}
				}
			}
				
		},
		bond : function(args){
			if(args===undefined){
				args = {gofr:false};
			}
			if(args.gofr === undefined){ 
				args.gofr = false;
			}
			var epsinv = 1/4*3.1415926535*0.1;
			if(!v.option.bonds || v.Structure.atoms.length > 500){
				v.clear.bondsInScene();
				this.bondsChanged = false;
				return;
			}
			var dx, dy, dz, dr;
			var neighs, atomi_r, atomj_r;
			var ca, cb;
			var cutoff;
			var nbonds = 0;
			if(v.option.calculate_gofr || args.gofr){
				v.analysis.gofr = [];
				for(var i = 0 ; i<100 ; i++){
					v.analysis.gofr[i] = 0;
				}
			}

			if(v.update.bin()==="bin false"){
				return;
			}; // Update bin indicies
//			console.log(v.Structure.atoms.length+"!!");
//			console.log(v.bondpairs_display);
			for( var i = 0 ; i < v.Structure.atoms.length ; i++ ){
				ca = v.Structure.atoms[i];
				atomi_r = ca.radius;
				neighs = v.get.NeighsChildren( ca.bin );
				for( var j = 0 ; j < neighs.length ; j++ ){
					if(neighs[j]>=i){
						continue;
					}
					cb = v.Structure.atoms[ neighs[j] ];
					if(( v.bondpairs_display.indexOf(ca.element+""+cb.element) < 0 ) && !args.gofr) continue;
					if(( v.bondpairs_display.indexOf(cb.element+""+ca.element) < 0 ) && !args.gofr) continue;
					atomj_r = cb.radius;

					cutoff = ( atomi_r + atomj_r ) * 1.08;
					if(v.option.calculate_gofr || args.gofr){
						var resol = v.option.gofr_resolution;
						dx = ca.x - cb.x ;
						dy = ca.y - cb.y ;
						dz = ca.z - cb.z ;
						dr = Math.sqrt( dx*dx + dy*dy + dz*dz );
						var idx = Math.floor(dr/resol);
						if(idx<100){
							v.analysis.gofr[idx]+=epsinv/(dr*dr);
						}
					}else{
						dx = Math.abs( ca.x - cb.x );
						if(dx > cutoff) continue;
						dy = Math.abs( ca.y - cb.y );
						if(dy > cutoff) continue;
						dz = Math.abs( ca.z - cb.z );
						if(dz > cutoff) continue;
						dr = Math.sqrt( dx*dx + dy*dy + dz*dz );
					}
					if(dr > cutoff) continue;
					if(dr > 0.001){
						if(v.bondMeshes[nbonds]===undefined){
							BondMesh = v.draw.Cylinder( ca, cb, v.option.radius.bond );
							BondMesh.castShadow=true;
							BondMesh.receiveShadow=true;
							v.set.toSceneCenter( BondMesh );
							v.bondMeshes.push( BondMesh );
							v.scene.add( BondMesh );
						}else{
							var vec = new THREE.Vector3( ca.x - cb.x,
									  ca.y - cb.y,
									  ca.z - cb.z
									 );
							v.bondMeshes[nbonds].rotation.z = Math.acos( vec.y / dr );
							v.bondMeshes[nbonds].rotation.y = 0.5 * Math.PI + Math.atan2( vec.x, vec.z );
							v.bondMeshes[nbonds].eularOrder = 'YZX';
							v.bondMeshes[nbonds].scale.y = vec.length();
							v.bondMeshes[nbonds].position.x = ( ca.x + cb.x ) /2;
							v.bondMeshes[nbonds].position.y = ( ca.y + cb.y ) /2;
							v.bondMeshes[nbonds].position.z = ( ca.z + cb.z ) /2;
							v.set.toSceneCenter( v.bondMeshes[nbonds] );
						}

						if( v.update.bondsScaleChanged ){
							v.bondMeshes[nbonds].scale.x = v.bondMeshes[nbonds].scale.z = v.option.radius.bond;
						}
						nbonds++;
					}
				}
			}
//remove bonds
			var obj;
			for(var i=v.bondMeshes.length-1;i>=nbonds;i--){
				obj = v.bondMeshes[i];
				if( obj instanceof THREE.Mesh ){
					v.scene.remove(obj);
					if( obj.geometry !== undefined ) obj.geometry.dispose();
					if( obj.material !== undefined ) obj.material.dispose();
				}
				v.bondMeshes.splice(i,1);
			}
			v.update.bondsChanged = false;
			v.update.bondsScaleChanged = false;
			if(args.gofr){return v.analysis.gofr;}
		},
		bin : function(){
			v.Structure.bin = [];
			var bs = v.option.BinSize;
			var bin_nx, bin_ny, bin_nz;
			
			var latMat = [ v.Structure.a, v.Structure.b, v.Structure.c ];
//	console.log("@");
//	console.log(v.Structure.bin);

			
			//var _atomPos_tmp = VLatoms.Math.vecdotmat(  [1,1,1], latMat );
/*				bin_nx = Math.floor( VLatoms.Math.len( v.Structure.a ) / bs );
				bin_ny = Math.floor( VLatoms.Math.len( v.Structure.b ) / bs );
				bin_nz = Math.floor( VLatoms.Math.len( v.Structure.c ) / bs );	*/
			//		
			//	bin_nx = Math.floor(_atomPos_tmp[0]/bs);
			//	bin_ny = Math.floor(_atomPos_tmp[1]/bs);
			//	bin_nz = Math.floor(_atomPos_tmp[2]/bs);
			var xmax,xmin,ymax,ymin,zmax,zmin;
			var refPos = [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[0,1,1],[1,0,1],[1,1,1]];
			for(var i=0;i<8;i++){
				var tmpPos=refPos[i];
				var atomPos_tmp = VLatoms.Math.vecdotmat(  tmpPos, latMat );
//	console.log(atomPos_tmp);
				if(xmax===undefined){
					xmax=atomPos_tmp[0];
					xmin=atomPos_tmp[0];

					ymax=atomPos_tmp[1];
					ymin=atomPos_tmp[1];

					zmax=atomPos_tmp[2];
					zmin=atomPos_tmp[2];
				}
				if(atomPos_tmp[0]<xmin) xmin=atomPos_tmp[0];
				if(atomPos_tmp[1]<ymin) ymin=atomPos_tmp[1];
				if(atomPos_tmp[2]<zmin) zmin=atomPos_tmp[2];

				if(atomPos_tmp[0]>xmax) xmax=atomPos_tmp[0];
				if(atomPos_tmp[1]>ymax) ymax=atomPos_tmp[1];
				if(atomPos_tmp[2]>zmax) zmax=atomPos_tmp[2];
			}
//console.log(xmax,xmin,ymax,ymin,zmax,zmin);	
			bin_nx = Math.floor((xmax - xmin)/bs);
			bin_ny = Math.floor((ymax - ymin)/bs);
			bin_nz = Math.floor((zmax - zmin)/bs);
			for(var i = 0 ; i<bin_nx * bin_ny * bin_nz; i++){
				v.Structure.bin[i]=[];
			}
			if( bin_nx == 0 ) bin_nx = 1;
			if( bin_ny == 0 ) bin_ny = 1;
			if( bin_nz == 0 ) bin_nz = 1;
			for( var i = 0 ; i < bin_nx * bin_ny * bin_nz ; i++) v.Structure.bin[i] = [] ;
			for( var i = 0 ; i < v.Structure.atoms.length ; i++ ){
				try{
					var ca = v.Structure.atoms[i] ;
					var myx = Math.floor( (ca.x-xmin) / bs );
					var myy = Math.floor( (ca.y-ymin) / bs );
					var myz = Math.floor( (ca.z-zmin) / bs );
					if( myx < 0 ) myx = bin_nx + myx;
					if( myy < 0 ) myy = bin_ny + myy;
					if( myz < 0 ) myz = bin_nz + myz;
					if( myx == bin_nx ) myx--;
					if( myy == bin_ny ) myy--;
					if( myz == bin_nz ) myz--;
					var binidx =   myx * bin_ny * bin_nz
								 + myy * bin_nz
								 + myz;
					v.Structure.bin[binidx].push( i );
					ca.bin = [ myx, myy, myz ];
				}catch(e){
					v.Structure.bin=[];
					return "bin false";
				}
			}
			v.Structure.bindim = [ bin_nx, bin_ny, bin_nz ];
		}
	};
	v.set = {
		toSceneCenter : function(mesh){
			var La = v.Structure.a;
			var Lb = v.Structure.b;
			var Lc = v.Structure.c;
			var Sa = VLatoms.Math.cdotvec(-0.5,La);
			var Sb = VLatoms.Math.cdotvec(-0.5,Lb);
			var Sc = VLatoms.Math.cdotvec(-0.5,Lc);
			var Spos = VLatoms.Math.vecdotmat([0.5,0.5,0.5],[La,Lb,Lc]); 
			var CurPos = mesh.position;
			//CurPos.set( CurPos.x - 0.5*Sx, CurPos.y - 0.5*Sy, CurPos.z - 0.5*Sz );
			CurPos.set( CurPos.x - Spos[0], CurPos.y - Spos[1], CurPos.z - Spos[2] );
			mesh.centered = true;
		}
	}
	v.get = {
		NeighsChildren : function( binarr, cutoff = 3 ){
// return neighboring bin's children atoms
			var pj = v.Structure;
			var nbin_x = pj.bindim[0];
			var nbin_y = pj.bindim[1];
			var nbin_z = pj.bindim[2];

			var xlist,ylist,zlist;
			xlist=[];
			ylist=[];
			zlist=[];
			xlist.push(binarr[0]);
			ylist.push(binarr[1]);
			zlist.push(binarr[2]);
			if(binarr[0]-1>=0){ xlist.push(binarr[0]-1);}else{  xlist.push(pj.bindim[0]-1); }
			if(binarr[1]-1>=0){ ylist.push(binarr[1]-1);}else{  ylist.push(pj.bindim[1]-1); }
			if(binarr[2]-1>=0){ zlist.push(binarr[2]-1);}else{  zlist.push(pj.bindim[2]-1); }
			if(binarr[0]+1<nbin_x){ xlist.push(binarr[0]+1);}else{  xlist.push(0); }
			if(binarr[1]+1<nbin_y){ ylist.push(binarr[1]+1);}else{  ylist.push(0); }
			if(binarr[2]+1<nbin_z){ zlist.push(binarr[2]+1);}else{  zlist.push(0); }
			var retarr=[];

			var i,j,k,binidx;
			for( var ii=0 ; ii<xlist.length ; ii++ ){
				for( var jj=0 ; jj<ylist.length ; jj++ ){
					for( var kk=0 ; kk<zlist.length ; kk++ ){
						i=xlist[ii];
						j=ylist[jj];
						k=zlist[kk];
						binidx=i*nbin_y*nbin_z+j*nbin_z+k;
						retarr = retarr.concat(v.Structure.bin[binidx]);
					}
				}
			}
			return retarr;
		}
	}

	v.clear = {
		customMeshes : function(){
			for( var i = v.customMeshes.length - 1 ; i >= 0 ; i-- )
			{
				obj = v.customMeshes[i];
				if( obj instanceof THREE.Mesh ){
					v.scene.remove(obj);
					if( obj.geometry !== undefined ) obj.geometry.dispose();
					if( obj.material !== undefined ) obj.material.dispose();
				}
				v.customMeshes.splice(i,1);
			}

		},
		atomsInStructure : function(){
			v.Structure.atoms = [];
			v.Structure.ghosts = [];
			v.clear.atomsInScene();
			v.clear.bondsInScene();
		},
		bondsInScene : function(){
			var obj;
			for( var i = v.bondMeshes.length - 1 ; i >= 0 ; i-- )
			{
				obj = v.bondMeshes[i];
				if( obj instanceof THREE.Mesh ){
					v.scene.remove(obj);
					if( obj.geometry !== undefined ) obj.geometry.dispose();
					if( obj.material !== undefined ) obj.material.dispose();
				}
				v.bondMeshes.splice(i,1);
			}

		},
		atomsInScene : function(){
			var obj;
			for( var i = v.atomMeshes.length - 1 ; i >= 0 ; i-- )
			{
				obj = v.atomMeshes[i];
				if( obj instanceof THREE.Mesh ){
					v.scene.remove(obj);
					if( obj.geometry !== undefined ) obj.geometry.dispose();
					if( obj.material !== undefined ) obj.material.dispose();
				}
				v.atomMeshes.splice(i,1);
			}
			for( var i = v.ghostMeshes.length - 1 ; i >= 0 ; i-- )
			{
				obj = v.ghostMeshes[i];
				if( obj instanceof THREE.Mesh ){
					v.scene.remove(obj);
					if( obj.geometry !== undefined ) obj.geometry.dispose();
					if( obj.material !== undefined ) obj.material.dispose();
				}
				v.ghostMeshes.splice(i,1);
			}
				
		},
		atoms : function(){
			v.clear.atomsInScene();
			v.clear.bondsInScene();
			v.clear.atomsInStructure();
			v.IO.selectedAtoms = [];
		}
	}
	v.draw = {
		Cell : function(){
			if( v.cellline !==undefined )
				v.scene.remove( v.cellline );
			if( !v.option.cell ) return;
			var la = v.Structure.a;//.split(" ");
			var lb = v.Structure.b;//.split(" ");
			var lc = v.Structure.c;//.split(" ");
			var latMat = [la,lb,lc];
			for(var i in latMat){
				for( j in latMat[i]){
					latMat[i][j]*=1;
				}
			}
			var pts = [];
			var _ax = la[0]*1; var _ay = la[1]*1; var _az = la[2]*1;
			var _bx = lb[0]*1; var _by = lb[1]*1; var _bz = lb[2]*1;
			var _cx = lc[0]*1; var _cy = lc[1]*1; var _cz = lc[2]*1;
			var cellgeom = new THREE.Geometry();
			cellgeom.vertices.push(new THREE.Vector3(0,0,0));
			cellgeom.vertices.push(new THREE.Vector3(_ax,_ay,_az));
			cellgeom.vertices.push(new THREE.Vector3(_ax+_bx,_ay+_by,_az+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_bx,_by,_bz));
			cellgeom.vertices.push(new THREE.Vector3(0,0,0));
			cellgeom.vertices.push(new THREE.Vector3(_cx,_cy,_cz));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_ax,_cy+_ay,_cz+_az));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_ax+_bx,_cy+_ay+_by,_cz+_az+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_bx,_cy+_by,_cz+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_cx,_cy,_cz));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_bx,_cy+_by,_cz+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_bx,_by,_bz));
			cellgeom.vertices.push(new THREE.Vector3(_ax+_bx,_ay+_by,_az+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_ax+_bx,_cy+_ay+_by,_cz+_az+_bz));
			cellgeom.vertices.push(new THREE.Vector3(_cx+_ax,_cy+_ay,_cz+_az));
			cellgeom.vertices.push(new THREE.Vector3(_ax,_ay,_az));
			var cellmaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1, linewidth: 5/*, vertexColors: THREE.VertexColors*/ } );
			v.cellline = new THREE.Line(cellgeom,cellmaterial);
			v.set.toSceneCenter(v.cellline);
			v.scene.add(v.cellline);
		},
		Axis : function(){
			if(v.Axis.length>0){
				v.camera.children=[];
				for(var i=v.Axis.length-1;i>=0;i--){
					v.scene.remove(v.Axis[i]);
				}
			}
			v.Axis=[];
			if(!v.option.axis) return;

			var latvec = []; // lattice vector
				latvec.push( v.Structure.a );
				latvec.push( v.Structure.b );
				latvec.push( v.Structure.c );
			var a0 = VLatoms.Math.vecdotmat([1,0,0],latvec);	
			var b0 = VLatoms.Math.vecdotmat([0,1,0],latvec);	
			var c0 = VLatoms.Math.vecdotmat([0,0,1],latvec);	
			var alen = Math.sqrt(a0[0]*a0[0]+a0[1]*a0[1]+a0[2]*a0[2]);
			var blen = Math.sqrt(b0[0]*b0[0]+b0[1]*b0[1]+b0[2]*b0[2]);
			var clen = Math.sqrt(c0[0]*c0[0]+c0[1]*c0[1]+c0[2]*c0[2]);
			if(alen*blen*clen==0||isNaN(alen*blen*clen)){return;}
			for(var i=0;i<3;i++){
				a0[i]/=alen;
				b0[i]/=blen;
				c0[i]/=clen;
			}
			var a0_cyl = v.draw.Cylinder({x:0,y:0,z:0},{x:a0[0],y:a0[1],z:a0[2]},0.15);
			var b0_cyl = v.draw.Cylinder({x:0,y:0,z:0},{x:b0[0],y:b0[1],z:b0[2]},0.15);
			var c0_cyl = v.draw.Cylinder({x:0,y:0,z:0},{x:c0[0],y:c0[1],z:c0[2]},0.15);

			var a0_cone = v.draw.Cylinder({x:a0[0],y:a0[1],z:a0[2]},{x:a0[0]*1.6,y:a0[1]*1.6,z:a0[2]*1.6},0.3,v.Cone);
			var b0_cone = v.draw.Cylinder({x:b0[0],y:b0[1],z:b0[2]},{x:b0[0]*1.6,y:b0[1]*1.6,z:b0[2]*1.6},0.3,v.Cone);
			var c0_cone = v.draw.Cylinder({x:c0[0],y:c0[1],z:c0[2]},{x:c0[0]*1.6,y:c0[1]*1.6,z:c0[2]*1.6},0.3,v.Cone);
			a0_cyl.material.color.setHex(0xff0000);
			a0_cone.material.color.setHex(0xff0000);
			b0_cyl.material.color.setHex(0x00ff00);
			b0_cone.material.color.setHex(0x00ff00);
			c0_cyl.material.color.setHex(0x0000ff);
			c0_cone.material.color.setHex(0x0000ff);
			v.Axis.push(a0_cyl);
			v.Axis.push(b0_cyl);
			v.Axis.push(c0_cyl);

			v.Axis.push(a0_cone);
			v.Axis.push(b0_cone);
			v.Axis.push(c0_cone);
			if(v.camera.type === "OrthographicCamera"){
				for(let i=0;i<v.Axis.length;i++){
					v.scene.add(v.Axis[i]);
					v.set.toSceneCenter( v.Axis[i] );
				}
			}else{
				let vls_ratio=v.wrapper.offsetHeight/600;
				let __pos_x=(v.wrapper.offsetWidth-120*vls_ratio)/v.wrapper.offsetWidth;
				let __pos_y=(v.wrapper.offsetHeight-120*vls_ratio)/v.wrapper.offsetHeight;
				let vector = new THREE.Vector3( -1*__pos_x, -1*__pos_y, 0.5 );
//왼쪽하단offset을 vector화

				v.camera.updateMatrixWorld(true);

				vector.unproject( v.camera );
				let raycaster = new THREE.Raycaster( v.camera.position, vector.sub( v.camera.position ).normalize() );
				var z_shift=-1000/v.camera.fov;

				var target_pos=new THREE.Vector3(raycaster.ray.origin.x-raycaster.ray.direction.x*z_shift,raycaster.ray.origin.y-raycaster.ray.direction.y*z_shift,raycaster.ray.origin.z-raycaster.ray.direction.z*z_shift);
//camera위치에서 목표지점으로 z_shift만큼 이동
				let _shift_value=target_pos.applyMatrix4(v.camera.matrixWorldInverse);
				let x_shift=_shift_value.x;
				let y_shift=_shift_value.y;
				v.Axis.Box = new THREE.Object3D();
				v.Axis.Box.position.x=x_shift;
				v.Axis.Box.position.y=y_shift;
				v.Axis.Box.position.z=z_shift;
				for(let i=0;i<v.Axis.length;i++){
					v.Axis.Box.add(v.Axis[i]);
				}
				var geometry = new THREE.SphereGeometry( 0.25,16,16 );
				var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0x666666, shininess : 100, color : 0xdedede });
				var sphere = new THREE.Mesh( geometry, material );
				v.Axis.Box.add(sphere);
				v.Axis.Box.rotateZ(-1*v.camera.rotation._z);
				v.Axis.Box.rotateY(-1*v.camera.rotation._y);
				v.Axis.Box.rotateX(-1*v.camera.rotation._x);
				v.camera.add(v.Axis.Box);
			}
//		return VLatoms.Math.vecdotmat( latvec, VLatoms.Math.random3() );

				
		},
		Cylinder : function( pos1, pos2, r0, Geom){
			if(Geom===undefined) Geom = v.Cylinder
			var Cylinder = new THREE.Mesh(  Geom,
											new THREE.MeshLambertMaterial({ color : 0xbbbbbb })
										 );
			var vec = new THREE.Vector3( pos1.x - pos2.x,
									  pos1.y - pos2.y,
									  pos1.z - pos2.z
									 );
			var len = vec.length();
			Cylinder.scale.set(r0,len,r0);
			Cylinder.overdraw = true;
			if( len > 0.001 ){
				Cylinder.rotation.z = Math.acos( vec.y / len );
				Cylinder.rotation.y = 0.5 * Math.PI + Math.atan2( vec.x, vec.z );
				Cylinder.eularOrder = 'YZX';
			}
			Cylinder.position.x = ( pos1.x + pos2.x ) /2;
			Cylinder.position.y = ( pos1.y + pos2.y ) /2;
			Cylinder.position.z = ( pos1.z + pos2.z ) /2;
			return Cylinder;
		}
	}
	v.animateId = undefined;
	v.onAnimate = false;
	v.animateControl = {
/*
 * once는 start 상태에서는 안먹힘(이미 그려지고 있는 상황이므로) -> 중복실행돌 방지
 * start 되어있는 상태에서 또 start 안됨-> 중복실행 방지
 * start를 유지해야 하면 playStack에 추가 
 * 
 */
		playStack : [],
		once : function(){
			if(!v.onAnimate){
				v.animateId = requestAnimationFrame(v.animate);
			} 
		},
		
		start : function(addStack){
			if(addStack != undefined){
				v.animateControl.playStack.push(addStack);
			}
			if(!v.onAnimate){
				v.onAnimate = true;
				v.animateId = requestAnimationFrame(v.animate); 
			}
		},
		stop : function(removeStack){
			if(removeStack != undefined){
				let removeIdx = v.animateControl.playStack.indexOf(removeStack);
				if(~removeIdx){
					v.animateControl.playStack.splice(removeIdx, 1);
				}
			}
		   if(v.animateControl.playStack.length < 1){
			   v.onAnimate = false;
		   }
		},

	}
	v.animate = function(){
		/* if Something changed on Scene (new atom, delete atom, move...) */
		if( v.update.atomsChanged ){
			v.update.atom();
/*	v.update.atom()에 있음
			for(var i=0;i<v.option.onUpdate.length;i++){
				v.option.onUpdate[i]();
			}
*/
		}
		if( v.update.bondsChanged ){
			v.update.bond();
		}
/*			var _v = new THREE.Vector3(0,0,-1).unproject(v.camera);
	console.log(_v);*/

		//requestAnimationFrame(v.animate);

		var cx,cy,cz;
		var carr = [];
		var refarr= [];
		var uparr=[];
		var _c;
		var __c=[];
		if( v.controls !== undefined ){ v.controls.update(); }
		//v.light.position.set( v.camera.position.x, v.camera.position.y, v.camera.position.z );
		uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
		_c = new THREE.Vector3(v.camera.position.x, v.camera.position.y, v.camera.position.z);
		_c.normalize();
		__c = [_c.x, _c.y, _c.z];
		refarr = VLatoms.Math.cross(uparr,__c); // ->

		for(var i=0;i<3;i++){			
			carr = [v.camera.position.x, v.camera.position.y, v.camera.position.z];
			carr = VLatoms.Math.rotateA(refarr,carr,v.option.light[i].pos.x);
			carr = VLatoms.Math.rotateA(uparr,carr,v.option.light[i].pos.y);


			//v.light.position.set( v.camera.up.x, v.camera.up.y, v.camera.up.z );
			v.light[i].position.set( carr[0]*CX, carr[1]*CX, carr[2]*CX);
		}


		v.renderer.render( v.scene, v.camera );
		if(v.onAnimate){
//			console.log('animateId : '+v.animateId);
			v.animateId = requestAnimationFrame(v.animate); 
		} else {
	//		cancelAnimationFrame(v.animateId);
		}
	}
	v.axisView = function(direction){
		var camRange = v.camera.position.length();
		var _sAxis=[[1,0,0],[0,1,0],[0,0,1]];
		let _sAxisUnit=[[1,0,0],[0,1,0],[0,0,1]];
		if(v.Structure !== undefined){
			if(v.Structure.a!==undefined){
				_sAxis[0] = VLatoms.Math.norm(v.Structure.a);
				_sAxis[1] = VLatoms.Math.norm(v.Structure.b);
				_sAxis[2] = VLatoms.Math.norm(v.Structure.c);
			}
		}
		var camPos, camUp, nowUp, checkUp;
		nowUp = [v.camera.up.x, v.camera.up.y, v.camera.up.z];
		switch(direction){
			case "x":
				camPos = [1, 0, 0];
				camUp = [0, 0, 1];
			break;
			case "-x":
				camPos = [1, 0, 0];
				camUp = [0, 0, 1];
			break;
			case "y":
				camPos = [0, 1, 0];
				camUp = [1, 0, 0];
			break;
			case "-y":
				camPos = [0, 1, 0];
				camUp = [1, 0, 0];
			break;
			case "z":
				camPos = [0, 0, 1];
				camUp = [0, 1, 0];
			break;
			case "-z":
				camPos = [0, 0, 1];
				camUp = [0, 1, 0];
			break;
			case "a":
				camPos = _sAxis[0];
				checkUp = math.equal(nowUp, _sAxis[2]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[0], _sAxis[1]);
				} else {
					camUp = _sAxis[2];
				}
			break;
			case "-a":
				camPos = _sAxis[0];
				checkUp = math.equal(nowUp, _sAxis[2]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[0], _sAxis[1]);
				} else {
					camUp = _sAxis[2];
				}
			break;
			case "b":
				camPos = _sAxis[1];
				checkUp = math.equal(nowUp, _sAxis[0]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[1], _sAxis[2]);
				} else {
					camUp = _sAxis[0];
				}
			break;
			case "-b":
				camPos = _sAxis[1];
				checkUp = math.equal(nowUp, _sAxis[0]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[1], _sAxis[2]);
				} else {
					camUp = _sAxis[0];
				}
			break;
			case "c":
				camPos = _sAxis[2];
				checkUp = math.equal(nowUp, _sAxis[1]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[2], _sAxis[0]);
				} else {
					camUp = _sAxis[1];
				}
			break;
			case "-c":
				camPos = _sAxis[2];
				checkUp = math.equal(nowUp, _sAxis[1]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[2], _sAxis[0]);
				} else {
					camUp = _sAxis[1];
				}
			break;
		}
//console.log('cam',camPos,camUp,camRange);
		v.camera.position.set(camPos[0], camPos[1], camPos[2]);
		v.camera.up.set(camUp[0], camUp[1], camUp[2]);
/*
		switch(direction){
			case "x":
				v.camera.position.set(_sAxis[0][0],_sAxis[0][1],_sAxis[0][2]);
				v.camera.up.set(_sAxis[2][0],_sAxis[2][1],_sAxis[2][2]);
			break;
			case "y":
				v.camera.position.set(_sAxis[1][0],_sAxis[1][1],_sAxis[1][2]);
				v.camera.up.set(_sAxis[2][0],_sAxis[2][1],_sAxis[2][2]);
			break;
			case "z":
				v.camera.position.set(_sAxis[2][0],_sAxis[2][1],_sAxis[2][2]);
				v.camera.up.set(_sAxis[1][0],_sAxis[1][1],_sAxis[1][2]);
			break;
		}
*/
		v.camera.position.multiplyScalar(camRange);
		v.controls.update();
		v.animateControl.once();
	}


	v.fill = {
		RandomMax : function(){


		}
	}

	v.setOptimalCamPosition = function(){
		if(!(v.camera instanceof THREE.PerspectiveCamera)) return;
		if(!v.Structure) return;
		if(!v.Structure.a) return;
		var la = VLatoms.Math.len( v.Structure.a );
		var lb = VLatoms.Math.len( v.Structure.b );
		var lc = VLatoms.Math.len( v.Structure.c );
		var maxcell = Math.max(la,lb,lc);
		if(maxcell==0) return;
		
		var orgCamPos = VLatoms.Utils.xyzToArr( v.camera.position.clone() );
		var orgCamRange = VLatoms.Math.len( orgCamPos );
		var newCamPos = VLatoms.Math.norm( orgCamPos );
		//var dist = (1 / Math.tan((v.camera.fov * ( Math.PI / 180 ) ) / 2) / maxcell )/ 2;
		var dist = maxcell/2 / Math.tan( v.camera.fov/2 * Math.PI/180 );

	v.controls.panSpeed  =  20/dist;
		v.camera.position.x = newCamPos[0]*dist;
		v.camera.position.y = newCamPos[1]*dist;
		v.camera.position.z = newCamPos[2]*dist;
		v.camera.updateProjectionMatrix();
	}
	v.camera.position.z=10;
	v.setOptimalCamPosition();

	v.animate();

// -------------------------------------------------------------------------------- //

/* Basic Functions and Data structure */
	v.Structure = {
/*		a : Array(3),
		b : Array(3),
		c : Array(3),*/
		a : [1, 0, 0],
		b : [0, 1, 0],
		c : [0, 0, 1],
		atoms : Array(),
		ghosts : Array()
	};
	v.strlist=[{"name":"Structure-0","Structure":-1,"history":[]}];
	v.strNum=0;

	v.isStructureSame = function (sA,sB){
		/*return : true - same
		 		   false - different */

		//cell
		if(!math.deepEqual(sA.a, sB.a)){return false;}
		if(!math.deepEqual(sA.b, sB.b)){return false;}
		if(!math.deepEqual(sA.c, sB.c)){return false;}
		if(sA.atoms.length != sB.atoms.length){return false;}
		for(var i in sA.atoms){
			for(var j in sA.atoms[i]){
				console.log(sA.atoms[i][j],sB.atoms[i][j],i,j);
				if(sA.atoms[i][j] != sB.atoms[i][j]){return false;}
			}
		}
		return true;
	}

	v.Atom = {
		add : function( x, y, z, element){
			v.Structure.atoms.push(new VLatoms.Atom( x, y, z, element));
			v.update.atomsChanged = true;
			v.animateControl.once();
			return v.Structure.atoms.length;
		}
	}
// -------------------------------------------------------------------------------- //
/* File (Import and export) */
	v.File = {
		Load : function(){
			var FileContainer = document.createElement('file');
		}
	}
// -------------------------------------------------------------------------------- //
	v.IO = {
		selectMode : "none",
		selectinverse : false,
		selectedAtoms : [],
		mousePressed : false,
		selecting : false,
		wasdrag : false,
		start : [ -1, -1 ],
		sphereCenter : new THREE.Vector3(0,0,0),
		distance : 0,
		rdfMode : false,
		end : [ -1, -1],
		focus : false,
		isMobile : false,
		init : function(){
			//			console.log(VLATOMS_PATH);
			// Drag and Drop
			v.wrapper.addEventListener('dragover', v.IO.dragOver ,false);
			v.wrapper.addEventListener('drop', v.IO.drop ,false);
			v.wrapper.addEventListener('contextmenu', v.IO.contextMenu ,false);




			
			document.addEventListener('mousedown', v.IO.mouseDown ,false);
			document.addEventListener('touchstart', v.IO.mouseDown ,false);

			document.addEventListener('mouseup', v.IO.mouseUp ,false);
			document.addEventListener('touchend', v.IO.mouseUp ,false);
			document.addEventListener('touchleave', v.IO.mouseUp ,false);

			document.addEventListener('mousemove', v.IO.mouseMove ,false);
			document.addEventListener('touchmove', v.IO.mouseMove ,false);
			//v.wrapper.addEventListener('mouseup', v.IO.mouseUp ,false);
			//v.wrapper.addEventListener('mousemove', v.IO.mouseMove ,false);
			v.shiftPressed=false;
			v.spacePressed=false;
			v.altPressed=false;
			v.ctlPressed=false;

			v.IO.initKey();
			v.IO.generateCtxMenu();
if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)) v.IO.isMobile = true;
			window.addEventListener("keydown", function(e) {
				//arrow keys
				if([37, 38, 39, 40].indexOf(e.keyCode) > -1 && v.IO.focus) {
					if($(document.activeElement).prop('tagName') != "INPUT"){
						e.preventDefault();
					}
				}
			}, false);

		},
		toggleSelection : function(mode){
			v.shiftPressed=false;
			v.ctlPressed=false;
			v.altPressed=false;
			v.spacePressed=false;
			v.IO.selectMode = mode;
			v.update.selectInfo();
		},
		generateCtxMenu : function(){
			var randno =(Math.random()*10000000).toFixed(0); 
			var ctxmenu="";
				ctxmenu+="<div id=VLAtomsCtx"+randno+" class=VLMessage style='width:280px;'><table class=VLMTable style='height:100%;width:100%;'>";
//				ctxmenu+="<thead class=VLMHeader><tr><td>Display Config</td></tr></thead>";
				ctxmenu+="<tbody class=VLMBody><tr><td>";
		ctxmenu+="<ul class='nav nav-tabs' role=tablist>";
		ctxmenu+="<li role=presentation class='nav-item'><a class='nav-link active' href=#VLCtx"+randno+"_display aria-controls=VLCtx"+randno+"_display role=tab data-toggle=tab style='color:black;background-color:inherit;'>Display</a></li>";
		ctxmenu+="<li role=presentation class='nav-item'><a class='nav-link' href=#VLCtx"+randno+"_measure aria-controls=VLCtx"+randno+"_measure role=tab data-toggle=tab style='color:black;background-color:inherit;'>Measure</a></li>";
		ctxmenu+="</ul>";

		ctxmenu+="<div class=tab-content>";
//Display
			ctxmenu+="<div role=tabpanel class='tab-pane active' id=VLCtx"+randno+"_display style='line-height:35px;'>";
				ctxmenu+="<div class=form-inline><span class=disp_option style='display: inline-block;margin-left: 16px;width: 95px;'>Download</span>";
				ctxmenu+="<a class='disp_download' href=javascript:; data-type='cif' style='display:inline-block; margin:0 5px;'>CIF</a>";
				ctxmenu+="<a class='disp_download' href=javascript:; data-type='vasp' style='display:inline-block; margin:0 5px;'>VASP</a>";
				ctxmenu+="</div>";
				ctxmenu+="<div class=form-inline style='display:flex;'><span data-option='backgroundcolor' style='margin-left:16px;display:inline-block;'><label style='width:95px;'><a href=javascript:;>Background </a></label></span>";
				ctxmenu+="<input id='backgroundcolor"+randno+"' class='form-control backgroundcolor ' style='width:130px;' type=text value='"+v.option.backgroundcolor.toString(16)+"'>";
				ctxmenu+="	<div style='display:inline;font-size:27px;margin-left:-30px;margin-top:-2px;'><button id='backgroundcolor_pick"+randno+"' style='width:20px; height:20px; border:#ccc solid 1px;'></button></div>";
				ctxmenu+="</div>";
				ctxmenu+="<div class=form-inline><div class='disp_option_toggle disp_toggle_swt' data-option='perspective' style='display:inline-block;'><label style='width:95px; display:inline-block;'><a href=javascript:;>Perspective</a></label></div>";
				ctxmenu+="<input class='form-control fov' style='width:130px;' type=range min=1 max=90 value="+v.camera.fov+"></div>";
				ctxmenu+="<div class=form-inline><div class='disp_option_toggle disp_toggle_swt ' data-option='atoms' style='display:inline-block;'><label style='width:40px; display:inline-block;'><a href=javascript:;>Atom</a></label></div>";
				ctxmenu+="<span class='fas fa-caret-down sub_option_toggle' data-toggletarget='atom_design_config_wrapper' style='margin-right:41px;'></span>";
				ctxmenu+="<input class='form-control atom_radius' style='width:130px;' type=range min=0.01 step=0.01 max=2 value="+v.option.radius.atom+"></div>";
				ctxmenu+="<div style='padding:0 40px; display:none;' class='atom_design_config_wrapper'></div>";
				ctxmenu+="<div class='atom_design_detail' data-targetelement='' style='margin-top:-10px;display:none;'>";
				ctxmenu+="	<div style='display:flex;'><span style='width:54px;'>Color</span><input type='text' id='element_color"+randno+"' class='form-control element_color' style='display:inline; width:110px;'><div style='display:inline;font-size:27px;margin-left:-30px;margin-top:-2px;'><button id='element_color_pick"+randno+"' style='width: 20px; height: 20px; border: 1px solid rgb(204, 204, 204);'></button></div></div>";
				ctxmenu+="	<div style='display:flex;'><span style='width:54px;'>Radius</span><input type='number' step='0.1' min='0' max='5' class='form-control element_radius' style='display:inline; width:110px;'></div>";
				ctxmenu+="</div>";
				ctxmenu+="<div class=form-inline><div class='disp_option_toggle disp_toggle_swt' data-option='bonds' style='display:inline-block;'><label style='width:40px; display:inline-block;'><a href=javascript:;>Bond</a></label></div>";
				ctxmenu+="<span class='fas fa-caret-down sub_option_toggle' data-toggletarget='bondpairs' style='margin-right:41px;'></span>";
				ctxmenu+="<input class='form-control bond_radius' style='width:130px;' type=range min=0.01 step=0.01 max=1 value="+v.option.radius.bond+"></div>";
				ctxmenu+="<div style='padding:0 35px; display:none;' class='bondpairs'></div>";
//Shift
				ctxmenu+="<div class=form-inline><div class='disp_option_toggle disp_toggle_swt ' data-option='shift' style='display:inline-block;'><label style='width:65px;display:inline-block;'><a href=javascript:;>Shift</a></label></div>";
				ctxmenu+="<span class='fas fa-caret-down sub_option_toggle' data-toggletarget='shift' style='margin-right:41px;'></span>";
				ctxmenu+="</div>";
				ctxmenu+="<div style='display:none;margin-left:16px;' class='shift'>";
				ctxmenu+="<div class='form-inline'><label style='width:45px;'>Value</label><input class='form-control cell_shift_x' style='width:45px;'><input class='form-control cell_shift_y' style='width:45px;'><input class='form-control cell_shift_z' style='width:45px;'>";
				ctxmenu+="<button type='button' class='btn manipulator_ok shift_cell btn-success'><span class='fas fa-check' aria-hidden='true'></span></button>";
				ctxmenu+="</div>";
				ctxmenu+="<div class='form-inline'><a class='center_to_atom' href='javascript:;'>Pick center atom</a></div>";
				ctxmenu+="<div class='form-inline'><a class='default_shift' href='javascript:;'>Default</a></div>";
				ctxmenu+="</div>";

				ctxmenu+="<div class=row><div class=col-6><span class='disp_option_toggle disp_toggle_swt' data-option='cell'><a href=javascript:;>Cell</a></span>";
				ctxmenu+="<span class='disp_option_toggle disp_toggle_swt' data-option='cellInfo'><a href=javascript:;>Cell Info</a></span>";
				ctxmenu+="</div>";
				ctxmenu+="<div class=col-6><span class='disp_option_toggle disp_toggle_swt' data-option='axis'><a href=javascript:;>Axis</a></span>";
				ctxmenu+="<span class='disp_option_toggle disp_toggle_swt' data-option='selectInfo'><a href=javascript:;>Select Info</a></span>";
				ctxmenu+="</div></div>";
				ctxmenu+="<div class=row><div class=col-12><span style='display:inline-block;width:115px;' class='disp_option_toggle disp_toggle_swt' data-option='ghosts'><a href=javascript:;>Ghosts</a></span>";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=x>x ";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=y style='margin-left:10px;'>y ";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=z style='margin-left:10px;'>z ";
				ctxmenu+="</div></div>";
//				ctxmenu+="<span class='disp_option' style='margin-left:16px;' data-option=''><a href=javascript:;>Lights</a></span>";
				/*	schan	*/
				ctxmenu+='<div class="form-inline">';
				ctxmenu+='	<div class="light_button_wrapper" data-lightnumber="1" style="display:inline; margin-right:5px;">';
				ctxmenu+='	<div class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='	   <label style="width:42px; margin-left:-8px; display:inline-block;">';
				ctxmenu+='		  <a href="javascript:;">Light1</a>';
				ctxmenu+='	   </label>';
				ctxmenu+='	</div>';
				ctxmenu+='	<span class="fas fa-caret-down sub_option_toggle" data-toggletarget="light_control_box" style="cursor:pointer; color: #999;"></span>';
				ctxmenu+='	</div>';
				ctxmenu+='	<div class="light_button_wrapper" data-lightnumber="2" style="display:inline; margin-right:5px;">';
				ctxmenu+='	<div class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='	   <label style="width:42px; margin-left:-8px; display:inline-block;">';
				ctxmenu+='		  <a href="javascript:;">Light2</a>';
				ctxmenu+='	   </label>';
				ctxmenu+='	</div>';
				ctxmenu+='	<span class="fas fa-caret-down sub_option_toggle" data-toggletarget="light_control_box" style="cursor:pointer; color: #999;"></span>';
				ctxmenu+='	</div>';
				ctxmenu+='	<div class="light_button_wrapper" data-lightnumber="3" style="display:inline; margin-right:5px;">';
				ctxmenu+='	<div class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='	   <label style="width:42px; margin-left:-8px; display:inline-block;">';
				ctxmenu+='		  <a href="javascript:;">Light3</a>';
				ctxmenu+='	   </label>';
				ctxmenu+='	</div>';
				ctxmenu+='	<span class="fas fa-caret-down sub_option_toggle" data-toggletarget="light_control_box" style="cursor:pointer; color: #999;"></span>';
				ctxmenu+='	</div>';
				ctxmenu+='</div>';
				ctxmenu+='<div class="form-inline light_control_box" data-lightnumber="" style="display:none; padding:0 30px;">';
				ctxmenu+=' 	<span class="fas fa-arrow-left light" data-arrow="left" aria-hidden="true"></span>';
				ctxmenu+=' 	<span class="fas fa-arrow-right light" data-arrow="right" aria-hidden="true"></span>';
				ctxmenu+=' 	<span class="fas fa-arrow-up light" data-arrow="top" aria-hidden="true"></span>';
				ctxmenu+=' 	<span class="fas fa-arrow-down light" data-arrow="bottom" aria-hidden="true"></span>';
				ctxmenu+='	<input class="form-control light" style="width:72px;" type="range" min="0.01" max="1.5" value="0.3" step="0.01">';
				ctxmenu+='</div>';
/*				ctxmenu+="<div style='width:200px;height:200px;margin-left:35px;border:solid 1px gray;position:relative;' class=lightpos_wrapper>";
				ctxmenu+="<div class=lightpos1 data-lightidx=0 style='width:20px;height:20px;border-radius:50%;position:absolute;background-color:#ccc;'></div>";
				ctxmenu+="<div class=lightpos2 data-lightidx=1 style='width:20px;height:20px;border-radius:50%;position:absolute;background-color:#ccc;'></div>";
				ctxmenu+="<div class=lightpos3 data-lightidx=2 style='width:20px;height:20px;border-radius:50%;position:absolute;background-color:#ccc;'></div>";
				ctxmenu+="</div>";*/
			ctxmenu+="</div>";
//Display-End
//Measure
			ctxmenu+="<div role=tabpanel class=tab-pane id=VLCtx"+randno+"_measure style='padding:5px 0;'>";
				ctxmenu+="<div class=form-inline>";
					ctxmenu+="<div class=form-group style='margin-bottom:10px;'>";
						ctxmenu+="<label style='width:110px;text-align:right;margin-right:3px;'>";
						ctxmenu+="Distance : ";
						ctxmenu+="</label>";
						ctxmenu+="<input type=text class='form-control VLCtx_distance' placeholder='Click here' style='width:140px;'>";
					ctxmenu+="</div>";
					ctxmenu+="<div class=form-group style='margin-bottom:10px;'>";
						ctxmenu+="<label style='width:110px;text-align:right;margin-right:3px;'>";
						ctxmenu+="Angle(Vectors) : ";
						ctxmenu+="</label>";
						ctxmenu+="<input type=text class='form-control VLCtx_angle' placeholder='Click here' style='width:140px;'>";
					ctxmenu+="</div>";
					ctxmenu+="<div class=form-group style='margin-bottom:10px;'>";
						ctxmenu+="<label style='width:110px;text-align:right;margin-right:3px;'>";
						ctxmenu+="Angle(Planes) : ";
						ctxmenu+="</label>";
						ctxmenu+="<input type=text class='form-control VLCtx_planeAngle' placeholder='Click here' style='width:140px;'>";
					ctxmenu+="</div>";

				ctxmenu+="</div>";
			ctxmenu+="</div>";
//Display-End
		ctxmenu+="</div>";
				ctxmenu+="</td></tr></tbody>";
				ctxmenu+="<tfoot class=VLMFooter><tr><td>";
				ctxmenu+="<button id=VLAtomsCtxDefaultBtn"+randno+" class='btn btn-info' style='margin-right:3px;'>Default</button>";
				ctxmenu+="<button id=VLAtomsCtxCloseBtn"+randno+" class='btn btn-info'>Close</button>";
				ctxmenu+="</td></tr></tfoot></table>";
				ctxmenu+="</div>";
			$(document.body).append(ctxmenu);
			v.ctxMenu = $('#VLAtomsCtx'+randno);
			v.ctxMenu.data('randno',randno);
			//css
			v.ctxMenu.find('.light.fas').css('cursor','pointer');
			v.ctxMenu.find('.light').css('margin','0 5px');
			v.ctxMenu.find('.shift_cell').click(function(){
				let ex_shift=[v.option.shift_val[0], v.option.shift_val[1], v.option.shift_val[2]];
				v.option.shift_val=[
					ex_shift[0] + v.ctxMenu.find(".cell_shift_x").val()*1,
					ex_shift[1] + v.ctxMenu.find(".cell_shift_y").val()*1,
					ex_shift[2] + v.ctxMenu.find(".cell_shift_z").val()*1
				];
				for(let i=0 ; i<3 ; i++){
					if(Number.isNaN(v.option.shift_val[i])){
						v.option.shift_val[0,0,0];
						v.ctxMenu.find(".cell_shift_x").val(v.option.shift_val[0])
						v.ctxMenu.find(".cell_shift_y").val(v.option.shift_val[1]);
						v.ctxMenu.find(".cell_shift_z").val(v.option.shift_val[2]);
						return false;
					}
				}
				v.ctxMenu.find(".cell_shift_x").val(0);
				v.ctxMenu.find(".cell_shift_y").val(0);
				v.ctxMenu.find(".cell_shift_z").val(0);
				if(v.option.shift){
					for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
						v.Structure.atoms[i].x = v.Structure.atoms[i].x - v.option.shift_val[0] + ex_shift[0];
						v.Structure.atoms[i].y = v.Structure.atoms[i].y - v.option.shift_val[1] + ex_shift[1];
						v.Structure.atoms[i].z = v.Structure.atoms[i].z - v.option.shift_val[2] + ex_shift[2];
					}
					v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
					v.update.atomsChanged = true;
					v.update.bondsChanged = true;
					v.animateControl.once();
				}
			});
			v.ctxMenu.find('.default_shift').click(function(){
				let ex_shift=[v.option.shift_val[0],v.option.shift_val[1],v.option.shift_val[2]];
				if(v.option.shift){
					for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
						v.Structure.atoms[i].x+=ex_shift[0];
						v.Structure.atoms[i].y+=ex_shift[1];
						v.Structure.atoms[i].z+=ex_shift[2];			
					}
				}
				v.ctxMenu.find(".cell_shift_x").val(0);
				v.ctxMenu.find(".cell_shift_y").val(0);
				v.ctxMenu.find(".cell_shift_z").val(0);
				v.option.shift_val=[0,0,0];
				v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
				v.update.atomsChanged = true;
				v.update.bondsChanged = true;
				v.animateControl.once();
			});
			v.ctxMenu.find('.center_to_atom').click(function(){
				let center=[];
				center[0]=(v.Structure.a[0]+v.Structure.b[0]+v.Structure.c[0])/2;
				center[1]=(v.Structure.a[1]+v.Structure.b[1]+v.Structure.c[1])/2;
				center[2]=(v.Structure.a[2]+v.Structure.b[2]+v.Structure.c[2])/2;
				let ex_shift=[v.option.shift_val[0],v.option.shift_val[1],v.option.shift_val[2]];
				console.log(center);
				v.IO.selectedAtoms=[];
				v.IO.toggleSelection("atom");
				v.IO.customSelectCallback.push(function(v){
					if(v.IO.selectedAtoms.length===0) return;
					let shift_atoms=v.Structure.atoms[v.IO.selectedAtoms];
					v.option.shift_val=[
						shift_atoms.x + ex_shift[0] - center[0],
						shift_atoms.y + ex_shift[1] - center[1],
						shift_atoms.z + ex_shift[2] - center[2]
					];
					v.ctxMenu.find(".cell_shift_x").val(0);
					v.ctxMenu.find(".cell_shift_y").val(0);
					v.ctxMenu.find(".cell_shift_z").val(0);
					for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
						v.Structure.atoms[i].x+=ex_shift[0];
						v.Structure.atoms[i].y+=ex_shift[1];
						v.Structure.atoms[i].z+=ex_shift[2];			
					}
					if(v.option.shift){
						for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
							v.Structure.atoms[i].x-=v.option.shift_val[0];
							v.Structure.atoms[i].y-=v.option.shift_val[1];
							v.Structure.atoms[i].z-=v.option.shift_val[2];
						}
						v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
						v.update.atomsChanged = true;
						v.update.bondsChanged = true;
						v.animateControl.once();
					}
					v.IO.customSelectCallback=[];
					v.IO.exitSelectMode();
				});
			});

			$('#VLAtomsCtxDefaultBtn'+randno).click(function(){ 
				if(confirm("All settings will be changed to default values.")){
					v.IO.ctxMenuCfg.load({cfgList:v.IO.ctxMenuCfg.defaultCtxOption}); 
					AtomParam = JSON.parse(JSON.stringify(_AtomParam));
					v.Structure.atoms.forEach(function(v,i,a){
							a[i].color = AtomParam[v.element].color;
					});
				}
			});
			$('#VLAtomsCtxCloseBtn'+randno).click(function(){ v.ctxMenu.hide(); });

			var dispOptions = ['perspective', 'atoms', 'bonds', 'cell', 'cellInfo', 'axis', 'ghosts', 'cellInfoSpaceGroup','shift'];
			for(var i in dispOptions){
				var key=dispOptions[i]; 
				if(!v.option[key]){
					v.ctxMenu.find('.disp_option_toggle[data-option="'+key+'"]').addClass("toggle_off");
				}
			}
/*			v.ctxMenu.draggable({
				drag:function(){
					$(this).css("height","auto");
				}
			});*/
			v.ctxMenu.css({
				"position":"absolute",
				"background-color":"white",
				"left":0,
				"top":0,
			});
			//Bind Download btns
			v.ctxMenu.find(".disp_download").click(function(){
				var type = $(this).data("type");
				var elArr = VLatoms.Utils.Structure.getElArr(v.Structure);
				var formula = "";
				for(var element in elArr){
					formula+=element;
					formula+=elArr[element];
				}
				switch(type){
					case "vasp":
						VLatoms.Utils.download("POSCAR."+formula+".vasp",VLatoms.Utils.Structure.toPoscar(v.Structure));
					break;
					case "cif":
						VLatoms.Utils.download(formula+".cif",VLatoms.Utils.Structure.toCIF(v.Structure));
					break; 
				}
			});
			//Bind measure 
			v.ctxMenu.find(".VLCtx_distance").click(function(){
				var _t = $(this);
				v.IO.customSelectCallback=[];
				v.IO.customSelectCallback.push(function(){
					switch(v.IO.selectedAtoms.length){
						case 2:
							var a1 = v.Structure.atoms[v.IO.selectedAtoms[0]];
							var a2 = v.Structure.atoms[v.IO.selectedAtoms[1]];
							var dist = VLatoms.Math.dist([a1.x, a1.y, a1.z],[a2.x, a2.y, a2.z]);
							_t.val(dist.toFixed(3)+" Å");
							v.IO.selectedAtoms = [];
							v.IO.selectMode="none";
							v.IO.customSelectCallback=[];
						break;
						case 1:
							_t.val("Select 1 more atom");
						break;
						case 0:
							_t.val("");
							v.IO.restoreAtomsColor();
							v.IO.highlightSelectedAtoms();
						break;
					}
				});
				v.IO.exitSelectMode();
				_t.val("Select two atoms");
				v.IO.selectMode="atom";
			});
			v.ctxMenu.find(".VLCtx_angle").click(function(){
				var _t = $(this);
				v.IO.customSelectCallback=[];
				v.IO.customSelectCallback.push(function(){
					switch(v.IO.selectedAtoms.length){
						case 3:
							var a1 = v.Structure.atoms[v.IO.selectedAtoms[0]];
							var a2 = v.Structure.atoms[v.IO.selectedAtoms[1]];
							var a3 = v.Structure.atoms[v.IO.selectedAtoms[2]];
							var dist1 = VLatoms.Math.dist([a1.x, a1.y, a1.z],[a2.x, a2.y, a2.z]);
							var dist2 = VLatoms.Math.dist([a2.x, a2.y, a2.z],[a3.x, a3.y, a3.z]);
							var vec1 = VLatoms.Math.subtract([a1.x, a1.y, a1.z],[a2.x, a2.y, a2.z]);
							var vec2 = VLatoms.Math.subtract([a3.x, a3.y, a3.z],[a2.x, a2.y, a2.z]);

							var _theta = VLatoms.Math.dot(vec1,vec2) / dist1 / dist2;
							var theta = Math.acos( _theta )*180/Math.PI;
							_t.val(theta.toFixed(3)+" °");
							v.IO.selectedAtoms = [];
							v.IO.selectMode="none";
							v.IO.customSelectCallback=[];
						break;
						case 2:
							_t.val("Select 1 more atom");
						break;
						case 1:
							_t.val("Select 2 more atoms");
							v.IO.restoreAtomsColor();
							v.IO.highlightSelectedAtoms();
						break;
					}
				});
				v.IO.exitSelectMode();
				_t.val("Select three atoms");
				v.IO.selectMode="atom";
			});
			v.ctxMenu.find(".VLCtx_planeAngle").click(function(){
				var _t = $(this);
				v.IO.customSelectCallback=[];
				v.IO.customSelectCallback.push(function(){
					switch(v.IO.selectedAtoms.length){
						case 4:
							let pangle=VLatoms.Math.checkPlaneAngle(v);
							_t.val(pangle.toFixed(3)+" °");
							v.IO.selectedAtoms = [];
							v.IO.selectMode="none";
							v.IO.customSelectCallback=[];
						break;
						case 3:
							_t.val("Select 1 more atom");
						break;
						case 2:
							_t.val("Select 2 more atoms");
						break;
						case 1:
							_t.val("Select 3 more atoms");
							v.IO.restoreAtomsColor();
							v.IO.highlightSelectedAtoms();					
						break;
					}
				});
				v.IO.exitSelectMode();
				_t.val("Select 4 more atoms");
				v.IO.selectMode="atom";
			});

			v.ctxMenu.hide();
//			v.IO.initializeLightPos();	//LightPos was deprecated. - schan
			v.IO.bindLightPos();
			v.ctxMenu.find(".backgroundcolor").change(function(){
				v.renderer.setClearColor(parseInt("0x"+$(this).val()));
				v.animateControl.once();
			});
			v.ctxMenu.find(".element_color").change(function(){
				let changedValue = "0x" + $(this).val().toUpperCase();
				let targetElement = $(this).parent().parent().data('targetelement');
				AtomParam[targetElement].color = changedValue;
				v.option.customAtomParam[targetElement] = v.option.customAtomParam[targetElement] || {};
				v.option.customAtomParam[targetElement].color = changedValue;
				v.Structure.atoms.forEach(function(v,i,a){
					if(v.element == targetElement){
						a[i].color = changedValue;
					}
				});
				v.IO.restoreAtomsColor();
			});
			v.ctxMenu.find(".element_radius").change(function(){
//맞는 값인지 조건 넣기
				let changedValue = $(this).val()*1;
				let targetElement = $(this).parent().parent().data('targetelement');
				AtomParam[targetElement].radius = changedValue;
				v.option.customAtomParam[targetElement] = v.option.customAtomParam[targetElement] || {};
				v.option.customAtomParam[targetElement].radius = changedValue;
				v.Structure.atoms.forEach(function(v,i,a){
					if(v.element == targetElement){
						a[i].radius = changedValue;
					}
				});
				v.update.atomsChanged = true;
				v.update.bondsChanged = true;
				v.animateControl.once();
			});
			v.ctxMenu.find(".fov").on("input change",function(){
				v.camera.fov=$(this).val()*1;
				v.camera.updateProjectionMatrix();
				v.setOptimalCamPosition();
				v.animateControl.once();
/*				if(v.camera.fov == 0 && (v.camera instanceof THREE.PerspectiveCamera)){
					v.setOrthographicCamera();
				}else if(v.camera.fov !=0 && (v.camera instanceof THREE.OrthographicCamera)){
					v.setPerspectiveCamera();
				}else{
					v.setOptimalCamPosition();
				}
*/

			});
			v.ctxMenu.find(".atom_radius").on("input change",function(){
				v.option.radius.atom = $(this).val()*1;
/*				if(v.option.radius.atom==0){
					v.option.atoms=false;
				}else{
					v.option.atoms=true;
				}*/
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
			});
			v.ctxMenu.find(".bond_radius").on("input change",function(){
				
				v.option.radius.bond = $(this).val()*1;
//				console.log(v.option.radius.bond,$(this).val()*1);
/*				if(v.option.radius.bond==0){
					v.option.bonds=false;
				{
					v.option.bonds=true;
				}*/
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.update.bondsScaleChanged=true;
				v.animateControl.once();
			});
			v.ctxMenu.find(".light").click(function(){
				var position_step = 10;
				
				var lightNumber = v.ctxMenu.find('.light_control_box').data('lightnumber') - 1;
				if (lightNumber == -1) return false;
				var arrow = $(this).data('arrow');	//find('.gliphicon-triangle-left').length);
				switch(arrow){
					case "left":
							v.option.light[lightNumber].pos.y = v.option.light[lightNumber].pos.y - position_step < -90
									? -90
									: v.option.light[lightNumber].pos.y - position_step;
					break;
					case "right":
							v.option.light[lightNumber].pos.y = v.option.light[lightNumber].pos.y + position_step > 90
									? 90 
									: v.option.light[lightNumber].pos.y + position_step;  
					break;
					case "top":
							v.option.light[lightNumber].pos.x = v.option.light[lightNumber].pos.x - position_step < -90
									? -90 
									: v.option.light[lightNumber].pos.x -= position_step; 
					break;
					case "bottom":
							v.option.light[lightNumber].pos.x = v.option.light[lightNumber].pos.x + position_step > 90
									? 90 
									: v.option.light[lightNumber].pos.x += position_step; 
					break;
/*	???
					case "selectInfo":
							v.option.selectInfo=!v.option.selectInfo;
					break;
*/
				}
				v.animateControl.once();
			});
			v.ctxMenu.find(".light.form-control").on("input change",function(){
				let changedValue = $(this).val()*1;
				var lightNumber = v.ctxMenu.find('.light_control_box').data('lightnumber') - 1;
				if (lightNumber == -1) return false;
				v.option.light[lightNumber].intensity = changedValue;
				v.light[lightNumber].intensity = changedValue;
				v.animateControl.once();
			});
			
			v.ctxMenu.find(".sub_option_toggle")
				.css('cursor','pointer')
				.css('color','#999')
				.click(function(){
					let toggleTarget = $(this).data('toggletarget');
					if(toggleTarget == "") return false;
console.log('toggle tar', toggleTarget);
					//set actions
					function toggle(_this){
						if($(_this).hasClass('fa-caret-down')){
							$(_this).addClass('fa-caret-up');
							$(_this).removeClass('fa-caret-down');
							v.ctxMenu.find('.'+toggleTarget).show();
						} else {
							$(_this).addClass('fa-caret-down');
							$(_this).removeClass('fa-caret-up');
							v.ctxMenu.find('.'+toggleTarget).hide();
						}
					}
					let argsBefore = {
						light_control_box : {
							_this : this,
							toggleTarget : toggleTarget,
						},
					};
					let argsAfter = {
						light_control_box : {
							_this : this,
							toggleTarget : toggleTarget,
						},
					};
					let actionBefore = {
						light_control_box : function(args){
							let lightNumber = $(args._this).parent().data('lightnumber');
							v.ctxMenu.find('.'+args.toggleTarget).data('lightnumber', lightNumber);
							v.ctxMenu.find('.light_button_wrapper>.fas').each(function(){
								if($(this).hasClass('fa-caret-up')){
									$(this).addClass('fa-caret-down');
									$(this).removeClass('fa-caret-up');
								}
							});
							v.ctxMenu.find('.light_control_box>input').val(v.option.light[lightNumber - 1].intensity);
						},
					};
					let actionAfter = {
					};

					//action
					if(actionBefore[toggleTarget] != undefined) actionBefore[toggleTarget](argsBefore[toggleTarget]);
					toggle(this);
					if(actionAfter[toggleTarget] != undefined) actionAfter[toggleTarget](argsAfter[toggleTarget]);
				});

			//변화가 생기면 우클릭메뉴 현 상태 저장
			v.ctxMenu.unbind();
			v.ctxMenu.draggable({
				drag:function(){
					$(this).css("height","auto");
				}
			});
			v.ctxMenu.bind("click",function(){
				v.IO.ctxMenuCfg.save();
			});
			v.ctxMenu.bind("change",function(){
				v.IO.ctxMenuCfg.save();
			});
		

			//color palet. need jscolor.js
			v.IO.ctxMenuCfg.jscolor.background = new jscolor("backgroundcolor_pick"+randno,{valueElement:"backgroundcolor"+randno, styleElement:"backgroundcolor_pick"+randno, zIndex:100000002});
			v.IO.ctxMenuCfg.jscolor.atom = new jscolor("element_color_pick"+randno,{valueElement:"element_color"+randno, styleElement:"element_color_pick"+randno, zIndex:100000002});
//, value:v.IO.ctxMenuCfg.option["v.ctxMenu.find('.backgroundcolor').val()"]
		},
		ctxMenuCfg : {
			jscolor : {},
			storeName : "",
			storeCfg: false,	//Before changing to true, storeName must be set.
			save: function (){
				if(!v.IO.ctxMenuCfg.storeCfg) return false;
				if(v.IO.ctxMenuCfg.storeName == "") {
					alert("'storeName' must be blank.");
					return false;
				}
				function setCookie(c_name,value,exdays){
					var exdate=new Date();
					exdate.setDate(exdate.getDate() + exdays);
					var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
					document.cookie=c_name + "=" + c_value;
				}
				var ghostChecked = v.ctxMenu.find('.ghosts_direction:checked');
					var ghostDirection=[];
				for(var i=0;i<ghostChecked.length;i++){
					ghostDirection.push(ghostChecked[i].value);
				}

				var ctxOption={
					"v.ctxMenu.find('.backgroundcolor').val()":v.ctxMenu.find(".backgroundcolor").val(),
					"v.option.perspective":v.option.perspective,
					"v.option.atoms":true,//v.option.atoms,
					"v.option.bonds":v.option.bonds,
					"v.ctxMenu.find('.atom_radius').val()":v.ctxMenu.find('.atom_radius').val(),
					"v.ctxMenu.find('.bond_radius').val()":v.ctxMenu.find('.bond_radius').val(),
					"v.ctxMenu.find('.fov').val()":v.ctxMenu.find('.fov').val(),
					"v.option.cell":v.option.cell,
					"v.option.cellInfo":v.option.cellInfo,
					"v.option.cellInfoSpaceGroup":v.option.cellInfoSpaceGroup,
					"v.option.selectInfo":v.option.selectInfo,
					"v.option.axis":v.option.axis,
					"v.option.ghosts":v.option.ghosts,
					"v.option.ghosts_direction[0]":v.option.ghosts_direction[0],
					"v.option.ghosts_direction[1]":v.option.ghosts_direction[1],
					"v.option.ghosts_direction[2]":v.option.ghosts_direction[2],
					"v.option.light":v.option.light,
					"_ghostDirection":ghostDirection,
					"v.option.customAtomParam":v.option.customAtomParam,
				}

				setCookie(v.IO.ctxMenuCfg.storeName,JSON.stringify(ctxOption));

			},
			load: function(args){
				function getCookie(c_name){
					var i,x,y,ARRcookies=document.cookie.split(";");
					for (i=0;i<ARRcookies.length;i++)
					{
				  	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
				  	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
				  	  x=x.replace(/^\s+|\s+$/g,"");
				  	  if (x==c_name)
				  	  {
				  		  return unescape(y);
				  	  }
					}
				}
				//쿠키에 저장된 값 불러오기
				var _ctx_Option = getCookie(v.IO.ctxMenuCfg.storeName);

				if(_ctx_Option === undefined) return false;
				ctx_Option = JSON.parse(_ctx_Option);
				if(args !== undefined){
					if(args.cfgList !== undefined){
						ctx_Option = args.cfgList;
					}
				}
				v.IO.ctxMenuCfg.option = ctx_Option;
				//값 불러오기 끝

				//값 배분
				v.ctxMenu.find(".backgroundcolor").val(ctx_Option["v.ctxMenu.find('.backgroundcolor').val()"]);
				v.IO.ctxMenuCfg.jscolor.background.fromString(ctx_Option["v.ctxMenu.find('.backgroundcolor').val()"]);
//				v.option.perspective=ctx_Option['v.option.perspective'];
				v.ctxMenu.find('.fov').val(ctx_Option["v.ctxMenu.find('.fov').val()"]);
//				v.option.atoms=ctx_Option['v.option.atoms'];
				v.ctxMenu.find('.atom_radius').val(ctx_Option["v.ctxMenu.find('.atom_radius').val()"]);
//				v.option.radius.atom=ctx_Option["$('.atom_radius').val()"];
//				v.option.bonds=ctx_Option['v.option.bonds'];
				v.ctxMenu.find('.bond_radius').val(ctx_Option["v.ctxMenu.find('.bond_radius').val()"]);
//				v.option.radius.bond=ctx_Option["$('.bond_radius').val()"];
//				v.option.cell=ctx_Option['v.option.cell'];
//				v.option.cellInfo=ctx_Option['v.option.cellInfo'];
//				v.option.axis=ctx_Option['v.option.axis'];
//				v.option.selectInfo=ctx_Option['v.option.selectInfo'];
//				v.option.ghosts=ctx_Option['v.option.ghosts'];
				v.option.ghosts_direction[0]=ctx_Option['v.option.ghosts_direction[0]'];
				v.option.ghosts_direction[1]=ctx_Option['v.option.ghosts_direction[1]'];
				v.option.ghosts_direction[2]=ctx_Option['v.option.ghosts_direction[2]'];
				var _ghostDirection=ctx_Option['_ghostDirection'];
				v.option.light = ctx_Option['v.option.light'] ? JSON.parse(JSON.stringify(ctx_Option['v.option.light'])) : v.option.light;
				v.light[0].intensity = v.option.light[0].intensity;
				v.light[1].intensity = v.option.light[1].intensity;
				v.light[2].intensity = v.option.light[2].intensity;
				v.option.customAtomParam = ctx_Option['v.option.customAtomParam'];
				v.option.customAtomParam = v.option.customAtomParam || {};
				for(let i in v.option.customAtomParam){
					for(let j in v.option.customAtomParam[i]){
						AtomParam[i][j] = v.option.customAtomParam[i][j];
					}
				}
				//값 배분 완료

				//값 적용(구조 로딩 전)
				v.ctxMenu.find(".backgroundcolor").change();

				var toggleOption=['perspective','atoms','bonds','cell','cellInfo', 'selectInfo','axis', 'ghosts'];
				for(var i=0;i<toggleOption.length;i++){
					var tmp="v.option."+toggleOption[i];
					var toggle = !v.ctxMenu.find('.disp_option_toggle[data-option='+toggleOption[i]+']').hasClass("toggle_off");
					if(ctx_Option[tmp] !== toggle){
						v.ctxMenu.find('.disp_toggle_swt[data-option='+toggleOption[i]+']').click();
					}
				}
				//클릭시 메시지가 뜨기 때문에 클릭 하지 않고 별도로 설정
				if(ctx_Option["v.option.cellInfoSpaceGroup"]){
					v.option.cellInfoSpaceGroup = true;
					v.ctxMenu.find('.disp_toggle_swt[data-option=cellInfoSpaceGroup]').removeClass("toggle_off");
				}
				var targetLight=v.ctxMenu.find('.disp_option_toggle[data-option=light]');
				for(var i=0;i<3;i++){
					if(v.option.light[i].on){
//						$(targetLight[i]).removeClass("toggle_off");
					}else{
						$(targetLight[i]).addClass("toggle_off");
						$(targetLight[i]).parent().find('.fas').hide();
						$(targetLight[i]).find('label').css('width','59.6px');
						v.light[i].intensity = 0;
					}
				}

				var ghostWillChecked = v.ctxMenu.find('.ghosts_direction');
				for(var i =0;i<ghostWillChecked.length;i++){
					if(_ghostDirection.indexOf(ghostWillChecked[i].value)<0){
						$(ghostWillChecked[i]).prop('checked',false);
					}else{
						$(ghostWillChecked[i]).prop('checked',true);
					}
				}
				//값 적용(최초 구조 로딩 후)
				v.ctxMenu.find('.fov').change();
				v.ctxMenu.find('.atom_radius').change();
				v.ctxMenu.find('.bond_radius').change();
				//적용완료
			},
			defaultCtxOption:{
					"v.ctxMenu.find('.backgroundcolor').val()":"ffffff",
					"v.option.perspective":true,
					"v.option.atoms":true,
					"v.option.bonds":true,
					"v.ctxMenu.find('.atom_radius').val()":0.6,
					"v.ctxMenu.find('.bond_radius').val()":0.1,
					"v.ctxMenu.find('.fov').val()":3,
					"v.option.cell":true,
					"v.option.cellInfo":true,
					"v.option.cellInfoSpaceGroup":false,
					"v.option.selectInfo":true,
					"v.option.axis":true,
					"v.option.ghosts":false,
					"v.option.ghosts_direction[0]":2,
					"v.option.ghosts_direction[1]":2,
					"v.option.ghosts_direction[2]":2,
					"v.option.light":[{pos:{x:0,y:0}, on:true, intensity: 0.333},
									  {pos:{x:0,y:0}, on:true, intensity: 0.333},
									  {pos:{x:0,y:0}, on:true, intensity: 0.333}],
					"_ghostDirection":['x','y','z'],
					"AtomParam":{},
			},
		},
/*		initializeLightPos : function(){
			var _lw = v.ctxMenu.find('.lightpos_wrapper');
			for(var i=0;i<3;i++){
				var lx = v.option.lightpos[i].x;
				var ly = v.option.lightpos[i].y;
				v.ctxMenu.find('.lightpos'+(i+1)).css("left",(ly+90)*180/200);
				v.ctxMenu.find('.lightpos'+(i+1)).css("top",(lx+90)*180/200);
			}
		},*/	/* LightPos was deprecated. - schan */
		bindLightPos : function(){
			v.ctxMenu.find('.disp_toggle_swt').click(function(e,u){
				//e.preventDefault(); // 이거 왜했지?
				var mode = $(this).data("option");
				switch(mode){
					case "perspective":
						v.option.perspective = !v.option.perspective;
						if(v.option.perspective){
							v.ctxMenu.find(".fov").show();
							v.setPerspectiveCamera();
						}else{
							v.ctxMenu.find(".fov").hide();
							v.setOrthographicCamera();
						}
					break;
					case "shift":
						v.option.shift=!v.option.shift;
						if(v.option.shift){
							for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
								v.Structure.atoms[i].x-=v.option.shift_val[0];
								v.Structure.atoms[i].y-=v.option.shift_val[1];
								v.Structure.atoms[i].z-=v.option.shift_val[2];
							}
							v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
							v.update.atomsChanged = true;
							v.update.bondsChanged = true;
							v.animateControl.once();
						}else{
							for(let i=0, len=v.Structure.atoms.length ; i<len ; i++){
								v.Structure.atoms[i].x+=v.option.shift_val[0];
								v.Structure.atoms[i].y+=v.option.shift_val[1];
								v.Structure.atoms[i].z+=v.option.shift_val[2];
							}
							v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true});
							v.update.atomsChanged = true;
							v.update.bondsChanged = true;
							v.animateControl.once();
						}
					break;
					case "atoms":
						v.option.atoms=!v.option.atoms;
						if(v.option.atoms){
							v.ctxMenu.find(".atom_radius").show();
							$(this).parent().find('.fas').show();
						}else{
							v.ctxMenu.find(".atom_radius").hide();
							$(this).parent().find('.fas').hide();
						}
					break;
					case "bonds":
						v.option.bonds=!v.option.bonds;
						if(v.option.bonds){
							v.ctxMenu.find(".bond_radius").show();
							$(this).parent().find('.fas').show();
						}else{
							v.ctxMenu.find(".bond_radius").hide();
							$(this).parent().find('.fas').hide();
						}
					break;
					case "cell":
						v.option.cell=!v.option.cell;
					break;
					case "cellInfo":
						v.option.cellInfo=!v.option.cellInfo;
						if(v.option.cellInfo){
								v.ctxMenu.find('.disp_toggle_swt[data-option="cellInfoSpaceGroup"]').show();
						} else {
								v.ctxMenu.find('.disp_toggle_swt[data-option="cellInfoSpaceGroup"]').hide();
						}
					break;
					case "cellInfoSpaceGroup":
						if(!v.option.cellInfoSpaceGroup){
							if(confirm("Structural changes may be slowed by space group decision time.\nIf the number of atoms is more than 200, space group is not displayed.")){
								v.option.cellInfoSpaceGroup=!v.option.cellInfoSpaceGroup;
//								v.update.cellInfo();
							} else {
								return false;
							}
						} else {
							v.option.cellInfoSpaceGroup=!v.option.cellInfoSpaceGroup;
						}
					break;
					case "selectInfo":
						v.option.selectInfo = !v.option.selectInfo;
/*						if(!v.option.selectInfo){ 
								$("#VLScreen_selectInfo").empty(); 
						} */
					break;
					case "axis":
						v.option.axis=!v.option.axis;
					break;
					case "ghosts":
	//TODO HERE #92
						v.option.ghosts=!v.option.ghosts;
						if(v.option.ghosts){
							v.option.ghosts_direction=[1,1,1];
							v.ctxMenu.find('.ghosts_direction:checked').each(function(){
								console.log($(this).val());
								switch($(this).val()){
									case "x": v.option.ghosts_direction[0] = 2; break;
									case "y": v.option.ghosts_direction[1] = 2; break;
									case "z": v.option.ghosts_direction[2] = 2; break;
								}
							});
						}
					break;
					case "ghosts_direction":
						v.option.ghosts_direction=[1,1,1];
						v.ctxMenu.find('.ghosts_direction:checked').each(function(){
							if(this.checked){
								switch($(this).val()){
									case "x": v.option.ghosts_direction[0] = 2; break;
									case "y": v.option.ghosts_direction[1] = 2; break;
									case "z": v.option.ghosts_direction[2] = 2; break;
								}
							}
						});
						console.log(v.option.ghosts_direction);
					break;
					case "light":
						let lightNumber;
						lightNumber = $(this).parent().data('lightnumber') - 1;
						v.option.light[lightNumber].on = !v.option.light[lightNumber].on;
						let toggleIcon = $(this).parent().find('.fas'); 
						if (v.option.light[lightNumber].on){
							v.light[lightNumber].intensity = v.option.light[lightNumber].intensity;
							if(toggleIcon.hasClass('fa-caret-up')){
								toggleIcon.addClass('fa-caret-down');
								toggleIcon.removeClass('fa-caret-up');
							}
							$(this).parent().find('.fas').show();
							$(this).find('label').css('width','42px');
						} else {
							v.light[lightNumber].intensity = 0;
							v.ctxMenu.find('.light_control_box').hide();
							$(this).parent().find('.fas').hide();
							$(this).find('label').css('width','59.6px');
						}
					break;
				}
//console.log(this)
				if($(this).hasClass("disp_option_toggle")){
					if($(this).hasClass("toggle_off")){
						$(this).removeClass("toggle_off");
					}else{
						$(this).addClass("toggle_off");
					}
				}

				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
			});
			v.ctxMenu.find('.toggle_ghosts').click(function(){
				v.option.ghosts=!v.option.ghosts;
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
			});

/*			for(var i=1;i<=3;i++){
				v.ctxMenu.find('.lightpos'+i).draggable({
					containment:v.ctxMenu.find('.lightpos_wrapper'),
					drag:function(){
					var _lw = v.ctxMenu.find('.lightpos_wrapper');
					var tp = $(this).position();
					var tx = tp.left;
					var ty = tp.top;
					var thisidx = +$(this).data("lightidx");
					v.option.lightpos[thisidx].y = -90+tx/200*180;
					v.option.lightpos[thisidx].x = -90+ty/200*180;
				}});
				v.ctxMenu.find('.lightpos'+i).bind({"mousewheel":function(e,u){
						e.preventDefault();
						var del = -e.originalEvent.wheelDelta;
						var thisidx = +$(this).data("lightidx");
						$(this).css("width",v.light[thisidx].intensity*60+6);
						$(this).css("height",v.light[thisidx].intensity*60+6);
						if(del<0){
							v.light[thisidx].intensity+=0.05;
						}else{
							var inten = v.light[thisidx].intensity;
							if(inten<0.1){
								v.light[thisidx].intensity=0;
							}else{
								v.light[thisidx].intensity-=0.05;
							}
						}
					}
				});
			}*/ 	/* LightPos was deprecated. - schan */

		},
		initKey : function(){
			$(document).keydown(function(e,u){
				if( !v.IO.focus ) return;
				var domtype = $(e.target)[0].type || "Default";
				if($(e.target)[0].isContentEditable) domtype = "textarea";
				if(domtype != "text" && domtype != "textarea" && domtype != "select-one"){
					switch(e.keyCode*1){
						case 16 : // SHIFT
							v.shiftPressed=true;
						break;
						case 17 :  // CTL
							v.ctlPressed=true;
						break;
						case 18 :  // ALT
							v.altPressed=true;
						break;
						case 32 : // space
							v.spacePressed=true;
							e.preventDefault();
							e.stopPropagation();
						break;
					}
				}
				v.update.selectInfo();
			});
			$(document).keyup(function(e,u){

				if( !v.IO.focus ) return;
				var domtype = $(e.target)[0].type || "Default";
				if($(e.target)[0].isContentEditable) domtype = "textarea";
				if((domtype != "text" && domtype != "textarea" && domtype != "select-one" && domtype != "password") || +e.keyCode==27){
					switch(e.keyCode*1){
						case 16 : // Shift
							v.shiftPressed=false;
						break;
						case 17 :  // CTL
							v.ctlPressed=false;
						break;
						case 18 :  // ALT
							v.altPressed=false;
						break;
						case 27 :  // ESC
							v.ctxMenu.hide();
							v.IO.exitSelectMode();
						break;
						case 32 : // space
							v.spacePressed=false;
						break;
						case 46 :  // Delete
							v.manipulateAtom.removeSelectedAtoms();
						break;
						case 86 : // v
							if(v.ctlPressed==true){
								v.Manipulate.paste();
								v.Manipulate.addHistory({
									mode:"Paste",
									args:{},
									Structure:objClone(v.Structure),
								});
							}
						break;
						case 65 :  // a
							v.axisView("a");
						break;
						case 66 :  // b 
							v.axisView("b");
						break;
						case 67 :  // c 
							v.axisView("c");
						break;
						case 88 :  // x
							v.axisView("x");
						break;
						case 89 :  // y 
							v.axisView("y");
						break;
						case 90 :  // z 
							v.axisView("z");
						break;
						case 81: // q
							v.manipulateAtom.rotate({direction:"vz",step:-v.option.step.rotate,onEscape:v.option.onEscape});	
						break;
						case 69: // e
							v.manipulateAtom.rotate({direction:"vz",step:v.option.step.rotate,onEscape:v.option.onEscape});	
						break;
						case 38: // up arrow
//						case 87: // w
							v.manipulateAtom.move({direction:"vy",step:v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 37: //left arrow
//						case 65: //a
							v.manipulateAtom.move({direction:"vx",step:-v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 39: // right arrow
//						case 68: // d
							v.manipulateAtom.move({direction:"vx",step:v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 40: // down arrow
//						case 83: // s
							v.manipulateAtom.move({direction:"vy",step:-v.option.step.move,onEscape:v.option.onEscape});	
						break;




					}
				}
				v.update.selectInfo();
			});
			$(v.wrapper).bind({
				"contextmenu":function(e,u){
					e.preventDefault();
					e.stopPropagation();
				}
			});
		},
		showCtxMenu : function(e){
					if(!v.IO.wasdrag){	//temporarily true
						var ctxMenuHeight = 600; // 
						var targetY = e.pageY;
						var _overflowY = $(window).height() +$(window).scrollTop() - ( e.pageY + ctxMenuHeight );
					console.log(_overflowY);
						if(  _overflowY<0 /* Overflow */ ){
							targetY += _overflowY - 30;
						}
						v.ctxMenu.css("left",e.pageX+20);
						v.ctxMenu.css("top",targetY);
						v.ctxMenu.show();
						v.ctxMenu.find(".VLCtx_distance").val("");
						v.ctxMenu.find(".VLCtx_angle").val("");
						v.ctxMenu.css("z-index",$.topZIndex()+1);
					}
					


		},
		restoreAtomsColor : function(){
/*	원자별 표시 선택 기능 추가로 atoms 순서와 Meshes 순서가 같지 않음. (Meshes가 모자람)
			for(var idx in v.Structure.atoms){
				var ca = v.Structure.atoms[idx];
				try{
					v.atomMeshes[idx].material.color.setHex(ca.color);	
				}catch(e){
				}
			}
*/
			for(let idx in v.atomMeshes){
				try{
					v.atomMeshes[idx].material.color.setHex(v.Structure.atoms[v.atomMeshes[idx].atomid].color);	
				}catch(e){
				}
			}
			v.animateControl.once();
		},
		blurAtoms : function(){
	// TODO HERE
			for(var i=0;i<v.atomMeshes.length;i++){
				v.atomMeshes[i].material.opacity = 0.3;
			}
		},
		unblurAtoms : function(){
			for(var i=0;i<v.atomMeshes.length;i++){
				v.atomMeshes[i].material.opacity = 1;
			}
		},
		highlightSelectedAtoms : function(){
			 if(v.IO.selectedAtoms.length != 0){
				 for(var i=0;i<v.IO.selectedAtoms.length;i++){
					 var ca_idx = v.IO.selectedAtoms[i];
/*	원자별 표시 선택 기능 추가로 atoms 순서와 Meshes 순서가 같지 않음. (Meshes가 모자람)
					 v.atomMeshes[ca_idx].material.color.setHex('0x0000ff');
					 v.atomMeshes[ca_idx].material.opacity = 1;
*/
					 meshIndex = v.atomMeshes.findIndex(function(e){ return e.atomid == ca_idx; });
					 v.atomMeshes[meshIndex].material.color.setHex('0x0000ff');
					 v.atomMeshes[meshIndex].material.opacity = 1;
				 }
			 }
			v.animateControl.once();
		},
		dragOver : function( e ){
			e.stopPropagation();
			e.preventDefault();
		},
		readFiles : function(files){
			for(var i=0;i<files.length;i++){
			var reader = new FileReader();
				reader.onload = (function(f){
					var fileName = f.name;
					var _fn = fileName.split(".");
					var suffix="none";
					if(fileName.toLowerCase().match("poscar") || fileName.toLowerCase().match("contcar")){
						 suffix="POSCAR";
					}else if(_fn.length>1){
						suffix = _fn[_fn.length-1];
					}
					
					if(suffix == "vasp" || suffix == "VASP") suffix="POSCAR";
					
					return function(e){
						var text = e.target;
						var StructureRead=text.result;
						//var _structure = VLatoms.Utils.Structure.poscarToVLatoms(StructureRead);
						switch(suffix){
							case "xyz":
								var _structure = VLatoms.Utils.Structure.xyzToVLatoms(StructureRead);
							break;
							case "cif":
								var _structure = VLatoms.Utils.Structure.cifToVLatoms(StructureRead);
							break;
							case "POSCAR":
								var _structure = VLatoms.Utils.Structure.poscarToVLatoms(StructureRead);
							break;
							case "none":
							break;
						}
//						v.manipulateAtom.appendStructure(_structure);
						if(v.Structure.atoms!==undefined){
							if(v.Structure.atoms.length!=0){
								if(confirm("Do you want to append structure?")){
									for(var i=0;i<_structure.atoms.length;i++){
//										v.manipulateAtom.checkAtomPositionAfterManipulate(_structure.atoms[i],i,true);
									}
									if(confirm("Do you want to keep the cell size?")){
										var testRet = v.Manipulate.insideTest(_structure.atoms, {onEscape:true});//
										var oldNatoms = v.Structure.atoms.length;
										v.Structure = VLatoms.Utils.Structure.union(v.Structure,_structure);
									} else {
										var testRet = v.Manipulate.insideTest(_structure.atoms);//
										var oldNatoms = v.Structure.atoms.length;
										v.Structure = VLatoms.Utils.Structure.union(v.Structure,_structure);
										v.Manipulate.vacuum({
														"nx":testRet.delta[0],
														"ny":testRet.delta[1],
														"nz":testRet.delta[2],
														"px":testRet.delta[3],
														"py":testRet.delta[4],
														"pz":testRet.delta[5]}
										);
									}
	
									v.IO.selectedAtoms = [];
									for(var i=oldNatoms;i<v.Structure.atoms.length;i++){
										v.IO.selectedAtoms.push(i);
									}
									alert("New atoms are selected. please move new atoms to proper position");
								}else{
									v.Structure = _structure;
								}
							}else{
								v.Structure = _structure;
							}
						}else{
							v.Structure = _structure;
						}
						
						if(v.fileReaderCallback) v.fileReaderCallback({fileName:fileName,structure:_structure});	
						
						//v.Structure = _structure;
						v.update.atomsChanged = true;
						v.update.bondsChanged = true;
						v.setOptimalCamPosition();
						v.animateControl.once();
						v.Manipulate.addHistory({
							mode:"File Load",
							args:{},
							Structure:objClone(v.Structure),

						});

					}
				})(files[i]);
				reader.readAsText(files[i]);
			}
		},
		drop : function( e ){
			e.stopPropagation();
			e.preventDefault();
			var files = e.dataTransfer.files;
			v.IO.readFiles( files );
			//var msg = "";
			//var btn = {test:function(){alert();},close:true};
//			v.UI.message("Please select the File Type",msg,btn);


			return;
		},
		loadFile : function(){
			var evt_tmp;
			var title = "Load Structure";
			var msg= "<div style='padding-left:15px;padding-top:15px;'><div class=form-horizontal><div class='form-group'><label class=col-8>File Type</label><div class=col-16><select class=form-control disabled>";
				msg+= "<option value=-1>Auto</option>";
				msg+= "</select></div></div></div>"
				msg+= "<div class=form-horizontal><div class=form-group><label class=col-8>File</label><div class=col-16>";
				msg+= "<input type=file class='form-control VLLoadFile'></div></div></div></div>";
			var btn = {
				"OK":function(){
					v.IO.readFiles(evt_tmp.target.files);
				},
				"close":function(){
						v.IO.exitSelectMode();
				}
			};
			v.UI.message(title,msg,btn);
			$('.VLLoadFile').unbind();
			$('.VLLoadFile').change(function(e){
				evt_tmp = e;
			});

		},
		mouseMove : function( e ){

			if(!v.IO.mousePressed) return;
			if(v.spacePressed) return;
			if(v.IO.selectMode=='none') return;
			if(v.IO.selecting){
			e.stopPropagation();
			e.preventDefault();
				
			}

			var cPos = [ e.pageX-2, e.pageY-2 ];
			var _guide = $('#select_guide');
			var startx, starty;
			switch(v.IO.selectMode){
				case "rect":
					startx = Math.min(v.IO.start[0], cPos[0]);
					starty = Math.min(v.IO.start[1], cPos[1]);
					var gwidth = Math.abs(v.IO.start[0] - cPos[0]);
					var gheight = Math.abs(v.IO.start[1] - cPos[1]);
					_guide.css("left",startx);
					_guide.css("top",starty);
					_guide.css("width",gwidth);
					_guide.css("height",gheight);
				break;
				case "circ":
					var radius = VLatoms.Math.len([ cPos[0]-v.IO.start[0], cPos[1]-v.IO.start[1], 0]);
					_guide.css("left",v.IO.start[0]-radius);
					_guide.css("top",v.IO.start[1]-radius);
					_guide.css("width",radius*2);
					_guide.css("height",radius*2);
				break;
				case "pent":
					startx = Math.min(v.IO.start[0], cPos[0]);
					starty = Math.min(v.IO.start[1], cPos[1]);

					var gwidth = Math.abs(v.IO.start[0] - cPos[0]);
					var gheight = Math.abs(v.IO.start[1] - cPos[1]);

					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');

					v.IO.polygon = [[ startx, starty + gheight/2.618 ]];
					v.IO.polygon.push([startx + 0.5*gwidth, starty]);
					v.IO.polygon.push([startx + gwidth, starty + gheight / 2.618]);
					v.IO.polygon.push([startx + 0.80901*gwidth, starty + gheight]);
					v.IO.polygon.push([startx + 0.19098*gwidth, starty + gheight]);

					_ctx.clearRect(0,0,3000,3000);
					_ctx.fillStyle = 'rgba(183,126,129,0.3)';
					_ctx.strokeStyle = 'rgba(183,126,129,0.9)';
					_ctx.fillStyle = 'rgba(255,0,0,0.1)';
					_ctx.beginPath();
					_ctx.setLineDash([1,1]);
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1]);
					for(var i=0;i<v.IO.polygon.length;i++){
						_ctx.lineTo( v.IO.polygon[i][0], v.IO.polygon[i][1]);
					}
					_ctx.closePath();
					_ctx.stroke();
					_ctx.fill();				
				break;
				case "hex":
					startx = Math.min(v.IO.start[0], cPos[0]);
					starty = Math.min(v.IO.start[1], cPos[1]);

					var gwidth = Math.abs(v.IO.start[0] - cPos[0]);
					var gheight = Math.abs(v.IO.start[1] - cPos[1]);

					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');

					v.IO.polygon = [[ startx + 0.25*gwidth, starty ]];
					v.IO.polygon.push([startx + 0.75*gwidth, starty]);
					v.IO.polygon.push([startx + gwidth, starty + 0.5 * gheight]);
					v.IO.polygon.push([startx + 0.75*gwidth, starty + gheight]);
					v.IO.polygon.push([startx + 0.25*gwidth, starty + gheight]);
					v.IO.polygon.push([startx, starty + 0.5 * gheight]);

					_ctx.clearRect(0,0,3000,3000);
					_ctx.fillStyle = 'rgba(183,126,129,0.3)';
					_ctx.strokeStyle = 'rgba(183,126,129,0.9)';
					_ctx.fillStyle = 'rgba(255,0,0,0.1)';
					_ctx.beginPath();
					_ctx.setLineDash([1,1]);
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1]);
					for(var i=0;i<v.IO.polygon.length;i++){
						_ctx.lineTo( v.IO.polygon[i][0], v.IO.polygon[i][1]);
					}
					_ctx.closePath();
					_ctx.stroke();
					_ctx.fill();				
				break;
				case "hept":
					startx = Math.min(v.IO.start[0], cPos[0]);
					starty = Math.min(v.IO.start[1], cPos[1]);

					var gwidth = Math.abs(v.IO.start[0] - cPos[0]);
					var gheight = Math.abs(v.IO.start[1] - cPos[1]);

					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');

					v.IO.polygon = [[ startx + 0.5*gwidth, starty ]];
					v.IO.polygon.push([startx + 0.900969*gwidth, starty + gheight*0.198062]);
					v.IO.polygon.push([startx + gwidth, starty + gheight*0.643104]);
					v.IO.polygon.push([startx + 0.722521*gwidth, starty + gheight]);
					v.IO.polygon.push([startx + 0.277479*gwidth, starty + gheight]);
					v.IO.polygon.push([startx, starty + gheight*0.643104]);
					v.IO.polygon.push([startx + 0.099031*gwidth, starty + gheight*0.198062]);
					
					_ctx.clearRect(0,0,3000,3000);
					_ctx.fillStyle = 'rgba(183,126,129,0.3)';
					_ctx.strokeStyle = 'rgba(183,126,129,0.9)';
					_ctx.fillStyle = 'rgba(255,0,0,0.1)';
					_ctx.beginPath();
					_ctx.setLineDash([1,1]);
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1]);
					for(var i=0;i<v.IO.polygon.length;i++){
						_ctx.lineTo( v.IO.polygon[i][0], v.IO.polygon[i][1]);
					}
					_ctx.closePath();
					_ctx.stroke();
					_ctx.fill();				
				break;
				case "octa":
					startx = Math.min(v.IO.start[0], cPos[0]);
					starty = Math.min(v.IO.start[1], cPos[1]);

					var gwidth = Math.abs(v.IO.start[0] - cPos[0]);
					var gheight = Math.abs(v.IO.start[1] - cPos[1]);

					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');
					
					v.IO.polygon = [[ startx + 0.292893 * gwidth, starty ]];
					v.IO.polygon.push([startx + 0.707107 * gwidth, starty]);
					v.IO.polygon.push([startx + gwidth, starty + gheight * 0.292893]);
					v.IO.polygon.push([startx + gwidth, starty + gheight * 0.707107]);
					v.IO.polygon.push([startx + 0.707107 * gwidth, starty + gheight]);
					v.IO.polygon.push([startx + 0.292893 * gwidth, starty + gheight]);
					v.IO.polygon.push([startx, starty + gheight*0.707107]);
					v.IO.polygon.push([startx, starty + gheight*0.292893]);
					
					_ctx.clearRect(0,0,3000,3000);
					_ctx.fillStyle = 'rgba(183,126,129,0.3)';
					_ctx.strokeStyle = 'rgba(183,126,129,0.9)';
					_ctx.fillStyle = 'rgba(255,0,0,0.1)';
					_ctx.beginPath();
					_ctx.setLineDash([1,1]);
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1]);
					for(var i=0;i<v.IO.polygon.length;i++){
						_ctx.lineTo( v.IO.polygon[i][0], v.IO.polygon[i][1]);
					}
					_ctx.closePath();
					_ctx.stroke();
					_ctx.fill();				
				break;
				case "lasso":
					v.IO.polygon.push(cPos);
					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');
					_ctx.clearRect(0,0,3000,3000);
					_ctx.fillStyle = 'rgba(183,126,129,0.3)';
					_ctx.strokeStyle = 'rgba(183,126,129,0.9)';
					_ctx.fillStyle = 'rgba(255,0,0,0.1)';
					_ctx.beginPath();
					_ctx.setLineDash([1,1]);
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1]);
					for(var i=0;i<v.IO.polygon.length;i++){
						_ctx.lineTo( v.IO.polygon[i][0], v.IO.polygon[i][1]);
					}
					_ctx.closePath();
					_ctx.stroke();
					_ctx.fill();
//					_ctx.beginPath();
//					_ctx.moveTo( v.IO.polygon[l-1][0], v.IO.polygon[l-1][1] );
				break;
				case "sphere":
					var scr_pos= v.IO.toScreenXY(v.IO.sphereCenter);
					var inv=false;
					if(v.ctlPressed) inv=true;
					v.IO.start[0]=scr_pos.x;
					v.IO.start[1]=scr_pos.y;
					var radius = VLatoms.Math.len([ cPos[0]-v.IO.start[0], cPos[1]-v.IO.start[1], 0]);
					_guide.css("left",v.IO.start[0]-radius);
					_guide.css("top",v.IO.start[1]-radius);
					_guide.css("width",radius*2);
					_guide.css("height",radius*2);
					let _str_offset = [
						(v.Structure.a[0]+v.Structure.b[0]+v.Structure.c[0])/2,
						(v.Structure.a[1]+v.Structure.b[1]+v.Structure.c[1])/2,
						(v.Structure.a[2]+v.Structure.b[2]+v.Structure.c[2])/2
					];
					var wrapper_offset = $(v.wrapper).offset();
					let sphere_p_x  =  ( (cPos[0] - wrapper_offset.left )/ $(v.wrapper).width() ) * 2 - 1;
					let sphere_p_y  =  - ( (cPos[1] -wrapper_offset.top )/ $(v.wrapper).height() ) * 2 + 1;
					let raycaster;
					if(v.camera.type =="PerspectiveCamera"){
						let vector = new THREE.Vector3( sphere_p_x, sphere_p_y, 0.5 );
						v.camera.updateMatrixWorld(true);
						vector.unproject(v.camera);
						raycaster = new THREE.Raycaster(v.camera.position, vector.sub(v.camera.position).normalize());
					}else if(v.camera.type =="OrthographicCamera"){
						raycaster = new THREE.Raycaster();
						var vector = new THREE.Vector2( sphere_p_x, sphere_p_y);
						raycaster.setFromCamera( vector, v.camera );
					}
					var z_shift = -(v.IO.sphereCenter).distanceTo(v.camera.position);
					var target_pos = new THREE.Vector3(
						raycaster.ray.origin.x - raycaster.ray.direction.x * z_shift,
						raycaster.ray.origin.y - raycaster.ray.direction.y * z_shift,
						raycaster.ray.origin.z - raycaster.ray.direction.z * z_shift
					);
					v.IO.distance=(v.IO.sphereCenter).distanceTo(target_pos);
					let __center=[v.IO.sphereCenter.x+_str_offset[0],v.IO.sphereCenter.y+_str_offset[1],v.IO.sphereCenter.z+_str_offset[2]];
					v.IO.selectedAtoms=[];
					for(var i=0 ; i<v.Structure.atoms.length ; i++){
						let sqrt_d=(new THREE.Vector3(__center[0],__center[1],__center[2])).distanceTo(new THREE.Vector3(v.Structure.atoms[i].x,v.Structure.atoms[i].y,v.Structure.atoms[i].z));
						if(sqrt_d<=v.IO.distance && !inv){
							v.IO.selectedAtoms.push(i);
						}else if(sqrt_d>v.IO.distance && inv){
							v.IO.selectedAtoms.push(i);
						}
					}
					v.update.selectInfo();
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
				break;
			}
		},
		mouseDown : function( e ){
$(document.activeElement).blur();
			if(["text","textarea","select","radio"].indexOf(e.target.nodeName.toLocaleLowerCase())>=0){
				v.IO.selecting=false;
				return;
			}
			v.IO.focus = ($(e.target).closest( v.option.area ).length == 1);
			if(!v.IO.focus) return false;
			v.animateControl.start();
			if(v.IO.selectMode!=="sphere"){
				v.IO.start = [ e.pageX, e.pageY ]
			}
			if(v.spacePressed) return;	
			if(v.IO.selectMode=='none') return;
			$('#select_guide').remove();
			var domtype = $(e.target)[0].localName;//.toLowerCase();
			if(domtype) domtype=domtype.toLowerCase();
			if(domtype!=="canvas") return;
			
			if(!v.spacePressed){
				e.stopPropagation();
				e.preventDefault();
			}
			v.IO.mousePressed = true;
			v.IO.selecting=true;
			v.controls.enabled=false;

			switch(v.IO.selectMode){
				case "rect":
					$(document.body).append("<div id=select_guide style='background-color:rgba(183,126,129,0.3);position:absolute;border:dotted 1px rgba(183,126,129,0.9);'></div>");
				break;
				case "circ":
					$(document.body).append("<div id=select_guide style='background-color:rgba(183,126,129,0.3);position:absolute;border:dotted 1px rgba(183,126,129,0.9);border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;'></div>");
				break;
				case "pent":
					$('#vlvSelectArea').remove();
					$(document.body).append("<canvas id=vlvSelectArea width="+$(document).width()+" height="+$(document).height()+" style='position:absolute;left:0;top:0;z-index:10000;'></canvas>");
				break;
				case "hex":
					$('#vlvSelectArea').remove();
					$(document.body).append("<canvas id=vlvSelectArea width="+$(document).width()+" height="+$(document).height()+" style='position:absolute;left:0;top:0;z-index:10000;'></canvas>");
				break;
				case "hept":
					$('#vlvSelectArea').remove();
					$(document.body).append("<canvas id=vlvSelectArea width="+$(document).width()+" height="+$(document).height()+" style='position:absolute;left:0;top:0;z-index:10000;'></canvas>");
				break;
				case "octa":
					$('#vlvSelectArea').remove();
					$(document.body).append("<canvas id=vlvSelectArea width="+$(document).width()+" height="+$(document).height()+" style='position:absolute;left:0;top:0;z-index:10000;'></canvas>");
				break;
				case "lasso":
					v.IO.polygon = [[ e.pageX-2, e.pageY-2 ]];
					$('#vlvSelectArea').remove();
					$(document.body).append("<canvas id=vlvSelectArea width="+$(document).width()+" height="+$(document).height()+" style='position:absolute;left:0;top:0;z-index:10000;'></canvas>");
					console.log($('#vlvSelectArea').width());
					console.log($('#vlvSelectArea').height());
/*					var _canvas = document.getElementById('vlvSelectArea');
					var _ctx = _canvas.getContext('2d');
					_ctx.beginPath();
					_ctx.moveTo( v.IO.polygon[0][0], v.IO.polygon[0][1] );*/
				break;
				case "sphere":
					$(document.body).append("<div id=select_guide style='background-color:rgba(183,126,129,0.3);position:absolute;border:dotted 1px rgba(183,126,129,0.9);border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;'></div>");
				break;
			}
			
		},
		contextMenu : function ( e ){
				v.IO.showCtxMenu(e);
		},
		mouseUp : function( e ){
			$('#vlvSelectArea').remove();
			if(v.IO.focus){
				v.animateControl.stop();
			}
//console.log('enter up');
			if(!v.IO.selecting){
				return;
			}
//console.log('enter up2');
		
//			if(!v.IO.mousePressed) return;
			v.IO.mousePressed=false;
			v.IO.end = [ e.pageX, e.pageY ]
			console.log(v.IO.end);
			if(( v.IO.start[0] == v.IO.end[0] ) && ( v.IO.start[1] == v.IO.end[1] )){
				v.IO.wasdrag = false;
			}else{
				v.IO.wasdrag = true;
			}
/*			if(e.which == 3 && !v.IO.wasdrag){ // Ctx Menu
				v.IO.showCtxMenu(e);
				return;
			}*/
//moved 20180710
			v.IO.selecting=false;
			v.controls.enabled=true;
			$('#select_guide').remove();
			if(v.spacePressed) return;
			if(v.IO.selectMode=='none') return;
			if(v.IO.selectMode=='atom' && e.target.nodeName.toLocaleLowerCase() != "canvas"){
				return;
			} 

		/*	if(e.target.nodeName.toLocaleLowerCase() == "canvas")
			{*/
				if(v.IO.selectMode !== "none" ){
					v.IO.selectCallback();
					v.update.cellInfo();
					v.update.selectInfo();
				}
		/*	}*/

		},
		select : function( mode ){
			v.IO.selectedAtoms = [];
			v.IO.selectMode = mode;
		},
		exitSelectMode : function(){
			v.IO.wasdrag = false;
			v.IO.selectMode='none';
			v.IO.selectedAtoms = [];
			v.IO.restoreAtomsColor();
			v.update.cellInfo();
			v.update.selectInfo();
			for(var i=0;i<v.IO.customSelectCallback.length;i++){
				v.IO.customSelectCallback[i](v);
			}

		},
		toWorldXYZ : function(position){
//TODO
/*
			var wx,wy,wz;
			var sx,sy;
			sx = (position.x - $(v.wrapper).offset().left) / ($(v.wrapper).width()/2) - 1,
			sy = -( (position.y - $(v.wrapper).offset().top) / ( $(v.wrapper).height()/2 ) -1 );
			var pos = new THREE.Vector3(sx,sy,-1);
			var projWorldMat = new THREE.Matrix4();
			v.camera.updateProjectionMatrix();
			var pmi = (new THREE.Matrix4()).getInverse(v.camera.projectionMatrix);
			projWorldMat.multiplyMatrices(v.camera.matrixWorld, pmi );
	console.log(pos);


			var projScreenMat = new THREE.Matrix4();
			projScreenMat.multiplyMatrices( v.camera.projectionMatrix, v.camera.matrixWorldInverse );


			pos.unproject(projScreenMat, v.camera);
	console.log(pos);
			return pos;*/

		},
		toScreenXY : function(position){
			var pos = position.clone();
			var projScreenMat = new THREE.Matrix4();
			v.camera.updateProjectionMatrix();
			projScreenMat.multiplyMatrices( v.camera.projectionMatrix, v.camera.matrixWorldInverse );
			pos.applyProjection(projScreenMat);
			return {
				x : (pos.x + 1 ) * $(v.wrapper).width()/2 + $(v.wrapper).offset().left,
				y : (-pos.y + 1) * $(v.wrapper).height()/2 + $(v.wrapper).offset().top
			}
		},
		getPosOnCanvas : function( pos ){
			var mouse={};
			var wrapper_offset = $(v.wrapper).offset();
			mouse.x  =  ( (pos[0] - wrapper_offset.left )/ $(v.wrapper).width() ) * 2 - 1;
			mouse.y  =  - ( (pos[1] -wrapper_offset.top )/ $(v.wrapper).height() ) * 2 + 1;
			console.log(mouse);
			return mouse;
		},
		customSelectCallback:[], // Array of functions();
		selectCallback : function(){
			function getOneAtom(){
				if(v.camera.type =="PerspectiveCamera"){
					var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
					vector.unproject( v.camera );
					var raycaster = new THREE.Raycaster( v.camera.position, vector.sub( v.camera.position ).normalize() );
					var intersects = raycaster.intersectObjects( v.atomMeshes );
				} else if(v.camera.type =="OrthographicCamera"){
					var raycaster = new THREE.Raycaster();
					var vector = new THREE.Vector2( mouse.x, mouse.y);
					raycaster.setFromCamera( vector, v.camera );
					var intersects = raycaster.intersectObjects( v.atomMeshes );
				}
				var this_atomid=-1;
				if(intersects.length>0){
					var this_atomid = intersects[0].object.atomid
				}
				return this_atomid;

			}
			var mouse = v.IO.getPosOnCanvas( v.IO.end );
			var inv=false,del=false;
			if(v.ctlPressed) inv=true;
			if(v.altPressed) del=true;
			var atoms = v.atomMeshes;
			var endx = v.IO.end[0];
			var endy = v.IO.end[1];
			var startx = v.IO.start[0];
			var starty = v.IO.start[1];
			switch( v.IO.selectMode ){
				case "none":
				break;
				case "atom":
					var this_atomid = getOneAtom();	
					if(this_atomid>=0){
						var cidx=v.IO.selectedAtoms.indexOf( this_atomid );
						if(v.IO.selectedAtoms.indexOf( this_atomid )<0){
							v.IO.selectedAtoms.push( this_atomid );
						}else{
							v.IO.selectedAtoms.splice( cidx,1);
						}
					}
				
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
				break;
				case "element":
					var this_atomid = getOneAtom();
					if( this_atomid < 0 ){
						return false;
					}
					var selected_element = v.Structure.atoms[this_atomid].element;
					
					for(var i=0;i<v.Structure.atoms.length;i++){
						var ca = v.Structure.atoms[i];
						if(ca.element == selected_element){
							var cidx=v.IO.selectedAtoms.indexOf( i );
							if(!del){
								if( cidx < 0 ){
									v.IO.selectedAtoms.push( i );
								}
							}else{
								if( cidx>=0 ){
									v.IO.selectedAtoms.splice(cidx,1);
								}
							}

						}
					}
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
				break;
				case "circ":
					var selectRadius = VLatoms.Math.len([endx-startx, endy-starty, 0]);
					for(var i=0;i<atoms.length;i++){
						var screenpos = v.IO.toScreenXY( v.atomMeshes[i].position );
						var in_range;
						var _dr = VLatoms.Math.len([ screenpos.x - startx, screenpos.y - starty, 0]);
						if(inv){
							in_range = selectRadius < _dr;
						}else{
							in_range = selectRadius >= _dr;
						}
						if(in_range){
							var this_atomid = atoms[i].atomid
							var cidx=v.IO.selectedAtoms.indexOf( this_atomid );
							if(!del){
								if( cidx < 0 ){
									v.IO.selectedAtoms.push( this_atomid );
								}
							}else{
								if( cidx>=0 ){
									v.IO.selectedAtoms.splice(cidx,1);
								}
							}
						}
					}
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
				break;
				case "rect":
					for(var i=0;i<atoms.length;i++){
						var screenpos = v.IO.toScreenXY( v.atomMeshes[i].position );
						console.log(screenpos);;
						var in_range;
						 if(inv) {in_range=!((screenpos.x>startx&&screenpos.x<endx)&&(screenpos.y>starty&&screenpos.y<endy)||
							(screenpos.x>startx&&screenpos.x<endx)&&(screenpos.y<starty&&screenpos.y>endy)||
							(screenpos.x<startx&&screenpos.x>endx)&&(screenpos.y>starty&&screenpos.y<endy)||
							(screenpos.x<startx&&screenpos.x>endx)&&(screenpos.y<starty&&screenpos.y>endy)
							);}
						else{in_range=((screenpos.x>startx&&screenpos.x<endx)&&(screenpos.y>starty&&screenpos.y<endy)||
							(screenpos.x>startx&&screenpos.x<endx)&&(screenpos.y<starty&&screenpos.y>endy)||
							(screenpos.x<startx&&screenpos.x>endx)&&(screenpos.y>starty&&screenpos.y<endy)||
							(screenpos.x<startx&&screenpos.x>endx)&&(screenpos.y<starty&&screenpos.y>endy)
							);}
						if(in_range){
							var this_atomid = atoms[i].atomid
							var cidx=v.IO.selectedAtoms.indexOf( this_atomid );
							if(!del){
								if( cidx < 0 ){
									v.IO.selectedAtoms.push( this_atomid );
								}
							}else{
								if( cidx>=0 ){
									v.IO.selectedAtoms.splice(cidx,1);
								}
							}
						}
					}
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
				break;
				case "pent":
				case "hex":
				case "hept":
				case "octa":
				case "lasso":
					for(var i=0;i<atoms.length;i++){
						var screenpos = v.IO.toScreenXY( v.atomMeshes[i].position );
						var point = [screenpos.x, screenpos.y];
						in_range =  VLatoms.Utils.pointInPolygon(point, v.IO.polygon);
						if(!inv){
							if(in_range){
								var this_atomid = atoms[i].atomid
								var cidx=v.IO.selectedAtoms.indexOf( this_atomid );
								if(!del){
									if( cidx < 0 ){
										v.IO.selectedAtoms.push( this_atomid );
									}
								}else{
									if( cidx>=0 ){
										v.IO.selectedAtoms.splice(cidx,1);
									}
								}
							}
						}else{
							if(!in_range){
								var this_atomid = atoms[i].atomid
								var cidx=v.IO.selectedAtoms.indexOf( this_atomid );
								if(!del){
									if( cidx < 0 ){
										v.IO.selectedAtoms.push( this_atomid );
									}
								}else{
									if( cidx>=0 ){
										v.IO.selectedAtoms.splice(cidx,1);
									}
								}
							}
						}
					}
					v.IO.restoreAtomsColor();
					v.IO.highlightSelectedAtoms();
//TODO	
					console.log(v.IO.polygon);
				break;
				case "sphere":
				break;
				case "pos":
					var atom_id=getOneAtom();
					if(atom_id < 0){
						return false;
					}
					v.IO.exitSelectMode();
					let _str_offset = [
						(v.Structure.a[0]+v.Structure.b[0]+v.Structure.c[0])/2,
						(v.Structure.a[1]+v.Structure.b[1]+v.Structure.c[1])/2,
						(v.Structure.a[2]+v.Structure.b[2]+v.Structure.c[2])/2
					];
					v.IO.sphereCenter.x=v.Structure.atoms[atom_id].x - _str_offset[0];
					v.IO.sphereCenter.y=v.Structure.atoms[atom_id].y - _str_offset[1];
					v.IO.sphereCenter.z=v.Structure.atoms[atom_id].z - _str_offset[2];
					var scr_pos= v.IO.toScreenXY(v.IO.sphereCenter);
					v.IO.start=[scr_pos.x,scr_pos.y];
					v.IO.toggleSelection('sphere');
				break;
			}
			for(var i=0;i<v.IO.customSelectCallback.length;i++){
				console.log(v.IO.customSelectCallback[i]);
				v.IO.customSelectCallback[i](v);
			}
		//	v.IO.showSelectWin();
		},
		showSelectWin : function(){
			var title = "Manipulate Atoms";
			var msg = "<span id=nselected></span> atom(s) selected. <button id=manipulate_clear_select>Clear Selection</button><br>";
				msg+="<table>";
				msg+="<tr>";
				msg+="<td>Move</td>";
				msg+="<td><input type=text id=manipulate_move_step placeholder='Step(&#8491;)'> ";
				msg+="<input type=radio name=manipulate_move_direction class=manipulate_move_direction value=x> x <input type=radio name=manipulate_move_direction class=manipulate_move_direction value=y> y <input type=radio name=manipulate_move_direction class=manipulate_move_direction value=z checked> z<button id=manipulate_move_ok>Apply</button></td></tr>";
				msg+="<tr><td>Rotate</td><td><input type=text id=manipulate_rotate_step placeholder='Step(&deg;)'> <input type=radio name=manipulate_rotate_direction class=manipulate_rotate_direction value=x> x <input type=radio name=manipulate_rotate_direction class=manipulate_rotate_direction value=y> y <input type=radio name=manipulate_rotate_direction class=manipulate_rotate_direction value=z checked> z<button id=manipulate_rotate_ok>Apply</button><td></td></tr>";
				msg+="<tr><td>Change</td><td><select id=manipulate_change_select></select> <button id=manipulate_change_ok>Apply</button></td></tr>";
				msg+="<tr><td>Add</td><td></td></tr>";
				msg+="<tr><td>Delete</td><td><button id=manipulate_delete_ok>Delete</button></td></tr>";
				msg+="</table>";
			var btn = {
					"close":function(){
							v.IO.exitSelectMode();
					}
				};
			v.UI.message(title,msg,btn);
			var target = $('#manipulate_change_select');
			$.each(AtomParam,function(idx,val){
				target.append("<option value="+idx+">"+idx+"</option>");
			});

			// Define IO
			$('#manipulate_move_ok').unbind();
			$('#manipulate_rotate_ok').unbind();
			$('#manipulate_change_ok').unbind();
			$('#manipulate_delete_ok').unbind();
			$('#manipulate_clear_select').unbind();
			$('#manipulate_move_ok').bind("click",function(){
				v.manipulateAtom.move();
			});
			$('#manipulate_rotate_ok').bind("click",function(){
				v.manipulateAtom.rotate();
			});
			$('#manipulate_change_ok').bind("click",function(){
				v.manipulateAtom.change();
			});
			$('#manipulate_delete_ok').bind("click",function(){
				v.manipulateAtom.removeSelectedAtoms();
			});
			$('#manipulate_clear_select').bind("click",function(){
				v.IO.selectedAtoms=[];
			});
			

			$('#nselected').html(v.IO.selectedAtoms.length);
		}
	}
	v.manipulateAtom = {
		checkAtomPositionAfterManipulate(ca,idx,expand){
				if(expand===undefined) expand = false;
				var lat = [v.Structure.a, v.Structure.b, v.Structure.c ];
				var posFract = VLatoms.Utils.Structure.cartToFract([ca.x,ca.y,ca.z],lat);
				var posCart;
				var nx,ny,nz,px,py,pz;
				var lena,lenb,lenc;
				lena = VLatoms.Math.len(v.Structure.a);
				lenb = VLatoms.Math.len(v.Structure.b);
				lenc = VLatoms.Math.len(v.Structure.c);
				nx=ny=nz=px=py=pz=0;
				if(posFract[0]<0){nx = -posFract[0]*lena;}
				if(posFract[0]>1){px = (posFract[0]-1)*lena;}
				if(posFract[1]<0){ny = -posFract[1]*lenb;}
				if(posFract[1]>1){py = (posFract[1]-1)*lenb;}
				if(posFract[2]<0){nz = -posFract[2]*lenc;}
				if(posFract[2]>1){pz = (posFract[2]-1)*lenc;}
				if(nx>0||ny>0||nz>0||px>0||py>0||pz>0){
					if(expand){
						v.Manipulate.execute("vacuum",{"nx":nx,"ny":ny,"nz":nz,"px":px,"py":py,"pz":pz});
					}else{
						var latMat = [ v.Structure.a, v.Structure.b, v.Structure.c];
						for(var i=0;i<3;i++){
							posFract[i]=posFract[i]-Math.floor(posFract[i]);	
						}
						posCart = VLatoms.Math.vecdotmat(posFract,latMat);
						ca.x = posCart[0];
						ca.y = posCart[1];
						ca.z = posCart[2];

						v.update.atomsChanged=true;
						v.update.bondsChanged=true;
						v.animateControl.once();
					}
				}
		},
		appendStructure:function(_structure){
			if(v.Structure.a[0]===undefined){
				v.Structure.a=arrClone(_structure.a);
				v.Structure.b=arrClone(_structure.b);
				v.Structure.c=arrClone(_structure.c);
			}
//TODO Here
			var sa =_structure.atoms;
			var testRet = v.Manipulate.insideTest(sa);
			if(!testRet.inside){
				if(confirm("The cell should be expanded to add the atom(s).")){
					for(var i=0;i<sa.length;i++){
						v.Structure.atoms.push( new VLatoms.Atom( sa[i].x, sa[i].y, sa[i].z, sa[i].element));
						v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 저장
					}
					v.Manipulate.vacuum({
							"nx":testRet.delta[0],
							"ny":testRet.delta[1],
							"nz":testRet.delta[2],
							"px":testRet.delta[3],
							"py":testRet.delta[4],
							"pz":testRet.delta[5]
					});
				}else{
					v.IO.selectedAtoms = sa; // 추가를 안할 경우 원래 원소로 복귀
					return false;
				}
			} else {
				for(var i=0;i<sa.length;i++){
						v.Structure.atoms.push( new VLatoms.Atom( sa[i].x, sa[i].y, sa[i].z, sa[i].element));
						v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 저장
				}
			}

/*			for(var i=0;i<_structure.atoms.length;i++){
				var _s = _structure.atoms[i];
				v.Structure.atoms.push(new VLatoms.Atom( _s.x, _s.y, _s.z, _s.element ));
			}*/
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
		},
		add2 : function(args){
			var structure = args['Structure'] || {};
			var mode = args['mode'] || "single"; // multi or single
			var dx = +args['dx'];
			var dy = +args['dy'];
			var dz = +args['dz'];
			var natoms = v.Structure.atoms.length;
			var sa = JSON.parse(JSON.stringify(v.IO.selectedAtoms));	// deepcopy로 바꿈
			var cm = v.Structure.atoms.map( el=> [el.x, el.y, el.z]).reduce( function(a,b){ return math.add(a,b); });
			var newx, newy, newz;
			var _sa, _ta;
			if(natoms!=0){
				cm = math.multiply( cm, 1/natoms );
			}
			switch(mode){
				case "single":
					for( var j = 0 ; j < structure.atoms.length ; j++ ){
						_ta = structure.atoms[j];
						newx = cm[0] + _ta.x;
						newy = cm[1] + _ta.y;
						newz = cm[2] + _ta.z;
						v.Structure.atoms.push( new VLatoms.Atom( newx, newy, newz, _ta.element ));
					}
				break;
				case "multiple":
					for( var i = 0 ; i < sa.length ; i++ ){
						for( var j = 0 ; j < structure.atoms.length ; j++ ){
							_ta = structure.atoms[j];
							newx = _sa.x + _ta.x;
							newy = _sa.y + _ta.y;
							newz = _sa.z + _ta.z;
							v.Structure.atoms.push( new VLatoms.Atom( newx, newy, newz, _ta.element ));
						}
					}
				break;
			}
			console.log(cm);
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Add Atom(s)",
				args:{direction:direction,step:step},
				Structure:objClone(v.Structure),
			});
			v.setOptimalCamPosition();

		},
		add : function(args){
			//change delta of coordination to cartesian 
			if(args['type'] != undefined){
				let lattice = [v.Structure.a, v.Structure.b, v.Structure.c];
				let delta = [args['dx'],args['dy'],args['dz']];
				switch(args['type']){
					case "frac":
						delta = VLatoms.Utils.Structure.fracToCart(delta, lattice);
					break;
					case "view":
						delta = VLatoms.Utils.Structure.viewToCart(delta, v.camera);
					break;
				}
				args['dx'] = delta[0];
				args['dy'] = delta[1];
				args['dz'] = delta[2];
			}		
			

			var vdw = args['vdw'] ;
			var mode = args['mode'] ;
			if(mode==="pre"){
				var structure = args['Structure'];	
			}
			if(mode == "cen" && v.IO.selectedAtoms.length < 2){
//				alert("Please select more than one atom.");
				return false;
			}
			var dx = +args['dx'] ;
			var dy = +args['dy'] ;
			var dz = +args['dz'] ;
			var element = args['element'] ;
			var sa = JSON.parse(JSON.stringify(v.IO.selectedAtoms));	// deepcopy로 바꿈
			v.IO.selectedAtoms = []; //selectedAtoms를 sa에 저장했으니 초기화함
			var direction = args.direction;// $('.manipulate_move_direction:checked').val();
			var step = args.step;//$('#manipulate_move_step').val()*1;

			var cm = [0,0,0];
			for(var i=0;i<sa.length;i++){
				var ca = v.Structure.atoms[sa[i]];
				cm[0]+= +ca.x;
				cm[1]+= +ca.y;
				cm[2]+= +ca.z;
			}
			for(var i=0;i<3;i++){ cm[i]/=sa.length; }


			switch(mode){
				case "cen":
					if(v.Structure.atoms.length < 2){
						return false;
					} else {
						v.Structure.atoms.push( new VLatoms.Atom(cm[0], cm[1], cm[2], element));
					}
					break;

				case "rel":
					var targetAtoms = [];
					//if(v.Structure.atoms.length === 0){
					if(sa.length == 0){
						alert("Please select at least one atom.");
						return false;
					}
					if(vdw){
						var relpos = VLatoms.Math.norm([ dx, dy, dz ]);
					}
					var teradius = AtomParam[element].radius;
					var dr;
					for(var i=0;i<sa.length;i++){
						var _s = v.Structure.atoms[ sa[i] ];
						if(vdw){
							dr = VLatoms.Math.cdotvec( (teradius + _s.radius), relpos);
						}else{
							dr = [ dx, dy, dz];
						}
						targetAtoms[i] = {x:_s.x + dr[0], y:_s.y + dr[1], z: _s.z + dr[2], element:element};
//							v.Structure.atoms.push( new VLatoms.Atom( _s.x + dr[0], _s.y + dr[1], _s.z + dr[2], element));
					}
//					v.Structure.atoms.push( new VLatoms.Atom( _s.x + dr[0], _s.y + dr[1], _s.z + dr[2], element));
					var testRet = v.Manipulate.insideTest(targetAtoms);
					if(!testRet.inside){
						if(confirm("The Cell should be expanded to add the atom(s).")){
							for(var i=0;i<sa.length;i++){
								v.Structure.atoms.push( new VLatoms.Atom( targetAtoms[i].x, targetAtoms[i].y, targetAtoms[i].z, targetAtoms[i].element));
								v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 저장
							}
							v.Manipulate.vacuum({
									"nx":testRet.delta[0],
									"ny":testRet.delta[1],
									"nz":testRet.delta[2],
									"px":testRet.delta[3],
									"py":testRet.delta[4],
									"pz":testRet.delta[5]
							});
						}else{
							v.IO.selectedAtoms = sa; // 추가를 안할 경우 원래 원소로 복귀
							return false;
						}
					} else {
						for(var i=0;i<sa.length;i++){
								v.Structure.atoms.push( new VLatoms.Atom( targetAtoms[i].x, targetAtoms[i].y, targetAtoms[i].z, targetAtoms[i].element));
								v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 저장
						}
					}
					break;
				case "abs":
					if(v.Structure.atoms.length === 0){
						var pc = 2; // padding_constant
						let l_x,l_y,l_z;
						if(dx===0){
							v.Structure.a = [1, 0, 0];
						}else{
							v.Structure.a = [dx*pc, 0, 0];
						}
						if(dy===0){
							v.Structure.b = [0, 1, 0];
						}else{
							v.Structure.b = [0, dy*pc, 0];
						}
						if(dz===0){
							v.Structure.c = [0, 0, 1];
						}else{
							v.Structure.c = [0, 0, dz*pc];
						}
						v.Atom.add(dx, dy, dz, element);
					} else {
						var testRet = v.Manipulate.insideTest([{x:dx,y:dy,z:dz}]);
						if(!testRet.inside){
							if(confirm("The Cell should be expanded to add this atom.")){
								v.Structure.atoms.push( new VLatoms.Atom( dx, dy, dz, element));
								v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 
								v.Manipulate.vacuum({
										"nx":testRet.delta[0],
										"ny":testRet.delta[1],
										"nz":testRet.delta[2],
										"px":testRet.delta[3],
										"py":testRet.delta[4],
										"pz":testRet.delta[5]
								});
							}else{
									v.IO.selectedAtoms = sa; // 추가를 안할 경우 원래 원소리스트 반환
									return false;
							}
						} else{
								v.Structure.atoms.push( new VLatoms.Atom( dx, dy, dz, element));
								v.IO.selectedAtoms.push(v.Structure.atoms.length-1); //추가된 원소 index 저장
						}
					}
					break;
				case "pre":
//					args['v']=vlv;
					var retStr = VLatoms.StructureBuilder(args.structure,{"n":args.n,"m":args.m,"repeat":args.repeat}); 
					//2. 최대최소확인 (중심위치확인)
					var _maxx = retStr.atoms[0].x;
					var _maxy = retStr.atoms[0].y;
					var _maxz = retStr.atoms[0].z;
					var _minx = retStr.atoms[0].x;
					var _miny = retStr.atoms[0].y;
					var _minz = retStr.atoms[0].z;
					for( var i = 0 ; i<retStr.atoms.length ; i++ ){
							if(_maxx > retStr.atoms[i].x) _maxx = retStr.atoms[i].x;
							if(_maxy > retStr.atoms[i].y) _maxy = retStr.atoms[i].y;
							if(_maxz > retStr.atoms[i].z) _maxz = retStr.atoms[i].z;
							if(_minx < retStr.atoms[i].x) _minx = retStr.atoms[i].x;
							if(_miny < retStr.atoms[i].y) _miny = retStr.atoms[i].y;
							if(_minz < retStr.atoms[i].z) _minz = retStr.atoms[i].z;
					}
//					console.log("max and min",_maxx,_maxy,_maxz,_minx,_miny,_minz);
					var cen=[];
					cen[0]=(_maxx+_minx)/2;
					cen[1]=(_maxy+_miny)/2;
					cen[2]=(_maxz+_minz)/2;
					var cenCell=[];
					cenCell[0] = (v.Structure.a[0] + v.Structure.b[0] + v.Structure.c[0]) / 2;
					cenCell[1] = (v.Structure.a[1] + v.Structure.b[1] + v.Structure.c[1]) / 2;
					cenCell[2] = (v.Structure.a[2] + v.Structure.b[2] + v.Structure.c[2]) / 2;
//					console.log("cen",cen[0],cen[1],cen[2]);

					//3.보정할 값 찾음
					testAtom=[];
					for(var i=0;i<retStr.atoms.length;i++){
							testAtom.push(new VLatoms.Atom(retStr.atoms[i].x+cenCell[0]-cen[0], retStr.atoms[i].y+cenCell[1]-cen[1], retStr.atoms[i].z+cenCell[2]-cen[2], retStr.atoms[i].element));
					}
					var retVec = v.Manipulate.insideTest(testAtom,{"findSize":true});
					for(var i =3;i<6;i++){
							retVec.delta[i]-=1;
					}
					var deltaVec=[0,0,0];
					deltaVec[0]=(retVec.delta[3]+retVec.delta[0])/2;
					deltaVec[1]=(retVec.delta[4]+retVec.delta[1])/2;
					deltaVec[2]=(retVec.delta[5]+retVec.delta[2])/2;
//					console.log("deltaVec",deltaVec);
					var deltaPos=[0,0,0];
					deltaPos[0]=deltaVec[0]*v.Structure.a[0] + deltaVec[1] * v.Structure.b[0] + deltaVec[2] * v.Structure.c[0];
					deltaPos[1]=deltaVec[0]*v.Structure.a[1] + deltaVec[1] * v.Structure.b[1] + deltaVec[2] * v.Structure.c[1];
					deltaPos[2]=deltaVec[0]*v.Structure.a[2] + deltaVec[1] * v.Structure.b[2] + deltaVec[2] * v.Structure.c[2];
//					console.log("deltaPos",deltaPos);

					//4.보정된 위치로 원자 추가
					var _newPos=[];
					_newPos[0] = cenCell[0] - cen[0] - deltaPos[0];
					_newPos[1] = cenCell[1] - cen[1] - deltaPos[1];
					_newPos[2] = cenCell[2] - cen[2] - deltaPos[2];
					testAtom = [];
					for(var i=0;i<retStr.atoms.length;i++){
							testAtom.push(new VLatoms.Atom(retStr.atoms[i].x + _newPos[0],retStr.atoms[i].y + _newPos[1], retStr.atoms[i].z + _newPos[2],retStr.atoms[i].element));
					}

					//5.insidetest후 vacuum, selectMode가 꺼져있을 경우를 atom으로 바꿈
					var retInside = v.Manipulate.insideTest(testAtom);
					if(!retInside.inside){
							if(confirm("The Cell should be expanded to add the atom(s).")){
									for(var i=0;i<retStr.atoms.length;i++){
											v.Structure.atoms.push( new VLatoms.Atom(retStr.atoms[i].x + _newPos[0],retStr.atoms[i].y + _newPos[1], retStr.atoms[i].z + _newPos[2],retStr.atoms[i].element));
											v.IO.selectedAtoms.push(v.Structure.atoms.length-1);
									}
									v.Manipulate.vacuum({
													"nx":retInside.delta[0],
													"ny":retInside.delta[1],
													"nz":retInside.delta[2],
													"px":retInside.delta[3],
													"py":retInside.delta[4],
													"pz":retInside.delta[5]
													});
							}else{
									return false;
							}
					}else{
							for(var i=0;i<retStr.atoms.length;i++){
									v.Structure.atoms.push( new VLatoms.Atom(retStr.atoms[i].x + _newPos[0],retStr.atoms[i].y + _newPos[1], retStr.atoms[i].z + _newPos[2],retStr.atoms[i].element));
									v.IO.selectedAtoms.push(v.Structure.atoms.length-1);
							}	
					}
					break;
					//추가
			}

			if(v.IO.selectMode==="none") v.IO.selectMode = "atom";
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Add Atom(s)",
				args:{direction:direction,step:step},
				Structure:objClone(v.Structure),
			});
			v.setOptimalCamPosition();
		},
		edit:function(args){
			var newAtoms = args['atomArr'];
			var deleteTarget = [];
			for(var idx in newAtoms){
				if(newAtoms[+idx].del === true){
					deleteTarget.push(+idx);
				} else {
					var ca = newAtoms[+idx],targetElement = ca.element;
					v.Structure.atoms[+idx].element = ca.element;
					v.Structure.atoms[+idx].x = ca.x;
					v.Structure.atoms[+idx].y = ca.y;
					v.Structure.atoms[+idx].z = ca.z;

					v.Structure.atoms[+idx].radius = AtomParam[targetElement].radius ;
					v.Structure.atoms[+idx].color = AtomParam[targetElement].color ;
					v.Structure.atoms[+idx].mass = AtomParam[targetElement].mass ;
				}
			}
			if(deleteTarget.length > 0){
					v.manipulateAtom.removeAtoms(deleteTarget,"off");
			}
			var testRet = v.Manipulate.insideTest(v.Structure.atoms);
			if(!testRet.inside){
				if(!confirm("Do you want to keep the cell size?")){
					v.Manipulate.vacuum({
							"nx":testRet.delta[0],
							"ny":testRet.delta[1],
							"nz":testRet.delta[2],
							"px":testRet.delta[3],
							"py":testRet.delta[4],
							"pz":testRet.delta[5]
					});
				}else{
					v.Manipulate.insideTest(v.Structure.atoms,{"onEscape":true})
				}
			}

			v.update.atomsChanged = true;
			v.update.bondsChanged = true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Manual Edit",
				args:{},
				Structure:objClone(v.Structure)
			});
		},
/*
		move:function(args){
			var sa = v.IO.selectedAtoms;
			var direction = args.direction;// $('.manipulate_move_direction:checked').val();
			var step = args.step;//$('#manipulate_move_step').val()*1;
			console.log(args.onEscape);
			var onEscape = args.onEscape=="expand"?true:false;
			var posFract;
			var tmpStrain = [];
			var uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
				uparr = VLatoms.Math.norm(uparr);
			var carr = [v.camera.position.x, v.camera.position.y, v.camera.position.z];
				carr = VLatoms.Math.norm(carr);
			var rightarr = VLatoms.Math.cross(uparr,carr);
				rightarr = VLatoms.Math.norm(rightarr);

			var ref = [0,0,0];
			var newpos;
			for(var i=0;i<sa.length;i++){
				var ca = v.Structure.atoms[sa[i]];
				switch(direction){
					case "x":
//						ref = [1,0,0];
						ref = math.multiply(v.Structure.a,1/math.norm(v.Structure.a));
					break;
					case "y":
//						ref = [0,1,0];
						ref = math.multiply(v.Structure.b,1/math.norm(v.Structure.b));
					break;
					case "z":
//						ref = [0,0,1];
						ref = math.multiply(v.Structure.c,1/math.norm(v.Structure.c));
					break;
					case "vx":
						ref = rightarr;
					break;
					case "vy":
						ref = uparr;
					break;
					case "vz":
						ref = carr;
					break;
				}
				newpos = VLatoms.Math.add( VLatoms.Math.cdotvec(step, ref) , [ca.x, ca.y, ca.z]);
				ca.x = newpos[0];
				ca.y = newpos[1];
				ca.z = newpos[2];
// check atom is escaped the cell
				v.manipulateAtom.checkAtomPositionAfterManipulate(ca,i,onEscape);
//				v.Manipulate.insideTest(v.Structure.atoms,"onEscape");

			}
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Move Atom(s)",
				args:{direction:direction,step:step},
				Structure:objClone(v.Structure),
			});

//TODO
		},
*/
		move:function(args){
			var sa = v.IO.selectedAtoms;
			var onEscape = args.onEscape=="expand"?true:false;
			var posFract;
			var tmpStrain = [];
			var uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
				uparr = VLatoms.Math.norm(uparr);
			var carr = [v.camera.position.x, v.camera.position.y, v.camera.position.z];
				carr = VLatoms.Math.norm(carr);
			var rightarr = VLatoms.Math.cross(uparr,carr);
				rightarr = VLatoms.Math.norm(rightarr);

			var ref = [0,0,0];
			var newpos;
			if(args.coordinateType !== undefined){	//apply all three axes
				let _delta = args.delta;
				let delta;
				let coordinateType = args.coordinateType;
				switch(coordinateType){
					case "cart":
						delta = _delta;
					break;
					case "frac":
						let lattice = [v.Structure.a, v.Structure.b, v.Structure.c];
						delta = VLatoms.Utils.Structure.fracToCart(_delta, lattice);
					break;
					case "view":
						delta = VLatoms.Utils.Structure.viewToCart(_delta, v.camera);
					break;
				}
				for(let i=0; i < sa.length; i++){
					let ca = v.Structure.atoms[sa[i]];
					newpos = VLatoms.Math.add( delta , [ca.x, ca.y, ca.z]);
					ca.x = newpos[0];
					ca.y = newpos[1];
					ca.z = newpos[2];
					// checking if atom is escaped from the cell
					v.manipulateAtom.checkAtomPositionAfterManipulate(ca, i, onEscape);
				}
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
				v.Manipulate.addHistory({
					mode:"Move Atom(s)",
					args:{delta:_delta,coordinateType:coordinateType},
					Structure:objClone(v.Structure),
				});
			} else {	//apply just one axis
				let direction = args.direction;// $('.manipulate_move_direction:checked').val();
				let step = args.step;//$('#manipulate_move_step').val()*1;
				for(var i=0;i<sa.length;i++){
					var ca = v.Structure.atoms[sa[i]];
					switch(direction){
						case "x":	//xyz(x) abc(o)
	//						ref = [1,0,0];
							ref = math.multiply(v.Structure.a,1/math.norm(v.Structure.a));
						break;
						case "y":
	//						ref = [0,1,0];
							ref = math.multiply(v.Structure.b,1/math.norm(v.Structure.b));
						break;
						case "z":
	//						ref = [0,0,1];
							ref = math.multiply(v.Structure.c,1/math.norm(v.Structure.c));
						break;
						case "vx":
							ref = rightarr;
						break;
						case "vy":
							ref = uparr;
						break;
						case "vz":
							ref = carr;
						break;
					}
					newpos = VLatoms.Math.add( VLatoms.Math.cdotvec(step, ref) , [ca.x, ca.y, ca.z]);
					ca.x = newpos[0];
					ca.y = newpos[1];
					ca.z = newpos[2];
	// check atom is escaped the cell
					v.manipulateAtom.checkAtomPositionAfterManipulate(ca,i,onEscape);
	//				v.Manipulate.insideTest(v.Structure.atoms,"onEscape");

				}
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
				v.Manipulate.addHistory({
					mode:"Move Atom(s)",
					args:{direction:direction,step:step},
					Structure:objClone(v.Structure),
				});
			}

//TODO
		},
		change:function(args){
			var sa = v.IO.selectedAtoms;
			var targetElement = args.te;

			for(var i=0;i<sa.length;i++){
				v.Structure.atoms[sa[i]].element=targetElement;
				v.Structure.atoms[sa[i]].radius = AtomParam[targetElement].radius ;
				v.Structure.atoms[sa[i]].color = AtomParam[targetElement].color ;
				v.Structure.atoms[sa[i]].mass = AtomParam[targetElement].mass ;

			}
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Change Atom(s)",
				args:{},
				Structure:objClone(v.Structure),
			});
		},
		rotate:function(args){
			var cm = [0,0,0]; // Center of mass of selected atoms
			var sa = v.IO.selectedAtoms;

			for(var i=0;i<sa.length;i++){
				var ca = v.Structure.atoms[sa[i]];
				cm[0]+=ca.x;
				cm[1]+=ca.y;
				cm[2]+=ca.z;
			}
			cm[0]/=sa.length;
			cm[1]/=sa.length;
			cm[2]/=sa.length;
			console.log(args);
			var direction = args.direction;//$('.manipulate_rotate_direction:checked').val();
			var ref;

			var uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
				uparr = VLatoms.Math.norm(uparr);
			var carr = [-v.camera.position.x, -v.camera.position.y, -v.camera.position.z];
				carr = VLatoms.Math.norm(carr);
			var rightarr = VLatoms.Math.cross(uparr,carr);
				rightarr = VLatoms.Math.norm(rightarr);
			switch(direction){
				case "x":
					ref = [1,0,0];
				break;
				case "y":
					ref = [0,1,0];
				break;
				case "z":
					ref = [0,0,1];
				break;
				case "vx":
					ref = rightarr;
				break;
				case "vy":
					ref = uparr;
				break;
				case "vz":
					ref = carr;
				break;
				case "a":
					ref = v.Structure.a;
				break;
				case "b":
					ref = v.Structure.b;
				break;
				case "c":
					ref = v.Structure.c;
				break;
			}
//			console.log(ref);
/*		
			uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
			_c = new THREE.Vector3(v.camera.position.x, v.camera.position.y, v.camera.position.z);
			_c.normalize();
			__c = [_c.x, _c.y, _c.z];
			refarr = VLatoms.Math.cross(uparr,__c); // ->
*/
			var step = args.step;//$('#manipulate_rotate_step').val()*1;
			if(!$.isNumeric(step)) return false;
			for(var i=0;i<sa.length;i++){
				var ca = v.Structure.atoms[sa[i]];
				var tmppos = VLatoms.Math.rotateA(ref,[ca.x-cm[0],ca.y-cm[1],ca.z-cm[2]],step);
				//var tmppos = VLatoms.Math.rotate(direction,[ca.x-cm[0],ca.y-cm[1],ca.z-cm[2]],step);
				ca.x = tmppos[0]+cm[0];
				ca.y = tmppos[1]+cm[1];
				ca.z = tmppos[2]+cm[2];
				v.manipulateAtom.checkAtomPositionAfterManipulate(ca,i);
			}
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			v.Manipulate.addHistory({
				mode:"Rotate Atom(s)",
				args:{},
				Structure:objClone(v.Structure),
			});

		},
		removeAtoms : function(target,historyToggle){
			target.sort(function(a,b){return b-a;});
			for(var i in target){
				var idx = target[i];
				v.Structure.atoms.splice(idx,1);
			}
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
			
			if(historyToggle !== "off"){
					v.Manipulate.addHistory({
							mode:"Delete Atom(s)",
							args:{},
							Structure:objClone(v.Structure)
					});
			}
		},
		removeSelectedAtoms : function(){
			var deleteTarget = JSON.parse(JSON.stringify(v.IO.selectedAtoms));
			v.IO.selectedAtoms = [];
			v.manipulateAtom.removeAtoms(deleteTarget);
			var selectStatus = v.IO.selectMode;
			v.IO.exitSelectMode();
			v.IO.toggleSelection(selectStatus);
		}
	}
	v.UI = new VLatoms.UI(v.wrapper);
	v.IO.init();
/* Dialog windows */
	v.openwin = {
		Manipulate : {
			GenerateManipulatorMessage : function(desc1,desc2,fields){
				var retTxt = "";
				if(desc1)	retTxt+= "<span class=VLM_msg_desc1>"+desc1+"</span>";
				if(desc2) retTxt+= "<span class=VLM_msg_desc2>"+desc2+"</span>";
				if(fields) retTxt+= "<span class=VLM_msg_fields>"+fields+"</span>";
		
				return retTxt;	
				
			},
			Change : function(){
				var title = "Change element";
				var desc1="";// "Change element to : ";
				var fields= "<select id=manipulate_change></select>";
				var desc2 ;
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						var te = document.getElementById('manipulate_change').value ; // percent
						v.manipulateAtom.change({"te":te});

						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
//						v.Manipulate.execute("change",{"te":te});
					},
					close:true
				};
				v.UI.message( title, msg, btn );
				for(var elName in AtomParam){
					$('#manipulate_change').append("<option value="+elName+">"+elName+"</option>");
				}
			},
			Edit : function(){
				$('#VLAtoms_editWrapper').remove();
				var title = "Manual Edit";
				var desc1,desc2;
				var fields = "";
					fields+= "<div style='height:363px;overflow-y:auto;' id=VLAtoms_editWrapper>";
					fields+= "<table style='border-spacing:3px;text-align:center;'>";
					fields+= "<colgroup>";
					fields+= "<col style='width:30px;text-align:center;padding:1px 4px;'></col>";
					fields+= "<col style='width:80px;text-align:center;padding:1px 4px;'></col>";
					fields+= "<col style='width:80px;text-align:center;padding:1px 4px;'></col>";
					fields+= "<col style='width:80px;text-align:center;padding:1px 4px;'></col>";
					fields+= "<col style='width:80px;text-align:center;padding:1px 4px;'></col>";
					fields+= "<col style='width:30px;text-align:center;padding:1px 4px;'></col>";
					fields+= "</colgroup>";
					fields+= "<thead>";
					fields+= "<tr>";
					fields+= "<th>Index</th>";
					fields+= "<th>El.</th>";
					fields+= "<th>x(&#8491;)</th>";
					fields+= "<th>y(&#8491;)</th>";
					fields+= "<th>z(&#8491;)</th>";
					fields+= "<th>Del.</th>";
					fields+= "</tr>";
					fields+= "</thead>";
					fields+= "<tbody>";
					fields+= "</tbody></table>";
					fields+= "</div>";
					
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply : function(){
						var atomArr = {};
						
						$('#VLAtoms_editWrapper').find(".editAtomTrWrapper").each(function(){
							var idx = $(this).data("idx"); // atomId

							atomArr[idx] = {
								element : $(this).find(".newel").val(),
								x : $(this).find(".newx").val(),
								y : $(this).find(".newy").val(),
								z : $(this).find(".newz").val(),
								del : $(this).find(".manual_edit_del")[0].checked
							}
						});
						//checking input values - schan
						for(var i in atomArr){
							for(var j in atomArr[i]){
								if(atomArr[i][j] === ""){
									alert("The "+j+" value of element "+(Number(i)+1)+" is blank.");
									return false;
								}
								if(j == "element"){
										if(AtomParam[atomArr[i][j]] == undefined){
												alert("The element '"+atomArr[i][j]+"' is not present in the periodic table.");
	return false;
										}
								} else if(j != "del"){
										if(!isnum(atomArr[i][j])){
												alert("The "+j+" value of element "+(Number(i)+1)+" is not valid.");
	return false;
										}else{
											atomArr[i][j] = Number(atomArr[i][j]);
										}
								}
							}
						}						
						//end of checking input
						//selected atom list refresh
						var remainAtoms = [];
						var deletedAtoms = [];
						for(var i = 0; i < v.IO.selectedAtoms.length; i++){
							if(atomArr[v.IO.selectedAtoms[i]].del !== true){
								remainAtoms.push(v.IO.selectedAtoms[i]);
							} else {
								deletedAtoms.push(v.IO.selectedAtoms[i]);
							}
						}
						v.IO.selectedAtoms = remainAtoms.map(function(x){
							var n = deletedAtoms.filter(function(y){
								return y < x;
							}).length; 
							return x - n;
						});
						v.manipulateAtom.edit({"atomArr":atomArr});
						refreshAtomList();
					},
					Close : function(){ //different with close
									var target;
									for (i in v.IO.customSelectCallback){
											if(v.IO.customSelectCallback[i].name == "refreshAtomList"){
													target = i;
											}
											if(target !== undefined){
													v.IO.customSelectCallback.splice(target,1);
											}
									}
									$('#VLMessage').remove();
					}
				};
				v.UI.message( title, msg, btn, {width:"auto", height:480});
				var refreshAtomList = function(){
						var target = $('#VLAtoms_editWrapper>table>tbody');
						target.empty();
						var sa = v.IO.selectedAtoms;
						var fields_sub = "";
						for(var i = 0 ; i < sa.length ; i++){
								var cIdx = sa[i];
								var ca = v.Structure.atoms[cIdx];
								fields_sub+="<tr class='editAtomTrWrapper' data-idx='"+cIdx+"'>";
								fields_sub+= "<td>"+(cIdx+1)+"</td>";
								fields_sub+= "<td><input type=text class='form-control newel' value="+ca.element+"></td>";
								fields_sub+= "<td><input type=text class='form-control newx' value="+ca.x+"></td>";
								fields_sub+= "<td><input type=text class='form-control newy' value="+ca.y+"></td>";
								fields_sub+= "<td><input type=text class='form-control newz' value="+ca.z+"></td>";
								fields_sub+= "<td><input type=checkbox class='manual_edit_del delete' value="+cIdx+"></td>";
								fields_sub+="</tr>";
						}
						target.append(fields_sub);
						$(target).find('.editAtomTrWrapper>td>input').unbind();
						$(target).find('.editAtomTrWrapper>td>input').focus(function(){
										var idx = $(target).find('.editAtomTrWrapper>td>input:focus').parents('tr').data('idx');
//										v.IO.restoreAtomsColor();
										v.IO.highlightSelectedAtoms();
										if(idx!==undefined){
										v.atomMeshes[idx].material.color.setHex('0xFFFF55');
										}
						});
				}
				refreshAtomList();
				v.IO.customSelectCallback.push(refreshAtomList);
				$('#VLM_btn_1>button').addClass("btn-warn");
				$('#VLM_btn_1>button').removeClass("btn-info");
			},
			Rotate : function(){
				var title = "Rotate atom(s)";
				var desc1,desc2;
				var fields = "Reference Axis : <input type=radio style='margin-left:10px;' class=manipulate_rotate_direction name=manipulate_rotate_direction value=x> <font color=red>x</font>";
					fields+= "<input style='margin-left:20px;' type=radio class=manipulate_rotate_direction name=manipulate_rotate_direction value=y> <font color=green>y</font>"
					fields+= "<input style='margin-left:20px;' type=radio class=manipulate_rotate_direction name=manipulate_rotate_direction value=z checked> <font color=blue>z</font><br><br>"
					fields+= "Step (&deg;) : <input type=text style='margin-left:10px;' class=VL-input-50px id=manipulate_rotate_step value=15>"
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						v.manipulateAtom.rotate({"direction":$('.manipulate_rotate_direction:checked').val(), "step": $('#manipulate_rotate_step').val()*1});

						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
//						v.Manipulate.execute("change",{"te":te});
					},
					close:true
				};
				v.UI.message( title, msg, btn  );
			},
			Move : function(){
				var title = "Move atom(s)";
				var desc1, desc2;
				var fields = "";
					fields+= "Direction : <input style='margin-left:10px;' type=radio class=manipulate_move_direction name=manipulate_move_direction value=x> <font color=red>x</font>";
					fields+= "<input style='margin-left:20px;' type=radio class=manipulate_move_direction value=y name=manipulate_move_direction > <font color=green>y</font>"
					fields+= "<input style='margin-left:20px;' type=radio class=manipulate_move_direction value=z name=manipulate_move_direction  checked> <font color=blue>z</font><br><br>"
					fields+= "Expand cell :";
					fields+= "<input style='margin-left:10px;' type=radio class=manipulate_move_onescape value=expand name=manipulate_move_onescape  checked> Expand"
					fields+= "<input style='margin-left:20px;' type=radio class=manipulate_move_onescape value=keep name=manipulate_move_onescape> Keep<br><br>"
					fields+= "Step (&#8491;) : <input type=text style='margin-left:10px;' class=VL-input-50px id=manipulate_move_step value=15><br>"
					fields+= "<span id=manipulate_optimize_percdone style='display:none;'></span>";
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						v.manipulateAtom.move({"direction":$('.manipulate_move_direction:checked').val(), "step": $('#manipulate_move_step').val()*1, "onEscape":$('.manipulate_move_onescape:checked').val()});
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
//						v.Manipulate.execute("change",{"te":te});
					},
					Optimize : function(){
						v.Manipulate.optimize();
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();

					},
					close:true
				};
				v.UI.message( title, msg, btn ,{btnClasses:[undefined,"btn-success",undefined]});
			},
/*			Add : function(){
				var title = "Add atom(s)";
				var desc1,desc2;
				var fields = "";
					fields+= "<select id=manipulate_add_element></select><br>";
					fields+= "<br><input type=radio name=manipulate_add_direction class=manipulate_add_direction value=rel checked> Relative to the selected atom(s)<br>";
					fields+= "<span style='display:block;padding-left:30px;'>&Delta;x, &Delta;y, &Delta;z = ";
					fields+= "<input type=text class=VL-input-50px id=manipulate_add_dx value=0 style='width:40px;'>, "
					fields+= "<input type=text class=VL-input-50px id=manipulate_add_dy value=0 style='width:40px;'>, "
					fields+= "<input type=text class=VL-input-50px id=manipulate_add_dz value=1.5 style='width:40px;'></span>"
					fields+= "<span style='padding-left:26px;display:block;'><input type=checkbox checked id=manipulate_add_vdw> VDW Radii</span>";
					fields+= "<input type=radio name=manipulate_add_direction class=manipulate_add_direction value=cen> Center of the selected atom(s)<br>";

				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						var args = {};
						args['vdw'] = $('#manipulate_add_vdw').is(":checked");
						args['mode'] = $('.manipulate_add_direction:checked').val();
						args['dx'] = $('#manipulate_add_dx').val();
						args['dy'] = $('#manipulate_add_dy').val();
						args['dz'] = $('#manipulate_add_dz').val();
						args['element'] = $('#manipulate_add_element').val();
						v.manipulateAtom.add(args);
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
//						v.Manipulate.execute("change",{"te":te});
					},
					close:true
				};
				v.UI.message( title, msg, btn, {width:400});
				for(var elName in AtomParam){
					$('#manipulate_add_element').append("<option value="+elName+">"+elName+"</option>");
				}
			},*/	/* deprecated (지금은 메시지창 안띄우고 숨겨뒀다가 노출)*/
			Strain : function(){
				var title = "Strain (%)";
				var desc1, desc2;
			//		desc1= "Strain for each direction(%) :";
				var fields="";
					fields+= " a : <input type=text id='VLM_strain_sx' class=VL-input-50px value=0 style='margin-right:15px;'>";
					fields+= " b : <input type=text id='VLM_strain_sy' class=VL-input-50px value=0 style='margin-right:15px;'>";
					fields+= " c : <input type=text id='VLM_strain_sz' class=VL-input-50px value=0>";
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						var sx = document.getElementById('VLM_strain_sx').value/100+1 ; // percent
						var sy = document.getElementById('VLM_strain_sy').value/100+1 ; // percent
						var sz = document.getElementById('VLM_strain_sz').value/100+1 ; // percent
						v.Manipulate.execute("strain",{"sx":sx,"sy":sy,"sz":sz});
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
					},
					close:true
				};
				v.UI.message( title, msg, btn, {width:400} );
			},
			Clone : function(){
				var title = "Clone";
				var desc1,desc2,fields;
					desc1 = "Number of cell for each direction :";
					//desc2 = "Positive Integer";
					fields = "";
					fields+= " a : <input type=text id='VLM_strain_nx' class=VL-input-50px value=1 style='margin-right:15px;'>";
					fields+= " b : <input type=text id='VLM_strain_ny' class=VL-input-50px value=1 style='margin-right:15px;'>";
					fields+= " c : <input type=text id='VLM_strain_nz' class=VL-input-50px value=1>";
				var msg = this.GenerateManipulatorMessage(desc1, desc2, fields);
				var btn = {
					Apply: function(){
						var nx = document.getElementById('VLM_strain_nx').value*1 ; // percent
						var ny = document.getElementById('VLM_strain_ny').value*1 ; // percent
						var nz = document.getElementById('VLM_strain_nz').value*1 ; // percent
						v.Manipulate.execute("clone",{"nx":nx,"ny":ny,"nz":nz});
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
					},
					close:true
				};
				v.UI.message( title, msg, btn, {width:400});

			},
			Vacuum : function(){

				var title = "Vacuum";
				var desc1, desc2, fields;
					desc1 = "Size of Vacuum in each direction (&#8491;) :";
					//desc2 = "Negative and Positive, &#8491;";
					fields="<table><tr style='height:36px;'>";
					fields+="<td style='padding-right:3px;text-align:right;width:30px;'> -a : </td><td><input type=text id='VLM_strain_vx_n' class=VL-input-50px value=0 style='margin-right:15px;'></td>";
					fields+="<td style='padding-right:3px;text-align:right;width:30px;'> -b : </td><td><input type=text id='VLM_strain_vy_n' class=VL-input-50px value=0 style='margin-right:15px;'></td>";
					fields+="<td style='padding-right:3px;text-align:right;width:30px;'> -c : </td><td><input type=text id='VLM_strain_vz_n' class=VL-input-50px value=0></td></tr>";
					fields+="<tr><td style='padding-right:3px;text-align:right;width:30px;'> +a : </td><td><input type=text id='VLM_strain_vx_p' class=VL-input-50px value=0  style='margin-right:15px;'></td>";
					fields+="<td style='padding-right:3px;text-align:right;width:30px;'> +b : </td><td><input type=text id='VLM_strain_vy_p' class=VL-input-50px value=0 style='margin-right:15px;'></td>";
					fields+="<td style='padding-right:3px;text-align:right;width:30px;'> +c : </td><td><input type=text id='VLM_strain_vz_p' class=VL-input-50px value=0></td></tr>";
					fields+="</table>";


				var msg = this.GenerateManipulatorMessage(desc1,desc2,fields);
				var btn = {
					Apply: function(){
						var nx = document.getElementById('VLM_strain_vx_n').value*1 ; // percent
						var ny = document.getElementById('VLM_strain_vy_n').value*1 ; // percent
						var nz = document.getElementById('VLM_strain_vz_n').value*1 ; // percent

						var px = document.getElementById('VLM_strain_vx_p').value*1 ; // percent
						var py = document.getElementById('VLM_strain_vy_p').value*1 ; // percent
						var pz = document.getElementById('VLM_strain_vz_p').value*1 ; // percent
//						v.Manipulate.vacuum(vx_n,vx_p,vy_n,vy_p,vz_n,vz_p);
						v.Manipulate.execute("vacuum",{"nx":nx,"ny":ny,"nz":nz,"px":px,"py":py,"pz":pz});
						v.IO.restoreAtomsColor();
						v.IO.highlightSelectedAtoms();
					},
					close:true
				};
				v.UI.message( title, msg, btn, {width:400});

			},
			DrawFromInput : function(){
				var title="Structure Input";
				var desc1, desc2, fields;
					fields = "<div style='width:300px'>"
					fields += "<label>Cell</label><br/>";
					fields += "<input class='customInputCellOpt' type=checkbox><span>Use the Current Cell</span><br/>";
					fields += "<div class='customInputCellWrapper'>"
					fields += "<div>";
					fields += "<div style='display:inline-block;width:25%;'><span>a</span></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=0 data-column=0 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=0 data-column=1 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=0 data-column=2 style='width:100%;'></div>";
					fields += "</div>";
					fields += "<div>";
					fields += "<div style='display:inline-block;width:25%;'><span>b</span></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=1 data-column=0 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=1 data-column=1 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=1 data-column=2 style='width:100%;'></div>";
					fields += "</div>";
					fields += "<div>";
					fields += "<div style='display:inline-block;width:25%;'><span>c</span></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=2 data-column=0 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=2 data-column=1 style='width:100%;'></div>";
					fields += "<div style='display:inline-block;width:25%;'><input class='customInputCell' data-row=2 data-column=2 style='width:100%;'></div>";
					fields += "</div>";
					fields += "</div>";
					fields += "<label>Atoms</label>";
					fields += "<div class='customInputAtomsWrapper' style='height:300px;overflow-y:auto;'>"
					fields += "<div>";
					fields += "<div style='display:inline-block;width:10%;'><span>1</span></div>";
					fields += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=0 data-column=0 style='width:100%;' placeholder='Element'></div>";
					fields += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=0 data-column=1 style='width:100%;' placeholder='x'></div>";
					fields += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=0 data-column=2 style='width:100%;' placeholder='y'></div>";
					fields += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=0 data-column=3 style='width:100%;' placeholder='z'></div>";
					fields += "</div>";
					fields += "</div>";
					fields += "</div>";
					fields += "</div>";
				var btn={
					"Apply":function(){v.Manipulate.drawFromInput()},
					"close":true
				}
				var msg = this.GenerateManipulatorMessage(desc1,desc2,fields);
				v.UI.message( title, msg, btn, {"width":"auto","height":500});
				$(".customInputCell").off();
				$(".customInputCell").on("paste", function(e) {
					e.stopPropagation();
					e.preventDefault();
					let row = $(e.target).data("row");
					let col = $(e.target).data("column");
					console.log(row, col);
					var cd = e.originalEvent.clipboardData.getData("text/plain");
					cd = cd.trim().split("\n");
					for (let i = 0; i < cd.length; i++) {
						cd[i] = cd[i].trim().replace(/\s+/g, " ").replace(/\t+/g, " ").split(" ");
					}
					for (let i = 0; i < cd.length; i++) {
						for (let j = 0; j < cd[i].length; j++) {
							$(".customInputCell[data-row=" + (row + i) + "][data-column=" + (col + j) + "]").empty().val(cd[i][j]);
						}
					}
				});
				
				function atomsPatseEvent(e) {
					e.stopPropagation();
					e.preventDefault();
					let row = $(e.target).data("row");
					let col = $(e.target).data("column");
					var cd = e.originalEvent.clipboardData.getData("text/plain");
					cd = cd.trim().split("\n");
					for (let i = 0; i < cd.length; i++) {
						cd[i] = cd[i].trim().replace(/\s+/g, " ").replace(/\t+/g, " ").split(" ");
					}
					for (let i = 0; i < cd.length; i++) {
						let nrow=row*1+i*1;
						if ($(".customInputAtoms[data-row=" + nrow + "]").length === 0) {
							let inh = "<div>";
							inh += "<div style='display:inline-block;width:10%;'><span>" + (nrow + 1) + "</span></div>";
							inh += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=" + nrow + " data-column=0 style='width:100%;' placeholder='Element'></div>";
							inh += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=" + nrow + " data-column=1 style='width:100%;' placeholder='x'></div>";
							inh += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=" + nrow + " data-column=2 style='width:100%;' placeholder='y'></div>";
							inh += "<div style='display:inline-block;width:22.5%;'><input class='customInputAtoms' data-row=" + nrow + " data-column=3 style='width:100%;' placeholder='z'></div>";
							inh += "</div>";
							$(".customInputAtomsWrapper").append(inh);
						}
						for (let j = 0; j < cd[i].length; j++) {
							$(".customInputAtoms[data-row=" + (row + i) + "][data-column=" + (col + j) + "]").empty().val(cd[i][j]);
						}
					}
					$(".customInputAtoms").off();
					$(".customInputAtoms").on("paste", function(e) {
						atomsPatseEvent(e)
					});
				};
				$(".customInputCellOpt").off();
				$(".customInputCellOpt").click(function() {
					let checked = $(this).prop("checked");
					if (checked) {
						$(".customInputCellWrapper").hide();
					} else {
						$(".customInputCellWrapper").show();
					}
				});
				$(".customInputAtoms").off();
				$(".customInputAtoms").on("paste", function(e) {
					atomsPatseEvent(e)
				});
			}
		}
	},

/* Manipulator */
	v.Manipulate = {
		historyLoaded : -1,
		history : [],
		updateHistoryTbl : function(){
			if( v.option.historyWrapper !==undefined ){
				v.option.historyWrapper.empty();
				for(var idx = 0;idx<v.Manipulate.history.length;idx++){
				//	var idx = v.Manipulate.history.length - 1;
					v.option.historyWrapper
							.append("<div class='history_bar_record' data-historyidx='"+idx+"'><span class='history_bar_record_title' style='float:left;padding-top:5px;'>"
											+v.Manipulate.history[idx].mode
											+"</span><span class='history_bar_record_delete' style='float:right;font-size:9px;color:red;padding-top:5px;'>X</span><br><img class='history_bar_img' src='"
											+v.Manipulate.history[idx].Image+"'></div>");

					v.option.historyWrapper.scrollLeft(v.option.historyWrapper[0].scrollWidth);
					v.option.historyWrapper.children("div").eq(idx).unbind();
					v.option.historyWrapper.children("div").eq(idx).bind("click",function(){
							v.IO.selectedAtoms = [];
							var ci = $(this).data("historyidx");
							var _structure = v.Manipulate.history[ci].Structure;
							v.Structure = $.extend(true,{},_structure);
							v.update.atomsChanged = true;
							v.update.bondsChanged = true;
							v.animateControl.once();
							v.strlist[v.strNum]["Structure"]=ci;
					});
					v.option.historyWrapper.find(".history_bar_record_delete").off();
					v.option.historyWrapper.find(".history_bar_record_delete").click(function(e){
						let ci=$(this).parent().data("historyidx")*1;
						let si=v.strlist[v.strNum]["Structure"]*1;
						let ni=0;
						if(v.Manipulate.history.length <2){
							return;
						}
						v.Manipulate.history.splice(ci,1);
						if(ci>si){
							ni=si;
						}else if(ci===si){
							ni=v.Manipulate.history.length-1;
							var _structure = v.Manipulate.history[ni].Structure;
							v.Structure = VLatoms.Utils.redefineStructure(_structure);
							v.update.atomsChanged = true;
							v.update.bondsChanged = true;
							v.animateControl.once();

						}else{
							ni=si-1;
						}
						v.strlist[v.strNum]["Structure"]=ni;
						v.Manipulate.updateHistoryTbl();
						e.stopPropagation();
					});
				}
			}

		},
		addHistory : function(historyData){
			if(!v.option.history) return false;
			if(v.Manipulate.history.length === 0 && v.Structure.atoms.length === 0) return false;
			historyData.selectedAtoms = JSON.parse(JSON.stringify(v.IO.selectedAtoms));
			if(v.Manipulate.history.length > 0){
				if(VLatoms.Utils.Structure.compare(v.Structure, v.Manipulate.history[v.Manipulate.history.length - 1].Structure)) { 
					console.warn("Nothing has changed.");
					v.shiftPressed=false;
					v.ctlPressed=false;
					v.altPressed=false;
					v.spacePressed=false;
					return false;
				}
			} 
			v.update.atom();
			v.update.bond();
			v.update.atom();
			v.IO.highlightSelectedAtoms();
			v.renderer.render( v.scene, v.camera );
			historyData.Image = v.renderer.domElement.toDataURL("image/png");
			//반복 작업 통합
			var _idx = v.Manipulate.history.length - 1;
			if(_idx > 0){
				if(historyData.mode == "Move Atom(s)" || historyData.mode == "Rotate Atom(s)"){
					if(historyData.mode == v.Manipulate.history[_idx].mode
							&& math.deepEqual(historyData.selectedAtoms, v.Manipulate.history[_idx].selectedAtoms)){
						v.option.historyWrapper.find("div:last-child").remove();
						v.Manipulate.history.pop();
					}
				}
			}
			v.Manipulate.history.push(historyData);
			v.Manipulate.updateHistoryTbl();
			v.Manipulate.callback();
			v.strlist[v.strNum]["Structure"]=v.Manipulate.history.length -1;
			//v.setOptimalCamPosition();
		},
		callback : function(){
			if( typeof(v.option.manipulateCallback) == "function"){
				v.option.manipulateCallback = [v.option.manipulateCallback];
			}else if (typeof(v.option.manipulateCallback) != "object"){
				console.warn("manipulate callback is not an object : "+ typeof(v.option.manipulateCallback));
			}
			
			if(typeof(v.option.manipulateCallback) == "object"){
				for(var i=0;i<v.option.manipulateCallback.length;i++){
					if(typeof(v.option.manipulateCallback[i]) == "function"){
						v.option.manipulateCallback[i](v);
					}
				}
			}

		},
		execute : function(mode,args){
			if(v.Manipulate.historyLoaded>=0){
				console.log(v.Manipulate.historyLoaded);
				v.Manipulate.history.splice(v.Manipulate.historyLoaded+1);
				v.Manipulate.historyLoaded=-1;
			}

			v.Manipulate[mode](args);
			v.Manipulate.addHistory({
				mode:mode[0].toUpperCase()+mode.slice(1),
				args:args,
				Structure:objClone(v.Structure),
			});

		},
		clone : function( args ){
			var nx = args['nx'];
			var ny = args['ny'];
			var nz = args['nz'];
			var returnOnly=false;
			if(args['returnOnly']!==undefined) returnOnly = args['returnOnly'];
			var selectedClone = false;
			if(args['selectedClone'] == true) selectedClone = true;
			if(selectedClone && v.IO.selectedAtoms.length === 0){
				return false;
			}

			var retStructure = {	a : Array(3),	b : Array(3),	c : Array(3),	atoms : Array()	};
			nx = Math.floor( nx * 1 );
			ny = Math.floor( ny * 1 );
			nz = Math.floor( nz * 1 );
			for(var i = 0 ; i < 3 ; i++ ){
				retStructure.a[i] = v.Structure.a[i]*nx;
				retStructure.b[i] = v.Structure.b[i]*ny;
				retStructure.c[i] = v.Structure.c[i]*nz;
			}
			//선택부분만 복사로 체크시확인해서 수정
//			var natom_org = v.Structure.atoms.length;
			if(selectedClone && v.IO.selectedAtoms.length!== 0 ){
				var natom_org = v.IO.selectedAtoms.length;
					
			}else{
				var natom_org = v.Structure.atoms.length;
			}
			//수정끝
			var newpos = [];
			for(var i = 0 ; i < nx ; i++ ){
				for(var j = 0 ; j < ny ; j++ ){
					for(var k = 0 ; k < nz ; k++ ){
						//기본값들 복사하기
						var threezero=((i+j+k)=== 0);
						if(!threezero){
							var _natom_ = natom_org;
						}else{
							var _natom_ = v.Structure.atoms.length;
						}
//						for(var l = 0 ; l < natom_org ; l++){
						for(var l = 0 ; l < _natom_ ; l++){
//							var ca = v.Structure.atoms[l];
							//selectedClone true 여부 확인해서 나눔
							//var ca = v.Structure.atoms[l];
							if(selectedClone && !threezero){
								var ca = v.Structure.atoms[v.IO.selectedAtoms[l]];
							}else{
								var ca = v.Structure.atoms[l];
							}
							//끝
							newpos = [ ca.x, ca.y, ca.z ];
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( i, v.Structure.a ) )
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( j, v.Structure.b ) )
							newpos = VLatoms.Math.add( newpos , VLatoms.Math.cdotvec( k, v.Structure.c ) )
							for(var ii=0;ii<3;ii++){
								newpos[ii]=+newpos[ii].toFixed(8);
								if(Math.abs(newpos[ii])<0.00001) newpos[ii]=0;
							}
							retStructure.atoms.push( new VLatoms.Atom( newpos[0], newpos[1], newpos[2], ca.element) );
						}
					}
				}
			}
			if(!returnOnly){
				v.Structure = retStructure;
				v.update.atomsChanged = true;
				v.update.bondsChanged = true;
				v.animateControl.once();
			}
			return retStructure;
		},
		strain : function( args ){
			var _x = args['sx'];
			var _y = args['sy'];
			var _z = args['sz'];
			var retStructure = {	a : Array(3),	b : Array(3),	c : Array(3),	atoms : Array()	};
			_x *= 1 ;
			_y *= 1 ;
			_z *= 1 ;
			for(var i = 0 ; i < 3 ; i++ ){
				retStructure.a[i] = +v.Structure.a[i]*_x;
				retStructure.b[i] = +v.Structure.b[i]*_y;
				retStructure.c[i] = +v.Structure.c[i]*_z;
			}
			var natom_org = v.Structure.atoms.length;
			var newpos = [];
			for(var i = 0 ; i < natom_org ; i++ ){
				var ca = v.Structure.atoms[i];
				newpos = [ _x * ca.x, _y * ca.y, _z * ca.z ];
				retStructure.atoms.push( new VLatoms.Atom( newpos[0], newpos[1], newpos[2], ca.element) );
			}
			v.Structure = retStructure;
			v.update.atomsChanged = true;
			v.update.bondsChanged = true;
			v.animateControl.once();
			return retStructure;
		},
		vacuum : function( args ){
			var nx, px, ny, py, nz, pz;
				nx=args['nx'];
				ny=args['ny'];
				nz=args['nz'];
				px=args['px'];
				py=args['py'];
				pz=args['pz'];
			var returnOnly=false;
				if(args['returnOnly']!==undefined) returnOnly = args['returnOnly'];
		// negative x,y,z and positive x,y,z
			var len_org = [ VLatoms.Math.len( v.Structure.a ),
							VLatoms.Math.len( v.Structure.b ),
							VLatoms.Math.len( v.Structure.c ) ];
			var len_new = [ len_org[0] + nx + px,
							len_org[1] + ny + py,
							len_org[2] + nz + pz ];
			for(var i=0;i<3;i++){
				if(  len_new[i] <=0 ){
					alert("Cell size is less than 0!");	
					return;
				}
			}
			var retStructure = {	a : Array(3),	b : Array(3),	c : Array(3),	atoms : Array()	};
			retStructure.a = VLatoms.Math.cdotvec( len_new[0], VLatoms.Math.norm( v.Structure.a) );
			retStructure.b = VLatoms.Math.cdotvec( len_new[1], VLatoms.Math.norm( v.Structure.b) );
			retStructure.c = VLatoms.Math.cdotvec( len_new[2], VLatoms.Math.norm( v.Structure.c) );
			var natom_org = v.Structure.atoms.length;
			var shift = [
				VLatoms.Math.cdotvec( nx, VLatoms.Math.norm( v.Structure.a ) ),
				VLatoms.Math.cdotvec( ny, VLatoms.Math.norm( v.Structure.b ) ),
				VLatoms.Math.cdotvec( nz, VLatoms.Math.norm( v.Structure.c ) )
			];
			var newpos = [];
			var latmatinv = VLatoms.Math.inv3([retStructure.a, retStructure.b, retStructure.c]);
			var newPosFract;
			for(var i = 0 ; i < natom_org ; i++){
				var ca = v.Structure.atoms[i];
				newpos = [ ca.x, ca.y, ca.z ];
				for(var j = 0 ; j < 3 ; j++){
					newpos = VLatoms.Math.add( shift[j], newpos );
				}
//Check atom is in the box
				newPosFract = VLatoms.Math.vecdotmat( newpos, latmatinv );
				for(var j = 0 ; j < 3 ; j++){
					if(newPosFract[j]<0) newPosFract[j]=Math.ceil(Math.abs(newPosFract[j]))-newPosFract[j];
					if(newPosFract[j]>0) newPosFract[j]=newPosFract[j]-Math.ceil(Math.abs(newPosFract[j]));
				}
				
				


				retStructure.atoms.push( new VLatoms.Atom( newpos[0], newpos[1], newpos[2], ca.element) );

			}
			if(nx <0 || ny <0 || nz <0 || px <0 || py <0 || pz <0){	//outsider check when shrinking
				var ret = v.Manipulate.insideTest(retStructure.atoms, {cell:retStructure});
console.log(retStructure);	
console.log(ret);	
				if(!ret.inside){
					if(confirm(ret.outsider.length+" atom(s) will be deleted. Do you want to continue?")){
						v.IO.exitSelectMode();
//						v.manipulateAtom.removeAtoms(ret.outsider);
						ret.outsider.sort(function(a,b){return b-a;});
						for(var i in ret.outsider){
								var idx = ret.outsider[i];
								retStructure.atoms.splice(idx,1);
						}
					} else {
						return false;
					}
				}
			}
			if(!returnOnly){
				v.Structure = retStructure;
				v.update.atomsChanged = true;
				v.update.bondsChanged = true;
				v.animateControl.once();
			}
			v.setOptimalCamPosition();
			return retStructure;
		},
		fill : function( option ){
			if( !option ){
				alert("Invalid operation");
				return;
			}
			var worker = new Worker(VLATOMS_PATH+"/workers/fill.js?v"+Math.random());
			worker.postMessage({
				Structure : v.Structure,
				angle : option.angle,
				molecules : option.molecules,
				maxdensity : option.maxdensity,
				thickness : option.thickness,
				dist : option.dist,
				rotate : option.rotate,
			});
			worker.onmessage = function(e){
				var stat = e.data;
console.log('get data from worker', stat);
				if(stat.state == 'busy'){
				
				}else if(stat.state == 'finished'){
					var retdata = stat.retarr;
					v.Structure = VLatoms.Utils.redefineStructure(retdata);//TODO Here
					v.update.atomsChanged=true;
					v.update.bondsChanged=true;
					v.animateControl.once();
					v.Manipulate.addHistory({
						mode:"Fill-"+option.molecules[0].formula.formulaStr,
						args:{},
						Structure:objClone(v.Structure),
					});
					if(typeof(option.callback == "function")){
						option.callback();
					}

				}
				console.log(e);
			}
		},
		optimize : function(){
			var worker = new Worker(VLATOMS_PATH+"/workers/optimize.js?v"+Math.random());
			worker.postMessage({
				Structure : v.Structure,
				movingAtoms : v.IO.selectedAtoms
			});
			var percdone = 0;
			worker.onmessage = function(e){
				var newStructure = e.data.Structure;
				var time = e.data.time;
				percdone = time/10 * 100;
				$('#manipulate_optimize_percdone').css("display","block");
				$('#manipulate_optimize_percdone').html("Optimize : "+percdone.toFixed(0)+"% Done");
				v.Structure = newStructure;

				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.animateControl.once();
					
			}	
		},
/*		insideTest : function(atoms){
			if(atoms === undefined){
			   return false;
			}
			var ret={
				inside:true,
				delta:[0,0,0,0,0,0],
				outsider:[],
			};
			var _cube_ =[];
			var tmp;
			var _atom = [];
			var _sizeCube_=[];
			_cube_[0]=v.Structure.a;
			_cube_[1]=v.Structure.b;
			_cube_[2]=v.Structure.c;
			_sizeCube_[0]=Math.sqrt(math.dot(v.Structure.a,v.Structure.a));
			_sizeCube_[1]=Math.sqrt(math.dot(v.Structure.b,v.Structure.b));
			_sizeCube_[2]=Math.sqrt(math.dot(v.Structure.c,v.Structure.c));
			   
			for(var i=0; i<atoms.length;i++){
			   _atom = [];
			   _atom[0]=atoms[i].x;
			   _atom[1]=atoms[i].y;
			   _atom[2]=atoms[i].z;
			   var vectorSize = math.multiply(math.inv(math.transpose(_cube_)),_atom);
			   for(var j=0;j<3;j++){
				  if(vectorSize[j]>1){
					 ret.inside=false;
					 ret.outsider.push(i);
					 tmp=(vectorSize[j]-1)*_sizeCube_[j];
					 if(ret.delta[j+3] < tmp){
						ret.delta[j+3] = tmp;
					 }
				  }else if(vectorSize[j]<0){
					 ret.inside=false;
					 ret.outsider.push(i);
					 tmp=vectorSize[j]*_sizeCube_[j]*(-1);
					 if(ret.delta[j] < tmp){
						ret.delta[j] = tmp;
					 }
				  }
			   }
			}
			for (var i = 0; i < 6; i++){
				ret.delta[i] = Math.ceil(ret.delta[i]*1000)/1000;
			}
			return ret;
		}*/
		insideTest : function(atoms,option){
			//기본 기능은 atoms를 visualizer의 cell에 넣을 때 벗어나는 원자가 있는지 알려주고(outsider에 목록 제공)
			//벗어나는 원자들을 포함하려면 셀이 얼마나 늘어나야 할지를 알려준다. (delta, 012는 음수방향, 345는 양수방향)
			//option.cell로 임의의 셀과 비교하는 기능 제공.
			//기본적으로 findSize=true 인 경우에 대한 값을 구하고, 그걸 후처리해서 findSize=false일때의 기본 delta 제공. 
			var cell = v.Structure;
			var onEscape = false;		//셀은 고정 시키고 벗어난 원자들은 벗어난 위치의 다른 셀에 
										//해당하는 위치로 넣는 기능.(atoms 좌표가 call by reference로 바뀜)
										// return 값 필요 없음.
			var findSize = false;		//셀에서 atoms가 차지하는 위치의 최대최소값을 abc에 대한 상대좌표로 제공. 
			if(atoms === undefined){
				return false;
			}
			if(option !== undefined){
				if(option.onEscape !== undefined) onEscape = option.onEscape;
				if(option.cell !== undefined) cell = option.cell;
				if(option.findSize !== undefined) findSize=option.findSize;
			}
			var ret={
				inside:true,
				delta:[],
				outsider:[],
			};
			var _cube_ =[];
			var tmp;
			var _atom = [];
			var _sizeCube_=[];
			_cube_[0]=cell.a;
			_cube_[1]=cell.b;
			_cube_[2]=cell.c;
			_sizeCube_[0]=VLatoms.Math.len(cell.a);
			_sizeCube_[1]=VLatoms.Math.len(cell.b);
			_sizeCube_[2]=VLatoms.Math.len(cell.c);
			for(var i=0; i<atoms.length;i++){
				_atom = [];
				_atom[0]=atoms[i].x;
				_atom[1]=atoms[i].y;
				_atom[2]=atoms[i].z;
				var vectorSize = math.multiply(math.inv(math.transpose(_cube_)),_atom);
				if(i===0){
					for(var j=0;j<3;j++){
						ret.delta[j]=vectorSize[j];
						ret.delta[j+3]=vectorSize[j];
					}
				}
				if(!onEscape){
					for(var j=0;j<3;j++){
						if(vectorSize[j]>1){
							ret.inside=false;
							if(ret.outsider.indexOf(i) == -1){
								ret.outsider.push(i);
							}
						}else if(vectorSize[j]<0){
							ret.inside=false;
							if(ret.outsider.indexOf(i) == -1){
								ret.outsider.push(i);
							}
						}
							tmp=vectorSize[j];
							if(ret.delta[j+3] < tmp){
								ret.delta[j+3] = tmp;
							}
							if(ret.delta[j] > tmp){
								ret.delta[j] = tmp;
							}
					}
				}else{	
					for(var j=0;j<3;j++){
						if( vectorSize[j]>1 || vectorSize[j]<0 ){
							vectorSize[j]-=Math.floor(vectorSize[j]);
						}
					}
					atoms[i].x = vectorSize[0]*_cube_[0][0];
					atoms[i].x += vectorSize[1]*_cube_[1][0];
					atoms[i].x += vectorSize[2]*_cube_[2][0];
					atoms[i].y = vectorSize[0]*_cube_[0][1];
					atoms[i].y += vectorSize[1]*_cube_[1][1];
					atoms[i].y += vectorSize[2]*_cube_[2][1];
					atoms[i].z = vectorSize[0]*_cube_[0][2];
					atoms[i].z += vectorSize[1]*_cube_[1][2];
					atoms[i].z += vectorSize[2]*_cube_[2][2];
				}
			}
			if(onEscape){
				return true;	
			}
			if(!findSize){
				for(var i=0;i<3;i++){
					if(ret.delta[i]>=0) {
						ret.delta[i]=0;
					}
					else {
						ret.delta[i]*=_sizeCube_[i]*(-1);
					}
				}
				for(var i=3;i<6;i++){
					if(ret.delta[i]<=1) {
						ret.delta[i]=0;
					}
					else {
						ret.delta[i]=(ret.delta[i]-1)*_sizeCube_[i-3];
					}
				}
				for(var i =0;i<3;i++){
					if(ret.delta[i]>0 ) {
						ret.delta[i]+=0.001;
					}
					if( ret.delta[i+3]>0){
						ret.delta[i+3]+=0.001;
					}
				}
			}
			return ret;
		},
		paste : function( args ){
			var _tmp_selectedAtoms=[];
			var newpos = [];
			if(v.IO.selectedAtoms.length==0){
				return false;
			}
			var nAtomPasted = v.IO.selectedAtoms.length;	
			for(var l = 0 ; l < nAtomPasted ; l++){
				if(v.IO.selectedAtoms.length!== 0 ){
					var ca = v.Structure.atoms[v.IO.selectedAtoms[l]];
				}else{
					var ca = v.Structure.atoms[l];
				}
				newpos = [ ca.x+1, ca.y+1, ca.z+1 ];
				v.Structure.atoms.push( new VLatoms.Atom( newpos[0], newpos[1], newpos[2], ca.element) );
				_tmp_selectedAtoms.push(v.Structure.atoms.length-1);
			}
			v.IO.selectedAtoms=_tmp_selectedAtoms.slice(0);
			v.Manipulate.insideTest(v.Structure.atoms, {onEscape:true});
		},
		merge : function(args){
			let idx1=args.idx1;
			let idx2=args.idx2;
			let target_plane=args.tplane;
			let order =args.order;
			let space=args.space;
			let cloneOpt=args.clone;
			if(cloneOpt===undefined){
				cloneOpt=[true,true,true];
			}
			let vll = v.strlist[idx1].history[v.strlist[idx1].Structure].Structure;
			let vlr = v.strlist[idx2].history[v.strlist[idx2].Structure].Structure;
			let cen1 = [
				(vll.a[0]+vll.b[0]+vll.c[0])/2,
				(vll.a[1]+vll.b[1]+vll.c[1])/2,
				(vll.a[2]+vll.b[2]+vll.c[2])/2
			];
			let cen2 = [
				(vlr.a[0]+vlr.b[0]+vlr.c[0])/2,
				(vlr.a[1]+vlr.b[1]+vlr.c[1])/2,
				(vlr.a[2]+vlr.b[2]+vlr.c[2])/2
			];
			v.addStrlist();
			var cube = [];
			cube[0] = vlr.a.slice(0);
			cube[1] = vlr.b.slice(0);
			cube[2] = vlr.c.slice(0);
			var cube2 = [];
			cube2[0] = vll.a.slice(0);
			cube2[1] = vll.b.slice(0);
			cube2[2] = vll.c.slice(0);
			v.Structure.a = vlr.a.slice(0);
			v.Structure.b = vlr.b.slice(0);
			v.Structure.c = vlr.c.slice(0);
			v.Structure.atoms = vlr.atoms.slice(0);
			var new_atoms = [];
			var max = [0, 0, 0];
			var min = [1, 1, 1]
			var target_point = [
				[0, 0, 0]
			];
			target_point.push([vll.a[0] + vll.b[0] + vll.c[0], vll.a[1] + vll.b[1] + vll.c[1], vll.a[2] + vll.b[2] + vll.c[2]]);
			target_point.push([vll.a[0] + vll.b[0], vll.a[1] + vll.b[1], vll.a[2] + vll.b[2]]);
			target_point.push([vll.a[0] + vll.c[0], vll.a[1] + vll.c[1], vll.a[2] + vll.c[2]]);
			target_point.push([vll.b[0] + vll.c[0], vll.b[1] + vll.c[1], vll.b[2] + vll.c[2]]);
			target_point.push([vll.a[0], vll.a[1], vll.a[2]]);
			target_point.push([vll.b[0], vll.b[1], vll.b[2]]);
			target_point.push([vll.c[0], vll.c[1], vll.c[2]]);
			var max2 = [0, 0, 0];
			var min2 = [1, 1, 1];
			var target_point2 = [
				[0, 0, 0]
			];
			target_point2.push([vlr.a[0] + vlr.b[0] + vlr.c[0], vlr.a[1] + vlr.b[1] + vlr.c[1], vlr.a[2] + vlr.b[2] + vlr.c[2]]);
			target_point2.push([vlr.a[0] + vlr.b[0], vlr.a[1] + vlr.b[1], vlr.a[2] + vlr.b[2]]);
			target_point2.push([vlr.a[0] + vlr.c[0], vlr.a[1] + vlr.c[1], vlr.a[2] + vlr.c[2]]);
			target_point2.push([vlr.b[0] + vlr.c[0], vlr.b[1] + vlr.c[1], vlr.b[2] + vlr.c[2]]);
			target_point2.push([vlr.a[0], vlr.a[1], vlr.a[2]]);
			target_point2.push([vlr.b[0], vlr.b[1], vlr.b[2]]);
			target_point2.push([vlr.c[0], vlr.c[1], vlr.c[2]]);
			for (var i = 0; i < target_point.length; i++) {
				let atom=[]
				for( var j=0 ; j<3 ; j++){
					atom.push(target_point[i][j].toFixed(5));
				}
				let vectorSize = math.multiply(math.inv(math.transpose(cube)), atom);
				if (vectorSize[0] > max[0]) max[0] = vectorSize[0];
				if (vectorSize[1] > max[1]) max[1] = vectorSize[1];
				if (vectorSize[2] > max[2]) max[2] = vectorSize[2];
				if (vectorSize[0] < min[0]) min[0] = vectorSize[0];
				if (vectorSize[1] < min[1]) min[1] = vectorSize[1];
				if (vectorSize[2] < min[2]) min[2] = vectorSize[2];
				let atom2 = [];
				for( var j=0 ; j<3 ; j++){
					atom2.push(target_point2[i][j].toFixed(5));
				}
				let vectorSize2 = math.multiply(math.inv(math.transpose(cube2)), atom2);
				if (vectorSize2[0] > max2[0]) max2[0] = vectorSize2[0];
				if (vectorSize2[1] > max2[1]) max2[1] = vectorSize2[1];
				if (vectorSize2[2] > max2[2]) max2[2] = vectorSize2[2];
				if (vectorSize2[0] < min2[0]) min2[0] = vectorSize2[0];
				if (vectorSize2[1] < min2[1]) min2[1] = vectorSize2[1];
				if (vectorSize2[2] < min2[2]) min2[2] = vectorSize2[2];
			}
			var _cube = [];
			let shift=[0,0,0];
			let cloneVal=[];
			for(var i=0 ; i<3 ; i++){
				if(cloneOpt[i]){
					cloneVal[i]=Math.ceil(max[i]-min[i]);
				}else{
					cloneVal[i]=1;
				}
			}

			switch (target_plane) {
				case "XY":
					v.Manipulate.execute("clone", {
						"nx": cloneVal[0],
						"ny": cloneVal[1],
						"nz": cloneVal[2]+(cloneOpt[2]?1:0),
					});
					_cube[0] = vll.a.slice(0);
					_cube[1] = vll.b.slice(0);
					_cube[2] = vll.c.slice(0);
					for(var i=0 ; i<3 ; i++){
						_cube[2][i]*=(max2[2] - min2[2]);
					}
					break;
				case "XZ":
					v.Manipulate.execute("clone", {
						"nx": cloneVal[0],
						"ny": cloneVal[1]+(cloneOpt[1]?1:0),
						"nz": cloneVal[2],
					});
					_cube[0] = vll.a.slice(0);
					_cube[1] = vll.b.slice(0);
					_cube[2] = vll.c.slice(0);
					for(var i=0 ; i<3 ; i++){
						_cube[1][i]*=(max2[1] - min2[1]);
					}
					break;
				case "YZ":
					v.Manipulate.execute("clone", {
						"nx": cloneVal[0]+(cloneOpt[0]?1:0),
						"ny": cloneVal[1],
						"nz": cloneVal[2],
					});
					_cube[0] = vll.a.slice(0);
					_cube[1] = vll.b.slice(0);
					_cube[2] = vll.c.slice(0);
					for(var i=0 ; i<3 ; i++){
						_cube[0][i]*=(max2[0] - min2[0]);
					}
					break;
			}

			cen1 = [
				(_cube[0][0]+_cube[1][0]+_cube[2][0])/2,
				(_cube[0][1]+_cube[1][1]+_cube[2][1])/2,
				(_cube[0][2]+_cube[1][2]+_cube[2][2])/2,
			];

			for(var i=0 ; i<3 ; i++){
				if(cloneOpt[i]){
					shift[i]=0;
				}else{
					shift[i]=cen1[i]-cen2[i];
				}
			}

			let tooSmall=0;

			for (var i = 0; i < v.Structure.atoms.length; i++) {
				let atom = v.Structure.atoms[i];
				if(shift[0]===0){
					atom.x = atom.x * 1 + vlr.a[0] * min[0] + vlr.b[0] * min[1] + vlr.c[0] * min[2];
				}else{
					atom.x = atom.x * 1 + shift[0];
				}
				if(shift[1]===0){
					atom.y = atom.y * 1 + vlr.a[1] * min[0] + vlr.b[1] * min[1] + vlr.c[1] * min[2];
				}else{
					atom.y = atom.y * 1 + shift[1];
				}
				if(shift[2]===0){
					atom.z = atom.z * 1 + vlr.a[2] * min[0] + vlr.b[2] * min[1] + vlr.c[2] * min[2];
				}else{
					atom.z = atom.z * 1 + shift[2];
				}
				let atom_pos = [atom.x, atom.y, atom.z];
				let vectorSize = math.multiply(math.inv(math.transpose(_cube)), atom_pos);
				if (
/*					(target_plane !== "YZ" & ( vectorSize[0] < 0 || vectorSize[0] > 1)) ||
 *										(target_plane !== "XZ" & ( vectorSize[1] < 0 || vectorSize[1] > 1)) ||
 *															(target_plane !== "XY" & ( vectorSize[2] < 0 || vectorSize[2] > 1))
 *															*/
					( vectorSize[0] < 0 || vectorSize[0] > 1) ||
					( vectorSize[1] < 0 || vectorSize[1] > 1) ||
					( vectorSize[2] < 0 || vectorSize[2] > 1)
				){	
					if(shift[0] !== 0 || shift[1] !== 0 || shift[2] !== 0){
						tooSmall++;
					}
				}else{
					new_atoms.push(atom);
				}
			}
			v.Structure.a = vll.a.slice(0);
			v.Structure.b = vll.b.slice(0);
			v.Structure.c = vll.c.slice(0);
			v.Structure.atoms = [];
			for (var i = 0; i < vll.atoms.length; i++) {
				v.Structure.atoms.push($.extend(true, {}, vll.atoms[i]));
			}
			var offset = [0, 0, 0];
			if (Number.isNaN(space) || space < 0){
				console.log("a");
				space = 0;
			}
			switch (target_plane) {
				case "XY":
					for (var i = 0; i < 3; i++) {
						v.Structure.c[i] += _cube[2][i];
					}
					let length_m_c = VLatoms.Math.len(v.Structure.c);
					if(order==="or-fixed-added"){
						offset = vll.c.slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.c[j] *= (1 + space / length_m_c);
							offset[j] *= (1 + space / VLatoms.Math.len(vll.c));
						}
					}else if(order==="or-added-fixed"){
						offset = _cube[2].slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.c[j] *= (1 + space / length_m_c);
							offset[j] *= (1 + space / VLatoms.Math.len(offset));
						}
					}

					break;
				case "XZ":
					for (var i = 0; i < 3; i++) {
						v.Structure.b[i] += _cube[1][i];
					}
					let length_m_b = VLatoms.Math.len(v.Structure.b);
					if(order==="or-fixed-added"){
						offset = vll.b.slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.b[j] *= (1 + space / length_m_b);
							offset[j] *= (1 + space / VLatoms.Math.len(vll.b));
						}
					}else if(order==="or-added-fixed"){
						offset = _cube[1].slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.b[j] *= (1 + space / length_m_b);
							offset[j] *= (1 + space / VLatoms.Math.len(offset));
						}					
					}
					break;
				case "YZ":
					for (var i = 0; i < 3; i++) {
						v.Structure.a[i] += _cube[0][i];
					}
					let length_m_a = VLatoms.Math.len(v.Structure.a);
					if(order==="or-fixed-added"){
						offset = vll.a.slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.a[j] *= (1 + space / length_m_a);
							offset[j] *= (1 + space / VLatoms.Math.len(vll.a));
						}
					}else if(order==="or-added-fixed"){
						offset = _cube[0].slice(0);
						for (let j = 0; j < 3; j++) {
							v.Structure.a[j] *= (1 + space / length_m_a);
							offset[j] *= (1 + space / VLatoms.Math.len(offset));
						}
					}
					break;
			}
			switch (order) {
				case "or-fixed-added":
					console.log(offset);
					for (let i = 0; i < new_atoms.length; i++) {
						let _atom = new_atoms[i];
						_atom.x += offset[0];
						_atom.y += offset[1];
						_atom.z += offset[2];
						v.Structure.atoms.push(_atom);
					}
					break;
				case "or-added-fixed":
					console.log(offset);
					for (let i = 0; i < v.Structure.atoms.length; i++) {
						let _atom = v.Structure.atoms[i];
						_atom.x += offset[0];
						_atom.y += offset[1];
						_atom.z += offset[2];
					}
					for (let i = 0; i < new_atoms.length; i++) {
						let _atom = new_atoms[i];
						v.Structure.atoms.push(_atom);
					}
					break;
			}
			v.update.atomsChanged = true;
			v.update.bondsChanged = true;
			v.animateControl.once();
			v.setOptimalCamPosition();
			v.Manipulate.history.length=0;
			v.Manipulate.addHistory({
				"mode":"Merge",
				"args":{},
				"Structure":objClone(v.Structure)
			})
			if(tooSmall>0 && !cloneOpt[0] && !cloneOpt[1] && !cloneOpt[2]){
				alert("Some of the atoms in the Attached Structure were deleted because the based structure was small.");
			}
		},
		drawFromInput:function(){
			if($(".customInputCellOpt").prop("checked")){
			}else{
				let exit=false;
				let ncell={"a":[],"b":[],"c":[]};
				for(let j=0 ; j<3 ; j++){
					let a_val = $(".customInputCell[data-row=0][data-column="+j+"]").val()*1;
					let b_val = $(".customInputCell[data-row=1][data-column="+j+"]").val()*1;
					let c_val = $(".customInputCell[data-row=2][data-column="+j+"]").val()*1;
					if(Number.isNaN(a_val*1) || Number.isNaN(b_val*1) || Number.isNaN(c_val*1)){
						exit=true;
						break;
					}
					ncell.a[j]=$(".customInputCell[data-row=0][data-column="+j+"]").val();
					ncell.b[j]=$(".customInputCell[data-row=1][data-column="+j+"]").val();
					ncell.c[j]=$(".customInputCell[data-row=2][data-column="+j+"]").val();
				}
			}
			let atoms=$(".customInputAtomsWrapper").children("div");
			let tempAtoms=[]
			for(let i=0 ; i<atoms.length ; i++){
				var _x=$(atoms[i]).find(".customInputAtoms[data-column=1]").val()*1;
				var _y=$(atoms[i]).find(".customInputAtoms[data-column=2]").val()*1;
				var _z=$(atoms[i]).find(".customInputAtoms[data-column=3]").val()*1;
				var _ele=$(atoms[i]).find(".customInputAtoms[data-column=0]").val();
				if(_x=== "" || _y === "" || _z === "" || _ele === ""){
					continue;
				}
				if(Number.isNaN(_x) || Number.isNaN(_y) || Number.isNaN(_z) ){
					continue;
				}
				tempAtoms.push(new VLatoms.Atom(_x,_y,_z,_ele));
			}
			var testRet = v.Manipulate.insideTest(tempAtoms);
			if(!testRet.inside){
				if(confirm("The cell should be expanded to add the atom(s).")){
					v.Structure.atoms = objClone(tempAtoms);
					v.Manipulate.vacuum({
							"nx":testRet.delta[0],
							"ny":testRet.delta[1],
							"nz":testRet.delta[2],
							"px":testRet.delta[3],
							"py":testRet.delta[4],
							"pz":testRet.delta[5]
					});
				}else{
					return false;
				}
			} else {
				v.Structure.atoms = objClone(tempAtoms);
			}
			v.Manipulate.addHistory({
				"mode":"Structure Input",
				"args":{},
				"Structure":objClone(v.Structure)
			});
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
			v.animateControl.once();
		}
	}
// -------------------------------------------------------------------------------- //
}


VLatoms.UI = function( wrapper ){
	this.wrapper = wrapper;
	this.message = function( title, msg, btn, option ){
		if( orgWin = $('#VLMessage')){
			orgWin.remove();
		}
		var _wrapper;
			_wrapper = this.wrapper || document.body;
		var div = document.createElement('div');
			div.id = "VLMessage";
			if( option === undefined ){
				option = {};
			}
			option.width = option.width || 500;
			option.height = option.height || 100;
			if(option.width == "auto"){
					div.style.width = "auto";
			} else {
					div.style.width = option.width+"px";
			}
			div.style.position="absolute";
			//Position
			var ww = $(window).width();
			var wh = $(window).height();
			$(div).addClass("VLMessage");
			$(div).css({"left": ww/2, //0.5*(ww-option.width),
						"top": 0.5*(wh-option.height)+$(window).scrollTop()
						});
//			div.style.left=0;
//			div.style.right=0;
			
		var btnhtml = "";
		var btncount = 0;
			for( i in btn ) {
				switch(i){
					case "close" :
						var close_txt = "Close";
						if(typeof(btn[i])=="string"){
							close_txt = btn[i];
						}
						btnhtml += "<a href=\"javascript:;\" onclick=\"$('#VLMessage').remove();\" id=VLM_btn_close style='margin:2px 1px;'><button class='btn btn-warn'>"+close_txt+"</button></a>";
					break;
					default :
						var btnClass = "btn-info";
						if(option.btnClasses){
							if(option.btnClasses[btncount]){
								btnClass=option.btnClasses[btncount];
							}
						}

						btnhtml += '<a href=javascript:; id=VLM_btn_'+btncount+' ><button class="VLM_btn_highlight btn '+btnClass+'" style="margin:2px 1px;">'+i+'</button></a>';
						btncount++;
					break;
				}
				btnhtml+="\n";
			}

		var innerhtml = "";
			innerhtml+= "<table class=VLMTable>";
			innerhtml+= "<thead class=VLMHeader><tr><td>"+title+"</td></tr></thead>";
			innerhtml+= "<tbody class=VLMBody><tr><td>";
			innerhtml+= msg;
			innerhtml+= "</td></tr></tbody>";
			innerhtml+= "<tfoot class=VLMFooter><tr><td style='padding-right:15px;'>"+btnhtml+"</td></tr></tfoot>";
			innerhtml+= "</table>";
			div.innerHTML = innerhtml;
			$(document.body).append(div);
			//_wrapper.appendChild(div);

			//$(div).draggable();
		var matchingcount = 0;
		for( i in btn ) {
			if( i !== "close" )
			{
				document.getElementById('VLM_btn_'+matchingcount).onclick= btn[i];
				matchingcount++;

			}
		}
		option.width = option.width || 400;
		if( option.height ){
			div.style['min-height'] = option.height+"px";
		}else{
			option.height = $(div).height();
		}
		div.style.width = option.width+"px";
		div.style.position="absolute";
		//Position
		var ww = $(window).width();
		var wh = $(window).height();
		$(div).css({"left":0.5*(ww-option.width),
					"top": 0.5*(wh-option.height)+$(window).scrollTop()
					});
		$(div).draggable({cancel:"canvas,input,textarea,button,select,option"});
	}
	this.selectWindow = function(msg,options){
		for( var i=0 ; i < options.length ; i++ ){
		}
	}
}
VLatoms.prototype = {
	natoms : function() {return this.Structure.atoms.length;},
	volume : function() {return VLatoms.Utils.getVolume(this.Structure)}
}
VLatoms.Atom = function ( x, y, z, element){
	this.x = x || 0 ;
	this.y = y || 0 ;
	this.z = z || 0 ;
	this.element = element || "X" ;
	this.radius = AtomParam[this.element].radius ;
	this.color = AtomParam[this.element].color ;
	this.mass = AtomParam[this.element].mass ;
	return this;
}
VLatoms.Atom.prototype = {
	constructor : VLatoms.Atom,
	move : function( x, y, z, element ){
		this.x = x;
		this.y = y;
		this.z = z;
		this.element = element || this.element;
		this.radius = AtomParam[this.element].radius ;
		this.color = AtomParam[this.element].color ;
		this.mass = AtomParam[this.element].mass ;
	}
}

VLatoms.Math = {
	gcd : function(a,b){
		if(!b){
			return a;
		}
		return VLatoms.Math.gcd(b,a%b);
	},
	lcm : function(a,b){
		if(a==0) return b;
		if(b==0) return a;
		var _gcd = VLatoms.Math.gcd(a,b);
		return a*b/_gcd;
	},
	cdotmat : function(c,m1){
		var ret = [[],[],[]];
		for(var i=0;i<3;i++){
			for(var j=0;j<3;j++){
				ret[i][j]=c*m1[i][j];
			}
		}
		return ret;

	},
	transpose3 : function(m1){
		var ret = [[],[],[]];
		for(var i=0;i<3;i++){
			for(var j=0;j<3;j++){
				ret[j][i]=m1[i][j];
			}
		}
		return ret;
	},
	random3 : function(){
		return [ Math.random(), Math.random(), Math.random() ];
	},
	norm : function(v1){
		var _len = VLatoms.Math.len(v1);
		var ret = [];
		for( var i = 0 ; i < v1.length ; i++ )
		{
			ret[i]  = v1[i] / _len;
		}
		return ret;
	},
	len : function(v1){
		// Length of a vector
		return Math.sqrt(VLatoms.Math.dot(v1,v1));
	},
	dist : function(v1,v2){
		var v3 = [v1[0]-v2[0],v1[1]-v2[1],v1[2]-v2[2]];
		return VLatoms.Math.len(v3);
	},
	divide : function(v1,constant){
		for(var i=0;i<v1.length;i++){
			v1[i]/=constant;
		}
		return v1;
	},
	cross : function(v1,v2){
		var ret = Array();
		ret[0]=v1[1]*v2[2]-v1[2]*v2[1];
		ret[1]=-(v1[0]*v2[2]-v1[2]*v2[0]);
		ret[2]=v1[0]*v2[1]-v1[1]*v2[0];
		return ret;
	},
	cdotvec : function(c,v1){
		var ret = [];
		for(var i = 0;i<v1.length;i++)
		{
			ret[i] = c * v1[i];
		}
		return ret;
	},
	dot : function(v1,v2){
		var ret = 0;
		for(var i = 0;i<v1.length;i++)
		{
			ret+= v1[i]*v2[i];
		}
		return ret;
	},
	add : function(v1,v2){
		var ret = [];
		for(var i = 0;i<v1.length;i++)
		{
			ret.push( v1[i] + v2[i] );
		}
		return ret;

	},
	subtract : function(v1,v2){
		var ret = [];
		for(var i = 0;i<v1.length;i++)
		{
			ret.push( v1[i] - v2[i] );
		}
		return ret;

	},
	inv3 : function(m1){
		var oa = m1[0][0];
		var ob = m1[0][1];
		var oc = m1[0][2];
		var od = m1[1][0];
		var oe = m1[1][1];
		var of = m1[1][2];
		var og = m1[2][0];
		var oh = m1[2][1];
		var oi = m1[2][2];
		var oD = (oa*oe*oi+ob*of*og+oc*od*oh-oc*oe*og-ob*od*oi-oa*of*oh);
		var ret = [
					[(oe*oi-of*oh)/oD,		(-(ob*oi-oc*oh))/oD,	(ob*of-oc*oe)/oD],
					[(-(od*oi-of*og))/oD,	(oa*oi-oc*og)/oD,		(-(oa*of-oc*od))/oD],
					[(od*oh-oe*og)/oD,		(-(oa*oh-ob*og))/oD,	(oa*oe-ob*od)/oD]
				  ];
		return ret;
	},
	vecdotmat : function(v1,m1){
		var ret = new Array();
		ret[0] = m1[0][0]*v1[0];
		ret[0]+= m1[1][0]*v1[1];
		ret[0]+= m1[2][0]*v1[2];
		ret[1] = m1[0][1]*v1[0];
		ret[1]+= m1[1][1]*v1[1];
		ret[1]+= m1[2][1]*v1[2];
		ret[2] = m1[0][2]*v1[0];
		ret[2]+= m1[1][2]*v1[1];
		ret[2]+= m1[2][2]*v1[2];
		return ret;

	},
	matdotmat : function(m1,m2){
	//only for between 2d matrixes
		var ret = Array(m1.length);
		for (var i = 0; i<m1.length; i++){
			ret[i] = [];
		}
		for(var i=0;i<m1.length;i++){
			for(var j=0;j<m2[0].length;j++){
				ret[i][j]=0;
				for(var k=0;k<m1[0].length;k++){
					ret[i][j]+=m1[i][k]*m2[k][j];
				}
			}
		}
		return ret;
	},
	matdotvec : function(m1,v1){
		/* return Matrix * Vector */
		var ret = new Array();
		ret[0] = m1[0][0]*v1[0];
		ret[0]+= m1[0][1]*v1[1];
		ret[0]+= m1[0][2]*v1[2];
		ret[1] = m1[1][0]*v1[0];
		ret[1]+= m1[1][1]*v1[1];
		ret[1]+= m1[1][2]*v1[2];
		ret[2] = m1[2][0]*v1[0];
		ret[2]+= m1[2][1]*v1[1];
		ret[2]+= m1[2][2]*v1[2];
		return ret;
	},
	rotate : function(dir,pos,angle){
		var cos=Math.cos(angle/180*Math.PI);
		var sin=Math.sin(angle/180*Math.PI);
		var mat=Array(3);
		switch(dir){
			case "x":
				mat[0]=[1,0,0];
				mat[1]=[0,cos,-1*sin];
				mat[2]=[0,sin,cos];
			break;
			case "y":
				mat[0]=[cos,0,sin];
				mat[1]=[0,1,0];
				mat[2]=[-1*sin,0,cos];
			break;
			case "z":
				mat[0]=[cos,-1*sin,0];
				mat[1]=[sin,cos,0];
				mat[2]=[0,0,1];
			break;
		}
		return VLatoms.Math.matdotvec(mat,pos);
	},
	   rotateA : function(ref,pos,angle){
			// ref : reference vector;
			var u = VLatoms.Math.norm(ref);
			var ux = u[0],uy=u[1],uz=u[2];
			var cos=Math.cos(angle/180*Math.PI);
			var sin=Math.sin(angle/180*Math.PI);
			var mat = [];
			mat[0] = [ cos + ux*ux*(1-cos), ux*uy*(1-cos)-uz*sin, ux*uz*(1-cos)+uy*sin ];
			mat[1] = [ uy*ux*(1-cos) + uz*sin, cos+uy*uy*(1-cos), uy*uz*(1-cos)-ux*sin ];
			mat[2] = [ uz*ux*(1-cos) - uy*sin, uz*uy*(1-cos)+ux*sin, cos+uz*uz*(1-cos) ];
			return VLatoms.Math.matdotvec(mat,pos);
		},
	angle : function(v1,v2){
	  var v1len = VLatoms.Math.len(v1);
	  var v2len = VLatoms.Math.len(v2);
		var _angle=VLatoms.Math.dot(v1,v2) / v1len / v2len;
		if(_angle>1){
			console.log(_angle);
			_angle=1;
		}else if(_angle<-1){
			console.log(_angle);
			_angle=-1;
		}
	  return Math.acos(_angle);
	},
	rad2deg : function(rad){
	  return rad*180/Math.PI;
	},
	checkPlaneAngle : function(v){
		let sa=v.IO.selectedAtoms;
		if(sa.length !== 4 ){
			return "Select 4 atoms";
		}
		let pva=objClone(sa);
		let pvb=objClone(sa);

		pva.splice(0,1);
		pvb.splice(3,1);
		let pvaP={"x":[],"y":[],"z":[]};
		let pvbP={"x":[],"y":[],"z":[]};
		for(let i=0 ; i<3 ; i++){
			pvaP.x.push(v.Structure.atoms[pva[i]].x);
			pvaP.y.push(v.Structure.atoms[pva[i]].y);
			pvaP.z.push(v.Structure.atoms[pva[i]].z);

			pvbP.x.push(v.Structure.atoms[pvb[i]].x);
			pvbP.y.push(v.Structure.atoms[pvb[i]].y);
			pvbP.z.push(v.Structure.atoms[pvb[i]].z);
		}

		let va=[
			pvaP.y[0]*(pvaP.z[1]-pvaP.z[2])+pvaP.y[1]*(pvaP.z[2]-pvaP.z[0])+pvaP.y[2]*(pvaP.z[0]-pvaP.z[1]),
			pvaP.z[0]*(pvaP.x[1]-pvaP.x[2])+pvaP.z[1]*(pvaP.x[2]-pvaP.x[0])+pvaP.z[2]*(pvaP.x[0]-pvaP.x[1]),
			pvaP.x[0]*(pvaP.y[1]-pvaP.y[2])+pvaP.x[1]*(pvaP.y[2]-pvaP.y[0])+pvaP.x[2]*(pvaP.y[0]-pvaP.y[1])
		];
		let vb=[
			pvbP.y[0]*(pvbP.z[1]-pvbP.z[2])+pvbP.y[1]*(pvbP.z[2]-pvbP.z[0])+pvbP.y[2]*(pvbP.z[0]-pvbP.z[1]),
			pvbP.z[0]*(pvbP.x[1]-pvbP.x[2])+pvbP.z[1]*(pvbP.x[2]-pvbP.x[0])+pvbP.z[2]*(pvbP.x[0]-pvbP.x[1]),
			pvbP.x[0]*(pvbP.y[1]-pvbP.y[2])+pvbP.x[1]*(pvbP.y[2]-pvbP.y[0])+pvbP.x[2]*(pvbP.y[0]-pvbP.y[1])
		];
		let angle=this.angle(va,vb).toFixed(5)*180/Math.PI;
		return angle;
		if(angle>1){
			angle=1;
		}else if(angle<-1){
			angle=-1;
		}
		return Math.acos(angle)*180/Math.PI;
	}
}
VLatoms.Utils = {
	pointInPolygon : function(point,vs){
		// ray-casting algorithm based on
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	
		var x = point[0], y = point[1];
	
		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			var xi = vs[i][0], yi = vs[i][1];
			var xj = vs[j][0], yj = vs[j][1];
	
			var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
	
		return inside;
	},
	minimizeStructure : function(_s){
		var s = {};
		s.a = [ +_s.a[0],+_s.a[1],+_s.a[2]];
		s.b = [ +_s.b[0],+_s.b[1],+_s.b[2]];
		s.c = [ +_s.c[0],+_s.c[1],+_s.c[2]];
		var natoms=_s.atoms.length;
		s.atoms = [];
		for(var i=0;i<natoms;i++){
			var ca = _s.atoms[i];
			var _x = +ca.x;
			var _y = +ca.y;
			var _z = +ca.z;
			var _el = ca.element.replace(/[^a-zA-Z]/g,""); //temp
			s.atoms.push({"element":_el, "x":_x, "y":_y, "z":_z});
		}
		
		return s;
	},
	redefineStructure : function(_s,_v={}){
		if(_v.option===undefined){
			_v.option={};
		}
		if(_v.option.shift===undefined){
			_v.option.shift=false;
			_v.option.shift_val=[0,0,0];
		}
		var s = {};
		s.a = [ +_s.a[0],+_s.a[1],+_s.a[2]];
		s.b = [ +_s.b[0],+_s.b[1],+_s.b[2]];
		s.c = [ +_s.c[0],+_s.c[1],+_s.c[2]];
		var natoms=-1;
		for(i in _s.atoms){
			var n = +i;
			if(n>natoms) natoms=n;
		}
		natoms++;
		s.atoms = [];
		for(var i=0;i<natoms;i++){
			var ca = _s.atoms[i];
			if(_v.option.shift){
				var _x = +ca.x-_v.option.shift_val[0];
				var _y = +ca.y-_v.option.shift_val[1];
				var _z = +ca.z-_v.option.shift_val[2];
			}else{
				var _x = +ca.x;
				var _y = +ca.y;
				var _z = +ca.z;
			}
			var _el = ca.element.replace(/[^a-zA-Z]/g,""); //temp
			s.atoms.push(new VLatoms.Atom( _x, _y, _z, _el ));
		}
		
		return s;
	
			
	},
	xyzToArr : function(obj){
		return [obj.x, obj.y, obj.z];
	},
	download : function( filename, contents){
		var tmphtml="<form class=downloader target=_blank method=post action=/utils/txtDownloader>";
			tmphtml+="<input type=hidden name=_token value="+$('meta[name="csrf-token"]').attr('content')+">";
			tmphtml+="<input type=hidden name=filename class=downloader_filename>";
			tmphtml+="<input type=hidden name=content class=downloader_content>";
			tmphtml+="</form>";
		var tmphtml_=$(document.body).append(tmphtml);
		$('.downloader_filename').val(filename);
		$('.downloader_content').val(contents);
		$('.downloader').submit();
		$('.downloader').remove();

	},
	getRandomPosition : function( structure ){
		var latvec = []; // lattice vector
		latvec.push( structure.a );
		latvec.push( structure.b );
		latvec.push( structure.c );
		return VLatoms.Math.matdotvec( latvec, VLatoms.Math.random3() );
	},
	findElementInArray : function( element, arr ){
		for( var i = 0 ; i < arr.length ; i++ )
		{
			if( arr[i] == element ) return true;
		}
		return false;
	},
	getVolume : function( structure ){
		var _a = structure.a;
		var _b = structure.b;
		var _c = structure.c;
		return Math.abs( VLatoms.Math.dot(_a, VLatoms.Math.cross( _b, _c) ) );
	},
	gram_schmidt_orthonormalization_3d : function(matrix){
		function proj(a,b){
			//a에 b를 프로젝션
			var ua = math.multiply(a,1/math.norm(a));
			var size = math.dot(ua,b);
			return math.multiply(ua, size);
		}

		var temp = [];
		temp[0] = matrix[0];
		temp[1] = math.subtract(matrix[1],proj(matrix[0],matrix[1]));

		var ua = proj(temp[0],matrix[2]);
		var ub = proj(temp[1],matrix[2]);

		temp[2] = math.subtract(matrix[2],math.add(ua,ub));

		//normalization

		function normalize_vector_3d(vector){
			return math.divide(vector, math.norm(vector));
		}

		return [normalize_vector_3d(temp[0]),
			   normalize_vector_3d(temp[1]),
			   normalize_vector_3d(temp[2])];
	},
	set_to_x_y_plane : function(orgStr){
		//이 함수는 orgStr(vlv.structure 형식)의 a-b평면을 절대좌표계을 x-y평면과 일치시킨다. a와 x가 평행이 된다.
		var orgCell = [orgStr.a, 
						orgStr.b, 
						orgStr.c];
		var unit_space = VLatoms.Utils.gram_schmidt_orthonormalization_3d(orgCell);
		
		//where cell matrix, AU^-1 = lower triangular matrix 
		var retStr = JSON.parse(JSON.stringify(orgStr));
		retStr.a = math.divide(orgStr.a, unit_space);
		retStr.b = math.divide(orgStr.b, unit_space);
		retStr.c = math.divide(orgStr.c, unit_space);
		
		for (var i = 0; i < orgStr.atoms.length; i++){
			var tempPosition = [orgStr.atoms[i].x, orgStr.atoms[i].y, orgStr.atoms[i].z]		
			var retPosition = math.divide(tempPosition, unit_space);
			retStr.atoms[i].x = retPosition[0];
			retStr.atoms[i].y = retPosition[1];
			retStr.atoms[i].z = retPosition[2];
		}
		return retStr;
	}
}
VLatoms.Utils.Structure = {
	getSpaceGroup : function(v){
		if(
				v.Structure.atoms.length == 0 
				|| v.Structure.atoms.length > 200 
				|| !v.option.cellInfo
				|| !v.option.cellInfoSpaceGroup
		  ) { 
/*
			console.log('spacegroup cancel');
			console.log(
				v.Structure.atoms.length 
				, v.option.cellInfo
				, v.option.cellInfoSpaceGroup
					);
*/
			return false; 
		}
		var cif = VLatoms.Utils.Structure.toCIF(v.Structure);
		var ret = post_ajax("/modeling/symcheck",{"ciffile":cif});	
		return ret*1;
	},
	toFormula : function(s){
		var formulaArr = {};
		var ca;
		var formulaStr = "", formulaUnitStr = "";
		for(var i=0;i<s.atoms.length;i++){
			ca = s.atoms[i];
			if( Object.keys(formulaArr).indexOf(ca.element)<0){
				formulaArr[ ca.element ] = 0; 
			}
			formulaArr[ ca.element ]++;
		}
		if( Object.keys( formulaArr ).length>1 ){
			gcd = formulaArr[ Object.keys(formulaArr)[0] ];
		}else{
			gcd = 1;
		}
		for(var el in formulaArr){
			formulaStr+= el + formulaArr[el];
			gcd = math.gcd(gcd, formulaArr[el]);
		}
		var formulaUnit = {};
		for(var el in formulaArr){
			formulaUnit[el] = formulaArr[el]/gcd;
		}
		for(var el in formulaUnit){
			formulaUnitStr+= el + formulaUnit[el];
		}
		return {
			formulaArr : formulaArr,
			formulaStr : formulaStr,
			formulaUnit : formulaUnit,
			formulaUnitStr : formulaUnitStr,
			nfu : gcd
		};
	},
	getSurfaceAtoms : function(s){
		var _s = objClone(s);
// Generate surface points



		function makeGrid(psize){
			var gridSize = 0.5;
			var grid = Array();
			var dx,dy,dz;
			var cx,cy,cz;
			var sx = VLatoms.Math.len(s.a);
			var sy = VLatoms.Math.len(s.b);
			var sz = VLatoms.Math.len(s.c);
			for(var i=0;i<sx/gridSize;i++){
				cx = i*gridSize;
				grid[i] = Array();
				for(var j=0;j<sy/gridSize;j++){
					cy = j*gridSize;
					grid[i][j]=Array();
					for(var k=0;k<sz/gridSize;k++){
						cz = k*gridSize;
						grid[i][j][k]=-1;
						for(var l=0;l<s.atoms.length;l++){
							ar = s.atoms[l].radius + psize;
							ax = s.atoms[l].x;
							ay = s.atoms[l].y;
							az = s.atoms[l].z;
							dx = ax-cx;
							if(Math.abs(dx>ar)) continue;
							dy = ay-cy;
							if(Math.abs(dy>ar)) continue;
							dz = az-cz;
							if(Math.abs(dz>ar)) continue;
							d = Math.sqrt(dx*dx + dy*dy + dz*dz);
							if(d<ar){
								grid[i][j][k]=l;
								break;
							}
						}
					}
				}
			}
			return grid;
		}
		var sAtoms = [];
		var nflood =0 ;
		function floodFill(posx,posy){
			if(posx<0 || posx>cGrid.length-1) return;
			if(posy<0 || posy>cGrid[0].length-1) return;
			if(cGrid[posx][posy]==-2) return;
			if(cGrid[posx][posy]!=-1){
				if(sAtoms.indexOf(cGrid[posx][posy]) == -1 )sAtoms.push(cGrid[posx][posy]);
				return;
			}else{
				cGrid[posx][posy]=-2;
			}
			nflood ++;
			floodFill(posx,posy+1);
			floodFill(posx,posy-1);
			floodFill(posx-1,posy);
			floodFill(posx+1,posy);
		}
		console.log("S1");
		var grid = makeGrid(2.5);
		var startPos = undefined;
		for(var ii=0;ii<grid.length;ii++){
			cGrid = grid[ii];
			startPos = undefined;
			nflood=0;
			for(var i=0;i<cGrid.length;i++){
				for(var j=0;j<cGrid[0].length;j++){
					if(cGrid[i][j]==-1) startPos = [i,j];
					break;
				}
				if(startPos!==undefined) break;
			}
			if(startPos === undefined) startPos = [0,0];
//			console.log("Starting flood fill from "+startPos);
//			console.log("Starting flood fill from "+cGrid[startPos[0],startPos[1]]);
			floodFill(startPos[0],startPos[1]);
			console.log(nflood);

		}
		console.log("S2");
		return sAtoms;
//		return makeGrid();

	},
	cartToFract : function(pos,lat){
		var latMatInv = VLatoms.Math.inv3([lat[0],lat[1],lat[2]]);
		var pos_fract = [];
			pos_fract = VLatoms.Math.vecdotmat(pos,latMatInv);
		return pos_fract;
	},
	fracToCart : function(delta, lattice){
		return math.multiply(delta, lattice);
	},
	viewToCart : function(delta, camera){
		 var uparr = [ camera.up.x, camera.up.y, camera.up.z ]; // ^
		 uparr = VLatoms.Math.norm(uparr);
		 var carr = [camera.position.x, camera.position.y, camera.position.z];
		 carr = VLatoms.Math.norm(carr);
		 var rightarr = VLatoms.Math.cross(uparr,carr);
		 rightarr = VLatoms.Math.norm(rightarr);
//		 var ref = [0,0,0];
		 let newDelta = math.add(
									math.add( math.multiply(delta[0], rightarr), math.multiply(delta[1], uparr) ),
			 						math.multiply(delta[2], carr) 
								);
//				newpos = VLatoms.Math.add( VLatoms.Math.cdotvec(step, ref) , position);
//				newpos = VLatoms.Math.cdotvec(step, ref);
		 return newDelta;
//----------------------------------------------
/*
			var sa = v.IO.selectedAtoms;
			var direction = args.direction;// $('.manipulate_move_direction:checked').val();
			var step = args.step;// 1
			var onEscape = args.onEscape=="expand"?true:false;
			var posFract;
			var tmpStrain = [];
			var uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
				uparr = VLatoms.Math.norm(uparr);
			var carr = [v.camera.position.x, v.camera.position.y, v.camera.position.z];
				carr = VLatoms.Math.norm(carr);
			var rightarr = VLatoms.Math.cross(uparr,carr);
				rightarr = VLatoms.Math.norm(rightarr);

			var newpos;
			for(var i=0;i<sa.length;i++){
				var ca = v.Structure.atoms[sa[i]];
				switch(direction){
					case "x":
//						ref = [1,0,0];
						ref = math.multiply(v.Structure.a,1/math.norm(v.Structure.a));
					break;
					case "y":
//						ref = [0,1,0];
						ref = math.multiply(v.Structure.b,1/math.norm(v.Structure.b));
					break;
					case "z":
//						ref = [0,0,1];
						ref = math.multiply(v.Structure.c,1/math.norm(v.Structure.c));
					break;
					case "vx":
						ref = rightarr;
					break;
					case "vy":
						ref = uparr;
					break;
					case "vz":
						ref = carr;
					break;
				}
				newpos = VLatoms.Math.add( VLatoms.Math.cdotvec(step, ref) , [ca.x, ca.y, ca.z]);
				ca.x = newpos[0];
				ca.y = newpos[1];
				ca.z = newpos[2];
*/
	},
	cleaveSurface : function(basis,milIndex,args){
		if(args===undefined){
			args = [];
		}
		if(args['maxv3length']===undefined){
			args['maxv3length']=50;
		}
		var maxv3length=args['maxv3length'];
		function nonZeros(arr){
			var retArr = [];
			for(var i=0;i<arr.length;i++){
				if(arr[i]!=0) retArr.push(arr[i]);
			}
			return retArr;
		};
		var h = milIndex[0];
		var k = milIndex[1];
		var l = milIndex[2];
		var v1,v2;
			var nonZeroMilIndices = nonZeros(milIndex);
			var nzeros = 3-nonZeroMilIndices.length;
			var lcm = 1;
			for(var i=0;i<nonZeroMilIndices.length;i++){
				console.log(nonZeroMilIndices[i]);
				lcm = VLatoms.Math.lcm(lcm,nonZeroMilIndices[i]);
			}
		var p1,p2,p3;
		switch(nzeros){
			case 0:
				p1 = VLatoms.Math.cdotvec(lcm/h,basis[0]);
				p2 = VLatoms.Math.cdotvec(lcm/k,basis[1]);
				p3 = VLatoms.Math.cdotvec(lcm/l,basis[2]);
			break;
			case 1:
				if(h==0){
					p2=VLatoms.Math.cdotvec((lcm/k),basis[1]);
					p3=VLatoms.Math.cdotvec((lcm/l),basis[2]);
					p1=VLatoms.Math.add(p3,basis[0]);
				}
				if(k==0){
					p1=VLatoms.Math.cdotvec((lcm/h),basis[0]);
					p2=VLatoms.Math.add(p1,basis[1]);
					p3=VLatoms.Math.cdotvec((lcm/l),basis[2]);

				}
				if(l==0){
						p1=VLatoms.Math.cdotvec((lcm/h),basis[0]);
						p2=VLatoms.Math.cdotvec((lcm/k),basis[1]);
						p3=VLatoms.Math.add(p1,basis[2]);
				}
			break;
			case 2:
				return;
			break;
		}
		//milIndex :
	console.log('milIndex',milIndex);
	console.log('nzeros',nzeros);
	console.log('p1~3',p1,p2,p3);
	console.log('v12',v1,v2);
	console.log('v1x2',v1xv2);
		var v1 = VLatoms.Math.subtract(p2,p1);
		var v2 = VLatoms.Math.subtract(p3,p1);
		var v3;
		var v1xv2 = VLatoms.Math.cross(v1,v2);

// most orthogonal v3
		var theta1,theta2,theta3;
		var lastT=100;
		for(var i=-1;i<2;i++){
			for(var j=-1;j<2;j++){
				for(var k=-1;k<2;k++){
					if(i==0&&j==0&&k==0) continue;
					var v3tmp = VLatoms.Math.cdotvec(i,basis[0]);
					v3tmp = VLatoms.Math.add( v3tmp, VLatoms.Math.cdotvec(j,basis[1]));
					v3tmp = VLatoms.Math.add( v3tmp, VLatoms.Math.cdotvec(k,basis[2]));
					theta1 = VLatoms.Math.angle(v1xv2,v3tmp);
					theta2 = VLatoms.Math.angle(v1,v3tmp);
					theta3 = VLatoms.Math.angle(v2,v3tmp);
					if( (theta1 < Math.PI/2) && (theta2 < Math.PI/2) && (theta3 < Math.PI/2) && (theta2 >=0 ) && (theta3 >=0 ) ){
						if(theta1<lastT) {
							lastT = theta1;
							v3 = v3tmp;
						}
					}
				}
			}
		}
//		var maxv3length = 30; // Maximum v3 length


	console.log(v3,VLatoms.Math.rad2deg(lastT));


	console.log(v1,v2);
// Loop
		//var NNv3 = v3.splice(0);
		var NNv3 = v3;
		var pv1,pv2;
		var tol = 0.5;
		var v3matrix = [];
		var lenangles=[];
		var millerv3s=[];
		for(var q=1;q<50;q++){
			pv1 = VLatoms.Math.dot( VLatoms.Math.cdotvec(q,NNv3), v1);
			pv2 = VLatoms.Math.dot( VLatoms.Math.cdotvec(q,NNv3), v2);
			console.log(pv1,pv2,pv1%1,pv2%1);
			if( pv1%1>(1-tol) || pv1%1<tol ){
				if( pv2%1>(1-tol) || pv2%1<tol ){
					var done = false;
					var angle = VLatoms.Math.angle(v1xv2,NNv3);
					console.log(VLatoms.Math.rad2deg( VLatoms.Math.angle( v1xv2, NNv3 )));
					v3 = VLatoms.Math.cdotvec(q,NNv3);
						console.log(VLatoms.Math.rad2deg(angle) + "DEG");
					while(!done){
						if(VLatoms.Math.rad2deg(angle) < 5){
								done=true;
						}else if( VLatoms.Math.angle( VLatoms.Math.subtract(v3,v1), v1xv2 ) < angle ){
								v3 = VLatoms.Math.subtract(v3,v1);
								angle = VLatoms.Math.angle(v3,v1xv2);
						}else if( VLatoms.Math.angle( VLatoms.Math.add(v3,v1), v1xv2 ) < angle ){
								v3 = VLatoms.Math.add(v3,v1);
								angle = VLatoms.Math.angle(v3,v1xv2);
						}else if( VLatoms.Math.angle( VLatoms.Math.subtract(v3,v2), v1xv2 ) < angle ){
								v3 = VLatoms.Math.subtract(v3,v2);
								angle = VLatoms.Math.angle(v3,v1xv2);
						}else if( VLatoms.Math.angle( VLatoms.Math.add(v3,v2), v1xv2 ) < angle ){
								v3 = VLatoms.Math.add(v3,v2);
								angle = VLatoms.Math.angle(v3,v1xv2);
						}else{
								done=true;
						}
					}
					if( VLatoms.Math.len(v3) < maxv3length){
						v3matrix.push(v3);
						lenangles.push([VLatoms.Math.len(v3), VLatoms.Math.rad2deg(VLatoms.Math.angle(v1xv2,v3))]);
						millerv3s.push(VLatoms.Math.matdotvec( VLatoms.Math.inv3(basis), v3));
					}
				}
			}
		}
		if(v3matrix.length==0){
			console.warn("Could not find v3 matrix.");
			v3matrix = [NNv3];
			lenangles = [VLatoms.Math.len(NNv3)];
		}
		var basisList = [];
		var al,be,gam;
			gam = VLatoms.Math.rad2deg( VLatoms.Math.angle(v1,v2) );
		for(var i=0;i<v3matrix.length;i++){
			al = VLatoms.Math.rad2deg( VLatoms.Math.angle(v2,v3matrix[i]) );
			be = VLatoms.Math.rad2deg( VLatoms.Math.angle(v1,v3matrix[i]) );
			basisList.push({
				angles : {alpha : al, beta:be, gamma:gam},
				basis : [v1, v2, v3matrix[i]]
			});
		}
/*console.log('basis1',JSON.parse(JSON.stringify(basisList)));
		for(var i = 0; i<basisList.length; i++){
			basisList[i].basis = math.divide(basisList[i].basis,VLatoms.Utils.gram_schmidt_orthonormalization_3d(basisList[i].basis));
			if(basisList[i].basis[0][1] < 1e-7) basisList[i].basis[0][1] = 0;
			if(basisList[i].basis[0][2] < 1e-7) basisList[i].basis[0][2] = 0;
			if(basisList[i].basis[1][2] < 1e-7) basisList[i].basis[1][2] = 0;
		}
console.log('basis2',basisList);*/
		return basisList;
//		return {"v3matrix":v3matrix,"lenangles":lenangles,"millerv3s":millerv3s,newbasis:[v1,v2,v3matrix[0]]};
	},
	basisTransform : function(orgB,newB,orgPos){
		var oBInv = math.inv(math.transpose(orgB));
		var C = VLatoms.Math.matdotmat(newB, oBInv);
		var v1 = newB[0];
		var v2 = newB[1];
		var v3 = newB[2];

		var millerv1 = VLatoms.Math.matdotvec(oBInv, v1);
		var millerv2 = VLatoms.Math.matdotvec(oBInv, v2);
		var millerv3 = VLatoms.Math.matdotvec(oBInv, v3);
		
		var Sxyz = [[0,0,0],[0,0,0]];
		var M;
		for(var xx=0;xx<2;xx++){
			for(var yy=0;yy<2;yy++){
				for(var zz=0;zz<2;zz++){
				 	M = VLatoms.Math.add(VLatoms.Math.add(VLatoms.Math.cdotvec(xx,millerv1),  VLatoms.Math.cdotvec(yy,millerv2)), VLatoms.Math.cdotvec(zz,millerv3));  
					for(var aa=0;aa<3;aa++){
						if(M[aa]>Sxyz[0][aa]){
							Sxyz[0][aa]=Math.round(M[aa]);
						}
						if(M[aa]<Sxyz[1][aa]){
							Sxyz[1][aa]=Math.round(M[aa]);
						}
					}
				}
			}
		}
		var nRows = orgPos.length;
		//var nCols = orgPos[0].length;
//		for (var i = 0; i < orgPos.length; i++){
//			orgPos[i].push(i);
//		}
//		var retAtoms = [], ca;
		var retAtoms = [];
		console.log(Sxyz);
		console.log(C);
		for(var ii=0;ii<nRows;ii++){
			for(var x = Sxyz[1][0]; x<=Sxyz[0][0]; x++){
				for(var y = Sxyz[1][1]; y<=Sxyz[0][1]; y++){
					for(var z = Sxyz[1][2]; z<=Sxyz[0][2]; z++){
						retAtoms.push([orgPos[ii][0]+x, orgPos[ii][1]+y, orgPos[ii][2]+z, ii]);
					}
				}
			}
		}
		var _C = VLatoms.Math.matdotmat( newB, VLatoms.Math.inv3(orgB) );
		var C = Array();
			C.push([_C[0][0],_C[0][1],_C[0][2],0]);
			C.push([_C[1][0],_C[1][1],_C[1][2],0]);
			C.push([_C[2][0],_C[2][1],_C[2][2],0]);
			C.push([0,0,0,1]);
//			console.log('c_1',math.multiply(newB,math.inv(orgB)));
			//schan wrote below
			console.log(C, retAtoms);
			retAtoms = math.transpose(math.multiply(math.inv(math.transpose(C)), math.transpose(retAtoms)));
console.log("retatom",retAtoms);
			var NewAtoms = [];
			var tol, XA, XB, XC, XL;
				tol = 1e-3;
			for (var i = 0; i < retAtoms.length; i++){
				XA = retAtoms[i][0];				
				XB = retAtoms[i][1];				
				XC = retAtoms[i][2];				
				XL = retAtoms[i][3];				
				if(XA>=-tol && XA<(1-tol) && XB>=-tol && XB<(1-tol) && XC>=-tol && XC<(1-tol)){
					NewAtoms.push([XA, XB, XC, XL]);
				}
			}
			function matlab_unique(target, direction) {
				var arrayEquality;
				if(direction =='rows'){
					for(var i = target.length-1; i>0; i--){
						for(var j = i-1; j >= 0; j--){
							arrayEquality = true;
							for(var k = 0; k < target[i].length; k++){
								if(target[i][k] != target[j][k]) {
									arrayEquality = false;
									k = target[i].length;
								}
							}
							if(arrayEquality) {
								target.splice(i,1);
								j=0;
							}
						}
					}
				}
			}
			matlab_unique(NewAtoms,'rows');
			var NewBasisVol = Math.abs(VLatoms.Math.dot(newB[2],VLatoms.Math.cross(newB[0], newB[1])));
			var OrigBasisVol = Math.abs(VLatoms.Math.dot(orgB[2],VLatoms.Math.cross(orgB[0], orgB[1])));
/*			function matlab_size(target){
				var ret=[]; 
				ret.push(target.length); 
				if ($.isArray(target[0])) {
					return ret.concat(test(target[0]));}
				else {
					return ret;
				}
			}*/
			if(Math.abs(NewAtoms.length/orgPos.length - NewBasisVol/OrigBasisVol) >= 0.0001){
console.log(NewAtoms.length, orgPos.length,NewBasisVol,OrigBasisVol);
console.log(Math.abs(NewAtoms.length/orgPos.length - NewBasisVol/OrigBasisVol));
				console.warn('EGREGIOUS ERROR, # of NewAtoms inconsistent with size of basis!\nMay need to manually tweak tolerance of atom elimination outside supercell\n');
				return;
			}
			NewAtoms.sort(function(a,b){
					if(a[3] === b[3]){
						return a[2] < b[2] ? -1 : a[2] > b[2] ? 1: 0;
					} else {
						return a[3] < b[3] ? -1 : 1;
					}
			});
			return NewAtoms;
	},
	union : function(a,b){
		newStructure = VLatoms.Utils.redefineStructure(a); 
		var b2 = VLatoms.Utils.redefineStructure(b);
		for(var i=0;i<b.atoms.length;i++){
			newStructure.atoms.push(b2.atoms[i]);
		}
		return newStructure;
		
	},
	getElArr : function(s){
		var elarr = {};
		for(var i=0;i<s.atoms.length;i++){
			var sa = s.atoms[i];
			if(elarr[sa.element]===undefined){
				elarr[sa.element]=1;
			}else{
				elarr[sa.element]++;
			}
		}
		return elarr;
	},
	toCIF : function(structure){
		var la = structure['a'];
		var lb = structure['b'];
		var lc = structure['c'];

		var alen = VLatoms.Math.len(la);
		var blen = VLatoms.Math.len(lb);
		var clen = VLatoms.Math.len(lc);
		var alpha,beta,gamma;
		alpha = Math.acos(VLatoms.Math.dot(lb,lc)/blen/clen)*180/Math.PI;
		beta = Math.acos(VLatoms.Math.dot(lc,la)/clen/alen)*180/Math.PI;
		gamma = Math.acos(VLatoms.Math.dot(la,lb)/alen/blen)*180/Math.PI;

		var elarr = VLatoms.Utils.Structure.getElArr(structure);
		var formula="";
		for(var element in elarr){
			formula+=element+elarr[element];
		}
		var latMatInv = VLatoms.Math.inv3([la,lb,lc]);
		var cif = "# Generated by MaterialsSquare.com\n";
			cif+="data_"+formula+"\n";
			cif+="_symmetry_space_group_name_H-M   'P 1'\n";
			cif+="_cell_length_a   "+alen+"\n";
			cif+="_cell_length_b   "+blen+"\n";
			cif+="_cell_length_c   "+clen+"\n";
			cif+="_cell_angle_alpha   "+alpha+"\n";
			cif+="_cell_angle_beta   "+beta+"\n";
			cif+="_cell_angle_gamma   "+gamma+"\n";
			cif+="_symmetry_Int_Tables_number   1\n";
		//	cif+="_chemical_formula_structural   TiFeO3";
		//	cif+="_chemical_formula_sum   'Ti2 Fe2 O6'";
		//	cif+="_cell_volume   108.892390228";
		//	cif+="_cell_formula_units_Z   2";
			cif+="loop_\n";
			cif+=" _symmetry_equiv_pos_site_id\n";
			cif+=" _symmetry_equiv_pos_as_xyz\n";
			cif+="  1  'x, y, z'\n";
			cif+="loop_\n";
			cif+=" _atom_site_type_symbol\n";
			cif+=" _atom_site_label\n";
			cif+=" _atom_site_symmetry_multiplicity\n";
			cif+=" _atom_site_fract_x\n";
			cif+=" _atom_site_fract_y\n";
			cif+=" _atom_site_fract_z\n";
			cif+=" _atom_site_occupancy\n";
		var catoms = structure.atoms;
		for(var element in elarr){
			var atoms_thisElement = catoms.filter(function(d){return d.element==element});
			for(var i=0;i<atoms_thisElement.length;i++){
				var ca = atoms_thisElement[i];
				var cp = [ca.x, ca.y, ca.z];
				var cp_frac = VLatoms.Math.vecdotmat( cp, latMatInv ); 
				cif+=element+" "+element+""+(i+1)+" 1 "+cp_frac[0]+" "+cp_frac[1]+" "+cp_frac[2]+" 1\n";
			}
		}
		return cif;

		
	},
	toPoscar : function(structure){
		var la = structure['a'];
		var lb = structure['b'];
		var lc = structure['c'];
		var poscar ="POSCAR Generated by VLAtoms at MaterialsSquare.com\n";
			poscar+="1.0\n";
			poscar+=Number(la[0]).toFixed(5)+" "+Number(la[1]).toFixed(5)+" "+Number(la[2]).toFixed(5)+"\n";
			poscar+=Number(lb[0]).toFixed(5)+" "+Number(lb[1]).toFixed(5)+" "+Number(lb[2]).toFixed(5)+"\n";
			poscar+=Number(lc[0]).toFixed(5)+" "+Number(lc[1]).toFixed(5)+" "+Number(lc[2]).toFixed(5)+"\n";
		var elarr = VLatoms.Utils.Structure.getElArr(structure);
		var catoms = structure.atoms;
		for(var element in elarr){
			poscar+=element+" ";
		}
		poscar+="\n";
		for(var element in elarr){
			poscar+=elarr[element]+" ";
		}
		poscar+="\n";
		poscar+="Direct\n";
		var latMatInv = VLatoms.Math.inv3([la,lb,lc]);
		for(var element in elarr){
			var atoms_thisElement = catoms.filter(function(d){return d.element==element});
			for(var i=0;i<atoms_thisElement.length;i++){
				var ca = atoms_thisElement[i];
				var cp = [ca.x, ca.y, ca.z];
				var cp_frac = VLatoms.Math.vecdotmat( cp, latMatInv ); 
				poscar+=Number(cp_frac[0]).toFixed(5)+" "+Number(cp_frac[1]).toFixed(5)+" "+Number(cp_frac[2]).toFixed(5)+" \n";
			}
		}
		return poscar;
		
	},
	everyThingsToVLatoms : function(structure,type){
		alert();
	},
	lammpstrjToVLatoms : function(structure){
	},
	cifToVLatoms : function(structure){
		var retStructure = {
			a : Array(0,0,0),
			b : Array(0,0,0),
			c : Array(0,0,0),
			atoms : Array()
		};
		var parseRet = loadCIF(structure,1);
		var _c = parseRet[Object.keys(parseRet)[0]];
		var a,b,c,alpha,beta,gamma;
		var lv = [];
			if(_c['cell_length_a']) a = +_c['cell_length_a'];
			if(_c['cell_length_b']) b = +_c['cell_length_b'];
			if(_c['cell_length_c']) c = +_c['cell_length_c'];
			if(_c['cell_angle_alpha']) alpha = +_c['cell_angle_alpha']*Math.PI/180;
			if(_c['cell_angle_beta']) beta = +_c['cell_angle_beta']*Math.PI/180;
			if(_c['cell_angle_gamma']) gamma = +_c['cell_angle_gamma']*Math.PI/180;
			lv[0]=[0,0,0]; lv[1]=[0,0,0]; lv[2]=[0,0,0];
			lv[0][0]=a;
			lv[1][0]=b*Math.cos(gamma);
			lv[1][1]=b*Math.sin(gamma);
			lv[2][0]=c*Math.cos(beta);
			if(lv[1][1]>0)
			{
			   lv[2][1]=(   b*c*Math.cos(alpha)
						   -b*Math.cos(gamma)*c*Math.cos(beta)
						)/lv[1][1];
			}else{
				lv[2][1]=0;
			}
			var c2sq = c*c-lv[2][0]*lv[2][0]-lv[2][1]*lv[2][1];
			if(c2sq<0){
				alert("Structure cannot be created");
				return -1;
			}
			lv[2][2]=Math.sqrt(c2sq);
			var natoms = _c['atom_site_fract_x'].length;
			var _atomPos=[],_element;
			retStructure.a = lv[0];
			retStructure.b = lv[1];
			retStructure.c = lv[2];
			
			if( _c['atom_site_fract_x'] ){
				for(var i=0;i<natoms;i++){
					_atomPos[0] = +_c['atom_site_fract_x'][i];
					_atomPos[1] = +_c['atom_site_fract_y'][i];
					_atomPos[2] = +_c['atom_site_fract_z'][i];
					_element = _c['atom_site_type_symbol'][i];
					atomPos = VLatoms.Math.vecdotmat(  _atomPos, lv );
					retStructure.atoms.push(new VLatoms.Atom( atomPos[0], atomPos[1], atomPos[2] ,_element));
				}
			}
			return retStructure;
	// http://www.iucr.org/resources/cif/spec/version1.1/cifsyntax
	},
	importVLatoms : function(structure){
		
	},
	xyzToVLatoms : function(structure){
		// parse XYZ File to VLAtoms Format
		// Additional vacuum region will be created to each direction
		var _s = structure.split("\n");
		var rmax; // maximum radius among all atoms, this value will be used as the additional vacuum size
		var natoms = _s[0]*1;
		var xmin,ymin,zmim,xmax,ymax,zmax;
		var _el, _x, _y, _z, _r;
		var retStructure = {
			a : Array(0,0,0),
			b : Array(0,0,0),
			c : Array(0,0,0),
			atoms : Array()
		};
		for(var i=0;i<natoms;i++){
			var idx = 2+i;
			var l = _s[idx].removeSpace().split(" ");
			_el = l[0];
			_x = l[1]*1;
			_y = l[2]*1;
			_z = l[3]*1;
			_r = AtomParam[_el].radius;

			if( i == 0 ){
				xmax = xmin = _x;
				ymax = ymin = _y;
				zmax = zmin = _z;
				rmax = _r;
			}
			if( _r > rmax ) rmax = _r;
			if( _x > xmax ) xmax = _x;
			if( _y > ymax ) ymax = _y;
			if( _z > zmax ) zmax = _z;
			if( _x < xmin ) xmin = _x;
			if( _y < ymin ) ymin = _y;
			if( _z < zmin ) zmin = _z;

			retStructure.atoms.push(new VLatoms.Atom( _x, _y, _z, _el ));
		}
		for(var i=0;i<natoms;i++){
			var ca = retStructure.atoms[i];
				ca.x -= xmin;
				ca.y -= ymin;
				ca.z -= zmin;
		}
		var xrange = xmax-xmin;
		var yrange = ymax-ymin;
		var zrange = zmax-zmin;
		if(xrange == 0 ) xrange = 1;
		if(yrange == 0 ) yrange = 1;
		if(zrange == 0 ) zrange = 1;
		retStructure.a[0] = xrange;
		retStructure.b[1] = yrange;
		retStructure.c[2] = zrange;
		return retStructure;
	},
	poscarToVLatoms : function(structure){
		var retStructure = {
			a : Array(3),
			b : Array(3),
			c : Array(3),
			atoms : Array()
		};
		var _s = structure.split("\n");
		var _ratio = _s[1]*1;
		var _a = _s[2].removeSpace().split(" ");
		var _b = _s[3].removeSpace().split(" ");
		var _c = _s[4].removeSpace().split(" ");
		var elements = _s[5].removeSpace().split(" ");
		var nelements = _s[6].removeSpace().split(" ");
		var nskip = 8;
		var iscartesian = false;
		if( _s[7][0] == "s" || _s[7][0] == "S" ){ // Selective Dynamics tag
			nskip = 9;
		}
		if( _s[nskip-1][0] == "c" || _s[nskip-1][0] == "C" ){
			iscartesian = true;
		}
		var natoms = 0;
		for( var i = 0 ; i < 3 ; i++ ){
			retStructure.a[i] = _a[i]*_ratio;
			retStructure.b[i] = _b[i]*_ratio;
			retStructure.c[i] = _c[i]*_ratio;
		}
		var latMat = [ retStructure.a, retStructure.b, retStructure.c ];
		var elementTable = [];
		for( var i=0 ; i < nelements.length ; i++ )
		{
			natoms += nelements[i]*1;
			for( var j=0 ; j < nelements[i]*1 ; j++ )
			{
				elementTable.push(elements[i]);
			}
		}
		var atomPos;
		for( var i = 0 ; i < natoms ; i++ ){
			var _l = _s[ nskip + i ].removeSpace().split(" ");
			var _atomPos = [_l[0]*1,_l[1]*1,_l[2]*1];
			if( !iscartesian ){
				for( var j = 0 ; j < 3 ; j++ ){
					_l[j]*=1;
					if( _l[j]<0 ) _l[j]=1+_l[j];
					if( _l[j]>1 ) _l[j]= _l[j]-1;
				}
				_atomPos = [_l[0],_l[1],_l[2]];
				atomPos = VLatoms.Math.vecdotmat(  _atomPos, latMat );
				//atomPos = VLatoms.Math.matdotvec(  latMat, _atomPos );

			}else{
				atomPos = _atomPos;
			}
			retStructure.atoms.push(new VLatoms.Atom( atomPos[0], atomPos[1], atomPos[2] ,elementTable[i]));
		}
		return retStructure;
	},
	compare : function(str1, str2){
		for(var i = 0; i<3; i++){	//compare cell
			console.log(str1.a[i],str2.a[i],i);
			if(str1.a[i] != str2.a[i]) return false;
			if(str1.b[i] != str2.b[i]) return false;
			if(str1.c[i] != str2.c[i]) return false;
		}
		if(str1.atoms.length + str2.atoms.length === 0) return true;
		if(str1.atoms.length !== str2.atoms.length) return false;
		for(var i = 0; i<str1.atoms.length; i++){	//compare atoms
			if(str1.atoms[i].x !== str2.atoms[i].x) return false;
			if(str1.atoms[i].y !== str2.atoms[i].y) return false;
			if(str1.atoms[i].z !== str2.atoms[i].z) return false;
			if(str1.atoms[i].element !== str2.atoms[i].element) return false;
		}
		return true;
	},
}


// Atomic parameters
//
var supportedElements = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es'];

// Reference :	 TODO
var AtomParam={};
AtomParam['H']={'no':1,'radius':0.79,'color':'0xFFD3D3','mass':1.00794,'group':1,'period':1,'block':'s','ie':13.598434005136,'oxi_n':[-1,1]};
AtomParam['He']={'no':2,'radius':0.49,'color':'0xFE1E00','mass':4.002602,'group':18,'period':1,'block':'s','ie':24.587387936,'oxi_n':[]};
AtomParam['Li']={'no':3,'radius':1.05,'color':'0xf477ff','mass':6.941,'group':1,'period':2,'block':'s','ie':5.391714761,'oxi_n':[1]};
AtomParam['Be']={'no':4,'radius':1.4,'color':'0x003EFE','mass':9.012182,'group':2,'period':2,'block':'s','ie':9.322699,'oxi_n':[1,2]};
AtomParam['B']={'no':5,'radius':1.17,'color':'0xBFFE00','mass':10.811,'group':13,'period':2,'block':'p','ie':8.298019,'oxi_n':[-5,-1,1,2,3]};
AtomParam['C']={'no':6,'radius':0.91,'color':'0x999999','mass':12.0107,'group':14,'period':2,'block':'p','ie':11.2603,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['N']={'no':7,'radius':0.75,'color':'0x6D77FF','mass':14.00674,'group':15,'period':2,'block':'p','ie':14.53413,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['O']={'no':8,'radius':0.65,'color':'0xFF0000','mass':15.9994,'group':16,'period':2,'block':'p','ie':13.618054,'oxi_n':[-2,-1,1,2]};
AtomParam['F']={'no':9,'radius':0.57,'color':'0x6DFF89','mass':18.9984032,'group':17,'period':2,'block':'p','ie':17.42282,'oxi_n':[-1]};
AtomParam['Ne']={'no':10,'radius':0.51,'color':'0xFE1900','mass':20.1797,'group':18,'period':2,'block':'p','ie':21.56454,'oxi_n':[]};
AtomParam['Na']={'no':11,'radius':2.23,'color':'0x0009FE','mass':22.98976928,'group':1,'period':3,'block':'s','ie':5.1390767,'oxi_n':[-1,1]};
AtomParam['Mg']={'no':12,'radius':1.72,'color':'0x0043FE','mass':24.305,'group':2,'period':3,'block':'s','ie':7.646235,'oxi_n':[1,2]};
AtomParam['Al']={'no':13,'radius':1.82,'color':'0xC5FE00','mass':26.9815386,'group':13,'period':3,'block':'p','ie':5.985768,'oxi_n':[-2,-1,1,2,3]};
AtomParam['Si']={'no':14,'radius':1.46,'color':'0xFEFC00','mass':28.0855,'group':14,'period':3,'block':'p','ie':8.151683,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['P']={'no':15,'radius':1.23,'color':'0xFF6666','mass':30.973762,'group':15,'period':3,'block':'p','ie':10.486686,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['S']={'no':16,'radius':1.09,'color':'0xFFFF00','mass':32.066,'group':16,'period':3,'block':'p','ie':10.36001,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['Cl']={'no':17,'radius':0.97,'color':'0xFE4E00','mass':35.4527,'group':17,'period':3,'block':'p','ie':12.96763,'oxi_n':[-1,1,2,3,4,5,6,7]};
AtomParam['Ar']={'no':18,'radius':0.88,'color':'0xFE1400','mass':39.948,'group':18,'period':3,'block':'p','ie':15.7596112,'oxi_n':[]};
AtomParam['K']={'no':19,'radius':2.77,'color':'0x000EFE','mass':39.0983,'group':1,'period':4,'block':'s','ie':4.34066354,'oxi_n':[-1,1]};
AtomParam['Ca']={'no':20,'radius':2.23,'color':'0x0048FE','mass':40.078,'group':2,'period':4,'block':'s','ie':6.1131552,'oxi_n':[1,2]};
AtomParam['Sc']={'no':21,'radius':2.09,'color':'0x0083FE','mass':44.955912,'group':3,'period':4,'block':'d','ie':6.56149,'oxi_n':[1,2,3]};
AtomParam['Ti']={'no':22,'radius':2,'color':'0x00BDFE','mass':47.867,'group':4,'period':4,'block':'d','ie':6.82812,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['V']={'no':23,'radius':1.92,'color':'0x00F7FE','mass':50.9415,'group':5,'period':4,'block':'d','ie':6.746187,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Cr']={'no':24,'radius':1.85,'color':'0x00FECA','mass':51.9961,'group':6,'period':4,'block':'d','ie':6.76651,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Mn']={'no':25,'radius':1.79,'color':'0x9C7AC7','mass':54.938045,'group':7,'period':4,'block':'d','ie':7.434038,'oxi_n':[-3,-2,-1,1,2,3,4,5,6,7]};
AtomParam['Fe']={'no':26,'radius':1.72,'color':'0x00FE56','mass':55.845,'group':8,'period':4,'block':'d','ie':7.9024678,'oxi_n':[-4,-2,-1,1,2,3,4,5,6,7]};
AtomParam['Co']={'no':27,'radius':1.67,'color':'0xf090a0','mass':58.933195,'group':9,'period':4,'block':'d','ie':7.88101,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Ni']={'no':28,'radius':1.62,'color':'0x1CFE00','mass':58.6934,'group':10,'period':4,'block':'d','ie':7.639877,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['Cu']={'no':29,'radius':1.57,'color':'0x8C3610','mass':63.546,'group':11,'period':4,'block':'d','ie':7.72638,'oxi_n':[-2,1,2,3,4]};
AtomParam['Zn']={'no':30,'radius':1.53,'color':'0xA0ED20','mass':65.39,'group':12,'period':4,'block':'d','ie':9.3941968,'oxi_n':[-2,1,2]};
AtomParam['Ga']={'no':31,'radius':1.81,'color':'0xCAFE00','mass':69.723,'group':13,'period':4,'block':'p','ie':5.9993018,'oxi_n':[-5,-4,-2,-1,1,2,3]};
AtomParam['Ge']={'no':32,'radius':1.52,'color':'0xFEF700','mass':72.61,'group':14,'period':4,'block':'p','ie':7.899435,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['As']={'no':33,'radius':1.33,'color':'0xFEBD00','mass':74.9216,'group':15,'period':4,'block':'p','ie':9.7886,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Se']={'no':34,'radius':1.22,'color':'0xFE8300','mass':78.96,'group':16,'period':4,'block':'p','ie':9.752392,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['Br']={'no':35,'radius':1.12,'color':'0xFE4800','mass':79.904,'group':17,'period':4,'block':'p','ie':11.81381,'oxi_n':[-1,1,3,4,5,7]};
AtomParam['Kr']={'no':36,'radius':1.03,'color':'0xFE0E00','mass':83.8,'group':18,'period':4,'block':'p','ie':13.9996049,'oxi_n':[2]};
AtomParam['Rb']={'no':37,'radius':2.98,'color':'0x0014FE','mass':85.4678,'group':1,'period':5,'block':'s','ie':4.177128,'oxi_n':[-1,1]};
AtomParam['Sr']={'no':38,'radius':2.45,'color':'0x004EFE','mass':87.62,'group':2,'period':5,'block':'s','ie':5.6948672,'oxi_n':[1,2]};
AtomParam['Y']={'no':39,'radius':2.27,'color':'0x0088FE','mass':88.90585,'group':3,'period':5,'block':'d','ie':6.21726,'oxi_n':[1,2,3]};
AtomParam['Zr']={'no':40,'radius':2.16,'color':'0x00C2FE','mass':91.224,'group':4,'period':5,'block':'d','ie':6.6339,'oxi_n':[-2,1,2,3,4]};
AtomParam['Nb']={'no':41,'radius':2.08,'color':'0x00FCFE','mass':92.90638,'group':5,'period':5,'block':'d','ie':6.75885,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Mo']={'no':42,'radius':2.01,'color':'0x64BDB0','mass':95.94,'group':6,'period':5,'block':'d','ie':7.09243,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Tc']={'no':43,'radius':1.95,'color':'0x00FE8B','mass':97.9072,'group':7,'period':5,'block':'d','ie':7.11938,'oxi_n':[-3,-1,1,2,3,4,5,6,7]};
AtomParam['Ru']={'no':44,'radius':1.89,'color':'0x00FE50','mass':101.07,'group':8,'period':5,'block':'d','ie':7.3605,'oxi_n':[-4,-2,1,2,3,4,5,6,7,8]};
AtomParam['Rh']={'no':45,'radius':1.83,'color':'0x00FE16','mass':102.9055,'group':9,'period':5,'block':'d','ie':7.4589,'oxi_n':[-3,-1,1,2,3,4,5,6]};
AtomParam['Pd']={'no':46,'radius':1.79,'color':'0x21FE00','mass':106.42,'group':10,'period':5,'block':'d','ie':8.33686,'oxi_n':[1,2,3,4,5,6]};
AtomParam['Ag']={'no':47,'radius':1.75,'color':'0x464646','mass':107.8682,'group':11,'period':5,'block':'d','ie':7.576234,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['Cd']={'no':48,'radius':1.71,'color':'0x95FE00','mass':112.411,'group':12,'period':5,'block':'d','ie':8.99382,'oxi_n':[-2,1,2]};
AtomParam['In']={'no':49,'radius':2,'color':'0xCFFE00','mass':114.818,'group':13,'period':5,'block':'p','ie':5.7863554,'oxi_n':[-5,-2,-1,1,2,3]};
AtomParam['Sn']={'no':50,'radius':1.72,'color':'0xFEF200','mass':118.71,'group':14,'period':5,'block':'p','ie':7.343917,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['Sb']={'no':51,'radius':1.53,'color':'0xFEB700','mass':121.76,'group':15,'period':5,'block':'p','ie':8.608389,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Te']={'no':52,'radius':1.42,'color':'0xFE7D00','mass':127.6,'group':16,'period':5,'block':'p','ie':9.00966,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['I']={'no':53,'radius':1.32,'color':'0xFE4300','mass':126.90447,'group':17,'period':5,'block':'p','ie':10.45126,'oxi_n':[-1,1,3,4,5,6,7]};
AtomParam['Xe']={'no':54,'radius':1.24,'color':'0xFE0900','mass':131.29,'group':18,'period':5,'block':'p','ie':12.1298431,'oxi_n':[2,4,6,8]};
AtomParam['Cs']={'no':55,'radius':3.34,'color':'0x0019FE','mass':132.9054519,'group':1,'period':6,'block':'s','ie':3.893905557,'oxi_n':[-1,1]};
AtomParam['Ba']={'no':56,'radius':2.78,'color':'0x585017','mass':137.327,'group':2,'period':6,'block':'s','ie':5.211664,'oxi_n':[1,2]};
AtomParam['La']={'no':57,'radius':2.74,'color':'0x008DFE','mass':178.49,'group':53,'period':6,'block':'f','ie':5.5769,'oxi_n':[1,2,3]};
AtomParam['Ce']={'no':58,'radius':2.7,'color':'0x008DFE','mass':180.94788,'group':53,'period':6,'block':'f','ie':5.5386,'oxi_n':[2,3,4]};
AtomParam['Pr']={'no':59,'radius':2.67,'color':'0x008DFE','mass':183.84,'group':53,'period':6,'block':'f','ie':5.47,'oxi_n':[2,3,4,5]};
AtomParam['Nd']={'no':60,'radius':2.64,'color':'0x008DFE','mass':186.207,'group':53,'period':6,'block':'f','ie':5.525,'oxi_n':[2,3,4]};
AtomParam['Pm']={'no':61,'radius':2.62,'color':'0x008DFE','mass':190.23,'group':53,'period':6,'block':'f','ie':5.577,'oxi_n':[2,3]};
AtomParam['Sm']={'no':62,'radius':2.59,'color':'0x008DFE','mass':192.217,'group':53,'period':6,'block':'f','ie':5.64371,'oxi_n':[2,3]};
AtomParam['Eu']={'no':63,'radius':2.56,'color':'0x008DFE','mass':195.084,'group':53,'period':6,'block':'f','ie':5.670385,'oxi_n':[2,3]};
AtomParam['Gd']={'no':64,'radius':2.54,'color':'0x008DFE','mass':196.966569,'group':53,'period':6,'block':'f','ie':6.1498,'oxi_n':[1,2,3]};
AtomParam['Tb']={'no':65,'radius':2.51,'color':'0x008DFE','mass':200.59,'group':53,'period':6,'block':'f','ie':5.8638,'oxi_n':[1,2,3,4]};
AtomParam['Dy']={'no':66,'radius':2.49,'color':'0x008DFE','mass':204.3833,'group':53,'period':6,'block':'f','ie':5.93905,'oxi_n':[2,3,4]};
AtomParam['Ho']={'no':67,'radius':2.47,'color':'0x008DFE','mass':207.2,'group':53,'period':6,'block':'f','ie':6.0215,'oxi_n':[2,3]};
AtomParam['Er']={'no':68,'radius':2.45,'color':'0x008DFE','mass':208.9804,'group':53,'period':6,'block':'f','ie':6.1077,'oxi_n':[2,3]};
AtomParam['Tm']={'no':69,'radius':2.42,'color':'0x008DFE','mass':208.9824,'group':53,'period':6,'block':'f','ie':6.18431,'oxi_n':[2,3]};
AtomParam['Yb']={'no':70,'radius':2.4,'color':'0x008DFE','mass':209.9871,'group':53,'period':6,'block':'f','ie':6.254159,'oxi_n':[2,3]};
AtomParam['Lu']={'no':71,'radius':2.25,'color':'0x008DFE','mass':222.0176,'group':53,'period':6,'block':'f','ie':5.425871,'oxi_n':[2,3]};
AtomParam['Hf']={'no':72,'radius':2.16,'color':'0x00C7FE','mass':138.90547,'group':4,'period':6,'block':'d','ie':6.825069,'oxi_n':[-2,1,2,3,4]};
AtomParam['Ta']={'no':73,'radius':2.09,'color':'0x00FEFA','mass':140.116,'group':5,'period':6,'block':'d','ie':7.549571,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['W']={'no':74,'radius':2.02,'color':'0x00FEBF','mass':140.90765,'group':6,'period':6,'block':'d','ie':7.86403,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Re']={'no':75,'radius':1.97,'color':'0x00FE85','mass':144.242,'group':7,'period':6,'block':'d','ie':7.83352,'oxi_n':[-3,-1,1,2,3,4,5,6,7]};
AtomParam['Os']={'no':76,'radius':1.92,'color':'0x00FE4B','mass':144.9127,'group':8,'period':6,'block':'d','ie':8.43823,'oxi_n':[-4,-2,-1,1,2,3,4,5,6,7,8]};
AtomParam['Ir']={'no':77,'radius':1.87,'color':'0x00FE11','mass':150.36,'group':9,'period':6,'block':'d','ie':8.96702,'oxi_n':[-3,-1,1,2,3,4,5,6,7,8]};
AtomParam['Pt']={'no':78,'radius':1.83,'color':'0x26FE00','mass':151.964,'group':10,'period':6,'block':'d','ie':8.95883,'oxi_n':[-3,-2,-1,1,2,3,4,5,6]};
AtomParam['Au']={'no':79,'radius':1.79,'color':'0x585017','mass':157.25,'group':11,'period':6,'block':'d','ie':9.225553,'oxi_n':[-3,-2,-1,1,2,3,5]};
AtomParam['Hg']={'no':80,'radius':1.76,'color':'0x9AFE00','mass':158.92535,'group':12,'period':6,'block':'d','ie':10.437504,'oxi_n':[-2,1,2]};
AtomParam['Tl']={'no':81,'radius':2.08,'color':'0xD5FE00','mass':162.5,'group':13,'period':6,'block':'p','ie':6.1082871,'oxi_n':[-5,-2,-1,1,2,3]};
AtomParam['Pb']={'no':82,'radius':1.81,'color':'0xFEEC00','mass':164.93032,'group':14,'period':6,'block':'p','ie':7.4166796,'oxi_n':[-4,-2,-1,1,2,3,4]};
AtomParam['Bi']={'no':83,'radius':1.63,'color':'0xFEB200','mass':167.259,'group':15,'period':6,'block':'p','ie':7.285516,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Po']={'no':84,'radius':1.53,'color':'0xFE7800','mass':168.93421,'group':16,'period':6,'block':'p','ie':8.414,'oxi_n':[-2,2,4,5,6]};
AtomParam['At']={'no':85,'radius':1.43,'color':'0xFE3E00','mass':173.04,'group':17,'period':6,'block':'p','ie':9.31751,'oxi_n':[-1,1,3,5,7]};
AtomParam['Rn']={'no':86,'radius':1.34,'color':'0xFE0400','mass':174.967,'group':18,'period':6,'block':'p','ie':10.7485,'oxi_n':[2,6]};
AtomParam['Fr']={'no':87,'radius':1.5,'color':'0x001EFE','mass':223.0197,'group':1,'period':7,'block':'s','ie':4.0727409,'oxi_n':[1]};
AtomParam['Ra']={'no':88,'radius':1.5,'color':'0x0058FE','mass':226.0254,'group':2,'period':7,'block':'s','ie':5.278424,'oxi_n':[2]};
AtomParam['Ac']={'no':89,'radius':1.88,'color':'0x0092FE','mass':263.1125,'group':63,'period':7,'block':'f','ie':5.380226,'oxi_n':[3]};
AtomParam['Th']={'no':90,'radius':1.5,'color':'0x0092FE','mass':262.1144,'group':63,'period':7,'block':'f','ie':6.3067,'oxi_n':[1,2,3,4]};
AtomParam['Pa']={'no':91,'radius':1.5,'color':'0x0092FE','mass':266.1219,'group':63,'period':7,'block':'f','ie':5.89,'oxi_n':[3,4,5]};
AtomParam['U']={'no':92,'radius':1.5,'color':'0x0092FE','mass':264.1247,'group':63,'period':7,'block':'f','ie':6.19405,'oxi_n':[1,2,3,4,5,6]};
AtomParam['Np']={'no':93,'radius':1.5,'color':'0x0092FE','mass':269.1341,'group':63,'period':7,'block':'f','ie':6.2655,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Pu']={'no':94,'radius':1.5,'color':'0x0092FE','mass':268.1388,'group':63,'period':7,'block':'f','ie':6.0258,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Am']={'no':95,'radius':1.5,'color':'0x0092FE','mass':272.1463,'group':63,'period':7,'block':'f','ie':5.9738,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Cm']={'no':96,'radius':1.5,'color':'0x0092FE','mass':272.1535,'group':63,'period':7,'block':'f','ie':5.9914,'oxi_n':[3,4,6]};
AtomParam['Bk']={'no':97,'radius':1.5,'color':'0x0092FE','mass':277,'group':63,'period':7,'block':'f','ie':6.1978,'oxi_n':[3,4]};
AtomParam['Cf']={'no':98,'radius':1.5,'color':'0x0092FE','mass':284,'group':63,'period':7,'block':'f','ie':6.2817,'oxi_n':[2,3,4]};
AtomParam['Es']={'no':99,'radius':1.5,'color':'0x0092FE','mass':289,'group':63,'period':7,'block':'f','ie':6.3676,'oxi_n':[2,3,4]};



//setting color
AtomParam['H'].color = '0xFFD3D3';
AtomParam['He'].color = '0xFE1E00';
AtomParam['Li'].color = '0xf477ff';
AtomParam['Be'].color = '0x003EFE';
AtomParam['B'].color = '0xBFFE00';
AtomParam['C'].color = '0x999999';
AtomParam['N'].color = '0x6D77FF';
AtomParam['O'].color = '0xFF0000';
AtomParam['F'].color = '0x6DFF89';
AtomParam['Ne'].color = '0xFE1900';
AtomParam['Na'].color = '0x0009FE';
AtomParam['Mg'].color = '0x0043FE';
AtomParam['Al'].color = '0xC5FE00';
AtomParam['Si'].color = '0xFEFC00';
AtomParam['P'].color = '0xFF6666';
AtomParam['S'].color = '0xFFFF00';
AtomParam['Cl'].color = '0xFE4E00';
AtomParam['Ar'].color = '0xFE1400';
AtomParam['K'].color = '0x000EFE';
AtomParam['Ca'].color = '0x0048FE';
AtomParam['Sc'].color = '0x0083FE';
AtomParam['Ti'].color = '0x00BDFE';
AtomParam['V'].color = '0x00F7FE';
AtomParam['Cr'].color = '0x00FECA';
AtomParam['Mn'].color = '0x9C7AC7';
AtomParam['Fe'].color = '0x00FE56';
AtomParam['Co'].color = '0xf090a0';
AtomParam['Ni'].color = '0x1CFE00';
AtomParam['Cu'].color = '0x8C3610';
AtomParam['Zn'].color = '0xA0ED20';
AtomParam['Ga'].color = '0xCAFE00';
AtomParam['Ge'].color = '0xFEF700';
AtomParam['As'].color = '0xFEBD00';
AtomParam['Se'].color = '0xFE8300';
AtomParam['Br'].color = '0xFE4800';
AtomParam['Kr'].color = '0xFE0E00';
AtomParam['Rb'].color = '0x0014FE';
AtomParam['Sr'].color = '0x004EFE';
AtomParam['Y'].color = '0x0088FE';
AtomParam['Zr'].color = '0x00C2FE';
AtomParam['Nb'].color = '0x00FCFE';
AtomParam['Mo'].color = '0x64BDB0';
AtomParam['Tc'].color = '0x00FE8B';
AtomParam['Ru'].color = '0x00FE50';
AtomParam['Rh'].color = '0x00FE16';
AtomParam['Pd'].color = '0x21FE00';
AtomParam['Ag'].color = '0x464646';
AtomParam['Cd'].color = '0x95FE00';
AtomParam['In'].color = '0xCFFE00';
AtomParam['Sn'].color = '0xFEF200';
AtomParam['Sb'].color = '0xFEB700';
AtomParam['Te'].color = '0xFE7D00';
AtomParam['I'].color = '0xFE4300';
AtomParam['Xe'].color = '0xFE0900';
AtomParam['Cs'].color = '0x0019FE';
AtomParam['Ba'].color = '0x585017';
AtomParam['La'].color = '0x008DFE';
AtomParam['Ce'].color = '0x008DFE';
AtomParam['Pr'].color = '0x008DFE';
AtomParam['Nd'].color = '0x008DFE';
AtomParam['Pm'].color = '0x008DFE';
AtomParam['Sm'].color = '0x008DFE';
AtomParam['Eu'].color = '0x008DFE';
AtomParam['Gd'].color = '0x008DFE';
AtomParam['Tb'].color = '0x008DFE';
AtomParam['Dy'].color = '0x008DFE';
AtomParam['Ho'].color = '0x008DFE';
AtomParam['Er'].color = '0x008DFE';
AtomParam['Tm'].color = '0x008DFE';
AtomParam['Yb'].color = '0x008DFE';
AtomParam['Lu'].color = '0x008DFE';
AtomParam['Hf'].color = '0x00C7FE';
AtomParam['Ta'].color = '0x00FEFA';
AtomParam['W'].color = '0x00FEBF';
AtomParam['Re'].color = '0x00FE85';
AtomParam['Os'].color = '0x00FE4B';
AtomParam['Ir'].color = '0x00FE11';
AtomParam['Pt'].color = '0x26FE00';
AtomParam['Au'].color = '0x585017';
AtomParam['Hg'].color = '0x9AFE00';
AtomParam['Tl'].color = '0xD5FE00';
AtomParam['Pb'].color = '0xFEEC00';
AtomParam['Bi'].color = '0xFEB200';
AtomParam['Po'].color = '0xFE7800';
AtomParam['At'].color = '0xFE3E00';
AtomParam['Rn'].color = '0xFE0400';
AtomParam['Fr'].color = '0x001EFE';
AtomParam['Ra'].color = '0x0058FE';
AtomParam['Ac'].color = '0x0092FE';
AtomParam['Th'].color = '0x0092FE';
AtomParam['Pa'].color = '0x0092FE';
AtomParam['U'].color = '0x0092FE';
AtomParam['Np'].color = '0x0092FE';
AtomParam['Pu'].color = '0x0092FE';
AtomParam['Am'].color = '0x0092FE';
AtomParam['Cm'].color = '0x0092FE';
AtomParam['Bk'].color = '0x0092FE';
AtomParam['Cf'].color = '0x0092FE';
AtomParam['Es'].color = '0x0092FE';


//setting radii
//reference : http://periodictable.com/
AtomParam['H'].radius =  .31;
AtomParam['He'].radius =  .28;
AtomParam['Li'].radius =  1.28;
AtomParam['Be'].radius =  .96;
AtomParam['B'].radius =  .85;
AtomParam['C'].radius =  .76;
AtomParam['N'].radius =  .71;
AtomParam['O'].radius =  .66;
AtomParam['F'].radius =  .57;
AtomParam['Ne'].radius =  .58;
AtomParam['Na'].radius =  1.66;
AtomParam['Mg'].radius =  1.41;
AtomParam['Al'].radius =  1.21;
AtomParam['Si'].radius =  1.11;
AtomParam['P'].radius =  1.07;
AtomParam['S'].radius =  1.05;
AtomParam['Cl'].radius =  1.02;
AtomParam['Ar'].radius =  1.06;
AtomParam['K'].radius =  2.03;
AtomParam['Ca'].radius =  1.76;
AtomParam['Sc'].radius =  1.7;
AtomParam['Ti'].radius =  1.6;
AtomParam['V'].radius =  1.53;
AtomParam['Cr'].radius =  1.39;
AtomParam['Mn'].radius =  1.39;
AtomParam['Fe'].radius =  1.32;
AtomParam['Co'].radius =  1.26;
AtomParam['Ni'].radius =  1.24;
AtomParam['Cu'].radius =  1.32;
AtomParam['Zn'].radius =  1.22;
AtomParam['Ga'].radius =  1.22;
AtomParam['Ge'].radius =  1.2;
AtomParam['As'].radius =  1.19;
AtomParam['Se'].radius =  1.2;
AtomParam['Br'].radius =  1.2;
AtomParam['Kr'].radius =  1.16;
AtomParam['Rb'].radius =  2.2;
AtomParam['Sr'].radius =  1.95;
AtomParam['Y'].radius =  1.9;
AtomParam['Zr'].radius =  1.75;
AtomParam['Nb'].radius =  1.64;
AtomParam['Mo'].radius =  1.54;
AtomParam['Tc'].radius =  1.47;
AtomParam['Ru'].radius =  1.46;
AtomParam['Rh'].radius =  1.42;
AtomParam['Pd'].radius =  1.39;
AtomParam['Ag'].radius =  1.45;
AtomParam['Cd'].radius =  1.44;
AtomParam['In'].radius =  1.42;
AtomParam['Sn'].radius =  1.39;
AtomParam['Sb'].radius =  1.39;
AtomParam['Te'].radius =  1.38;
AtomParam['I'].radius =  1.39;
AtomParam['Xe'].radius =  1.4;
AtomParam['Cs'].radius =  2.44;
AtomParam['Ba'].radius =  2.15;
AtomParam['La'].radius =  2.07;
AtomParam['Ce'].radius =  2.04;
AtomParam['Pr'].radius =  2.03;
AtomParam['Nd'].radius =  2.01;
AtomParam['Pm'].radius =  1.99;
AtomParam['Sm'].radius =  1.98;
AtomParam['Eu'].radius =  1.98;
AtomParam['Gd'].radius =  1.96;
AtomParam['Tb'].radius =  1.94;
AtomParam['Dy'].radius =  1.92;
AtomParam['Ho'].radius =  1.92;
AtomParam['Er'].radius =  1.89;
AtomParam['Tm'].radius =  1.9;
AtomParam['Yb'].radius =  1.87;
AtomParam['Lu'].radius =  1.87;
AtomParam['Hf'].radius =  1.75;
AtomParam['Ta'].radius =  1.7;
AtomParam['W'].radius =  1.62;
AtomParam['Re'].radius =  1.51;
AtomParam['Os'].radius =  1.44;
AtomParam['Ir'].radius =  1.41;
AtomParam['Pt'].radius =  1.36;
AtomParam['Au'].radius =  1.36;
AtomParam['Hg'].radius =  1.32;
AtomParam['Tl'].radius =  1.45;
AtomParam['Pb'].radius =  1.46;
AtomParam['Bi'].radius =  1.48;
AtomParam['Po'].radius =  1.4;
AtomParam['At'].radius =  1.5;
AtomParam['Rn'].radius =  1.5;
AtomParam['Fr'].radius =  2.6;
AtomParam['Ra'].radius =  2.21;
AtomParam['Ac'].radius =  2.15;
AtomParam['Th'].radius =  2.06;
AtomParam['Pa'].radius =  2;
AtomParam['U'].radius =  1.96;
AtomParam['Np'].radius =  1.9;
AtomParam['Pu'].radius =  1.87;
AtomParam['Am'].radius =  1.8;
AtomParam['Cm'].radius =  1.69;
AtomParam['Bk'].radius =  1.6; //arbitrary value
AtomParam['Cf'].radius =  1.55; //arbitrary value
AtomParam['Es'].radius =  1.5; //arbitrary value


/*
 * AtomParam['H']={'no':1,'radius':0.79,'color':'0xFFD3D3','mass':1.00794,'group':1,'period':1};
AtomParam['He']={'no':2,'radius':0.49,'color':'0xFE1E00','mass':4.002602,'group':18,'period':1};
AtomParam['Li']={'no':3,'radius':1.05,'color':'0xf477ff','mass':6.941,'group':1,'period':2};
AtomParam['Be']={'no':4,'radius':1.4,'color':'0x003EFE','mass':9.012182,'group':2,'period':2};
AtomParam['B']={'no':5,'radius':1.17,'color':'0xBFFE00','mass':10.811,'group':13,'period':2};
AtomParam['C']={'no':6,'radius':0.91,'color':'0x999999','mass':12.0107,'group':14,'period':2};
AtomParam['N']={'no':7,'radius':0.75,'color':'0x6D77FF','mass':14.00674,'group':15,'period':2};
AtomParam['O']={'no':8,'radius':0.65,'color':'0xFF0000','mass':15.9994,'group':16,'period':2};
AtomParam['F']={'no':9,'radius':0.57,'color':'0x6DFF89','mass':18.9984032,'group':17,'period':2};
AtomParam['Ne']={'no':10,'radius':0.51,'color':'0xFE1900','mass':20.1797,'group':18,'period':2};
AtomParam['Na']={'no':11,'radius':2.23,'color':'0x0009FE','mass':22.98976928,'group':1,'period':3};
AtomParam['Mg']={'no':12,'radius':1.72,'color':'0x0043FE','mass':24.305,'group':2,'period':3};
AtomParam['Al']={'no':13,'radius':1.82,'color':'0xC5FE00','mass':26.9815386,'group':13,'period':3};
AtomParam['Si']={'no':14,'radius':1.46,'color':'0xFEFC00','mass':28.0855,'group':14,'period':3};
AtomParam['P']={'no':15,'radius':1.23,'color':'0xFF6666','mass':30.973762,'group':15,'period':3};
AtomParam['S']={'no':16,'radius':1.09,'color':'0xFFFF00','mass':32.066,'group':16,'period':3};
AtomParam['Cl']={'no':17,'radius':0.97,'color':'0xFE4E00','mass':35.4527,'group':17,'period':3};
AtomParam['Ar']={'no':18,'radius':0.88,'color':'0xFE1400','mass':39.948,'group':18,'period':3};
AtomParam['K']={'no':19,'radius':2.77,'color':'0x000EFE','mass':39.0983,'group':1,'period':4};
AtomParam['Ca']={'no':20,'radius':2.23,'color':'0x0048FE','mass':40.078,'group':2,'period':4};
AtomParam['Sc']={'no':21,'radius':2.09,'color':'0x0083FE','mass':44.955912,'group':3,'period':4};
AtomParam['Ti']={'no':22,'radius':2,'color':'0x00BDFE','mass':47.867,'group':4,'period':4};
AtomParam['V']={'no':23,'radius':1.92,'color':'0x00F7FE','mass':50.9415,'group':5,'period':4};
AtomParam['Cr']={'no':24,'radius':1.85,'color':'0x00FECA','mass':51.9961,'group':6,'period':4};
AtomParam['Mn']={'no':25,'radius':1.79,'color':'0x9C7AC7','mass':54.938045,'group':7,'period':4};
AtomParam['Fe']={'no':26,'radius':1.72,'color':'0x00FE56','mass':55.845,'group':8,'period':4};
AtomParam['Co']={'no':27,'radius':1.67,'color':'0xf090a0','mass':58.933195,'group':9,'period':4};
AtomParam['Ni']={'no':28,'radius':1.62,'color':'0x1CFE00','mass':58.6934,'group':10,'period':4};
AtomParam['Cu']={'no':29,'radius':1.57,'color':'0x8C3610','mass':63.546,'group':11,'period':4};
AtomParam['Zn']={'no':30,'radius':1.53,'color':'0xA0ED20','mass':65.39,'group':12,'period':4};
AtomParam['Ga']={'no':31,'radius':1.81,'color':'0xCAFE00','mass':69.723,'group':13,'period':4};
AtomParam['Ge']={'no':32,'radius':1.52,'color':'0xFEF700','mass':72.61,'group':14,'period':4};
AtomParam['As']={'no':33,'radius':1.33,'color':'0xFEBD00','mass':74.9216,'group':15,'period':4};
AtomParam['Se']={'no':34,'radius':1.22,'color':'0xFE8300','mass':78.96,'group':16,'period':4};
AtomParam['Br']={'no':35,'radius':1.12,'color':'0xFE4800','mass':79.904,'group':17,'period':4};
AtomParam['Kr']={'no':36,'radius':1.03,'color':'0xFE0E00','mass':83.8,'group':18,'period':4};
AtomParam['Rb']={'no':37,'radius':2.98,'color':'0x0014FE','mass':85.4678,'group':1,'period':5};
AtomParam['Sr']={'no':38,'radius':2.45,'color':'0x004EFE','mass':87.62,'group':2,'period':5};
AtomParam['Y']={'no':39,'radius':2.27,'color':'0x0088FE','mass':88.90585,'group':3,'period':5};
AtomParam['Zr']={'no':40,'radius':2.16,'color':'0x00C2FE','mass':91.224,'group':4,'period':5};
AtomParam['Nb']={'no':41,'radius':2.08,'color':'0x00FCFE','mass':92.90638,'group':5,'period':5};
AtomParam['Mo']={'no':42,'radius':2.01,'color':'0x64BDB0','mass':95.94,'group':6,'period':5};
AtomParam['Tc']={'no':43,'radius':1.95,'color':'0x00FE8B','mass':97.9072,'group':7,'period':5};
AtomParam['Ru']={'no':44,'radius':1.89,'color':'0x00FE50','mass':101.07,'group':8,'period':5};
AtomParam['Rh']={'no':45,'radius':1.83,'color':'0x00FE16','mass':102.9055,'group':9,'period':5};
AtomParam['Pd']={'no':46,'radius':1.79,'color':'0x21FE00','mass':106.42,'group':10,'period':5};
AtomParam['Ag']={'no':47,'radius':1.75,'color':'0x464646','mass':107.8682,'group':11,'period':5};
AtomParam['Cd']={'no':48,'radius':1.71,'color':'0x95FE00','mass':112.411,'group':12,'period':5};
AtomParam['In']={'no':49,'radius':2,'color':'0xCFFE00','mass':114.818,'group':13,'period':5};
AtomParam['Sn']={'no':50,'radius':1.72,'color':'0xFEF200','mass':118.71,'group':14,'period':5};
AtomParam['Sb']={'no':51,'radius':1.53,'color':'0xFEB700','mass':121.76,'group':15,'period':5};
AtomParam['Te']={'no':52,'radius':1.42,'color':'0xFE7D00','mass':127.6,'group':16,'period':5};
AtomParam['I']={'no':53,'radius':1.32,'color':'0xFE4300','mass':126.90447,'group':17,'period':5};
AtomParam['Xe']={'no':54,'radius':1.24,'color':'0xFE0900','mass':131.29,'group':18,'period':5};
AtomParam['Cs']={'no':55,'radius':3.34,'color':'0x0019FE','mass':132.9054519,'group':1,'period':6};
AtomParam['Ba']={'no':56,'radius':2.78,'color':'0x585017','mass':137.327,'group':2,'period':6};
AtomParam['La']={'no':57,'radius':2.74,'color':'0x008DFE','mass':178.49,'group':53,'period':6};
AtomParam['Ce']={'no':58,'radius':2.7,'color':'0x008DFE','mass':180.94788,'group':53,'period':6};
AtomParam['Pr']={'no':59,'radius':2.67,'color':'0x008DFE','mass':183.84,'group':53,'period':6};
AtomParam['Nd']={'no':60,'radius':2.64,'color':'0x008DFE','mass':186.207,'group':53,'period':6};
AtomParam['Pm']={'no':61,'radius':2.62,'color':'0x008DFE','mass':190.23,'group':53,'period':6};
AtomParam['Sm']={'no':62,'radius':2.59,'color':'0x008DFE','mass':192.217,'group':53,'period':6};
AtomParam['Eu']={'no':63,'radius':2.56,'color':'0x008DFE','mass':195.084,'group':53,'period':6};
AtomParam['Gd']={'no':64,'radius':2.54,'color':'0x008DFE','mass':196.966569,'group':53,'period':6};
AtomParam['Tb']={'no':65,'radius':2.51,'color':'0x008DFE','mass':200.59,'group':53,'period':6};
AtomParam['Dy']={'no':66,'radius':2.49,'color':'0x008DFE','mass':204.3833,'group':53,'period':6};
AtomParam['Ho']={'no':67,'radius':2.47,'color':'0x008DFE','mass':207.2,'group':53,'period':6};
AtomParam['Er']={'no':68,'radius':2.45,'color':'0x008DFE','mass':208.9804,'group':53,'period':6};
AtomParam['Tm']={'no':69,'radius':2.42,'color':'0x008DFE','mass':208.9824,'group':53,'period':6};
AtomParam['Yb']={'no':70,'radius':2.4,'color':'0x008DFE','mass':209.9871,'group':53,'period':6};
AtomParam['Lu']={'no':71,'radius':2.25,'color':'0x008DFE','mass':222.0176,'group':53,'period':6};
AtomParam['Hf']={'no':72,'radius':2.16,'color':'0x00C7FE','mass':138.90547,'group':4,'period':6};
AtomParam['Ta']={'no':73,'radius':2.09,'color':'0x00FEFA','mass':140.116,'group':5,'period':6};
AtomParam['W']={'no':74,'radius':2.02,'color':'0x00FEBF','mass':140.90765,'group':6,'period':6};
AtomParam['Re']={'no':75,'radius':1.97,'color':'0x00FE85','mass':144.242,'group':7,'period':6};
AtomParam['Os']={'no':76,'radius':1.92,'color':'0x00FE4B','mass':144.9127,'group':8,'period':6};
AtomParam['Ir']={'no':77,'radius':1.87,'color':'0x00FE11','mass':150.36,'group':9,'period':6};
AtomParam['Pt']={'no':78,'radius':1.83,'color':'0x26FE00','mass':151.964,'group':10,'period':6};
AtomParam['Au']={'no':79,'radius':1.79,'color':'0x585017','mass':157.25,'group':11,'period':6};
AtomParam['Hg']={'no':80,'radius':1.76,'color':'0x9AFE00','mass':158.92535,'group':12,'period':6};
AtomParam['Tl']={'no':81,'radius':2.08,'color':'0xD5FE00','mass':162.5,'group':13,'period':6};
AtomParam['Pb']={'no':82,'radius':1.81,'color':'0xFEEC00','mass':164.93032,'group':14,'period':6};
AtomParam['Bi']={'no':83,'radius':1.63,'color':'0xFEB200','mass':167.259,'group':15,'period':6};
AtomParam['Po']={'no':84,'radius':1.53,'color':'0xFE7800','mass':168.93421,'group':16,'period':6};
AtomParam['At']={'no':85,'radius':1.43,'color':'0xFE3E00','mass':173.04,'group':17,'period':6};
AtomParam['Rn']={'no':86,'radius':1.34,'color':'0xFE0400','mass':174.967,'group':18,'period':6};
AtomParam['Fr']={'no':87,'radius':1.5,'color':'0x001EFE','mass':223.0197,'group':1,'period':7};
AtomParam['Ra']={'no':88,'radius':1.5,'color':'0x0058FE','mass':226.0254,'group':2,'period':7};
AtomParam['Ac']={'no':89,'radius':1.88,'color':'0x0092FE','mass':263.1125,'group':63,'period':7};
AtomParam['Th']={'no':90,'radius':1.5,'color':'0x0092FE','mass':262.1144,'group':63,'period':7};
AtomParam['Pa']={'no':91,'radius':1.5,'color':'0x0092FE','mass':266.1219,'group':63,'period':7};
AtomParam['U']={'no':92,'radius':1.5,'color':'0x0092FE','mass':264.1247,'group':63,'period':7};
AtomParam['Np']={'no':93,'radius':1.5,'color':'0x0092FE','mass':269.1341,'group':63,'period':7};
AtomParam['Pu']={'no':94,'radius':1.5,'color':'0x0092FE','mass':268.1388,'group':63,'period':7};
AtomParam['Am']={'no':95,'radius':1.5,'color':'0x0092FE','mass':272.1463,'group':63,'period':7};
AtomParam['Cm']={'no':96,'radius':1.5,'color':'0x0092FE','mass':272.1535,'group':63,'period':7};
AtomParam['Bk']={'no':97,'radius':1.5,'color':'0x0092FE','mass':277,'group':63,'period':7};
AtomParam['Cf']={'no':98,'radius':1.5,'color':'0x0092FE','mass':284,'group':63,'period':7};
AtomParam['Es']={'no':99,'radius':1.5,'color':'0x0092FE','mass':289,'group':63,'period':7};*/
/*


AtomParam['H']={radius : 0.79, color : '0xFFD3D3', mass : 1.00794, no : 1};
AtomParam['He']={radius : 0.49, color : '0xFE1E00', mass : 4.002602,no : 2};
AtomParam['Li']={radius : 1.05, color : '0xf477ff', mass : 6.941, no : 3};
AtomParam['Be']={radius : 1.4, color : '0x003EFE', mass : 9.012182, no : 4};
AtomParam['B']={radius : 1.17, color : '0xBFFE00', mass : 10.811, no : 5};
AtomParam['C']={radius : 0.91, color : '0x999999', mass : 12.0107};
AtomParam['N']={radius : 0.75, color : '0x6D77FF', mass : 14.00674};
AtomParam['O']={radius : 0.65, color : '0xFF0000', mass : 15.9994};
AtomParam['F']={radius : 0.57, color : '0x6DFF89', mass : 18.9984032};
AtomParam['Ne']={radius : 0.51, color : '0xFE1900', mass : 20.1797};
AtomParam['Na']={radius : 2.23, color : '0x0009FE', mass : 22.98976928};
AtomParam['Mg']={radius : 1.72, color : '0x0043FE', mass : 24.305};
AtomParam['Al']={radius : 1.82, color : '0xC5FE00', mass : 26.9815386};
AtomParam['Si']={radius : 1.46, color : '0xFEFC00', mass : 28.0855};
AtomParam['P']={radius : 1.23, color : '0xFF6666', mass : 30.973762};
AtomParam['S']={radius : 1.09, color : '0xFFFF00', mass : 32.066};
AtomParam['Cl']={radius : 0.97, color : '0xFE4E00', mass : 35.4527};
AtomParam['Ar']={radius : 0.88, color : '0xFE1400', mass : 39.948};
AtomParam['K']={radius : 2.77, color : '0x000EFE', mass : 39.0983};
AtomParam['Ca']={radius : 2.23, color : '0x0048FE', mass : 40.078};
AtomParam['Sc']={radius : 2.09, color : '0x0083FE', mass : 44.955912};
AtomParam['Ti']={radius : 2, color : '0x00BDFE', mass : 47.867};
AtomParam['V']={radius : 1.92, color : '0x00F7FE', mass : 50.9415};
AtomParam['Cr']={radius : 1.85, color : '0x00FECA', mass : 51.9961};
AtomParam['Mn']={radius : 1.79, color : '0x9C7AC7', mass : 54.938045};
AtomParam['Fe']={radius : 1.72, color : '0x00FE56', mass : 55.845};
AtomParam['Co']={radius : 1.67, color : '0xf090a0', mass : 58.933195};
AtomParam['Ni']={radius : 1.62, color : '0x1CFE00', mass : 58.6934};
AtomParam['Cu']={radius : 1.57, color : '0x8C3610', mass : 63.546};
AtomParam['Zn']={radius : 1.53, color : '0xA0ED20', mass : 65.39};
AtomParam['Ga']={radius : 1.81, color : '0xCAFE00', mass : 69.723};
AtomParam['Ge']={radius : 1.52, color : '0xFEF700', mass : 72.61};
AtomParam['As']={radius : 1.33, color : '0xFEBD00', mass : 74.9216};
AtomParam['Se']={radius : 1.22, color : '0xFE8300', mass : 78.96};
AtomParam['Br']={radius : 1.12, color : '0xFE4800', mass : 79.904};
AtomParam['Kr']={radius : 1.03, color : '0xFE0E00', mass : 83.8};
AtomParam['Rb']={radius : 2.98, color : '0x0014FE', mass : 85.4678};
AtomParam['Sr']={radius : 2.45, color : '0x004EFE', mass : 87.62};
AtomParam['Y']={radius : 2.27, color : '0x0088FE', mass : 88.90585};
AtomParam['Zr']={radius : 2.16, color : '0x00C2FE', mass : 91.224};
AtomParam['Nb']={radius : 2.08, color : '0x00FCFE', mass : 92.90638};
AtomParam['Mo']={radius : 2.01, color : '0x64BDB0', mass : 95.94};
AtomParam['Tc']={radius : 1.95, color : '0x00FE8B', mass : 97.9072};
AtomParam['Ru']={radius : 1.89, color : '0x00FE50', mass : 101.07};
AtomParam['Rh']={radius : 1.83, color : '0x00FE16', mass : 102.9055};
AtomParam['Pd']={radius : 1.79, color : '0x21FE00', mass : 106.42};
AtomParam['Ag']={radius : 1.75, color : '0x464646', mass : 107.8682};
AtomParam['Cd']={radius : 1.71, color : '0x95FE00', mass : 112.411};
AtomParam['In']={radius : 2, color : '0xCFFE00', mass : 114.818};
AtomParam['Sn']={radius : 1.72, color : '0xFEF200', mass : 118.71};
AtomParam['Sb']={radius : 1.53, color : '0xFEB700', mass : 121.76};
AtomParam['Te']={radius : 1.42, color : '0xFE7D00', mass : 127.6};
AtomParam['I']={radius : 1.32, color : '0xFE4300', mass : 126.90447};
AtomParam['Xe']={radius : 1.24, color : '0xFE0900', mass : 131.29};
AtomParam['Cs']={radius : 3.34, color : '0x0019FE', mass : 132.9054519};
AtomParam['Ba']={radius : 2.78, color : '0x585017', mass : 137.327};
AtomParam['La']={radius : 2.74, color : '0x008DFE', mass : 178.49};
AtomParam['Ce']={radius : 2.7, color : '0x008DFE', mass : 180.94788};
AtomParam['Pr']={radius : 2.67, color : '0x008DFE', mass : 183.84};
AtomParam['Nd']={radius : 2.64, color : '0x008DFE', mass : 186.207};
AtomParam['Pm']={radius : 2.62, color : '0x008DFE', mass : 190.23};
AtomParam['Sm']={radius : 2.59, color : '0x008DFE', mass : 192.217};
AtomParam['Eu']={radius : 2.56, color : '0x008DFE', mass : 195.084};
AtomParam['Gd']={radius : 2.54, color : '0x008DFE', mass : 196.966569};
AtomParam['Tb']={radius : 2.51, color : '0x008DFE', mass : 200.59};
AtomParam['Dy']={radius : 2.49, color : '0x008DFE', mass : 204.3833};
AtomParam['Ho']={radius : 2.47, color : '0x008DFE', mass : 207.2};
AtomParam['Er']={radius : 2.45, color : '0x008DFE', mass : 208.9804};
AtomParam['Tm']={radius : 2.42, color : '0x008DFE', mass : 208.9824};
AtomParam['Yb']={radius : 2.4, color : '0x008DFE', mass : 209.9871};
AtomParam['Lu']={radius : 2.25, color : '0x008DFE', mass : 222.0176};
AtomParam['Hf']={radius : 2.16, color : '0x00C7FE', mass : 138.90547};
AtomParam['Ta']={radius : 2.09, color : '0x00FEFA', mass : 140.116};
AtomParam['W']={radius : 2.02, color : '0x00FEBF', mass : 140.90765};
AtomParam['Re']={radius : 1.97, color : '0x00FE85', mass : 144.242};
AtomParam['Os']={radius : 1.92, color : '0x00FE4B', mass : 144.9127};
AtomParam['Ir']={radius : 1.87, color : '0x00FE11', mass : 150.36};
AtomParam['Pt']={radius : 1.83, color : '0x26FE00', mass : 151.964};
AtomParam['Au']={radius : 1.79, color : '0x585017', mass : 157.25};
AtomParam['Hg']={radius : 1.76, color : '0x9AFE00', mass : 158.92535};
AtomParam['Tl']={radius : 2.08, color : '0xD5FE00', mass : 162.5};
AtomParam['Pb']={radius : 1.81, color : '0xFEEC00', mass : 164.93032};
AtomParam['Bi']={radius : 1.63, color : '0xFEB200', mass : 167.259};
AtomParam['Po']={radius : 1.53, color : '0xFE7800', mass : 168.93421};
AtomParam['At']={radius : 1.43, color : '0xFE3E00', mass : 173.04};
AtomParam['Rn']={radius : 1.34, color : '0xFE0400', mass : 174.967};
AtomParam['Fr']={radius : 1.5, color : '0x001EFE', mass : 223.0197};
AtomParam['Ra']={radius : 1.5, color : '0x0058FE', mass : 226.0254};
AtomParam['Ac']={radius : 1.88, color : '0x0092FE', mass : 263.1125};
AtomParam['Th']={radius : 1.5, color : '0x0092FE', mass : 262.1144};
AtomParam['Pa']={radius : 1.5, color : '0x0092FE', mass : 266.1219};
AtomParam['U']={radius : 1.5, color : '0x0092FE', mass : 264.1247};
AtomParam['Np']={radius : 1.5, color : '0x0092FE', mass : 269.1341};
AtomParam['Pu']={radius : 1.5, color : '0x0092FE', mass : 268.1388};
AtomParam['Am']={radius : 1.5, color : '0x0092FE', mass : 272.1463};
AtomParam['Cm']={radius : 1.5, color : '0x0092FE', mass : 272.1535};
AtomParam['Bk']={radius : 1.5, color : '0x0092FE', mass : 277};
AtomParam['Cf']={radius : 1.5, color : '0x0092FE', mass : 284};
AtomParam['Es']={radius : 1.5, color : '0x0092FE', mass : 289};
*/
AtomParam['X']={oxi_n:[],radius : 3, color : '0x000000', mass : 0.0001}; // If element is not defined
_AtomParam = JSON.parse(JSON.stringify(AtomParam));
SpaceGroups = ['P1','P-1','P2','P21','C2','Pm','Pc','Cm','Cc','P2/m','P21/m','C2/m','P2/c','P21/c','C2/c','P222','P2221','P21212','P212121','C2221','C222','F222','I222','I212121','Pmm2','Pmc21','Pcc2','Pma2','Pca21','Pnc2','Pmn21','Pba2','Pna21','Pnn2','Cmm2','Cmc21','Ccc2','Amm2','Aem2','Ama2','Aea2','Fmm2','Fdd2','Imm2','Iba2','Ima2','Pmmm','Pnnn','Pccm','Pban','Pmma','Pnna','Pmna','Pcca','Pbam','Pccn','Pbcm','Pnnm','Pmmn','Pbcn','Pbca','Pnma','Cmcm','Cmce','Cmmm','Cccm','Cmme','Ccce','Fmmm','Fddd','Immm','Ibam','Ibca','Imma','P4','P41','P42','P43','I4','I41','P-4','I-4','P4/m','P42/m','P4/n','P42/n','I4/m','I41/a','P422','P4212','P4122','P41212','P4222','P42212','P4322','P43212','I422','I4122','P4mm','P4bm','P42cm','P42nm','P4cc','P4nc','P42mc','P42bc','I4mm','I4cm','I41md','I41cd','P-42m','P-42c','P-421m','P-421c','P-4m2','P-4c2','P-4b2','P-4n2','I-4m2','I-4c2','I-42m','I-42d','P4/mmm','P4/mcc','P4/nbm','P4/nnc','P4/mbm','P4/mnc','P4/nmm','P4/ncc','P42/mmc','P42/mcm','P42/nbc','P42/nnm','P42/mbc','P42/mnm','P42/nmc','P42/ncm','I4/mmm','I4/mcm','I41/amd','I41/acd','P3','P31','P32','R3','P-3','R-3','P312','P321','P3112','P3121','P3212','P3221','R32','P3m1','P31m','P3c1','P31c','R3m','R3c','P-31m','P-31c','P-3m1','P-3c1','R-3m','R-3c','P6','P61','P65','P62','P64','P63','P-6','P6/m','P63/m','P622','P6122','P6522','P6222','P6422','P6322','P6mm','P6cc','P63cm','P63mc','P-6m2','P-6c2','P-62m','P-62c','P6/mmm','P6/mcc','P63/mcm','P63/mmc','P23','F23','I23','P213','I213','Pm-3','Pn-3','Fm-3','Fd-3','Im-3','Pa-3','Ia-3','P432','P4232','F432','F4132','I432','P4332','P4132','I4132','P-43m','F-43m','I-43m','P-43n','F-43c','I-43d','Pm-3m','Pn-3n','Pm-3n','Pn-3m','Fm-3m','Fm-3c','Fd-3m','Fd-3c','Im-3m','Ia-3d'];
