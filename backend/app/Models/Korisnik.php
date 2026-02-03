<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Korisnik extends Model
{
    use HasApiTokens, HasFactory;

    protected $table = 'korisnik';

    // Postavljamo idKorisnik kao primarni ključ
    protected $primaryKey = 'idKorisnik';

    protected $fillable = [
        'ime',
        'prezime',
        'username',
        'uloga',
    ];

    protected $hidden = [ 'password',
    'remember_token',
    'created_at',
    'updated_at'
    ];

    public function isAdmin()
    {
        return $this->uloga === 'admin';
    }

    public function isDete()
    {
        return $this->uloga === 'dete';
    }

    // U modelu Korisnik.php

    // Veza "je vlasnik": Korisnik kao vlasnik više stanova (1:N)
    public function mojiStanoviVlasnik()
    {
        return $this->hasMany(Stan::class, 'vlasnik_id', 'idKorisnik');
    }

    // Veza "ima": Korisnik kao stanar/korisnik stana (M:N)
    public function stanoviGdeBoravim()
    {
        return $this->belongsToMany(Stan::class, 'korisnik_stan', 'korisnik_id', 'stan_id');
    }
}