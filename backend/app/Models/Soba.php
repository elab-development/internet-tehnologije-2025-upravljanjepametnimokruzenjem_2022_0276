<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soba extends Model
{
    use HasFactory;

    protected $table = 'soba';
    
    // Na šemi je primarni ključ rbSoba
    protected $primaryKey = 'rbSoba';

    protected $fillable = [
        'nazivSobe', // string na šemi (umesto naziv)
        'stan_id',   // veza "pripada" stanu (1,1)
    ];

    /**
     * Relacija: "pripada" (1,1)
     * Soba uvek pripada jednom konkretnom stanu.
     */
    public function stan()
    {
        // Povezujemo stan_id sa idStan u tabeli stan
        return $this->belongsTo(Stan::class, 'stan_id', 'idStan');
    }

    /**
     * Relacija: "ima" (0,*)
     * Prema šemi (crni romb), soba sadrži stanja uređaja.
     */
    public function stanjaUredjaja()
    {
        // Spoljni ključ u tabeli stanje_uredjaja je soba_id
        return $this->hasMany(StanjeUredjaja::class, 'soba_id', 'rbSoba');
    }
}