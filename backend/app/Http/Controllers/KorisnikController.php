<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use Illuminate\Http\Request;

class KorisnikController extends Controller
{
    // Prikaz svih korisnika
    public function index()
    {
        return response()->json(Korisnik::all());
    }

    // Kreiranje novog korisnika
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|unique:korisnik,username',
            'password' => 'required|string|min:6',
            'uloga' => 'required|in:dete,obican,admin', // Dodato
        ]);

        $validated['password'] = bcrypt($validated['password']); // heš lozinke

        $korisnik = Korisnik::create($validated);

        return response()->json($korisnik, 201);
    }

    // Prikaz jednog korisnika
    public function show($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        return response()->json($korisnik);
    }

    // Izmena korisnika
    public function update(Request $request, $id)
    {
        $korisnik = Korisnik::findOrFail($id);

        $validated = $request->validate([
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            // Ovde idKorisnik mora biti naveden da ignorisao trenutnog korisnika pri proveri unique
            'username' => 'sometimes|string|unique:korisnik,username,' . $id . ',idKorisnik',
            'password' => 'sometimes|string|min:3
            ',
            'uloga' => 'sometimes|in:dete,obican,admin',
        ]);

        if (isset($validated['password'])) {
            $validated ['password'] = bcrypt($validated['password']);
        }

        $korisnik->update($validated);
        return response()->json($korisnik);
    }

    // Brisanje korisnika
    public function destroy($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        $korisnik->delete();

        return response()->json(['message' => 'Korisnik obrisan.']);
    }
}