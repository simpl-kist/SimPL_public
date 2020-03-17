<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
	protected $fillable=['title','contents'];
	protected $table = 'vcms_pages';	
	public $timestamps = false;
}
