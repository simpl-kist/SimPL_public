// Avoid `console` errors in browsers that lack a console.


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

var NVLScreens = 0; // Number of VL Screens



var VLatoms = function(option){
	var v = this;
	v.that = this;
	v.option = option || { resolution : 8 };
	if(v.option.shadow === undefined) v.option.shadow = false;
	if(v.option.resolution===undefined) v.option.resolution=8;
	//if(v.option.onEscape===undefined) v.option.onEscape="expand";
	if(v.option.step === undefined) v.option.step = { rotate:15, move:1 };
	v.option.camera = v.option.camera || { fov : 3, aspect : 1, near : 1, far : 1<<30 };
	v.option.onUpdate = [];
	v.bondpairs = [];
	v.bondpairs_display = [];

	v.option.onUpdate.push(function(){
		v.Structure.formula = VLatoms.Utils.Structure.toFormula(v.Structure);
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
			target.append("<label><input checked type=checkbox class='bondpair' data-idx="+i+" data-ij="+cp.pair[0]+""+cp.pair[1]+" data-ji="+cp.pair[1]+""+cp.pair[0]+" data-i="+cp.pair[0]+" data-j="+cp.pair[1]+"> "+cp.pair[0]+"-"+cp.pair[1]+"</label>");
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
		var myParentNode =  v.option.wrapper;

	}


	v.option.lightpos=[{x:0,y:0},{x:0,y:0},{x:0,y:0}];
	if(v.option.history === undefined) v.option.history=false;

	v.wrapper = myParentNode.insertBefore(div, this_script);
	v.wrapper.id = "VLScreen" + NVLScreens;
	v.option.backgroundcolor = v.option.backgroundcolor || 0xffffff;



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
	if(v.option.ghosts ===undefined) v.option.ghosts=false;
	if(v.option.ghosts_direction ===undefined) v.option.ghosts_direction=[2,2,2];
	if(v.option.calculate_gofr ===undefined) v.option.calculate_gofr=false;
//	if(v.option.light ===undefined) v.option.light=[false, false, false];
	if(v.option.light ===undefined) v.option.light=[true, true, true];



	v.analysis = {};



//  History button
	//v.wrapper.parentNode.append("<div><img src=img/vis_history.png></div>");
		$(v.wrapper).append("<div id=VLScreen_cellInfo"+NVLScreens+"></div>");
		v.cellInfoWrapper = $('#VLScreen_cellInfo'+NVLScreens);
		v.cellInfoWrapper.css({
			position:"absolute",
			"font-size":"9px"
		});
		$(v.wrapper).append('<div id="VLScreen_selectInfo" style="position: absolute; font-size: 9px; right: 0.5em; top: 0.5em; width: 160px; height: 40px; text-align: right;"></div>');
	if(!v.option.cellInfo){
		v.cellInfoWrapper.hide();
	}

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
		v.renderer  =  new THREE.CangasRenderer(render_option);
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
			"height":40,
			"text-align":"right"
		});
		// Message window
		
		if(v.messageWrapper ===undefined){
			$(v.wrapper).append("<div id=VLScreen_message"+NVLScreens+" class=VLScreen_message><div class='messagebox'></div></div>");
		}
		v.messageWrapper = $("#VLScreen_message"+NVLScreens);
		v.messageWrapper.css({
			width:v.wrapperStyle.width,
			height:v.wrapperStyle.height,
		});
		v.messageWrapper.find(".messagebox").html("Click here to upload structure file <br>or<br>Drop your structure file here!");
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


	v.light=[];
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	v.light.push(new THREE.DirectionalLight(0xffffff,1/3));
	//v.light = new THREE.PointLight( 0xffffff, 1 );

	v.controls = new THREE.TrackballControls( v.camera, v.renderer.domElement );
	v.controls.rotateSpeed  =  1.2;
	v.controls.zoomSpeed  =  1.2;
	v.controls.panSpeed  =  1;
	v.controls.noZoom  =  false;
	v.controls.noPan  =  false;
	v.controls.staticMoving  =  true;
	v.controls.dynamicDampingFactor  =  0.3;
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
				return;
			}
			var la = VLatoms.Math.len(v.Structure.a);
			var lb = VLatoms.Math.len(v.Structure.b);
			var lc = VLatoms.Math.len(v.Structure.c);
			var al = Math.acos( VLatoms.Math.dot(v.Structure.b, v.Structure.c) / lb / lc)*180/Math.PI;
			var be = Math.acos( VLatoms.Math.dot(v.Structure.c, v.Structure.a) / lc / la)*180/Math.PI;
			var gam= Math.acos( VLatoms.Math.dot(v.Structure.a, v.Structure.b) / la / lb)*180/Math.PI;
			var _s = v.IO.selectedAtoms;
			
			var selTxt="";
			if(_s.length>0) selTxt+="Selected : ";
			var selArr={};
			for(var i in _s){
/*console.log('test',i);
console.log('test1',_s);
console.log('test2',v.Structure.atoms);*/
				var element = v.Structure.atoms[_s[i]].element;
				if(selArr[element]===undefined){ selArr[element]=1;}
				else{ selArr[element]++;}
			}
			for(i in selArr){
				selTxt+=i+""+selArr[i]+" ";
			}
			var innerhtml="";
				innerhtml+="Atoms : "+v.Structure.atoms.length+"<br>";
				innerhtml+="a,b,c (&#8491;) : "+la.toFixed(2)+", ";
				innerhtml+=lb.toFixed(2)+", ";
				innerhtml+=lc.toFixed(2)+"<br>";
				innerhtml+="&alpha;,&beta;,&gamma; (&deg;) : "+al.toFixed(2)+", ";
				innerhtml+=be.toFixed(2)+", ";
				innerhtml+=gam.toFixed(2)+"<br>";
				innerhtml+=selTxt;
			_t.html(innerhtml);

		},
		selectInfo : function(){
//			v.option.selectInfo = !v.option.selectInfo;
		   $("#VLScreen_selectInfo").empty();   
		   if(!v.option.selectInfo){
			  return;
		   }
		   if(v.IO.selectMode!="none"){
			  switch(v.IO.selectMode){
				 case 'atom':
					$("#VLScreen_selectInfo").html("Select mode - Single<br>");
					break;
				 case 'rect':
					$("#VLScreen_selectInfo").html("Select mode - Rectangular<br>");
					break;
				 case 'circ':
					$("#VLScreen_selectInfo").html("Select mode - Circle<br>");
					break;
				 case 'element':
					$("#VLScreen_selectInfo").html("Select mode - Element<br>");
					break;
			  }
			  if(v.ctlPressed===true){
				 $("#VLScreen_selectInfo").append('Reverse<br>');
			  }
			  var _selected_atoms=[];
			  v.IO.selectedAtoms.forEach(function(_atom){ 
				 for(var i=0;i<_selected_atoms.length;i++){
					if(_selected_atoms[i].element == v.Structure.atoms[_atom].element){
					   _selected_atoms[i].count+=1;
					   return;
					  }
				  }
				 _selected_atoms.push({"element":v.Structure.atoms[_atom].element,"count":1});
			  })
			  var ih="";
			  for(var i=0;i<_selected_atoms.length;i++){
				 ih+=_selected_atoms[i].element +"="+ _selected_atoms[i].count+", ";
			  }
			  _ih=ih.substr(0,ih.length-2);
			  if(_ih!=""){
				 $("#VLScreen_selectInfo").append(_ih);
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
		},
		atomPosition : function(newStructure){
			var ns = newStructure;
				for(var i=0;i<ns.atoms.length;i++){
					var ca = ns.atoms[i];
					v.Structure.atoms[i].x = ca.x;
					v.Structure.atoms[i].y = ca.y;
					v.Structure.atoms[i].z = ca.z;
					if(v.option.atoms){
						v.atomMeshes[i].position.set( ca.x*1, ca.y*1, ca.z*1 );
						v.set.toSceneCenter(v.atomMeshes[i]);
					}
				}
			v.update.bondsChanged=true;
			for(var i=0;i<v.option.onUpdate.length;i++){
				v.option.onUpdate[i]();
			}

		},
		atom : function(){
				v.draw.Cell();
				v.draw.Axis();
// 예전의 drawatom
				v.clear.atomsInScene();
				v.update.atomsChanged = false;
				if(!v.option.atoms) return;
				var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0x666666, shininess : 100, color : 0xff0000 });
				//var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0xffffff, shininess : 10, color : 0xff0000 });
				//var material = new THREE.MeshLambertMaterial({ reflectivity : 1.00 ,specular : 0x000000, shininess : 10, color : 0xff0000 });
				var ca, tmpmesh;
				for( var i = 0 ; i < v.natoms() ; i++ ){
					ca = v.Structure.atoms[i];
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
				if(v.natoms() == 0 )
				{
				v.messageWrapper.show();
				}else{
				v.messageWrapper.hide();
				}
				if(v.option.ghosts) v.update.ghosts();
				v.update.cellInfo();
				v.update.selectInfo();
				for(var i=0;i<v.option.onUpdate.length;i++){
					v.option.onUpdate[i]();
				}

			},
		ghosts : function(){
			var material = new THREE.MeshPhongMaterial({ reflectivity : 1.00 ,specular : 0xffffff, shininess : 100, color : 0xff0000, opacity:0.5 ,transparent : true});
			var ca, tmpmesh;
			var gidx = 0;
			var nghosts=v.option.ghosts_direction;
			for(var xx=0;xx<nghosts[0];xx++){
				for(var yy=0;yy<nghosts[1];yy++){
					for(var zz=0;zz<nghosts[2];zz++){
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
			if(args.gofr === undefined) args.gofr = false;
			var epsinv = 1/4*3.1415926535*0.1;
			if(!v.option.bonds){
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

			v.update.bin(); // Update bin indicies
			console.log(v.Structure.atoms.length+"!!");
			console.log(v.bondpairs_display);
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

					cutoff = ( atomi_r + atomj_r ) * 1.1;//1.005;
					if(v.option.calculate_gofr || args.gofr){
						var resol = 0.05;
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
		NeighsChildren : function( binarr ){
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
			for(var i=0;i<v.Axis.length;i++){
				v.scene.add(v.Axis[i]);

				v.set.toSceneCenter( v.Axis[i] );
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
	v.animate = function(){

		/* if Something changed on Scene (new atom, delete atom, move...) */
		if( v.update.atomsChanged ){
			v.update.atom();
			for(var i=0;i<v.option.onUpdate.length;i++){
				v.option.onUpdate[i]();
			}
		}
		if( v.update.bondsChanged ){
			v.update.bond();
		}


		requestAnimationFrame(v.animate);

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
			carr = VLatoms.Math.rotateA(refarr,carr,v.option.lightpos[i].x);
			carr = VLatoms.Math.rotateA(uparr,carr,v.option.lightpos[i].y);
		

			//v.light.position.set( v.camera.up.x, v.camera.up.y, v.camera.up.z );
			v.light[i].position.set( carr[0]*CX, carr[1]*CX, carr[2]*CX);
			}


		v.renderer.render( v.scene, v.camera );
	}
	v.axisView = function(direction){
		var camRange = v.camera.position.length();
		var _sAxis=[[1,0,0],[0,1,0],[0,0,1]];
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
				camPos = _sAxis[0];
				checkUp = math.equal(nowUp, _sAxis[2]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[0], _sAxis[1]);
				} else {
					camUp = _sAxis[2];
				}
			break;
			case "y":
				camPos = _sAxis[1];
				checkUp = math.equal(nowUp, _sAxis[0]);
				if(checkUp[0]&&checkUp[1]&&checkUp[2]){
					camUp = math.cross(_sAxis[1], _sAxis[2]);
				} else {
					camUp = _sAxis[0];
				}
			break;
			case "z":
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
		v.camera.position.multiplyScalar(camRange);
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
			return v.Structure.atoms.length;
		},
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
		end : [ -1, -1],
		init : function(){
			console.log(VLATOMS_PATH);
			// Drag and Drop
			v.wrapper.addEventListener('dragover', v.IO.dragOver ,false);
			v.wrapper.addEventListener('drop', v.IO.drop ,false);
			v.wrapper.addEventListener('contextmenu', v.IO.contextMenu ,false);
			document.addEventListener('mousedown', v.IO.mouseDown ,false);
			document.addEventListener('mouseup', v.IO.mouseUp ,false);
			document.addEventListener('mousemove', v.IO.mouseMove ,false);
			//v.wrapper.addEventListener('mouseup', v.IO.mouseUp ,false);
			//v.wrapper.addEventListener('mousemove', v.IO.mouseMove ,false);
			v.shiftPressed=false;
			v.spacePressed=false;
			v.altPressed=false;
			v.ctlPressed=false;

			v.IO.initKey();
			v.IO.generateCtxMenu();
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
				ctxmenu+="<div id=VLAtomsCtx"+randno+" class=VLMessage style='width:285px;'><table class=VLMTable style='height:100%;'>";
//				ctxmenu+="<thead class=VLMHeader><tr><td>Display Config</td></tr></thead>";
				ctxmenu+="<tbody class=VLMBody><tr><td>";
		ctxmenu+="<ul class='nav nav-tabs' role=tablist>";
		ctxmenu+="<li role=presentation class=active><a href=#VLCtx"+randno+"_display aria-controls=VLCtx"+randno+"_display role=tab data-toggle=tab>Display</a></li>";
		ctxmenu+="<li role=presentation><a href=#VLCtx"+randno+"_measure aria-controls=VLCtx"+randno+"_measure role=tab data-toggle=tab>Measure</a></li>";
		ctxmenu+="</ul>";

		ctxmenu+="<div class=tab-content>";
//Display
			ctxmenu+="<div role=tabpanel class='tab-pane active' id=VLCtx"+randno+"_display style='line-height:35px;'>";
				ctxmenu+="<div class=form-inline><span class=disp_option style='display: inline-block;margin-left: 16px;width: 95px;'>Download</span>";
				ctxmenu+="<a class='disp_download' href=javascript:; data-type='cif' style='display:inline-block; margin:0 5px;'>CIF</a>";
				ctxmenu+="<a class='disp_download' href=javascript:; data-type='vasp' style='display:inline-block; margin:0 5px;'>VASP</a>";
				ctxmenu+="</div>";
				ctxmenu+="<div class=form-inline><span data-option='backgroundcolor' style='margin-left:16px;display:inline-block;'><label style='width:95px;'><a href=javascript:;>Background </a></label></span>";
				ctxmenu+="<input class='form-control jscolor backgroundcolor' style='width:130px;' type=text value='"+v.option.backgroundcolor.toString(16)+"'></div>";
				ctxmenu+="<div class=form-inline><span class='disp_option_toggle disp_toggle_swt' data-option='perspective' style='display:inline-block;'><label style='width:95px;'><a href=javascript:;>Perspective</a></label></span>";
				ctxmenu+="<input class='form-control fov' style='width:130px;' type=range min=1 max=90 value="+v.camera.fov+"></div>";
				ctxmenu+="<div class=form-inline><span class='disp_option_toggle disp_toggle_swt ' data-option='atoms' style='display:inline-block;'><label style='width:95px;'><a href=javascript:;>Atom</a></label></span>";
				ctxmenu+="<input class='form-control atom_radius' style='width:130px;' type=range min=0.01 step=0.01 max=2 value="+v.option.radius.atom+"></div>";
				ctxmenu+="<div class=form-inline><span class='disp_option_toggle disp_toggle_swt' data-option='bonds' style='display:inline-block;'><label style='width:95px;'><a href=javascript:;>Bond</a></label></span>";
				ctxmenu+="<input class='form-control bond_radius' style='width:130px;' type=range min=0.01 step=0.01 max=1 value="+v.option.radius.bond+"></div>";
				ctxmenu+="<div style='padding-left:95px;' class='bondpairs'></div>";
				ctxmenu+="<div class=row><div class=col-xs-6><span class='disp_option_toggle disp_toggle_swt' data-option='cell'><a href=javascript:;>Cell</a></span>";
				ctxmenu+="<span class='disp_option_toggle disp_toggle_swt' data-option='cellInfo'><a href=javascript:;>Cell Info</a></span></div>";
				ctxmenu+="<div class=col-xs-6><span class='disp_option_toggle disp_toggle_swt' data-option='axis'><a href=javascript:;>Axis</a></span>";
				ctxmenu+="<span class='disp_option_toggle disp_toggle_swt' data-option='selectInfo'><a href=javascript:;>Select Info</a></span>";
				ctxmenu+="</div></div>";
				ctxmenu+="<div class=row><div class=col-xs-12><span style='display:inline-block;width:115px;' class='disp_option_toggle disp_toggle_swt' data-option='ghosts'><a href=javascript:;>Ghosts</a></span>";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=x>x ";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=y style='margin-left:10px;'>y ";
				ctxmenu+="<input type=checkbox data-option='ghosts_direction' class='disp_toggle_swt ghosts_direction' checked value=z style='margin-left:10px;'>z ";
				ctxmenu+="</div></div>";
//				ctxmenu+="<span class='disp_option' style='margin-left:16px;' data-option=''><a href=javascript:;>Lights</a></span>";
				/*	schan	*/
				ctxmenu+='<div class="form-inline" data-lightnumber="1">';
				ctxmenu+='  <span class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='     <label style="width:67px;">';
				ctxmenu+='        <a href="javascript:;">Light1</a>';
				ctxmenu+='     </label>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-left light" data-arrow="left" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-right light" data-arrow="right" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-top light" data-arrow="top" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-bottom light" data-arrow="bottom" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
				ctxmenu+='	<input class="form-control light" style="width:72px;" type="range" min="0.01" max="1.5" value="0.3" step="0.01">';
				ctxmenu+='</div>';
				ctxmenu+='<div class="form-inline" data-lightnumber="2">';
				ctxmenu+='  <span class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='     <label style="width:67px;">';
				ctxmenu+='        <a href="javascript:;">Light2</a>';
				ctxmenu+='     </label>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-left light" data-arrow="left" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-right light" data-arrow="right" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-top light" data-arrow="top" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-bottom light" data-arrow="bottom" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
				ctxmenu+='	<input class="form-control light" style="width:72px;" type="range" min="0.01" max="1.5" value="0.3" step="0.01">';
				ctxmenu+='</div>';
				ctxmenu+='<div class="form-inline" data-lightnumber="3">';
				ctxmenu+='  <span class="disp_option_toggle disp_toggle_swt" data-option="light" style="display:inline-block;">';
				ctxmenu+='     <label style="width:67px;">';
				ctxmenu+='        <a href="javascript:;">Light3</a>';
				ctxmenu+='     </label>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-left light" data-arrow="left" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-right light" data-arrow="right" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
				ctxmenu+='  <span style="margin-right:0.5em">';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-top light" data-arrow="top" aria-hidden="true"></span>';
				ctxmenu+='  <span class="glyphicon glyphicon-triangle-bottom light" data-arrow="bottom" aria-hidden="true"></span>';
				ctxmenu+='  </span>';
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
					ctxmenu+="<div class=form-group>";
						ctxmenu+="<label style='width:72px;text-align:right;margin-right:3px;'>";
						ctxmenu+="Distance : ";
						ctxmenu+="</label>";
						ctxmenu+="<input type=text class='form-control VLCtx_distance' placeholder='Click here to pick atoms' style='width:180px;'>";
					ctxmenu+="</div>";
					ctxmenu+="<div class=form-group>";
						ctxmenu+="<label style='width:72px;text-align:right;margin-right:3px;'>";
						ctxmenu+="Angle : ";
						ctxmenu+="</label>";
						ctxmenu+="<input type=text class='form-control VLCtx_angle' placeholder='Click here to pick atoms'>";
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


			$('#VLAtomsCtxDefaultBtn'+randno).click(function(){  v.IO.ctxMenuCfg.load({cfgList:v.IO.ctxMenuCfg.defaultCtxOption}); });

			$('#VLAtomsCtxCloseBtn'+randno).click(function(){  v.ctxMenu.hide(); });
			v.ctxMenu = $('#VLAtomsCtx'+randno);
			var dispOptions = ['perspective', 'atoms', 'bonds', 'cell', 'cellInfo', 'axis', 'ghosts'];
			for(var i in dispOptions){
				var key=dispOptions[i]; 
				if(!v.option[key]){
					v.ctxMenu.find('.disp_option_toggle[data-option="'+key+'"]').addClass("toggle_off");
				}
			}
			v.ctxMenu.draggable({
				drag:function(){
					$(this).css("height","auto");
				}
			});
			v.ctxMenu.css({
				"position":"absolute",
				"background-color":"white",
				"left":0,
				"top":0,
			});
			//Bind Download btns
			$(v.ctxMenu).find(".disp_download").click(function(){
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
			$(v.ctxMenu).find(".VLCtx_distance").click(function(){
				var _t = $(this);
				function distCallback(){
					switch(v.IO.selectedAtoms.length){
						case 2:
							var a1 = v.Structure.atoms[v.IO.selectedAtoms[0]];
							var a2 = v.Structure.atoms[v.IO.selectedAtoms[1]];
							var dist = VLatoms.Math.dist([a1.x, a1.y, a1.z],[a2.x, a2.y, a2.z]);
							_t.val(dist.toFixed(3)+" Å");
//							v.IO.selectedAtoms = [];
							v.IO.selectMode="none";
							v.IO.customSelectCallback.remove("distCallback");
						break;
						case 1:
							_t.val("Please select 1 more atom");
						break;
						case 0:
							_t.val("");
							v.IO.restoreAtomsColor();
							v.IO.highlightSelectedAtoms();
						break;
					}
				}
				if(!v.IO.customSelectCallback.exist("distCallback")) v.IO.customSelectCallback.list.push(distCallback);
				v.IO.exitSelectMode();
				_t.val("Please select two atoms");
				v.IO.selectMode="atom";
			});
			$(v.ctxMenu).find(".VLCtx_angle").click(function(){
				var _t = $(this);
				function angleCallback(){
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
//							v.IO.selectedAtoms = [];
							v.IO.selectMode="none";
							v.IO.customSelectCallback.remove("angleCallback");
						break;
						case 2:
							_t.val("Please select 1 more atom");
						break;
						case 1:
							_t.val("Please select 2 more atoms");
							v.IO.restoreAtomsColor();
							v.IO.highlightSelectedAtoms();
						break;
					}
				}
				if(!v.IO.customSelectCallback.exist("angleCallback")) v.IO.customSelectCallback.list.push(angleCallback);
				v.IO.exitSelectMode();
				_t.val("Please select three atoms");
				v.IO.selectMode="atom";
			});
			v.ctxMenu.hide();
//			v.IO.initializeLightPos();	//LightPos was deprecated. - schan
			v.IO.bindLightPos();
			v.ctxMenu.find(".backgroundcolor").change(function(){
				v.renderer.setClearColor(parseInt("0x"+$(this).val()));
			});
			v.ctxMenu.find(".fov").on("input change",function(){
				v.camera.fov=$(this).val()*1;
				v.camera.updateProjectionMatrix();
				v.setOptimalCamPosition();
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
			});
			v.ctxMenu.find(".bond_radius").on("input change",function(){
				
				v.option.radius.bond = $(this).val()*1;
//				console.log(v.option.radius.bond,$(this).val()*1);
/*				if(v.option.radius.bond==0){
					v.option.bonds=false;
				}else{
					v.option.bonds=true;
				}*/
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
				v.update.bondsScaleChanged=true;
			});
			v.ctxMenu.find(".light").click(function(){
				var position_step = 10;
				
				var lightNumber = $(this).closest('div').data('lightnumber') - 1;
				var arrow = $(this).data('arrow');	//find('.gliphicon-triangle-left').length);
				switch(arrow){
					case "left":
							if(v.option.lightpos[lightNumber].y - position_step < -90){
									v.option.lightpos[lightNumber].y = -90;
							} else {
									v.option.lightpos[lightNumber].y -= position_step;
							}
					break;
					case "right":
							if(v.option.lightpos[lightNumber].y + position_step > 90){
									v.option.lightpos[lightNumber].y = 90;
							} else {
									v.option.lightpos[lightNumber].y += position_step;
							}
					break;
					case "top":
							if(v.option.lightpos[lightNumber].x - position_step < -90){
									v.option.lightpos[lightNumber].x = -90;
							} else {
									v.option.lightpos[lightNumber].x -= position_step;
							}
					break;
					case "bottom":
							if(v.option.lightpos[lightNumber].x + position_step > 90){
									v.option.lightpos[lightNumber].x = 90;
							} else {
									v.option.lightpos[lightNumber].x += position_step;
							}
					break;
					case "selectInfo":
							v.option.selectInfo=!v.option.selectInfo;
					break;
				}
			});
			v.ctxMenu.find(".light.form-control").on("input change",function(){
				var lightNumber = $(this).closest('div').data('lightnumber') - 1;
				v.light[lightNumber].intensity = $(this).val()*1;
			});
			$(v.ctxMenu).unbind();
			$(v.ctxMenu).bind("click",function(){
				v.IO.ctxMenuCfg.save();
			});
			$(v.ctxMenu).bind("change",function(){
				v.IO.ctxMenuCfg.save();
			});


		},
		ctxMenuCfg : {
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
					"v.option.atoms":v.option.atoms,
					"v.option.bonds":v.option.bonds,
					"$('.atom_radius').val()":$('.atom_radius').val(),
					"$('.bond_radius').val()":$('.bond_radius').val(),
					"$('.fov').val()":$('.fov').val(),
					"v.option.cell":v.option.cell,
					"v.option.cellInfo":v.option.cellInfo,
					"v.option.selectInfo":v.option.selectInfo,
					"v.option.axis":v.option.axis,
					"v.option.ghosts":v.option.ghosts,
					"v.option.ghosts_direction[0]":v.option.ghosts_direction[0],
					"v.option.ghosts_direction[1]":v.option.ghosts_direction[1],
					"v.option.ghosts_direction[2]":v.option.ghosts_direction[2],
					"v.option.light[0]":v.option.light[0],
					"v.option.light[1]":v.option.light[1],
					"v.option.light[2]":v.option.light[2],
					"v.light[0].intensity":$('.disp_option_toggle[data-option="light"]').parent('[data-lightnumber="1"]').find('input').val(),
					"v.light[1].intensity":$('.disp_option_toggle[data-option="light"]').parent('[data-lightnumber="2"]').find('input').val(),
					"v.light[2].intensity":$('.disp_option_toggle[data-option="light"]').parent('[data-lightnumber="3"]').find('input').val(),
					"v.option.lightpos[0]":v.option.lightpos[0],
					"v.option.lightpos[1]":v.option.lightpos[1],
					"v.option.lightpos[2]":v.option.lightpos[2],
					"_ghostDirection":ghostDirection,
				}

				setCookie(v.IO.ctxMenuCfg.storeName,JSON.stringify(ctxOption))

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
				//값 불러오기 끝

				//값 배분
				v.ctxMenu.find(".backgroundcolor").val(ctx_Option["v.ctxMenu.find('.backgroundcolor').val()"]);
//				v.option.perspective=ctx_Option['v.option.perspective'];
				$('.fov').val(ctx_Option["$('.fov').val()"]);
//				v.option.atoms=ctx_Option['v.option.atoms'];
				$('.atom_radius').val(ctx_Option["$('.atom_radius').val()"]);
//				v.option.radius.atom=ctx_Option["$('.atom_radius').val()"];
//				v.option.bonds=ctx_Option['v.option.bonds'];
				$('.bond_radius').val(ctx_Option["$('.bond_radius').val()"]);
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
				v.option.light[0]=ctx_Option['v.option.light[0]'];
				v.option.light[1]=ctx_Option['v.option.light[1]'];
				v.option.light[2]=ctx_Option['v.option.light[2]'];
				v.light[0].intensity=ctx_Option['v.light[0].intensity'];
				v.light[1].intensity=ctx_Option['v.light[1].intensity'];
				v.light[2].intensity=ctx_Option['v.light[2].intensity'];
				for(var i=0;i<3;i++){
					var _dimension=['x','y'];
					for(var j in _dimension){v.option.lightpos[i][_dimension[j]]=ctx_Option['v.option.lightpos['+i+']'][_dimension[j]];
					}
				}
				//값 배분 완료

				//값 적용(구조 로딩 전)
				v.ctxMenu.find(".backgroundcolor").change();

				var toggleOption=['perspective','atoms','bonds','cell','cellInfo','selectInfo','axis', 'ghosts'];
				for(var i=0;i<toggleOption.length;i++){
					var tmp="v.option."+toggleOption[i];
					var toggle = !$('.disp_option_toggle[data-option='+toggleOption[i]+']').hasClass("toggle_off");
					if(ctx_Option[tmp] !== toggle){
						v.ctxMenu.find('.disp_toggle_swt[data-option='+toggleOption[i]+']').click();
					}
				}
				var targetLight=$('.disp_option_toggle[data-option=light]');
				for(var i=0;i<3;i++){
					$('.disp_option_toggle[data-option="light"]').parent('[data-lightnumber='+(i+1)+']').find('input').val(ctx_Option['v.light['+i+'].intensity']);
					if(ctx_Option["v.option.light["+i+"]"]){
						if($(targetLight[i]).hasClass("toggle_off")){
							$(targetLight[i]).removeClass("toggle_off");
							$(targetLight[i]).closest('div').find('.light').show();
						}
					}else{
						$(targetLight[i]).addClass("toggle_off");
						v.light[i].intensity = 0;
						$(targetLight[i]).closest('div').find('.light').hide();
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
				$('.fov').change();
				$('.atom_radius').change();
				$('.bond_radius').change();
				//적용완료
			},
			defaultCtxOption:{
					"v.ctxMenu.find('.backgroundcolor').val()":"ffffff",
					"v.option.perspective":true,
					"v.option.atoms":true,
					"v.option.bonds":true,
					"$('.atom_radius').val()":0.6,
					"$('.bond_radius').val()":0.1,
					"$('.fov').val()":3,
					"v.option.cell":true,
					"v.option.cellInfo":true,
					"v.option.selectInfo":true,
					"v.option.axis":true,
					"v.option.ghosts":false,
					"v.option.ghosts_direction[0]":2,
					"v.option.ghosts_direction[1]":2,
					"v.option.ghosts_direction[2]":2,
					"v.option.light[0]":true,
					"v.option.light[1]":true,
					"v.option.light[2]":true,
					"v.light[0].intensity":1/3,
					"v.light[1].intensity":1/3,
					"v.light[2].intensity":1/3,
					"v.option.lightpos[0]":{x:0,y:0},
					"v.option.lightpos[1]":{x:0,y:0},
					"v.option.lightpos[2]":{x:0,y:0},
					"_ghostDirection":['x','y','z'],
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
					case "atoms":
						v.option.atoms=!v.option.atoms;
						if(v.option.atoms){
							v.ctxMenu.find(".atom_radius").show();
						}else{
							v.ctxMenu.find(".atom_radius").hide();
						}
					break;
					case "bonds":
						v.option.bonds=!v.option.bonds;
						if(v.option.bonds){
							v.ctxMenu.find(".bond_radius").show();
						}else{
							v.ctxMenu.find(".bond_radius").hide();
						}
					break;
					case "cell":
						v.option.cell=!v.option.cell;
					break;
					case "cellInfo":
						v.option.cellInfo=!v.option.cellInfo;
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
					//schan made 'case light'.
					case "light":
//console.log($(this).find('a').text().replace("Light","")*1 - 1);
						var lightNumber;
						lightNumber = $(this).closest('div').data('lightnumber') - 1;
						v.option.light[lightNumber] = !v.option.light[lightNumber];
						if (!v.option.light[lightNumber]){
								v.light[lightNumber].intensity = 0;
//								$(this).find('.light').hide();
								$(this).closest('div').find('.light').hide();
						} else {
//								$(this).find('.light').show();
								$(this).closest('div').find('.light').show();
								v.light[lightNumber].intensity = $(this).closest('div').find('input').val()*1;
						}
					break;
				}
				if($(this).hasClass("disp_option_toggle")){
					if($(this).hasClass("toggle_off")){
						$(this).removeClass("toggle_off");
					}else{
						$(this).addClass("toggle_off");
					}
				}

				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
			});
			v.ctxMenu.find('.toggle_ghosts').click(function(){
				v.option.ghosts=!v.option.ghosts;
				v.update.atomsChanged=true;
				v.update.bondsChanged=true;
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
						case 87: // w
							v.manipulateAtom.move({direction:"vy",step:v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 65: //a
							v.manipulateAtom.move({direction:"vx",step:-v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 68: // d
							v.manipulateAtom.move({direction:"vx",step:v.option.step.move,onEscape:v.option.onEscape});	
						break;
						case 83: // s
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
						v.ctxMenu.css("z-index",$.topZIndex()+1);
					}
					


		},
		restoreAtomsColor : function(){
			for(var idx in v.Structure.atoms){
				var ca = v.Structure.atoms[idx];
				try{
					v.atomMeshes[idx].material.color.setHex(ca.color);	
				}catch(e){
				}
			}
		},
		highlightSelectedAtoms : function(){
			 if(v.IO.selectedAtoms.length != 0){
				 for(var i=0;i<v.IO.selectedAtoms.length;i++){
					 var ca_idx = v.IO.selectedAtoms[i];
					 v.atomMeshes[ca_idx].material.color.setHex('0x0000ff');
				 }
			 }
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
						v.Manipulate.addHistory({
							mode:"File Load",
							args:{},
							Structure:objClone(v.Structure),

						});

						v.setOptimalCamPosition();
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
			var msg= "<div style='padding-left:15px;padding-top:15px;'><div class=form-horizontal><div class='form-group'><label class=col-xs-8>File Type</label><div class=col-xs-16><select class=form-control disabled>";
				msg+= "<option value=-1>Auto</option>";
				msg+= "</select></div></div></div>"
				msg+= "<div class=form-horizontal><div class=form-group><label class=col-xs-8>File</label><div class=col-xs-16>";
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
			}
		},
		mouseDown : function( e ){
			if(["text","textarea","select","radio"].indexOf(e.target.nodeName.toLocaleLowerCase())>=0){
				v.IO.selecting=false;
				return;
			}
			v.IO.start = [ e.pageX, e.pageY ]
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
			}
			
		},
		contextMenu : function ( e ){
				v.IO.showCtxMenu(e);
		},
		mouseUp : function( e ){
console.log('enter up');
			if(!v.IO.selecting){
				return;
			}
console.log('enter up2');
		
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
			if(v.spacePressed) return;
			if(v.IO.selectMode=='none') return;
			if(v.IO.selectMode=='atom' && e.target.nodeName.toLocaleLowerCase() != "canvas"){
				return;
			} 
			v.IO.selecting=false;
			v.controls.enabled=true;
			$('#select_guide').remove();
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
			v.IO.customSelectCallback.run();
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
		customSelectCallback : { 
			list : [], //Array of functions
			run : function(){
				for(var i=0; i < v.IO.customSelectCallback.list.length; i++){
					v.IO.customSelectCallback.list[i](v);
				}
			},
			remove : function(functionName){
				var target = -1;
				for (var i in v.IO.customSelectCallback.list){
					if(v.IO.customSelectCallback.list[i].name == functionName){
							target = i;
					}
				}
				if(target !== -1){
					v.IO.customSelectCallback.list.splice(target,1);
				}
			},
			exist : function(functionName){
				for (var i in v.IO.customSelectCallback.list){
					if(v.IO.customSelectCallback.list[i].name == functionName){
							return true;
					}
				}
				return false;
			}
		},
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
			}
			v.IO.customSelectCallback.run();
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
						console.log(posFract);
						for(var i=0;i<3;i++){
							posFract[i]=posFract[i]-Math.floor(posFract[i]);	
						}
						console.log(posFract);
						posCart = VLatoms.Math.vecdotmat(posFract,latMat);
						ca.x = posCart[0];
						ca.y = posCart[1];
						ca.z = posCart[2];

						v.update.atomsChanged=true;
						v.update.bondsChanged=true;
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
		},
		appendToCenter : function(atoms,_option){		//구조를 대상 셀 중심에 옮겨서 구조가 셀에 들어가는지 검사, atoms와 cell은 v.Sturcture에서 쓰이는 형식
			//이 함수를 우선 실행하고 이후 그 구조를 옮기는 방식으로 임의의 지점에 분자를 놓을 수 있도록 수정할 것.
			var option = {
				historyTitle : 'add to center',
			};
			if(_option !== undefined){
				for(var i in _option) option[i] = _option[i];
			}
			//2. 최대최소확인 (중심위치확인)
			var _maxx = atoms[0].x;
			var _maxy = atoms[0].y;
			var _maxz = atoms[0].z;
			var _minx = atoms[0].x;
			var _miny = atoms[0].y;
			var _minz = atoms[0].z;
			for(var i = 1; i < atoms.length; i++){
					if(_maxx > atoms[i].x) _maxx = atoms[i].x;
					if(_maxy > atoms[i].y) _maxy = atoms[i].y;
					if(_maxz > atoms[i].z) _maxz = atoms[i].z;
					if(_minx < atoms[i].x) _minx = atoms[i].x;
					if(_miny < atoms[i].y) _miny = atoms[i].y;
					if(_minz < atoms[i].z) _minz = atoms[i].z;
			}
			var cen = [];
			cen[0] = (_maxx + _minx) / 2;
			cen[1] = (_maxy + _miny) / 2;
			cen[2] = (_maxz + _minz) / 2;
			var cenCell = [];
			cenCell[0] = (v.Structure.a[0] + v.Structure.b[0] + v.Structure.c[0]) / 2;
			cenCell[1] = (v.Structure.a[1] + v.Structure.b[1] + v.Structure.c[1]) / 2;
			cenCell[2] = (v.Structure.a[2] + v.Structure.b[2] + v.Structure.c[2]) / 2;

			//3.보정할 값 찾음
			var testAtom = [];
			for(var i=0; i < atoms.length; i++){	//testAtom은 구조 중심과 셀 중심이 일치하도록 이동한 구조[x,y,z,Element]
					testAtom.push(new VLatoms.Atom(atoms[i].x + cenCell[0] - cen[0], atoms[i].y + cenCell[1] - cen[1], atoms[i].z + cenCell[2] - cen[2], atoms[i].element));
			}
			var retVec = v.Manipulate.insideTest(testAtom,{findSize:true}); //이동한게 셀에 들어가는지 테스트
			for(var i = 3; i < 6; i++){
					retVec.delta[i] -= 1;	//늘려야 하는 값만 남게 1 빼기
			}
			//셀을 충분히 늘렸을 때 구조를 중심에 맞추면 들어가도록 구조 위치 추가 이동, 이걸 위해 이동값 탐색(구조 중심은 늘어난 셀 크기의 절반만큼 이동 필요)
			var deltaVec = [];
			deltaVec[0] = (retVec.delta[3] + retVec.delta[0]) / 2;
			deltaVec[1] = (retVec.delta[4] + retVec.delta[1]) / 2;
			deltaVec[2] = (retVec.delta[5] + retVec.delta[2]) / 2;
			var deltaPos = [];
			deltaPos[0] = deltaVec[0]*v.Structure.a[0] + deltaVec[1]*v.Structure.b[0] + deltaVec[2]*v.Structure.c[0];
			deltaPos[1] = deltaVec[0]*v.Structure.a[1] + deltaVec[1]*v.Structure.b[1] + deltaVec[2]*v.Structure.c[1];
			deltaPos[2] = deltaVec[0]*v.Structure.a[2] + deltaVec[1]*v.Structure.b[2] + deltaVec[2]*v.Structure.c[2];

			//4.보정된 위치로 구조 이동
			var _newPos = [];
			_newPos[0] = cenCell[0] - cen[0] - deltaPos[0];
			_newPos[1] = cenCell[1] - cen[1] - deltaPos[1];
			_newPos[2] = cenCell[2] - cen[2] - deltaPos[2];
			testAtom = [];
			for(var i=0;i<atoms.length;i++){
					testAtom.push(new VLatoms.Atom(atoms[i].x + _newPos[0], atoms[i].y + _newPos[1], atoms[i].z + _newPos[2], atoms[i].element));
			}

			//5.insidetest후 vacuum, selectMode가 꺼져있을 경우를 atom으로 바꿈
			var retInside = v.Manipulate.insideTest(testAtom);
			if(!retInside.inside){
					if(confirm("The Cell should be expanded to add the atom(s).")){
							for(var i=0;i<atoms.length;i++){
									v.Structure.atoms.push( new VLatoms.Atom(atoms[i].x + _newPos[0], atoms[i].y + _newPos[1], atoms[i].z + _newPos[2], atoms[i].element));
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
					for(var i=0;i<atoms.length;i++){
							v.Structure.atoms.push( new VLatoms.Atom(atoms[i].x + _newPos[0],atoms[i].y + _newPos[1], atoms[i].z + _newPos[2], atoms[i].element));
							v.IO.selectedAtoms.push(v.Structure.atoms.length-1);
					}	
			}
/*
			v.Manipulate.addHistory({
				mode:option.historyTitle,
				args:{},
				Structure:objClone(v.Structure),
			});
*/
			return true;
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
			v.Manipulate.addHistory({
				mode:"Add Atom(s)",
				args:{direction:direction,step:step},
				Structure:objClone(v.Structure),
			});
			v.setOptimalCamPosition();

		},
		add : function(args){
			console.log('args');
			console.log(args);
			var vdw = args['vdw'] ;
			var mode = args['mode'] ;
			if(mode==="pre"){
				var structure = args['Structure'];	
			}
			var dx = +args['dx'] ;
			var dy = +args['dy'] ;
			var dz = +args['dz'] ;
			var element = args['element'] ;
			var sa = JSON.parse(JSON.stringify(v.IO.selectedAtoms));	// deepcopy로 바꿈
			v.IO.selectedAtoms = []; //selectedAtmos를 sa에 저장했으니 초기화함
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
					if(v.Structure.atoms.length === 0){
						return false;
					} else {
						v.Structure.atoms.push( new VLatoms.Atom(cm[0], cm[1], cm[2], element));
					}
					break;

				case "rel":
					var targetAtoms = [];
					if(v.Structure.atoms.length === 0){
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
						v.Structure.a = [dx*pc, 0, 0];
						v.Structure.b = [0, dy*pc, 0];
						v.Structure.c = [0, 0, dz*pc];
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
/*
 * centerTest로 독립시킴
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
					cenCell[0]=(v.Structure.a[0]+v.Structure.b[0]+v.Structure.c[0])/2;
					cenCell[1]=(v.Structure.a[1]+v.Structure.b[1]+v.Structure.c[1])/2;
					cenCell[2]=(v.Structure.a[2]+v.Structure.b[2]+v.Structure.c[2])/2;
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
					}*/
					break;
					//추가
			}

			if(v.IO.selectMode==="none") v.IO.selectMode = "atom";
			v.update.atomsChanged=true;
			v.update.bondsChanged=true;
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
	console.log('edit3');

			v.update.atomsChanged = true;
			v.update.bondsChanged = true;
			v.Manipulate.addHistory({
				mode:"Manual Edit",
				args:{},
				Structure:objClone(v.Structure)
			});
		},
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
			v.Manipulate.addHistory({
				mode:"Move Atom(s)",
				args:{direction:direction,step:step},
				Structure:objClone(v.Structure),
			});

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

			}
			console.log(ref);
/*		
			uparr = [ v.camera.up.x, v.camera.up.y, v.camera.up.z ]; // ^
			_c = new THREE.Vector3(v.camera.position.x, v.camera.position.y, v.camera.position.z);
			_c.normalize();
			__c = [_c.x, _c.y, _c.z];
			refarr = VLatoms.Math.cross(uparr,__c); // ->
*/
			var step = args.step;//$('#manipulate_rotate_step').val()*1;
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
									v.IO.customSelectCallback.remove("refreshAtomList");
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
				v.IO.customSelectCallback.list.push(refreshAtomList);
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

			}

		}
	},

/* Manipulator */
	v.Manipulate = {
		historyLoaded : -1,
		history : [],
		addHistory : function(historyData){
			if(!v.option.history) return false;
			if(v.Manipulate.history.length === 0 && v.Structure.atoms.length === 0) return false;
			historyData.selectedAtoms = JSON.parse(JSON.stringify(v.IO.selectedAtoms));
			if(v.Manipulate.history.length > 0){
				if(VLatoms.Utils.Structure.compare(v.Structure, v.Manipulate.history[v.Manipulate.history.length - 1].Structure)) { 
console.log(v.Structure, v.Manipulate.history[v.Manipulate.history.length - 1].Structure);
					alert("Nothing has changed.");
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
			v.renderer.render( v.scene, v.camera );
			historyData.Image = v.renderer.domElement.toDataURL("image/png");
			var _idx = v.Manipulate.history.length - 1;
			if(_idx > 0){
				if(historyData.mode == "Move Atom(s)"){
					if(historyData.mode == v.Manipulate.history[_idx].mode
							&& math.deepEqual(historyData.selectedAtoms, v.Manipulate.history[_idx].selectedAtoms)){
						$("#vlv_history_bar>div:last-child").remove();
						v.Manipulate.history.pop();
					}
				}
				if(historyData.mode == "Rotate Atom(s)"){
					if(historyData.mode == v.Manipulate.history[_idx].mode
							&& math.deepEqual(historyData.selectedAtoms, v.Manipulate.history[_idx].selectedAtoms)){
						$("#vlv_history_bar>div:last-child").remove();
						v.Manipulate.history.pop();
					}
				}
			}
			v.Manipulate.history.push(historyData);
			if($('#vlv_history_bar').length == 1){
					var idx = v.Manipulate.history.length - 1;
					$('#vlv_history_bar')
							.append("<div class='history_bar_record' data-historyidx='"+idx+"'><span class='history_bar_record_title'>"
											+v.Manipulate.history[idx].mode
											+"</span><br><img class='history_bar_img' src='"
											+v.Manipulate.history[idx].Image+"'></div>");

					$('#vlv_history_bar').scrollLeft($('#vlv_history_bar')[0].scrollWidth);
					$("#vlv_history_bar>div").eq(idx).unbind();
					$("#vlv_history_bar>div").eq(idx).bind("click",function(){
							v.IO.selectedAtoms = [];
							var ci = $(this).data("historyidx");
							var _structure = v.Manipulate.history[ci].Structure;
							v.Structure = $.extend(true,{},_structure);
							v.update.atomsChanged = true;
							v.update.bondsChanged = true;
					});
			}
			v.Manipulate.callback();
			v.IO.highlightSelectedAtoms();
			//v.setOptimalCamPosition();
		},
		callback : function(){
			if(v.option.manipulateCallback){
				v.option.manipulateCallback(v);
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
				mode:mode,
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
				if(stat.state == 'busy'){
				
				}else if(stat.state == 'finished'){
					var retdata = stat.retarr;
					v.Structure = VLatoms.Utils.redefineStructure(retdata);//TODO Here
					v.update.atomsChanged=true;
					v.update.bondsChanged=true;
					option.callback();
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
			var onEscape = false;		//true 일 경우, 셀은 고정 시키고 벗어난 원자들은 벗어난 위치의 다른 셀에 
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
	        mat[1] = [ uy*uz*(1-cos) + uz*sin, cos+uy*uy*(1-cos), uy*uz*(1-cos)-ux*sin ];
	        mat[2] = [ uz*ux*(1-cos) - uy*sin, uz*uy*(1-cos)+ux*sin, cos+uz*uz*(1-cos) ];
	        return VLatoms.Math.matdotvec(mat,pos);
	    },
    angle : function(v1,v2){
      var v1len = VLatoms.Math.len(v1);
      var v2len = VLatoms.Math.len(v2);
      return Math.acos( VLatoms.Math.dot(v1,v2) / v1len / v2len);
    },
    rad2deg : function(rad){
      return rad*180/Math.PI;
    }
}
VLatoms.Utils = {
	redefineStructure : function(_s){
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
			var _x = +ca.x;
			var _y = +ca.y;
			var _z = +ca.z;
			var _el = ca.element;
			s.atoms.push(new VLatoms.Atom( _x, _y, _z, _el ));
		}
		return s;
	
			
	},
	xyzToArr : function(obj){
		return [obj.x, obj.y, obj.z];
	},
	download : function( filename, contents){
		var tmphtml="<form class=downloader target=_blank method=post action=/simulation/txtDownloader>";
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
	cleaveSurface : function(basis,milIndex,args){
/*
 * test cell
 *  [[0,4.736235,0],
 *  [4.101698,-2.368118,0],
 *  [0,0,13.492372]]
 *  (1,0,4)
 *  output
 *  [[4.101698,-2.368118,0],
 *  [0,-18.944941,13.492372],
 *  [0,-4.736235,0]]
 * */
		if(args===undefined){
			args = [];
		}
		if(args['maxv3length']===undefined){
			args['maxv3length']=50;
		}
		var maxv3length=args['maxv3length'];
console.log('maxv3',maxv3length);
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
//				console.log(nonZeroMilIndices[i]);
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

			break;
		}
		//milIndex :
		var v1 = VLatoms.Math.subtract(p2,p1);
		var v2 = VLatoms.Math.subtract(p3,p1);
		var v3;
		var v1xv2 = VLatoms.Math.cross(v1,v2);
/*
	console.log('nzeros',nzeros);
	console.log('p1~3',p1,p2,p3);
	console.log('v12',v1,v2);
	console.log('v1x2',v1xv2);
*/
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


//	console.log('v3, deg lastT', v3,VLatoms.Math.rad2deg(lastT));


//	console.log(v1,v2);
// Loop
//Find maximally-orthogonal v3 within maximum v3 length
		//var NNv3 = v3.splice(0);
		var NNv3 = v3;
		var pv1,pv2;

		//tol is the tolerance in the angle in the v3. Should be smaller for big
		//cells, bigger for small cells. Default 0.2, adjust as necessary
		var tol = 0.2;
		var v3matrix = [];
		var lenangles=[];
		var millerv3s=[];
		for(var q=1;q<50;q++){
			pv1 = VLatoms.Math.dot( VLatoms.Math.cdotvec(q,NNv3), v1);
			pv2 = VLatoms.Math.dot( VLatoms.Math.cdotvec(q,NNv3), v2);
//			console.log(pv1,pv2,pv1%1,pv2%1);
			if( pv1%1>(1-tol) || pv1%1<tol ){
				if( pv2%1>(1-tol) || pv2%1<tol ){
					//Iterative search for most orthogonal version of this v3
					var done = false;
					var angle = VLatoms.Math.angle(v1xv2,NNv3);
//					console.log(VLatoms.Math.rad2deg( VLatoms.Math.angle( v1xv2, NNv3 )));
					v3 = VLatoms.Math.cdotvec(q,NNv3);
//						console.log(VLatoms.Math.rad2deg(angle) + "DEG");
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


/*	align a-b to x-y
 * 			for(var i = 0; i<basisList.length; i++){
			basisList[i].basis = math.divide(basisList[i].basis,VLatoms.Utils.gram_schmidt_orthonormalization_3d(basisList[i].basis));
			for(var j = 0; j < 3; j++){
				for(var k = 0; k < 3; k++){
					if(basisList[i].basis[j][k] < 1e-7) basisList[i].basis[j][k] = 0;
				}
			}
		}*/
		return basisList;
//		return {"v3matrix":v3matrix,"lenangles":lenangles,"millerv3s":millerv3s,newbasis:[v1,v2,v3matrix[0]]};
	},
	basisTransform : function(orgB,newB,orgPos){
		//var oBInv = math.inv(math.transpose(orgB));
		var oBInv = math.inv(orgB);
		var C = VLatoms.Math.matdotmat(newB, oBInv);
		var v1 = newB[0];
		var v2 = newB[1];
		var v3 = newB[2];

		var millerv1 = VLatoms.Math.matdotvec(oBInv, v1);
		var millerv2 = VLatoms.Math.matdotvec(oBInv, v2);
		var millerv3 = VLatoms.Math.matdotvec(oBInv, v3);
		
		var Sxyz = [[0,0,0],[0,0,0]];
		var M;
//schan change range (0~1 -> -2~2)
		function fill_atoms(fillRange){
console.log('----- range '+fillRange+' -----');
			for(var xx=-fillRange;xx<fillRange;xx++){
				for(var yy=-fillRange;yy<fillRange;yy++){
					for(var zz=-fillRange;zz<fillRange;zz++){
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
//			console.log(Sxyz);
//			console.log(C);
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
//			console.log('C, retAtoms',C, retAtoms);
			retAtoms = math.transpose(math.multiply(math.inv(math.transpose(C)), math.transpose(retAtoms)));
			var NewAtoms = [];
			var tol, XA, XB, XC, XL;
//				tol = 1e-3;
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
		//console.log("newA",NewAtoms);
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
			return {NewAtoms:NewAtoms, NewBasisVol:NewBasisVol, OrigBasisVol:OrigBasisVol};
		}	//end of fill_atoms()
		for(var _range = 2; _range < 7; _range++){
			var fill_atoms_return = fill_atoms(_range);
			var NewAtoms = fill_atoms_return.NewAtoms;
			var NewBasisVol = fill_atoms_return.NewBasisVol;
			var OrigBasisVol = fill_atoms_return.OrigBasisVol;
			if(Math.abs(NewAtoms.length/orgPos.length - NewBasisVol/OrigBasisVol) < 0.0001){
				_range = 100;
			}
		}


		if(Math.abs(NewAtoms.length/orgPos.length - NewBasisVol/OrigBasisVol) >= 0.0001){
			console.warn('EGREGIOUS ERROR, # of NewAtoms inconsistent with size of basis!\nMay need to manually tweak tolerance of atom elimination outside supercell\n');
			console.log(NewAtoms.length, orgPos.length,NewBasisVol,OrigBasisVol);
			console.log(NewAtoms.length/orgPos.length, NewBasisVol/OrigBasisVol, Math.abs(NewAtoms.length/orgPos.length - NewBasisVol/OrigBasisVol));
			return false;
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
			poscar+=la[0]+" "+la[1]+" "+la[2]+"\n";
			poscar+=lb[0]+" "+lb[1]+" "+lb[2]+"\n";
			poscar+=lc[0]+" "+lc[1]+" "+lc[2]+"\n";
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
				poscar+=cp_frac[0]+" "+cp_frac[1]+" "+cp_frac[2]+" \n";
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

// Reference :     TODO
var AtomParam={};
AtomParam['H']={'no':1,'mass':1.00794,'group':1,'period':1,'block':'s','ie':13.598434005136,'oxi_n':[-1,1]};
AtomParam['He']={'no':2,'mass':4.002602,'group':18,'period':1,'block':'s','ie':24.587387936,'oxi_n':[]};
AtomParam['Li']={'no':3,'mass':6.941,'group':1,'period':2,'block':'s','ie':5.391714761,'oxi_n':[1]};
AtomParam['Be']={'no':4,'mass':9.012182,'group':2,'period':2,'block':'s','ie':9.322699,'oxi_n':[1,2]};
AtomParam['B']={'no':5,'mass':10.811,'group':13,'period':2,'block':'p','ie':8.298019,'oxi_n':[-5,-1,1,2,3]};
AtomParam['C']={'no':6,'mass':12.0107,'group':14,'period':2,'block':'p','ie':11.2603,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['N']={'no':7,'mass':14.00674,'group':15,'period':2,'block':'p','ie':14.53413,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['O']={'no':8,'mass':15.9994,'group':16,'period':2,'block':'p','ie':13.618054,'oxi_n':[-2,-1,1,2]};
AtomParam['F']={'no':9,'mass':18.9984032,'group':17,'period':2,'block':'p','ie':17.42282,'oxi_n':[-1]};
AtomParam['Ne']={'no':10,'mass':20.1797,'group':18,'period':2,'block':'p','ie':21.56454,'oxi_n':[]};
AtomParam['Na']={'no':11,'mass':22.98976928,'group':1,'period':3,'block':'s','ie':5.1390767,'oxi_n':[-1,1]};
AtomParam['Mg']={'no':12,'mass':24.305,'group':2,'period':3,'block':'s','ie':7.646235,'oxi_n':[1,2]};
AtomParam['Al']={'no':13,'mass':26.9815386,'group':13,'period':3,'block':'p','ie':5.985768,'oxi_n':[-2,-1,1,2,3]};
AtomParam['Si']={'no':14,'mass':28.0855,'group':14,'period':3,'block':'p','ie':8.151683,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['P']={'no':15,'mass':30.973762,'group':15,'period':3,'block':'p','ie':10.486686,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['S']={'no':16,'mass':32.066,'group':16,'period':3,'block':'p','ie':10.36001,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['Cl']={'no':17,'mass':35.4527,'group':17,'period':3,'block':'p','ie':12.96763,'oxi_n':[-1,1,2,3,4,5,6,7]};
AtomParam['Ar']={'no':18,'mass':39.948,'group':18,'period':3,'block':'p','ie':15.7596112,'oxi_n':[]};
AtomParam['K']={'no':19,'mass':39.0983,'group':1,'period':4,'block':'s','ie':4.34066354,'oxi_n':[-1,1]};
AtomParam['Ca']={'no':20,'mass':40.078,'group':2,'period':4,'block':'s','ie':6.1131552,'oxi_n':[1,2]};
AtomParam['Sc']={'no':21,'mass':44.955912,'group':3,'period':4,'block':'d','ie':6.56149,'oxi_n':[1,2,3]};
AtomParam['Ti']={'no':22,'mass':47.867,'group':4,'period':4,'block':'d','ie':6.82812,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['V']={'no':23,'mass':50.9415,'group':5,'period':4,'block':'d','ie':6.746187,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Cr']={'no':24,'mass':51.9961,'group':6,'period':4,'block':'d','ie':6.76651,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Mn']={'no':25,'mass':54.938045,'group':7,'period':4,'block':'d','ie':7.434038,'oxi_n':[-3,-2,-1,1,2,3,4,5,6,7]};
AtomParam['Fe']={'no':26,'mass':55.845,'group':8,'period':4,'block':'d','ie':7.9024678,'oxi_n':[-4,-2,-1,1,2,3,4,5,6,7]};
AtomParam['Co']={'no':27,'mass':58.933195,'group':9,'period':4,'block':'d','ie':7.88101,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Ni']={'no':28,'mass':58.6934,'group':10,'period':4,'block':'d','ie':7.639877,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['Cu']={'no':29,'mass':63.546,'group':11,'period':4,'block':'d','ie':7.72638,'oxi_n':[-2,1,2,3,4]};
AtomParam['Zn']={'no':30,'mass':65.39,'group':12,'period':4,'block':'d','ie':9.3941968,'oxi_n':[-2,1,2]};
AtomParam['Ga']={'no':31,'mass':69.723,'group':13,'period':4,'block':'p','ie':5.9993018,'oxi_n':[-5,-4,-2,-1,1,2,3]};
AtomParam['Ge']={'no':32,'mass':72.61,'group':14,'period':4,'block':'p','ie':7.899435,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['As']={'no':33,'mass':74.9216,'group':15,'period':4,'block':'p','ie':9.7886,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Se']={'no':34,'mass':78.96,'group':16,'period':4,'block':'p','ie':9.752392,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['Br']={'no':35,'mass':79.904,'group':17,'period':4,'block':'p','ie':11.81381,'oxi_n':[-1,1,3,4,5,7]};
AtomParam['Kr']={'no':36,'mass':83.8,'group':18,'period':4,'block':'p','ie':13.9996049,'oxi_n':[2]};
AtomParam['Rb']={'no':37,'mass':85.4678,'group':1,'period':5,'block':'s','ie':4.177128,'oxi_n':[-1,1]};
AtomParam['Sr']={'no':38,'mass':87.62,'group':2,'period':5,'block':'s','ie':5.6948672,'oxi_n':[1,2]};
AtomParam['Y']={'no':39,'mass':88.90585,'group':3,'period':5,'block':'d','ie':6.21726,'oxi_n':[1,2,3]};
AtomParam['Zr']={'no':40,'mass':91.224,'group':4,'period':5,'block':'d','ie':6.6339,'oxi_n':[-2,1,2,3,4]};
AtomParam['Nb']={'no':41,'mass':92.90638,'group':5,'period':5,'block':'d','ie':6.75885,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['Mo']={'no':42,'mass':95.94,'group':6,'period':5,'block':'d','ie':7.09243,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Tc']={'no':43,'mass':97.9072,'group':7,'period':5,'block':'d','ie':7.11938,'oxi_n':[-3,-1,1,2,3,4,5,6,7]};
AtomParam['Ru']={'no':44,'mass':101.07,'group':8,'period':5,'block':'d','ie':7.3605,'oxi_n':[-4,-2,1,2,3,4,5,6,7,8]};
AtomParam['Rh']={'no':45,'mass':102.9055,'group':9,'period':5,'block':'d','ie':7.4589,'oxi_n':[-3,-1,1,2,3,4,5,6]};
AtomParam['Pd']={'no':46,'mass':106.42,'group':10,'period':5,'block':'d','ie':8.33686,'oxi_n':[1,2,3,4,5,6]};
AtomParam['Ag']={'no':47,'mass':107.8682,'group':11,'period':5,'block':'d','ie':7.576234,'oxi_n':[-2,-1,1,2,3,4]};
AtomParam['Cd']={'no':48,'mass':112.411,'group':12,'period':5,'block':'d','ie':8.99382,'oxi_n':[-2,1,2]};
AtomParam['In']={'no':49,'mass':114.818,'group':13,'period':5,'block':'p','ie':5.7863554,'oxi_n':[-5,-2,-1,1,2,3]};
AtomParam['Sn']={'no':50,'mass':118.71,'group':14,'period':5,'block':'p','ie':7.343917,'oxi_n':[-4,-3,-2,-1,1,2,3,4]};
AtomParam['Sb']={'no':51,'mass':121.76,'group':15,'period':5,'block':'p','ie':8.608389,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Te']={'no':52,'mass':127.6,'group':16,'period':5,'block':'p','ie':9.00966,'oxi_n':[-2,-1,1,2,3,4,5,6]};
AtomParam['I']={'no':53,'mass':126.90447,'group':17,'period':5,'block':'p','ie':10.45126,'oxi_n':[-1,1,3,4,5,6,7]};
AtomParam['Xe']={'no':54,'mass':131.29,'group':18,'period':5,'block':'p','ie':12.1298431,'oxi_n':[2,4,6,8]};
AtomParam['Cs']={'no':55,'mass':132.9054519,'group':1,'period':6,'block':'s','ie':3.893905557,'oxi_n':[-1,1]};
AtomParam['Ba']={'no':56,'mass':137.327,'group':2,'period':6,'block':'s','ie':5.211664,'oxi_n':[1,2]};
AtomParam['La']={'no':57,'mass':178.49,'group':53,'period':6,'block':'f','ie':5.5769,'oxi_n':[1,2,3]};
AtomParam['Ce']={'no':58,'mass':180.94788,'group':53,'period':6,'block':'f','ie':5.5386,'oxi_n':[2,3,4]};
AtomParam['Pr']={'no':59,'mass':183.84,'group':53,'period':6,'block':'f','ie':5.47,'oxi_n':[2,3,4,5]};
AtomParam['Nd']={'no':60,'mass':186.207,'group':53,'period':6,'block':'f','ie':5.525,'oxi_n':[2,3,4]};
AtomParam['Pm']={'no':61,'mass':190.23,'group':53,'period':6,'block':'f','ie':5.577,'oxi_n':[2,3]};
AtomParam['Sm']={'no':62,'mass':192.217,'group':53,'period':6,'block':'f','ie':5.64371,'oxi_n':[2,3]};
AtomParam['Eu']={'no':63,'mass':195.084,'group':53,'period':6,'block':'f','ie':5.670385,'oxi_n':[2,3]};
AtomParam['Gd']={'no':64,'mass':196.966569,'group':53,'period':6,'block':'f','ie':6.1498,'oxi_n':[1,2,3]};
AtomParam['Tb']={'no':65,'mass':200.59,'group':53,'period':6,'block':'f','ie':5.8638,'oxi_n':[1,2,3,4]};
AtomParam['Dy']={'no':66,'mass':204.3833,'group':53,'period':6,'block':'f','ie':5.93905,'oxi_n':[2,3,4]};
AtomParam['Ho']={'no':67,'mass':207.2,'group':53,'period':6,'block':'f','ie':6.0215,'oxi_n':[2,3]};
AtomParam['Er']={'no':68,'mass':208.9804,'group':53,'period':6,'block':'f','ie':6.1077,'oxi_n':[2,3]};
AtomParam['Tm']={'no':69,'mass':208.9824,'group':53,'period':6,'block':'f','ie':6.18431,'oxi_n':[2,3]};
AtomParam['Yb']={'no':70,'mass':209.9871,'group':53,'period':6,'block':'f','ie':6.254159,'oxi_n':[2,3]};
AtomParam['Lu']={'no':71,'mass':222.0176,'group':53,'period':6,'block':'f','ie':5.425871,'oxi_n':[2,3]};
AtomParam['Hf']={'no':72,'mass':138.90547,'group':4,'period':6,'block':'d','ie':6.825069,'oxi_n':[-2,1,2,3,4]};
AtomParam['Ta']={'no':73,'mass':140.116,'group':5,'period':6,'block':'d','ie':7.549571,'oxi_n':[-3,-1,1,2,3,4,5]};
AtomParam['W']={'no':74,'mass':140.90765,'group':6,'period':6,'block':'d','ie':7.86403,'oxi_n':[-4,-2,-1,1,2,3,4,5,6]};
AtomParam['Re']={'no':75,'mass':144.242,'group':7,'period':6,'block':'d','ie':7.83352,'oxi_n':[-3,-1,1,2,3,4,5,6,7]};
AtomParam['Os']={'no':76,'mass':144.9127,'group':8,'period':6,'block':'d','ie':8.43823,'oxi_n':[-4,-2,-1,1,2,3,4,5,6,7,8]};
AtomParam['Ir']={'no':77,'mass':150.36,'group':9,'period':6,'block':'d','ie':8.96702,'oxi_n':[-3,-1,1,2,3,4,5,6,7,8]};
AtomParam['Pt']={'no':78,'mass':151.964,'group':10,'period':6,'block':'d','ie':8.95883,'oxi_n':[-3,-2,-1,1,2,3,4,5,6]};
AtomParam['Au']={'no':79,'mass':157.25,'group':11,'period':6,'block':'d','ie':9.225553,'oxi_n':[-3,-2,-1,1,2,3,5]};
AtomParam['Hg']={'no':80,'mass':158.92535,'group':12,'period':6,'block':'d','ie':10.437504,'oxi_n':[-2,1,2]};
AtomParam['Tl']={'no':81,'mass':162.5,'group':13,'period':6,'block':'p','ie':6.1082871,'oxi_n':[-5,-2,-1,1,2,3]};
AtomParam['Pb']={'no':82,'mass':164.93032,'group':14,'period':6,'block':'p','ie':7.4166796,'oxi_n':[-4,-2,-1,1,2,3,4]};
AtomParam['Bi']={'no':83,'mass':167.259,'group':15,'period':6,'block':'p','ie':7.285516,'oxi_n':[-3,-2,-1,1,2,3,4,5]};
AtomParam['Po']={'no':84,'mass':168.93421,'group':16,'period':6,'block':'p','ie':8.414,'oxi_n':[-2,2,4,5,6]};
AtomParam['At']={'no':85,'mass':173.04,'group':17,'period':6,'block':'p','ie':9.31751,'oxi_n':[-1,1,3,5,7]};
AtomParam['Rn']={'no':86,'mass':174.967,'group':18,'period':6,'block':'p','ie':10.7485,'oxi_n':[2,6]};
AtomParam['Fr']={'no':87,'mass':223.0197,'group':1,'period':7,'block':'s','ie':4.0727409,'oxi_n':[1]};
AtomParam['Ra']={'no':88,'mass':226.0254,'group':2,'period':7,'block':'s','ie':5.278424,'oxi_n':[2]};
AtomParam['Ac']={'no':89,'mass':263.1125,'group':63,'period':7,'block':'f','ie':5.380226,'oxi_n':[3]};
AtomParam['Th']={'no':90,'mass':262.1144,'group':63,'period':7,'block':'f','ie':6.3067,'oxi_n':[1,2,3,4]};
AtomParam['Pa']={'no':91,'mass':266.1219,'group':63,'period':7,'block':'f','ie':5.89,'oxi_n':[3,4,5]};
AtomParam['U']={'no':92,'mass':264.1247,'group':63,'period':7,'block':'f','ie':6.19405,'oxi_n':[1,2,3,4,5,6]};
AtomParam['Np']={'no':93,'mass':269.1341,'group':63,'period':7,'block':'f','ie':6.2655,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Pu']={'no':94,'mass':268.1388,'group':63,'period':7,'block':'f','ie':6.0258,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Am']={'no':95,'mass':272.1463,'group':63,'period':7,'block':'f','ie':5.9738,'oxi_n':[2,3,4,5,6,7]};
AtomParam['Cm']={'no':96,'mass':272.1535,'group':63,'period':7,'block':'f','ie':5.9914,'oxi_n':[3,4,6]};
AtomParam['Bk']={'no':97,'mass':277,'group':63,'period':7,'block':'f','ie':6.1978,'oxi_n':[3,4]};
AtomParam['Cf']={'no':98,'mass':284,'group':63,'period':7,'block':'f','ie':6.2817,'oxi_n':[2,3,4]};
AtomParam['Es']={'no':99,'mass':289,'group':63,'period':7,'block':'f','ie':6.3676,'oxi_n':[2,3,4]};

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
*/
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

