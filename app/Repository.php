<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Repository extends Model
{
	protected $fillable = ['owner','alias','filename','author'];
    //
}
