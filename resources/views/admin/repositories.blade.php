@extends('admin.layout')
@section('title')
Repositories
@stop
@section('content')
<link rel=stylesheet type=text/css href='/assets/dropzone/dropzone.css'>
<script src='/assets/dropzone/dropzone.js'></script>
<style>
	.search_wrapper{
		margin:25px 0;
	}
	.simpl-repository-tab{
		width:50%;
		height:48px;
		display:inline-block;
		float:left;
		text-align:center;
		background-color:#EFEFEF;
		position:relative;
		cursor:pointer;
	}
	.simpl-repository-tab span{
		top:0;
		bottom:0;
		margin:auto;
		position:absolute;
		height:fit-content;
	}
	.simpl-repository-tab.active{
		background-color:black;
	}
	.simpl-repository-tab.active span{
		color:white;
	}
	.simpl-repository-content{
		display:inline-block;
		width:100%;
		float:left;
		padding:1px;
		background-color:white;
		height:calc(100vh - 206px);
	}
	.simpl-repository-web{
		width:100%;
		height:100%;
		overflow-y:auto;
		background-color:#e4e9ef;
	}
	.simpl-repository-server{
		display:none;
		width:100%;
		height:100%;
		overflow-y:auto;
		background-color:#e4e9ef;
	}
	.files-wrapper{
		margin-left:0;
		margin-right:0;
	}
	.file-wrapper{
		width:210px;
	}
	.folder-icon{
		font-size:70px;
		width:100px;
		height:100px;
	}
	.folder-name{
		font-size:20px;
	}
	.file-name-wrapper .form-control{
		border-radius:4px !important;
	}
	.change-file-name{
		display:none;
	}
	.file-name-wrapper:hover .change-file-name{
		display:flex;
	}
</style>
<div style="padding:1px;height:50px;">
	<div class="simpl-repository-tab active" data-type="web">
		<span>WEB<span>
	</div>
	<div class="simpl-repository-tab" data-type="server">
		<span>SERVER<span>
	</div>
</div>
<div class="simpl-repository-content">
	<div id="repos_web_search" class="form-inline search_wrapper">
		<input class="form-control folder-now" value="" placeholder="/" readonly>
		<input id=repos_search_input class=form-control placeholder="Search">
	</div>
	<div class="simpl-repository-main simpl-repository-web">
@can('create','App\Repository')
		<form action="repositories/uploadFile" method=post class=dropzone id=dropzone>
			{{ csrf_field() }}
			<input type=hidden name=repos_for value="web">
			<div class=dz-message style='font-size:20px;'>
				Drop files here to upload
			</div>
		</form>
@endcan
		<div>
			@include('parts.repositories_web',["web"=>$repos["web"],"from"=>"admin"])
		</div>
	</div>
	<div class="simpl-repository-main simpl-repository-server">
@can('create','App\Repository')
		<form action="repositories/uploadFile" method=post class=dropzone id=dropzone>
			{{ csrf_field() }}
			<input type=hidden name=repos_for value="server">
			<div class=dz-message style='font-size:20px;'>
				Drop files here to upload
			</div>
		</form>
		<div>
			@include('parts.repositories_server',['server'=>$repos["server"],"from"=>"admin"])
		</div>
@endcan
	</div>
</div>
<div class="modal fade file-rename" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document" style="max-width:500px;width:500px;top:0;bottom:0;left:0;right:0;position:absolute;height:fit-content;margin:auto;">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Rename</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-12">
						<input class="form-control name_input">
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onclick="renameFile();">Change</button>
			</div>
		</div>
	</div>
