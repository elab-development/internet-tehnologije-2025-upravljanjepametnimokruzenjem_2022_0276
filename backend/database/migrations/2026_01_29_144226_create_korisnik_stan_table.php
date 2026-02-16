<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Prvo brišemo ako postoji, da bi fresh start bio čist
        Schema::dropIfExists('korisnik_stan');

        Schema::create('korisnik_stan', function (Blueprint $table) {
            $table->id();

            // Veza ka tabeli Korisnik
            $table->unsignedBigInteger('korisnik_id');
            $table->foreign('korisnik_id')
                  ->references('idKorisnik') 
                  ->on('korisnik')
                  ->onDelete('cascade');

            // Veza ka tabeli Stan
            $table->unsignedBigInteger('stan_id');
            $table->foreign('stan_id')
                  ->references('idStan') 
                  ->on('stan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('korisnik_stan');
    }
};