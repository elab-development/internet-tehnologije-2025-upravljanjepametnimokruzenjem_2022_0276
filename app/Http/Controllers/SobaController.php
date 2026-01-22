<?php

namespace App\Http\Controllers;

use App\Models\Soba;
use Illuminate\Http\Request;

class SobaController extends Controller
{
    public function index()
    {
        return response()->json(Soba::with('stan')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazivSobe' => 'required|string|max:255',
            'stan_id' => 'required|exists:stan,idStan',
        ]);

        $soba = Soba::create($validated);

        return response()->json($soba, 201);
    }

    public function show($id)
    {
        $soba = Soba::with('stan', 'uredjaji')->findOrFail($id);
        return response()->json($soba);
    }

    public function update(Request $request, $id)
    {
        $soba = Soba::findOrFail($id);

        $validated = $request->validate([
            'nazivSobe' => 'sometimes|string|max:255',
            'stan_id' => 'sometimes|exists:stan,idStan',
        ]);

        $soba->update($validated);

        return response()->json($soba);
    }

    public function destroy($id)
    {
        $soba = Soba::findOrFail($id);
        $soba->delete();

        return response()->json(['message' => 'Soba obrisana']);
    }
}
