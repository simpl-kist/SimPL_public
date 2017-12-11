<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\PageModel;
use App\CmsEnvModel;
use App\Repository;
class PageController extends Controller
{
	public function changePublic(Request $request){
		$page=PageModel::where('id',$request->index)->first();
		$this->authorize('update',$page);
		if($page->ispublic === 0){
			$page->ispublic=1;
		}else{
			$page->ispublic=0;
		}
		$page->save();
	}
	public function getRepo($alias){
		$img = Repository::where("alias",$alias)->firstOrFail();
		$this->authorize('read',$img);
		return redirect('/'.$img->filename);
	}
	public function add(Request $request){
		$pageM = PageModel::findOrNew($request->input('pageId'));
		if($pageM->id!==null){
			$this->authorize('update',$pageM);
		}else{
			$this->authorize('create',$pageM);
			$pageM->author = Auth::user()->id;
			$pageM->created = date('Y-m-d H:i:s'); 
		}
		$pageM->title = $request->input('title');
		$pageM->contents = $request->input('contents');
		$pageM->alias = $request->input('alias');
		$pageM->save();
		return redirect(route('admin.pages'));	
	}
	public function setFront($id){
		PageModel::where("isfront",true)->update(["isfront"=>false]);
		$m = PageModel::findOrFail($id);
		$m->isfront = true;
		$m->save();
		return redirect(route('admin.pages'));	
	}
	public function delete($id){
//block
		return false;
		$page = PageModel::findOrFail($id);
		$this->authorize('delete',$page);
		$page->delete();
		return redirect(route('admin.pages'));	
	}
	public function view($pageName=null){
		if($pageName == null){
			$frontPage = PageModel::where("isfront",true)->get(["alias"])->first();
			if( $frontPage->count() == 0 ){ // There is no front page
				abort(404);
			}else{
				$pageName = $frontPage->alias;
			}
			
		}
		$m = CmsEnvModel::get();
		$env = [];
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}

		$pageM = new PageModel;
		$page = $pageM->get()->where('alias',$pageName)->first();
// 없으면 빈 칸을 띄우게함

		if(count($page)<1) return redirect('/');
		$this->authorize('read',$page);
// Process tags
		$contents = $this->renderPageContent( $page->contents );
		
