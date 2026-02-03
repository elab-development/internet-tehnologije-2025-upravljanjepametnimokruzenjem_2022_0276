<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uredjaj extends Model
{
    use HasFactory;

    protected $table = 'uredjaj';
    
    // Na šemi je primarni ključ označen kao idUredjaj
    protected $primaryKey = 'idUredjaj';

    protected $fillable = [
        'marka',        // String na šemi
        'model',        // String na šemi
        'tipUredjaja',  // String na šemi
    ];

    /**
     * Relacija: "odnosi se na" (0,*)
     * Prema šemi, jedan uređaj može imati više zabeleženih stanja (istorija).
     * Veza ide od StanjeUredjaja ka Uredjaj.
     */
    public function stanja()
    {
        // Spoljni ključ u tabeli stanje_uredjaja je uredjaj_id
        return $this->hasMany(StanjeUredjaja::class, 'uredjaj_id', 'idUredjaj');
    }

    /**
     * Pomoćna relacija za dobijanje trenutno aktivnog stanja.
     */
    // public function trenutnoStanje()
    // {
    //     return $this->hasOne(StanjeUredjaja::class, 'uredjaj_id', 'idUredjaj')->latestOfMany();
    // }
}