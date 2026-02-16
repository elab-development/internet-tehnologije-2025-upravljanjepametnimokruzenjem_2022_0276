<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use App\Models\Stan;
use Illuminate\Http\Request;

class StanController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Ucitavanje stanova za one gde je on vlasnik "join" sobe, stanja uredjaja i uredjaji, 
        // kao i korisnici, sto su ovom slucaju stanari stana 
        $vlasnikStanovi = Stan::with(['sobe.stanjaUredjaja.uredjaj', 'korisnici'])
            ->where('vlasnik_id', $user->idKorisnik)
            ->get();

        // Ucitavanje stanova gde je stanar
        // isti joini
        $stanarStanovi = $user->stanoviGdeBoravim()
            ->with(['sobe.stanjaUredjaja.uredjaj', 'korisnici'])
            ->get();

        return response()->json([
            'vlasnik' => $vlasnikStanovi,
            'stanar' => $stanarStanovi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresa' => 'required|string|max:255',
            'brojStana' => 'required|integer',
            'sprat' => 'required|integer',
        ]);

        // Dodajemo ulogovanog korisnika kao vlasnika
        $validated['vlasnik_id'] = auth()->id();

        $stan = Stan::create($validated);


        $stan->load('sobe');

        return response()->json($stan, 201);
    }

    public function show($id)
    {
        return response()->json(Stan::with(['vlasnik', 'sobe'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $stan = Stan::findOrFail($id);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        $validated = $request->validate([
            'adresa' => 'sometimes|string|max:255',
            'brojStana' => 'sometimes|integer',
            'sprat' => 'sometimes|integer',
        ]);

        $stan->update($validated);
        return response()->json($stan->load('korisnici'));
    }

    public function ukloniStanara(Request $request, $idStan)
    {
        $stan = Stan::findOrFail($idStan);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        // detach uklanja vezu iz pivot tabele
        $stan->korisnici()->detach($request->korisnik_id);
        return response()->json(['message' => 'Stanar uklonjen']);
    }

    public function dodajStanaraPoUsername(Request $request, $idStan)
    {
        $request->validate(['username' => 'required|string']);

        $stan = Stan::findOrFail($idStan);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        $korisnik = Korisnik::where('username', $request->username)->first();

        if (!$korisnik) {
            return response()->json(['message' => 'Korisnik sa tim username-om ne postoji'], 404);
        }

        // Provera da li je već stanar
        if ($stan->korisnici()->where('korisnik_id', $korisnik->idKorisnik)->exists()) {
            return response()->json(['message' => 'Korisnik je već stanar ovog objekta'], 422);
        }

        $stan->korisnici()->attach($korisnik->idKorisnik);

        return response()->json([
            'message' => 'Stanar uspešno dodat',
            'korisnik' => $korisnik
        ]);
    }

    public function destroy($id)
    {
        $stan = Stan::findOrFail($id);
        $stan->delete();

        return response()->json(['message' => 'Stan obrisan']);
    }

    // ne koristi se u ovoj verziji
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
