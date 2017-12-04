<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsJobTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_job', function (Blueprint $table) {
            $table->increments('id');
		$table->string("type");
		$table->string("name");
		$table->integer("owner");
		$table->dateTime("created");
		$table->dateTime("finished");
		$table->dateTime("started");
		$table->integer("plugin");
		$table->json("input");
		$table->json("output");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vcms_job');
    }
}
