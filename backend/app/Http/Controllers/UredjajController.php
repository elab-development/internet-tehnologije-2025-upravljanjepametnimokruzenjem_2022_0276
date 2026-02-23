<?php

namespace App\Http\Controllers;

use App\Models\Uredjaj;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Katalog Uređaja", description="Upravljanje tipovima uređaja dostupnim u sistemu")
 */
class UredjajController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/uredjaji",
     * summary="Vraća listu svih dostupnih uređaja u katalogu",
     * tags={"Katalog Uređaja"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešno učitana lista uređaja")
     * )
     */
    public function index()
    {
        return response()->json(Uredjaj::all());
    }

    /**
     * @OA\Post(
     * path="/api/uredjaji",
     * summary="Dodavanje novog tipa uređaja u katalog",
     * tags={"Katalog Uređaja"},
     * security={{"sanctum": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="marka", type="string", example="Samsung"),
     * @OA\Property(property="model", type="string", example="WindFree Gen2"),
     * @OA\Property(property="tipUredjaja", type="string", example="Klima")
     * )
     * ),
     * @OA\Response(response=201, description="Uređaj uspešno dodat u katalog")
     * )
     */
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

    /**
     * @OA\Get(
     * path="/api/uredjaji/{id}",
     * summary="Detalji o uređaju sa istorijom stanja",
     * tags={"Katalog Uređaja"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Uspešno učitani detalji uređaja")
     * )
     */
    public function show($id)
    {
        $uredjaj = Uredjaj::with('stanja')->findOrFail($id);
        return response()->json($uredjaj);
    }

    /**
     * @OA\Put(
     * path="/api/uredjaji/{id}",
     * summary="Izmena informacija o uređaju u katalogu",
     * tags={"Katalog Uređaja"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="marka", type="string"),
     * @OA\Property(property="model", type="string"),
     * @OA\Property(property="tipUredjaja", type="string", enum={"Klima", "Svetlo", "Grejalica"})
     * )
     * ),
     * @OA\Response(response=200, description="Uređaj uspešno ažuriran")
     * )
     */
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

    /**
     * @OA\Delete(
     * path="/api/uredjaji/{id}",
     * summary="Brisanje uređaja iz kataloga",
     * tags={"Katalog Uređaja"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Uređaj obrisan")
     * )
     */
    public function destroy($id)
    {
        $uredjaj = Uredjaj::findOrFail($id);
        $uredjaj->delete();
        return response()->json(['message' => 'Uređaj je uspešno obrisan.']);
    }
}