<?php

namespace App\Http\Controllers;

use App\Models\Uredjaj;
use Illuminate\Http\Request;

class UredjajController extends Controller
{
    // 1. Vraća listu svih dostupnih uređaja u sistemu
    public function index()
    {
        return response()->json(Uredjaj::all());
    }

    // 2. Dodavanje novog tipa uređaja u katalog (npr. Samsung Klima)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'marka'       => 'required|string|max:255',
            'model'       => 'required|string|max:255',
            'tipUredjaja' => 'required|string|max:255',
        ]);

        $uredjaj = Uredjaj::create($validated);

        return response()->json($uredjaj, 201);
    }

    // 3. Detalji o uređaju sa svim njegovim stanjima (istorija)
    public function show($id)
    {
        // Koristi idUredjaj jer smo ga tako definisali u modelu
        $uredjaj = Uredjaj::with('stanja')->findOrFail($id);
        return response()->json($uredjaj);
    }

    // 4. Izmena informacija o uređaju
    public function update(Request $request, $id)
    {
        $uredjaj = Uredjaj::findOrFail($id);

        $validated = $request->validate([
            'marka'       => 'sometimes|string|max:255',
            'model'       => 'sometimes|string|max:255',
            'tipUredjaja' => 'required|in:Klima,Svetlo,Grejalica',
        ]);

        $uredjaj->update($validated);
        return response()->json($uredjaj);
    }

    // 5. Brisanje uređaja iz sistema
    public function destroy($id)
    {
        $uredjaj = Uredjaj::findOrFail($id);
        $uredjaj->delete();
        return response()->json(['message' => 'Uređaj je uspešno obrisan.']);
    }
}