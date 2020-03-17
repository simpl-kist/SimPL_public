<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use Route;
use Response;
use App\CmsEnv;
use App\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
	private $env;
	public function __construct(){
		$environment = CmsEnv::get();
		$this->env = [];
		foreach($environment as $e){
			$this->env[$e->var_key] = $e->var_value;
		}
	}
	public function getList(){
		$pages = Page::get(['id','title','isfront']);
		return $pages;
	}
	public function loadPage(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$page = Page::where("id",$idx)->select(['id','title','alias','ispublic','isfront','contents','author'])->first();
		if($page === null){
			return ["message"=>"Invalid page ID","status"=>"Fail"];
		}
		if($user->can('read',$page)){
			if($user->can('update',$page)){
				return ["message"=>$page, "status"=>"Success"];
			}else{
				return ["message"=>$page, "status"=>"Unauthorized"];
			}
		}else{
			$page->script="Unauthroized";
			return ["message"=>$page, "status"=>"Unauthorized"];
		}
	}
	public function savePage(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$page = Page::where("id",$idx)->first();
		$title = $request->title;
		$alias = $request->alias;
		$is_public = $request->is_public;
		$contents = $request->contents;
		if($title === null || $title === ""){
			return ["message" => "Title is empty.", "status"=>"Fail"];	
		}
		if($alias === null || $alias === ""){
			return ["message" => "Alias is empty.", "status"=>"Fail"];	
		}
		if($is_public === null || $is_public === ""){
			return ["message" => "Required Qualification is empty.", "status"=>"Fail"];	
		}
		if($contents === null || $contents === ""){
			return ["message" => "Contents is empty.", "status"=>"Fail"];	
		}
		if($page === null){
			$page = new Page;
			if(!$user->can('create', $page)){
				return ["message" => "No permission", "status"=>"Fail"];
			}
			$cnt = Page::where("title",$title)->count();
			if($cnt > 0){
				return ["message" => "Name already exists.", "status"=>"Fail"];	
			}
			$cnt = Page::where("alias",$alias)->count();
			if($cnt > 0){
				return ["message" => "Alias already exists.", "status"=>"Fail"];	
			}
		}else{
			if(!$user->can('update', $page)){
				return ["message" => "No permission", "status"=>"Fail"];
			}
			$cnt = Page::where("title",$title)->count();
			if($cnt > 1){
				return ["message" => "Name already exists.", "status"=>"Fail"];	
			}else if($cnt === 1 && $title !== $page->title){
				return ["message" => "Name already exists.", "status"=>"Fail"];	
			}

			$cnt = Page::where("alias",$alias)->count();
			if($cnt > 1){
				return ["message" => "Alias already exists.", "status"=>"Fail"];	
			}else if($cnt === 1 && $alias !== $page->alias){
				return ["message" => "Alias already exists.", "status"=>"Fail"];	
			}
		}
		
		$page->title = $title;
		$page->alias = $alias;
		$page->ispublic = $is_public;
		$page->author = $user->id;
		$page->contents = $contents;
		$page->created = now();
		$page->save();
		return ["message" =>$page->id,"status"=>"Success"];
	}
	public function makeFront(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		if($user->policy !== "admin"){
			return ["message" => "No permission", "status"=>"Fail"];
		}
		$page = Page::where("id",$idx)->first();
		if($page === null){
			return ["message" => "Invalid page ID", "status"=>"Fail"];
		}
		$front = $page::where("isfront",1)->get();
		for($i=0 ; $i<count($front) ; $i++){
			$front[$i]->isfront =0;
			$front[$i]->save();
		}
		$page->isfront = 1;
		$page->save();
		return ["message" => "Success", "status"=>"Success"];
	}
	public function openPage($pageName=null){
		if($pageName == null){
			$frontPage = Page::where("isfront",1)->get(["alias"])->first();
			if( $frontPage === null ){ // There is no front page
				abort(404);
			}else{
				$pageName = $frontPage->alias;
			}
		}
		$m = CmsEnv::get();
		$env = [];
		foreach($m as $record){
			$env[$record->var_key] = $record->var_value;
		}
		$page = Page::where('alias',$pageName)->first();
		if($page===null) return redirect('/');
// page policy		
		$can_read=1;
		if($page->ispublic*1 !== 0){
			if(Auth::user() == null){
				$can_read=0;
			}else{
				$_policy=Auth::user()->policy;
				$_ispublic=$page->ispublic*1;
				switch($_policy){
					case "anonymous":
						if($_ispublic > 1){
							$can_read=0;
						}
						break;
					case "user":
						if($_ispublic > 2){
							$can_read=0;
						}				
						break;
					case "editor":
						if($_ispublic > 3){
							$can_read=0;
						}				
						break;
					case "admin":
						if($_ispublic > 4){
							$can_read=0;
						}			
						break;
					default:
						$can_read=0;
				}
			}
		}
// page policy
// Process tags
		if($can_read==1){
			$contents = $this->renderPageContent( $page->contents );
		}else{
			if(Auth::user()){
				if(Route::current()->getName()==""){
					return "Unauthorized";
				}
				return redirect("/");
			}else{
				return redirect("/login");
			}
		}
		$title = preg_split("/\/+/", $page->title);
		$title = $title[count($title)-1];
		return view('page',[
			'title'=>$title,
			'contents'=>$contents,
			'env'=>$env
		]);
		//$pageM->get()->where("alias",$pageName);
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
			}
		}
		return $content;
	}
	protected function parsePage($c,$originalTagStr,$tag){
		$pageAlias = array_shift($tag);
		$find_page=Page::where('alias',$pageAlias)->first();
		if($find_page === null){
			$page = "Page \"".$pageAlias."\" Does Not Exist.";
		}else{
			$page=$find_page->contents;
			$can_read=1;
			if($find_page->ispublic*1 !== 0){
				if(Auth::user() == null){
					$can_read=0;
				}else{
					$_policy=Auth::user()->policy;
					$_ispublic=$find_page->ispublic*1;
					switch($_policy){
						case "anonymous":
							if($_ispublic > 1){
								$can_read=0;
							}
							break;
						case "user":
							if($_ispublic > 2){
								$can_read=0;
							}				
							break;
						case "editor":
							if($_ispublic > 3){
								$can_read=0;
							}				
							break;
						case "admin":
							if($_ispublic > 4){
								$can_read=0;
							}			
							break;
						default:
							$can_read=0;
					}
				}
			}
			if($can_read==0){
				return "UNAUTHORIZED";
			}else{
				$page = $this->renderPageContent($page);
			}
		}		
		return str_replace($this->tagStrToOrg($originalTagStr),$page,$c);
	}
	protected function tagStrToOrg($tag){
		return "{{kCMS|".$tag."}}";
	}
	protected function parseVLAtoms($c,$originalTagStr,$tag){
		$vlaId = array_shift($tag);
		$vlaArgs = $tag[0];
		return str_replace($this->tagStrToOrg($originalTagStr),"<script>var ".$vlaId."=new VLatoms({".$vlaArgs."});</script>",$c);
	}
	public function deletePage(Request $request){
		$user = Auth::user();
		$idx = $request->idx;
		$plugin = Page::where("id",$idx)->first();
		if($user->can('delete',$plugin)){
			$plugin->delete();
			return ["message" => "Success", "status"=>"Success"];
		}else{
			return ["message" => "No permission", "status"=>"Fail"];
		}
	}

}
