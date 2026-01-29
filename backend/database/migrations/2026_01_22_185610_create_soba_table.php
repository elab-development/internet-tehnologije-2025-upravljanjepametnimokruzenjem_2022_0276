<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSobaTable extends Migration
{
    public function up()
    {
        Schema::create('soba', function (Blueprint $table) {
            $table->id('rbSoba');
            $table->string('nazivSobe');

            // FK ka stan
            $table->unsignedBigInteger('stan_id');
            $table->foreign('stan_id')
                  ->references('idStan')
                  ->on('stan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('soba');
    }
}
