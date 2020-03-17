<div class="row files-wrapper web-files-wrapper">
</div>
<script>
	$(document).ready(function(){
		drawWebList();
	});
	var webfilelist = {!! json_encode($web) !!};
	function drawWebList(){
		var target = $(".web-files-wrapper");
		target.empty();
		var ih = "";
		var lists = getFiles(webfilelist);
		var files = lists["file"];
		var folders = lists["folder"];
		var ih = "";
		for(var i=0 ; i<folders.length ; i++){
			ih += "<div class='file-wrapper' style='padding:15px;text-align:center;cursor:pointer;' onclick='changeFolder("+'"'+folders[i]+'"'+");'>";
			ih += "<div><i class='fas fa-folder-open folder-icon'></i></div>";
			ih += "<div><span class='folder-name'>"+folders[i]+"</span></div>";
			ih += "</div>";
		}
		for(var i=0 ; i<files.length ; i++){
			var file = files[i];
			ih += "<div class='file-wrapper' style='padding:15px;'>";
			ih += "<div style='text-align:center;'>"
			if(file["delete"]){
				ih += "<a style='float:right;cursor:pointer;color:red;' onclick='deleteFile("+file["id"]+","+'"'+file["alias"]+'"'+");'><i class='fas fa-minus-circle'></i></a>";
			}
			ih += "<div style='width:100px;height:100px;position:relative;display:inline-block;'>"
			ih += "<img src=/repo/"+file["alias"]+" style='position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;max-width:100%;max-height:100%;'>";
			ih += "</div>";
			ih += "</div>";
			ih += "<div>";
			ih += "</div>";
			ih += "<div class='input-group file-name-wrapper' style='font-size:12px;margin-top:-2px;margin-bottom:2px;width:180px;'>";
			ih += "<input class='form-control file-alias' value='/repo/"+file["alias"]+"' onclick=select(); data-idx="+file['id']+" readonly>";
			if(file["update"]){
				ih += "<div class='input-group-append change-file-name'>";
				ih += "<button class='btn btn-outline-secondary change_url_button' onclick='showRename("+file['id']+");'>";
				ih += "<i class='fas fa-pencil-alt'></i>";
				ih += "</button>";
				ih += "</div>";
			}
			ih += "</div>";
			ih += "<div>";
			if(file["update"]){
				ih += "<select name=require class=form-control id=changePublic_"+file["id"]+" onchange='changePublic("+file["id"]+")'>";
				ih += "<option value=0 "+(file["ispublic"]==0 ? "selected" : "")+">Public</option>";
				ih += "<option value=1 "+(file["ispublic"]==1 ? "selected" : "")+">Anonymous</option>";
				ih += "<option value=2 "+(file["ispublic"]==2 ? "selected" : "")+">User</option>";
				ih += "<option value=3 "+(file["ispublic"]==3 ? "selected" : "")+">Editor</option>";
				ih += "<option value=4 "+(file["ispublic"]==4 ? "selected" : "")+">Admin</option>";
				ih += "</select>";
			}
			ih += "</div>";
			ih += "<div style='font-size:12px;width:100%;overflow:hidden;white-space:nowrap;'>";
			ih += "<label>By&nbsp;</label>";
			ih += "<span>"+file["author"]+"</span>";
			ih += "</div>";

			ih += "</div>";
		}
		target.html(ih);
	}
	function getFilesForWeb(){
		$.ajax({
			url:"/admin/repositories/webFiles",
			type:"post",
			data:{
				"_token":"{{csrf_token()}}"
			},
			success:function(ret){
				webfilelist = ret;
				drawWebList();
			}
		});
	}
</script>
