<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stan extends Model
{
    use HasFactory;

    // U modelu Stan.php

    protected $table = 'stan';
    protected $primaryKey = 'idStan';

    protected $fillable = [
        'adresa',
        'brojStana',
        'sprat',
        'vlasnik_id' // FK ka Korisniku za vezu "je vlasnik"
    ];

    // Veza "ima vlasnika": Stan ima jednog vlasnika (N:1)
    public function vlasnik()
    {
        return $this->belongsTo(Korisnik::class, 'vlasnik_id', 'idKorisnik');
    }

    // Veza "ima": Stan ima više korisnika/stanara (M:N)
    public function korisnici()
    {
        return $this->belongsToMany(Korisnik::class, 'korisnik_stan', 'stan_id', 'korisnik_id');
    }

    // Veza "ima" ka Sobama (Kompozicija na šemi)
    public function sobe()
    {
        return $this->hasMany(Soba::class, 'stan_id', 'idStan');
    }
}
