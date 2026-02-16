<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable; 
use Laravel\Sanctum\HasApiTokens;

class Korisnik extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'korisnik';

    protected $primaryKey = 'idKorisnik';

    protected $fillable = [
        'ime',
        'prezime',
        'username',
        'uloga',
        'password'
    ];

    protected $hidden = [ 
        'password',
        'remember_token',
        'created_at',
        'updated_at'
    ];


    public function isAdmin() { return $this->uloga === 'admin'; }
    public function isDete() { return $this->uloga === 'dete'; }

    public function mojiStanoviVlasnik()
    {
        return $this->hasMany(Stan::class, 'vlasnik_id', 'idKorisnik');
    }

    public function stanoviGdeBoravim()
    {
        return $this->
        belongsToMany(Stan::class, 'korisnik_stan', 'korisnik_id', 'stan_id');
    }
}