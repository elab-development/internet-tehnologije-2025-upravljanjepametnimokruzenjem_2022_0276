<?php

namespace App\Http\Controllers;

use App\Models\Stan;
use Illuminate\Http\Request;

class StanController extends Controller
{
    public function index()
    {
        return response()->json(Stan::with('korisnik')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresa' => 'required|string|max:255',
            'brojStana' => 'required|integer',
            'sprat' => 'required|integer',
            'vlasnik_id' => 'required|exists:korisnik,idKorisnik',
        ]);

        $stan = Stan::create($validated);

        return response()->json($stan, 201);
    }

    public function show($id)
    {
        $stan = Stan::with('korisnik', 'sobe')->findOrFail($id);
        return response()->json($stan);
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
}
