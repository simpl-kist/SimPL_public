<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVcmsEnvTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vcms_env', function (Blueprint $table) {
/*            $table->increments('id');
            $table->timestamps();*/
/*		$tabel->string("url")->nullable();
		$tabel->string("title")->nullable();
		$tabel->string("logo")->nullable();
		$tabel->longText("header")->nullable();
		$tabel->longText("footer")->nullable();
		$tabel->string("mpirun")->nullable();
		$tabel->string("qsub")->nullable();
		$tabel->string("qstat")->nullable();
		$tabel->string("qdel")->nullable();*/
		$table->string("var_key");
		$table->longText("var_value");

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vcms_env');
    }
}
