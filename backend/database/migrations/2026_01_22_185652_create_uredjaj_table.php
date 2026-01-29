<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUredjajTable extends Migration
{
    public function up()
    {
        Schema::create('uredjaj', function (Blueprint $table) {
            $table->id('idUredjaj');
            $table->string('marka');
            $table->string('model');
            $table->string('tipUredjaja');

            // FK ka soba, nullable
            $table->unsignedBigInteger('soba_id')->nullable();
            $table->foreign('soba_id')
                  ->references('rbSoba')
                  ->on('soba')
                  ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('uredjaj');
    }
}
