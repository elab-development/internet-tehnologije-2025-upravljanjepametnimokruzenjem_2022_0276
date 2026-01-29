<?php

namespace App\Http\Controllers;

use App\Models\Uredjaj;
use Illuminate\Http\Request;

class UredjajController extends Controller
{
    public function index()
    {
        return response()->json(Uredjaj::with('soba', 'stanja')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'marka' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'tipUredjaja' => 'required|string|max:255',
            'soba_id' => 'nullable|exists:soba,rbSoba',
        ]);

        $uredjaj = Uredjaj::create($validated);

        return response()->json($uredjaj, 201);
    }

    public function show($id)
    {
        $uredjaj = Uredjaj::with('soba', 'stanja')->findOrFail($id);
        return response()->json($uredjaj);
    }

    public function update(Request $request, $id)
    {
        $uredjaj = Uredjaj::findOrFail($id);

        $validated = $request->validate([
            'marka' => 'sometimes|string|max:255',
            'model' => 'sometimes|string|max:255',
            'tipUredjaja' => 'sometimes|string|max:255',
            'soba_id' => 'nullable|exists:soba,rbSoba',
        ]);

        $uredjaj->update($validated);

        return response()->json($uredjaj);
    }

    public function destroy($id)
    {
        $uredjaj = Uredjaj::findOrFail($id);
        $uredjaj->delete();

        return response()->json(['message' => 'Uredjaj obrisan']);
    }
}
