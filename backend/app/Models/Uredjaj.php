<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uredjaj extends Model
{
    use HasFactory;

    protected $table = 'uredjaj';
    
    protected $primaryKey = 'idUredjaj';

    protected $fillable = [
        'marka',        
        'model',        
        'tipUredjaja',  
    ];

    public function stanja()
    {
        return $this->hasMany(StanjeUredjaja::class, 'uredjaj_id', 'idUredjaj');
    }

}