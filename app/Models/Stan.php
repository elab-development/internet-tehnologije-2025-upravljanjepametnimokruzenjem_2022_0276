<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stan extends Model
{
    use HasFactory;

    protected $table = 'stan';

    protected $fillable = [
        'naziv',
        'adresa',
        'korisnik_id', // strani ključ prema korisniku
    ];

    // Relacija: stan pripada korisniku
    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class);
    }

    // Relacija: stan ima više soba
    public function sobe()
    {
        return $this->hasMany(Soba::class);
    }
}
