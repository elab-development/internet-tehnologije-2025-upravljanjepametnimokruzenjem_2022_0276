<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StanjeUredjaja extends Model
{
    use HasFactory;

    protected $table = 'stanje_uredjaja';

    protected $fillable = [
        'uredjaj_id',  // strani ključ ka uređaju
        'status',      // npr. uključen, isključen, kvar
        'opis',        // opcionalno, detalji stanja
        'datum_vreme', // kada je stanje zabeleženo
    ];

    // Relacija: stanje pripada jednom uređaju
    public function uredjaj()
    {
        return $this->belongsTo(Uredjaj::class);
    }
}
