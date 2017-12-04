<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsSolversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_solvers', function (Blueprint $table) {
            $table->increments('id');
	    $table->integer("owner");
	    $table->string("author");
	    $table->text("execcmd");
	    $table->string("version");
	    $table->string("name");
	    $table->string("path");
            $table->timeStamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vcms_solvers');
    }
}
