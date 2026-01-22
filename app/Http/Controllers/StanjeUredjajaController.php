<?php

namespace App\Http\Controllers;

use App\Models\StanjeUredjaja;
use Illuminate\Http\Request;

class StanjeUredjajaController extends Controller
{
    public function index()
    {
        return response()->json(StanjeUredjaja::with('uredjaj')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazivUredjaja' => 'required|string|max:255',
            'ukljucen' => 'required|boolean',
            'podesavanja' => 'nullable|string',
            'uredjaj_id' => 'required|exists:uredjaj,idUredjaj',
        ]);

        $stanje = StanjeUredjaja::create($validated);

        return response()->json($stanje, 201);
    }

    public function show($id)
    {
        $stanje = StanjeUredjaja::with('uredjaj')->findOrFail($id);
        return response()->json($stanje);
    }

    public function update(Request $request, $id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);

        $validated = $request->validate([
            'nazivUredjaja' => 'sometimes|string|max:255',
            'ukljucen' => 'sometimes|boolean',
            'podesavanja' => 'nullable|string',
            'uredjaj_id' => 'sometimes|exists:uredjaj,idUredjaj',
        ]);

        $stanje->update($validated);

        return response()->json($stanje);
    }

    public function destroy($id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);
        $stanje->delete();

        return response()->json(['message' => 'Stanje uređaja obrisano']);
    }
}
