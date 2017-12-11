<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePolicy extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('policies', function (Blueprint $table) {
            $table->increments('id');
		$table->string('type')->unique();
		$table->tinyInteger('job_submit')->default(0);
		$table->tinyInteger('own_data_create')->default(0);
		$table->tinyInteger('own_data_read')->default(0);
		$table->tinyInteger('own_data_update')->default(0);
		$table->tinyInteger('own_data_delete')->default(0);
		$table->tinyInteger('oth_data_read')->default(0);
		$table->tinyInteger('oth_data_update')->default(0);
		$table->tinyInteger('oth_data_delete')->default(0);
		$table->tinyInteger('oth_user_read')->default(0);
		$table->tinyInteger('oth_user_update')->default(0);
		$table->tinyInteger('oth_user_delete')->default(0);
		$table->tinyInteger('policy_admin')->default(0);
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
        Schema::dropIfExists('policies');
    }
}
