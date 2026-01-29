<?php

namespace App\Http\Controllers;

use App\Models\StanjeUredjaja;
use Illuminate\Http\Request;

class StanjeUredjajaController extends Controller
{
    // 1. Prikaz svih stanja (npr. istorija svih promena u sistemu)
    public function index()
    {
        return response()->json(StanjeUredjaja::with(['uredjaj', 'soba'])->get());
    }

    // 2. Kreiranje novog stanja (npr. kada se doda novi uređaj u sobu)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazivUredjaja' => 'required|string',
            'ukljucen'      => 'required|boolean',
            'podesavanja'   => 'required|array', // Laravel cast-uje niz u JSON
            'uredjaj_id'    => 'required|exists:uredjaj,idUredjaj',
            'soba_id'       => 'required|exists:soba,rbSoba',
        ]);

        $stanje = StanjeUredjaja::create($validated);

        return response()->json($stanje, 201);
    }

    // 3. Promena stanja (KOMANDA: npr. upali svetlo ili promeni temperaturu)
    public function update(Request $request, $id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);

        // Dozvoljavamo delimično ažuriranje (samo status ili samo jedan parametar u JSON-u)
        $validated = $request->validate([
            'ukljucen'    => 'sometimes|boolean',
            'podesavanja' => 'sometimes|array',
        ]);

        // Ako šalješ nova podešavanja, spajamo ih sa starim da ne obrišemo postojeće parametre
        if ($request->has('podesavanja')) {
            $novaPodesavanja = array_merge($stanje->podesavanja ?? [], $request->podesavanja);
            $stanje->podesavanja = $novaPodesavanja;
        }

        if ($request->has('ukljucen')) {
            $stanje->ukljucen = $request->ukljucen;
        }

        $stanje->save();

        return response()->json([
            'message' => 'Komanda izvršena.',
            'novo_stanje' => $stanje
        ]);
    }

    // 4. Brisanje stanja
    public function destroy($id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);
        $stanje->delete();
        return response()->json(['message' => 'Stanje obrisano.']);
    }
}