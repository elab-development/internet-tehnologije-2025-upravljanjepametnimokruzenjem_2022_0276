<?php

namespace App\Http\Controllers;

use App\Models\StanjeUredjaja;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Stanja Uređaja (Komande)", description="Upravljanje statusima i izvršavanje komandi nad uređajima")
 */
class StanjeUredjajaController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/stanje-uredjaja",
     * summary="Istorija i trenutna stanja svih uređaja",
     * tags={"Stanja Uređaja (Komande)"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešno učitana stanja")
     * )
     */
    public function index()
    {
        return response()->json(StanjeUredjaja::with(['uredjaj', 'soba'])->get());
    }

    /**
     * @OA\Post(
     * path="/api/stanje-uredjaja",
     * summary="Dodaj uređaj u sobu (kreiraj početno stanje)",
     * tags={"Stanja Uređaja (Komande)"},
     * security={{"sanctum": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="nazivUredjaja", type="string", example="Klima Dnevna"),
     * @OA\Property(property="ukljucen", type="boolean", example=true),
     * @OA\Property(property="podesavanja", type="object", example={"temp": 24, "mod": "hladjenje"}),
     * @OA\Property(property="uredjaj_id", type="integer", example=1),
     * @OA\Property(property="soba_id", type="integer", example=1)
     * )
     * ),
     * @OA\Response(response=201, description="Stanje uspešno kreirano"),
     * @OA\Response(response=422, description="Validaciona greška")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nazivUredjaja' => 'required|string',
            'ukljucen'      => 'required|boolean',
            'podesavanja'   => 'required|array',
            'uredjaj_id'    => 'required|exists:uredjaj,idUredjaj',
            'soba_id'       => 'required|exists:soba,rbSoba',
        ]);

        $stanje = StanjeUredjaja::create($validated);

        return response()->json($stanje, 201);
    }

    /**
     * @OA\Put(
     * path="/api/stanje-uredjaja/{id}",
     * summary="Izvrši komandu (Promeni stanje/podešavanja uređaja)",
     * description="Koristi se za paljenje/gašenje ili promenu parametara poput temperature.",
     * tags={"Stanja Uređaja (Komande)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="ukljucen", type="boolean", example=false),
     * @OA\Property(property="podesavanja", type="object", example={"temp": 22})
     * )
     * ),
     * @OA\Response(response=200, description="Komanda uspešno izvršena"),
     * @OA\Response(response=404, description="Uređaj nije pronađen")
     * )
     */
    public function update(Request $request, $id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);

        $validated = $request->validate([
            'ukljucen'    => 'sometimes|boolean',
            'podesavanja' => 'sometimes|array',
        ]);

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

    /**
     * @OA\Delete(
     * path="/api/stanje-uredjaja/{id}",
     * summary="Ukloni uređaj iz sobe (briše stanje)",
     * tags={"Stanja Uređaja (Komande)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Stanje obrisano")
     * )
     */
    public function destroy($id)
    {
        $stanje = StanjeUredjaja::findOrFail($id);
        $stanje->delete();
        return response()->json(['message' => 'Stanje obrisano.']);
    }
}