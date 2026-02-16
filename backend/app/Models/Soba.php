<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soba extends Model
{
    use HasFactory;

    protected $table = 'soba';
    
    protected $primaryKey = 'rbSoba';

    protected $fillable = [
        'nazivSobe', 
        'stan_id',   
    ];

   
    public function stan()
    {
        return $this->belongsTo(Stan::class, 'stan_id', 'idStan');
    }

    
    public function stanjaUredjaja()
    {
        return $this->hasMany(StanjeUredjaja::class, 'soba_id', 'rbSoba');
    }
}