		return view('page',[
			'title'=>$page->title,
			'contents'=>$contents,
			'env'=>$env
			
		]);
		//$pageM->get()->where("alias",$pageName);
	}
	public function list(){
		$pages = PageModel::paginate(10);
//		$pages = $pageM->get();
		return view('admin/pages/list',[ 'pages' => $pages]);
	}
	public function modify($id){
		$pageM = new PageModel;
		$page = $pageM->get()->where('id',$id)->first();
		$this->authorize('update',$page);
		return view('admin/pages/modify',[ 'page'=> $page]);
	}


	protected function parsePage($c,$originalTagStr,$tag){
		$pageAlias = array_shift($tag);
		$page = PageModel::where('alias',$pageAlias)->firstOrFail()->contents;
		$page = $this->renderPageContent($page);
		
		return str_replace($this->tagStrToOrg($originalTagStr),$page,$c);
	}
	protected function tagStrToOrg($tag){
		return "{{kCMS|".$tag."}}";
	}
	protected function parsePlugin($c,$originalTagStr,$tag){
			$pluginId = array_shift($tag);
			$pluginDir = SERVER_ROOT."/contents/plugin/".$pluginId;
			if(!is_dir($pluginDir)){
				die("Plugin Directory does not exists(".$pluginDir.")");
			}
			if(!is_file($pluginDir."/plugin.def.php")){
				die("Plugin definition does not exists");
			}
			require_once $pluginDir."/plugin.def.php";
			$pluginArgs = $tag[0];
			$plugin = new $pluginId($pluginArgs);
			return str_replace($this->tagStrToOrg($originalTagStr),$plugin->pluginContents,$c);
		}
		protected function parseVLAtoms($c,$originalTagStr,$tag){
			$vlaId = array_shift($tag);
			$vlaArgs = $tag[0];
			return str_replace($this->tagStrToOrg($originalTagStr),"<script>var ".$vlaId."=new VLatoms({".$vlaArgs."});</script>",$c);
		}
	protected function parseDB($c,$originalTagStr,$tag){
			$supportedMethods = Array(
				"getStructure"=>Array("type"=>"read"),
				"saveStructure"=>Array("type"=>"create"),
			);
			$method = array_shift($tag);
			$qryType = $supportedMethods[$method]['type'];
			$_option = $tag;
			$options = explode(",",removeSpace($_option[0]));
	
			switch($qryType){
				case "create":
					$inputs=Array();
					foreach($options as $opt){
						$o = explode(":",$opt);
						$option = $o[0];
						$val = $o[1];
						switch($option){
							case "source": // Display type
								$source = $val;
							break;
							case "structure": // Display type
								$structure = $val;
							break;
							case "input":
								$v = explode("=",$val);
								$inputs[$v[0]]=$v[1];
							break;
							case "output":
								$v = explode("=",$val);
								$inputs[$v[0]]=$v[1];
							break;
							case "name":
								$name = $val;
							break;
	
							case "type":
								$type = $val;
							break;
						}
					}
					switch($method){
						case "saveStructure":
	
						break;
					}
	
					$tmpFunName = "tmp_".rand();
					$retTxt = "";
					$retTxt.="<script>";
					$retTxt.="function ".$tmpFunName."(){";
					$retTxt.="var args={pid:null,input:{},output:null,description:null,name:null};";
					$retTxt.="args.type='".$type."';";
					$retTxt.="args.name=".$name.";";
					foreach($inputs as $varname=>$value){
						$retTxt.="args.input['".$varname."']=".$value.";";
					}
					foreach($outputs as $varname=>$value){
						$retTxt.="args.output['".$varname."']=".$value.";";
					}
					$retTxt.="post_ajax('/inc/db.exports.php',{method:'".$method."',args:args});";
					$retTxt.="}";
					$retTxt.="</script>";
					$retTxt.="<button onclick=javascript:".$tmpFunName."();>Save Structure</button>";
					return str_replace($this->tagStrToOrg($originalTagStr),$retTxt,$c);
	
				break;
				case "read":
					$dbe = new cms_exports();
	
					if(!method_exists($dbe,$method)){
						die("Method does not exists");
					}
					$callbackTarget = null;
					$ret = $dbe->$method();
					foreach($options as $opt){
						$o = explode(":",$opt);
						$option = $o[0];
						$val = $o[1];
						switch($option){
							case "type": // Display type
								$type = $val;
							break;
							case "formid":
								$formid = $val;
							break;
							case "callback":
								$callbackTarget = $val;
							break;
	
						}
					}
					$retTxt = "";
					$valTitle = "name";
					switch($type){
						case "select":
							$retTxt.="<select id=".$formid.">";
							foreach($ret as $l){
								$retTxt.="!";
								$retTxt.="<option data-id=".$l->id.">";
								$retTxt.=$l->$valTitle;
								$retTxt.="</option>";
							}
							$retTxt.="</select>";
						break;
					}
					if($method == "getStructure"){
						if($callbackTarget){
							$retTxt.="<script>";
							$retTxt.="$(document).ready(function(){";
							$retTxt.="$('#".$formid."').change(function(){";
							$retTxt.="var did = $('#".$formid." option:checked').data('id');";
							$retTxt.='var ret = JSON.parse(post_ajax("/inc/db.exports.php",{method:"getStructureOne",args:{id:did}}).value.structure);';
							$retTxt.=$callbackTarget.".Structure = VLatoms.Utils.redefineStructure(ret);";
							$retTxt.=$callbackTarget.".update.atomsChanged=true;";
							$retTxt.=$callbackTarget.".update.bondsChanged=true;";
							$retTxt.=$callbackTarget.".setOptimalCamPosition();";
							$retTxt.="});";
							$retTxt.="});";
							$retTxt.="</script>";
						}
	
					}
					return str_replace($this->tagStrToOrg($originalTagStr),$retTxt,$c);
				break;
			}
		//	$method = array_shift($tag);
		}
	protected function renderPageContent($content){

		

		preg_match_all('/{{kCMS\|(.*?)}}/',$content,$tags);
	
		$original_tags = $tags[0];
		$original_tags_clean = $tags[1];
		foreach($original_tags_clean as $this_tag){
			$tag = explode("|",$this_tag);
			$tagType = array_shift($tag);
			switch($tagType){
				case "PAGE":
					$content = $this->parsePage($content,$this_tag,$tag);
				break;
				case "VLATOMS":
					$content = $this->parseVLAtoms($content,$this_tag,$tag);
				break;
				case "PLUGIN":
					$content = $this->parsePlugin($content,$this_tag,$tag);
				break;
				case "DB":
					$content = $this->parseDB($content,$this_tag,$tag);
				break;
			}
	
		}
		return $content;
	}
    //
}
