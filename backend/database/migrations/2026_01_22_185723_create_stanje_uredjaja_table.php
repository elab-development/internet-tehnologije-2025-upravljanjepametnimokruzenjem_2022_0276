<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStanjeUredjajaTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('stanje_uredjaja');
        Schema::create('stanje_uredjaja', function (Blueprint $table) {
            $table->id('rbStanje');
            $table->string('nazivUredjaja');
            $table->boolean('ukljucen');
            $table->string(column: 'podesavanja');
            $table->unsignedBigInteger('uredjaj_id');
            $table->unsignedBigInteger('soba_id');
            $table->foreign('uredjaj_id')->references('idUredjaj')->on('uredjaj')->onDelete('cascade');
            $table->foreign('soba_id')->references('rbSoba')->on('soba')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stanje_uredjaja');
    }
}
