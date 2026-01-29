<?php

namespace App\Http\Controllers;

use App\Models\Soba;
use Illuminate\Http\Request;

class SobaController extends Controller
{
    // 1. Izlistaj sve sobe (opciono sa informacijama o stanu)
    public function index()
    {
        return response()->json(Soba::with('stan')->get());
    }

    // 2. Kreiraj novu sobu unutar stana
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazivSobe' => 'required|string|max:255',
            'stan_id'   => 'required|exists:stan,idStan', // Proverava da li stan postoji
        ]);

        $soba = Soba::create($validated);

        return response()->json([
            'message' => 'Soba je uspešno kreirana.',
            'data' => $soba
        ], 201);
    }

    // 3. Prikaži jednu sobu i sva stanja uređaja u njoj
    public function show($id)
    {
        // Na šemi soba "ima" stanja uređaja (crni romb), pa ih učitavamo ovde
        $soba = Soba::with(['stan', 'stanjaUredjaja.uredjaj'])->findOrFail($id);
        
        return response()->json($soba);
    }

    // 4. Ažuriraj sobu
    public function update(Request $request, $id)
    {
        $soba = Soba::findOrFail($id);

        $validated = $request->validate([
            'nazivSobe' => 'sometimes|string|max:255',
            'stan_id'   => 'sometimes|exists:stan,idStan',
        ]);

        $soba->update($validated);

        return response()->json($soba);
    }

    // 5. Obriši sobu
    public function destroy($id)
    {
        $soba = Soba::findOrFail($id);
        $soba->delete();

        return response()->json(['message' => 'Soba je obrisana.']);
    }
}