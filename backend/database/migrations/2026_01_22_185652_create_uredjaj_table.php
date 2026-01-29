<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUredjajTable extends Migration
{
    public function up()
{
    Schema::dropIfExists('uredjaj');
    Schema::create('uredjaj', function (Blueprint $table) {
        $table->id('idUredjaj');
        $table->string('marka');
        $table->string('model');
        $table->string('tipUredjaja');
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('uredjaj');
    }
}
