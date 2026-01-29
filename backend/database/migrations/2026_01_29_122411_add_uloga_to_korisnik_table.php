<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUlogaToKorisnikTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('korisnik', function (Blueprint $table) {
        
        $table->enum('uloga', ['dete', 'obican', 'admin'])->default('obican')->after('password');
    });
}

public function down()
{
    Schema::table('korisnik', function (Blueprint $table) {
        $table->dropColumn('uloga');
    });
}
}
