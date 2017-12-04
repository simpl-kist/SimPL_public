<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PageModel extends Model
{
	protected $fillable=['title','contents','created'];
	protected $table = 'vcms_pages';	
	public $timestamps = false;
    //
}
