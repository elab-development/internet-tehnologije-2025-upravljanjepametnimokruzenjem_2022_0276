<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use App\Models\Stan;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Objekti (Stanovi)", description="Upravljanje stambenim objektima i stanarima")
 */
class StanController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/stanovi",
     * summary="Prikaz svih objekata korisnika (gde je vlasnik ili stanar)",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešno vraćeni podaci o objektima")
     * )
     */
    public function index()
    {
        $user = auth()->user();

        $vlasnikStanovi = Stan::with(['sobe.stanjaUredjaja.uredjaj', 'korisnici'])
            ->where('vlasnik_id', $user->idKorisnik)
            ->get();

        $stanarStanovi = $user->stanoviGdeBoravim()
            ->with(['sobe.stanjaUredjaja.uredjaj', 'korisnici'])
            ->get();

        return response()->json([
            'vlasnik' => $vlasnikStanovi,
            'stanar' => $stanarStanovi
        ]);
    }

    /**
     * @OA\Post(
     * path="/api/stanovi",
     * summary="Dodaj novi stambeni objekat",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="adresa", type="string", example="Bulevar Kralja Aleksandra 12"),
     * @OA\Property(property="brojStana", type="integer", example=5),
     * @OA\Property(property="sprat", type="integer", example=2)
     * )
     * ),
     * @OA\Response(response=201, description="Objekat kreiran")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresa' => 'required|string|max:255',
            'brojStana' => 'required|integer',
            'sprat' => 'required|integer',
        ]);

        $validated['vlasnik_id'] = auth()->id();
        $stan = Stan::create($validated);
        $stan->load('sobe');

        return response()->json($stan, 201);
    }

    /**
     * @OA\Get(
     * path="/api/stanovi/{id}",
     * summary="Prikaz detalja objekta",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Uspešno vraćen objekat")
     * )
     */
    public function show($id)
    {
        return response()->json(Stan::with(['vlasnik', 'sobe'])->findOrFail($id));
    }

    /**
     * @OA\Put(
     * path="/api/stanovi/{id}",
     * summary="Izmena podataka o objektu",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Uspešno ažurirano"),
     * @OA\Response(response=403, description="Niste vlasnik objekta")
     * )
     */
    public function update(Request $request, $id)
    {
        $stan = Stan::findOrFail($id);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        $validated = $request->validate([
            'adresa' => 'sometimes|string|max:255',
            'brojStana' => 'sometimes|integer',
            'sprat' => 'sometimes|integer',
        ]);

        $stan->update($validated);
        return response()->json($stan->load('korisnici'));
    }

    /**
     * @OA\Post(
     * path="/api/stanovi/{idStan}/ukloni-stanara",
     * summary="Ukloni stanara iz objekta",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="idStan", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(@OA\Property(property="korisnik_id", type="integer", example=2))
     * ),
     * @OA\Response(response=200, description="Stanar uklonjen"),
     * @OA\Response(response=403, description="Niste vlasnik objekta")
     * )
     */
    public function ukloniStanara(Request $request, $idStan)
    {
        $stan = Stan::findOrFail($idStan);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        $stan->korisnici()->detach($request->korisnik_id);
        return response()->json(['message' => 'Stanar uklonjen']);
    }

    /**
     * @OA\Post(
     * path="/api/stanovi/{idStan}/dodaj-stanara",
     * summary="Dodaj stanara u objekat preko korisničkog imena",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="idStan", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(@OA\Property(property="username", type="string", example="marko123"))
     * ),
     * @OA\Response(response=200, description="Stanar uspešno dodat"),
     * @OA\Response(response=403, description="Niste vlasnik objekta"),
     * @OA\Response(response=404, description="Korisnik ne postoji"),
     * @OA\Response(response=422, description="Korisnik je već stanar")
     * )
     */
    public function dodajStanaraPoUsername(Request $request, $idStan)
    {
        $request->validate(['username' => 'required|string']);

        $stan = Stan::findOrFail($idStan);
        if ($stan->vlasnik_id !== auth()->id())
            return response()->json(['message' => 'Niste vlasnik'], 403);

        $korisnik = Korisnik::where('username', $request->username)->first();

        if (!$korisnik) {
            return response()->json(['message' => 'Korisnik sa tim username-om ne postoji'], 404);
        }

        if ($stan->korisnici()->where('korisnik_id', $korisnik->idKorisnik)->exists()) {
            return response()->json(['message' => 'Korisnik je već stanar ovog objekta'], 422);
        }

        $stan->korisnici()->attach($korisnik->idKorisnik);

        return response()->json([
            'message' => 'Stanar uspešno dodat',
            'korisnik' => $korisnik
        ]);
    }

    /**
     * @OA\Delete(
     * path="/api/stanovi/{id}",
     * summary="Obriši objekat",
     * tags={"Objekti (Stanovi)"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Objekat obrisan"),
     * @OA\Response(response=404, description="Objekat nije pronađen")
     * )
     */
    public function destroy($id)
    {
        $stan = Stan::findOrFail($id);
        $stan->delete();

        return response()->json(['message' => 'Stan obrisan']);
    }


    // Ne koristi se u ovoj verziji
    public function dodajStanara(Request $request, $idStan)
    {
        $stan = Stan::findOrFail($idStan);
        $request->validate([
            'korisnik_id' => 'required|exists:korisnik,idKorisnik'
        ]);
        $stan->korisnici()->attach($request->korisnik_id);
        return response()->json(['message' => 'Stanar uspešno dodat u stan.']);
    }
}