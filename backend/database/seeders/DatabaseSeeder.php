<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // OVDE POZIVAŠ SVOJ SEEDER
        $this->call([
            GlavniSeeder::class,
        ]);
    }
}