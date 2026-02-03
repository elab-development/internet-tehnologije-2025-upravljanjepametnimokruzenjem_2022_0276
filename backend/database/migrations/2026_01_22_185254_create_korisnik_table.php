<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKorisnikTable extends Migration
{
    public function up()
    {
    Schema::dropIfExists('korisnik'); // Briše staru pre kreiranja
    Schema::create('korisnik', function (Blueprint $table) {
        $table->id('idKorisnik');
        $table->string('ime');
        $table->string('prezime');
        $table->string('username')->unique();
        $table->string('password');
        $table->enum('uloga', ['dete', 'obican', 'admin'])->default('obican');
        $table->timestamps();
    });
    }
    
    public function down()
    {
        Schema::dropIfExists('korisnik');
    }
}
