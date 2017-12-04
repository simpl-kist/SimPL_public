<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsProjectJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_project_jobs', function (Blueprint $table) {
            $table->increments('id');
	    $table->integer("project_id");
	    $table->integer("member_id");
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
        Schema::dropIfExists('vcms_project_jobs');
    }
}