</div>
<script>
	var nowtype = "web";
	var folder = "";
	$(document).ready(function(){
		$(".simpl-repository-tab").click(function(){
			var type = $(this).data('type');
			if(nowtype == type){
				return;
			}
			$(".simpl-repository-tab").removeClass("active");
			changeFolder("..");
			nowtype = type;
			$(this).addClass("active");
			$(".simpl-repository-main").hide();
			$(".simpl-repository-"+nowtype).show();
			if(nowtype === "web"){
				getFilesForWeb();
			}else{
				getFilesForServer();
			}
		});
		$("#repos_search_input").change(function(){
			if(nowtype === "web"){
				drawWebList();
			}else{
				drawServerList();
			}
		});
	});

	function changePublic(id){
		$.ajax({
			url:"/admin/repositories/changePublic",
			type:"POST",
			data:{
				_token:"{{csrf_token()}}",
				idx:id,
				ispublic:$('#changePublic_'+id).val()*1,
			},
			success:function(ret){
				if(ret["status"] === "failed"){
					alert(ret["message"]);
				}
				if(nowtype === "web"){
					getFilesForWeb();
				}else{
					getFilesForServer();
				}
			}
		})
	}
	function deleteFile(id,name){
		if(confirm(name+" will be deleted. continue?")){
			$.ajax({
				url:"/admin/repositories/deleteFile",
				type:"POST",
				data:{
					_token:"{{csrf_token()}}",
					idx:id,
				},
				success:function(ret){
					if(ret["status"] === "failed"){
						alert(ret["message"]);
					}
					if(nowtype === "web"){
						getFilesForWeb();
					}else{
						getFilesForServer();
					}
				}
			})		
		}
	}
	function changeFolder(f){
		folder = folder.split("/");
		if(folder[0] === ""){
			folder = folder.slice(1);
		}
		if(f === "."){
			folder = folder.slice(0, folder.length -1).join("/");
		}else if(f === ".."){
			folder = "";
		}else{
			folder.push(f);
			folder = folder.join("/");
		}
		$(".folder-now").val(folder);
		if(nowtype === "web"){
			drawWebList();		
		}else{
			drawServerList();		
		}
	}
	function showRename(id){
		$(".file-rename").modal('show');
		$(".name_input").val($(".file-alias[data-idx="+id+"]").val().replace("/repo/",""));
		$(".name_input").data("idx",id);
	}
	function renameFile(){
		var idx = $(".name_input").data("idx");
		var name = $(".name_input").val();
		name = name.replace(/\/+/g,"/");
		if(name[0] == "/"){
			name = name.slice(1);
		}
		$.ajax({
			url:"/admin/repositories/renameFile",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}",
				"idx":idx,
				"name":name
			},
			success:function(ret){
				if(nowtype === "web"){
					getFilesForWeb();
				}else{
					getFilesForServer();
				}
			}
		})
		$(".file-rename").modal('hide');
	}
    function getFiles(filelist){
        var ret = {"file":[],"folder":[]};
		var search_input = $("#repos_search_input").val().trim();
        var _folder = folder;
        if(_folder === ""){
            for(var i=0 ; i<filelist.length ; i++){
				if(filelist[i]["alias"].indexOf(search_input)<0){
					continue;
				}
                if(filelist[i]["alias"].indexOf("/")<=0){
                    ret["file"].push(filelist[i]);
                }else{
                    var _f = filelist[i]["alias"].split("/")[0];
                    if(ret["folder"].indexOf(_f)<0){
                        ret["folder"].push(_f);
                    }
                }
            }
        }else{
            ret["folder"].push(".")
            ret["folder"].push("..")
            for(var i=0 ; i<filelist.length ; i++){
				if(filelist[i]["alias"].indexOf(search_input)<0){
					continue;
				}
                if(filelist[i]["alias"].indexOf(_folder+"/")===0){
                    var _tf = objClone(filelist[i]);
                    _tf["alias"]=_tf["alias"].replace(_folder+"/","");
                    if(_tf["alias"].indexOf("/")<=0){
                        ret["file"].push(filelist[i]);
                    }else{
                        var _f = _tf["alias"].split("/")[0];
                        if(ret["folder"].indexOf(_f)<0){
                            ret["folder"].push(_f);
                        }
                    }
                }
            }
        }
        return ret;
    }
	Dropzone.options.dropzone = {
		paramName: "files",
		uploadMultiple:true,
		maxFilesize:10,
		autoProcessQueue: true,
		addRemoveLinks: true,
		dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",
		dictRemoveFile: "Remove",
		dictFileTooBig:"Image is bigger than 10MB",
	
		accept: function(file, done) {
			done();
		},

		init:function() {
			this.on("error",function(file,ret){
			});
		},  
		success: function(file,done){
			if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
//TODO
				if(nowtype === "web"){
					getFilesForWeb();
				}else{
					getFilesForServer();
				}
			}
		},
	}

</script>
@stop
