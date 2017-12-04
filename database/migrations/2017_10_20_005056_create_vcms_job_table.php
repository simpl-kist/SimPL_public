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
			$table->integer("parent")->nullable();
			$table->integer('project')->nullable();
			$table->integer('owner')->nullable();
			$table->string('type')->nullable(); // qjob or structure
			$table->json('qinfo')->nullable();
//			$table->string('qid')->nullable();
			$table->string('status',32)->nullable();
			$table->integer('pluginId')->nullable();
			$table->json('jobBefore')->nullable();
			$table->json('jobNext')->nullable();
			$table->json('input')->nullable();
			$table->json('output')->nullable();
			$table->text('name')->nullable();
			
			
            $table->timestamps();
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
