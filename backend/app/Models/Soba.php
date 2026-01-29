<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soba extends Model
{
    use HasFactory;

    protected $table = 'soba';

    protected $fillable = [
        'naziv',
        'povrsina',
        'stan_id', // strani ključ prema stanu
    ];

    // Relacija: soba pripada stanu
    public function stan()
    {
        return $this->belongsTo(Stan::class);
    }
}
