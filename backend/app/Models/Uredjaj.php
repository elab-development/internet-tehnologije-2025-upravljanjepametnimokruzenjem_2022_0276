<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uredjaj extends Model
{
    use HasFactory;

    protected $table = 'uredjaj';

    protected $fillable = [
        'naziv',
        'tip',        // npr. TV, Frižider, Klima...
        'soba_id',    // strani ključ prema sobi
    ];

    // Relacija: uređaj pripada jednoj sobi
    public function soba()
    {
        return $this->belongsTo(Soba::class);
    }

    // Relacija: uređaj može imati više stanja (istorija)
    public function stanja()
    {
        return $this->hasMany(StanjeUredjaja::class);
    }

    // Relacija: poslednje stanje uređaja (ako želiš quick access)
    public function poslednjeStanje()
    {
        return $this->hasOne(StanjeUredjaja::class)->latestOfMany();
    }
}
