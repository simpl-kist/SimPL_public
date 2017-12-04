<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_pages', function (Blueprint $table) {
            $table->increments('id');
		$table->boolean('isfront');
	    $table->text('title');
	    $table->text('alias');
	    $table->longText('contents');
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
        Schema::dropIfExists('vcms_pages');
    }
}
