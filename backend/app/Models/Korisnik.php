<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Korisnik extends Model
{
    use HasFactory;

    protected $table = 'korisnik'; 

    protected $fillable = [
        'ime',
        'prezime',
        'username',
        'password',
        'uloga',
    ];

    public function isAdmin() {
        return $this->uloga === 'admin';
    }

    public function isDete() {
        return $this->uloga === 'dete';
    }

    // Relacija: korisnik može imati više stanova
    public function stanovi()
    {
        return $this->hasMany(Stan::class);
    }
}
