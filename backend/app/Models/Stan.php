<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

class Stan extends Model
{
    use HasFactory;


    protected $table = 'stan';
    protected $primaryKey = 'idStan';

    protected $fillable = [
        'adresa',
        'brojStana',
        'sprat',
        'vlasnik_id' // spoljni kljuc ka vlasniku
    ];

    public function vlasnik()
    {
        return $this->belongsTo(Korisnik::class, 'vlasnik_id', 'idKorisnik');
    }

    public function korisnici()
    {
        return $this
        ->belongsToMany(Korisnik::class, 'korisnik_stan', 'stan_id', 'korisnik_id');
    }

    public function sobe()
    {
        return $this->hasMany(Soba::class, 'stan_id', 'idStan');
    }
}
