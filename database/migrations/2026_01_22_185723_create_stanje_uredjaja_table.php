<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStanjeUredjajaTable extends Migration
{
    public function up()
    {
        Schema::create('stanje_uredjaja', function (Blueprint $table) {
            $table->id('rbStanje');
            $table->string('nazivUredjaja');
            $table->boolean('ukljucen');
            $table->string('podesavanja')->nullable();

            // FK ka uredjaj
            $table->unsignedBigInteger('uredjaj_id');
            $table->foreign('uredjaj_id')
                  ->references('idUredjaj')
                  ->on('uredjaj')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stanje_uredjaja');
    }
}
