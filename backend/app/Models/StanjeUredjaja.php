<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StanjeUredjaja extends Model
{
    protected $table = 'stanje_uredjaja';
    protected $primaryKey = 'rbStanje';

    protected $fillable = [
        'nazivUredjaja',
        'ukljucen',
        'podesavanja',
        'uredjaj_id',
        'soba_id'
    ];

    protected $casts = [
        'ukljucen' => 'boolean',
        'podesavanja' => 'array',
    ];

    // Relacija: "odnosi se na" 1,1 Uredjaj
    public function uredjaj() {
        return $this->belongsTo(Uredjaj::class, 'uredjaj_id', 'idUredjaj');
    }

    // Relacija: "nalazi se u" 1,1 Soba
    public function soba() {
        return $this->belongsTo(Soba::class, 'soba_id', 'rbSoba');
    }
}