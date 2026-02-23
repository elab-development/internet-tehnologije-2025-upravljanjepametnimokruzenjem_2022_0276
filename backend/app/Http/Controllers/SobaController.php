<?php

namespace App\Http\Controllers;

use App\Models\Soba;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Sobe", description="Upravljanje sobama unutar objekata")
 */
class SobaController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/sobe",
     * summary="Izlistaj sve sobe",
     * tags={"Sobe"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešno učitane sobe sa podacima o stanu")
     * )
     */
    public function index()
    {
        return response()->json(Soba::with('stan')->get());
    }

    /**
     * @OA\Post(
     * path="/api/sobe",
     * summary="Kreiraj novu sobu",
     * tags={"Sobe"},
     * security={{"sanctum": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="nazivSobe", type="string", example="Dnevna soba"),
     * @OA\Property(property="stan_id", type="integer", example=1)
     * )
     * ),
     * @OA\Response(response=201, description="Soba uspešno kreirana"),
     * @OA\Response(response=403, description="Zabranjeno (Uloga 'dete' ili niste vlasnik stana)"),
     * @OA\Response(response=422, description="Validaciona greška")
     * )
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->uloga === 'dete') {
            return response()->json([
                'message' => 'Korisnici sa ulogom "dete" nemaju dozvolu za dodavanje soba.'
            ], 403);
        }

        $validated = $request->validate([
            'nazivSobe' => 'required|string|max:255',
            'stan_id' => 'required|exists:stan,idStan',
        ]);

        $stan = \App\Models\Stan::findOrFail($request->stan_id);

        if ($stan->vlasnik_id !== $user->idKorisnik) {
            return response()->json([
                'message' => 'Možete dodavati sobe samo u objekte čiji ste vlasnik.'
            ], 403);
        }

        $soba = Soba::create($validated);

        return response()->json([
            'message' => 'Soba je uspešno kreirana.',
            'data' => $soba
        ], 201);
    }

    /**
     * @OA\Get(
     * path="/api/sobe/{id}",
     * summary="Prikaži detalje sobe i uređaje",
     * tags={"Sobe"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Prikaz sobe sa stanjima svih uređaja"),
     * @OA\Response(response=404, description="Soba nije pronađena")
     * )
     */
    public function show($id)
    {
        $soba = Soba::with(['stan', 'stanjaUredjaja.uredjaj'])->findOrFail($id);
        return response()->json($soba);
    }

    /**
     * @OA\Put(
     * path="/api/sobe/{id}",
     * summary="Ažuriraj podatke o sobi",
     * tags={"Sobe"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="nazivSobe", type="string", example="Spavaća soba"),
     * @OA\Property(property="stan_id", type="integer")
     * )
     * ),
     * @OA\Response(response=200, description="Soba uspešno ažurirana")
     * )
     */
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

    /**
     * @OA\Delete(
     * path="/api/sobe/{id}",
     * summary="Obriši sobu",
     * tags={"Sobe"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Soba obrisana")
     * )
     */
    public function destroy($id)
    {
        $soba = Soba::findOrFail($id);
        $soba->delete();

        return response()->json(['message' => 'Soba je obrisana.']);
    }
}