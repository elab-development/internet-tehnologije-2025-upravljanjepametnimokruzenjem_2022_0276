<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStanTable extends Migration
{
    public function up()
    {
        Schema::create('stan', function (Blueprint $table) {
            $table->id('idStan');
            $table->string('adresa');
            $table->integer('brojStana');
            $table->integer('sprat');

            // FK ka korisnik
            $table->unsignedBigInteger('vlasnik_id');
            $table->foreign('vlasnik_id')
                  ->references('idKorisnik')
                  ->on('korisnik')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stan');
    }
}
