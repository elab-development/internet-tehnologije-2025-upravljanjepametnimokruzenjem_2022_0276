<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        
        DB::statement("ALTER TABLE uredjaj MODIFY COLUMN tipUredjaja ENUM('Klima', 'Svetlo', 'Grejalica') NOT NULL");
    }

    public function down(): void
    {
        // Vraćamo na varchar(255) u slučaju rollback-a
        DB::statement("ALTER TABLE uredjaj MODIFY COLUMN tipUredjaja VARCHAR(255) NOT NULL");
    }
};