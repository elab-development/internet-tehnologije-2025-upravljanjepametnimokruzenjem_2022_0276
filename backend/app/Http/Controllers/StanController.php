<?php

namespace App\Http\Controllers;

use App\Models\Stan;
use Illuminate\Http\Request;

class StanController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Ključno je ugnjezditi sve relacije kroz 'with'
        $vlasnik = $user->mojiStanoviVlasnik()
            ->with(['sobe.stanjaUredjaja.uredjaj'])
            ->get();

        $stanar = $user->stanoviGdeBoravim()
            ->with(['sobe.stanjaUredjaja.uredjaj'])
            ->get();

        return response()->json([
            'vlasnik' => $vlasnik,
            'stanar' => $stanar
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresa' => 'required|string',
            'brojStana' => 'required|integer',
            'sprat' => 'required|integer',
            'vlasnik_id' => 'required|exists:korisnik,idKorisnik',
        ]);

        $stan = Stan::create($validated);
        return response()->json($stan, 201);
    }

    public function show($id)
    {
        // Koristimo idStan jer je to PK
        return response()->json(Stan::with(['vlasnik', 'sobe'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $stan = Stan::findOrFail($id);

        $validated = $request->validate([
            'adresa' => 'sometimes|string|max:255',
            'brojStana' => 'sometimes|integer',
            'sprat' => 'sometimes|integer',
            'vlasnik_id' => 'sometimes|exists:korisnik,idKorisnik',
        ]);

        $stan->update($validated);

        return response()->json($stan);
    }

    public function destroy($id)
    {
        $stan = Stan::findOrFail($id);
        $stan->delete();

        return response()->json(['message' => 'Stan obrisan']);
    }

    public function dodajStanara(Request $request, $idStan)
    {
        $stan = Stan::findOrFail($idStan);

        $request->validate([
            'korisnik_id' => 'required|exists:korisnik,idKorisnik'
        ]);

        // attach dodaje red u pivot tabelu korisnik_stan
        $stan->korisnici()->attach($request->korisnik_id);

        return response()->json(['message' => 'Stanar uspešno dodat u stan.']);
    }

}
