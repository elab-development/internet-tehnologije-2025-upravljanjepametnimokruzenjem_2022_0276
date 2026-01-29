<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Korisnik;
use App\Models\Stan;
use App\Models\Soba;
use App\Models\Uredjaj;
use App\Models\StanjeUredjaja;
use Illuminate\Support\Facades\Hash;

class GlavniSeeder extends Seeder
{
    public function run()
    {
        // 1. Kreiraj Korisnika (Vlasnika)
        $vlasnik = Korisnik::create([
            'ime' => 'Vuk',
            'prezime' => 'Vasic',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'uloga' => 'admin'
        ]);

        $obicanKorisnik = Korisnik::create([
            'ime' => 'Cofi',
            'prezime' => 'Vukovic',
            'username' => 'cofi',
            'password' => Hash::make('cofi123'),
            'uloga' => 'obican'
        ]);

        // 2. Kreiraj Stan
        $stan = Stan::create([
            'adresa' => 'Bulevar Kralja Aleksandra 100',
            'brojStana' => 15,
            'sprat' => 3,
            'vlasnik_id' => $vlasnik->idKorisnik
        ]);

        // Poveži i običnog korisnika sa stanom kroz pivot tabelu (veza "ima")
        $stan->korisnici()->attach($obicanKorisnik->idKorisnik);

        // 3. Kreiraj Sobe
        $dnevna = Soba::create([
            'nazivSobe' => 'Dnevna Soba',
            'stan_id' => $stan->idStan
        ]);

        $spavaca = Soba::create([
            'nazivSobe' => 'Spavaća Soba',
            'stan_id' => $stan->idStan
        ]);

        // 4. Kreiraj Uređaje (Katalog)
        $klima = Uredjaj::create([
            'marka' => 'Bosch',
            'model' => 'White 2024',
            'tipUredjaja' => 'Klima'
        ]);

        $svetlo = Uredjaj::create([
            'marka' => 'Philips',
            'model' => 'Hue White',
            'tipUredjaja' => 'Svetlo'
        ]);

        // 5. Postavi Stanje Uređaja (Povezivanje uređaja i sobe)
        StanjeUredjaja::create([
            'nazivUredjaja' => 'Klima dnevna soba',
            'ukljucen' => true,
            'podesavanja' => [
                'temperatura' => 24,
                'mod' => 'hladjenje',
                'brzina_ventilatora' => 3
            ],
            'uredjaj_id' => $klima->idUredjaj,
            'soba_id' => $dnevna->rbSoba
        ]);

        StanjeUredjaja::create([
            'nazivUredjaja' => 'Glavno svetlo spavaća',
            'ukljucen' => false,
            'podesavanja' => [
                'intenzitet' => '80%',
                'boja' => 'Toplo bela'
            ],
            'uredjaj_id' => $svetlo->idUredjaj,
            'soba_id' => $spavaca->rbSoba
        ]);
    }
}