<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_users', function (Blueprint $table) {
            $table->increments('id');
	    $table->string('userid',255);
	    $table->string('passwd',255);
	    $table->string('verificatin_code',255);
	    $table->string('name',128)->nullable();
	    $table->string('affiliatione',128)->nullable();
	    $table->integer('nlogin')->default(0);
	    $table->string('lastlogin',128);

            $table->dateTime("created");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vcms_users');
    }
}
