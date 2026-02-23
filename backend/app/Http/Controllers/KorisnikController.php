<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Korisnici", description="Upravljanje korisnicima sistema (Admin operacije)")
 */
class KorisnikController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/korisnici",
     * summary="Prikaz svih korisnika",
     * tags={"Korisnici"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešno učitana lista korisnika"),
     * @OA\Response(response=401, description="Neautorizovan pristup")
     * )
     */
    public function index()
    {
        return response()->json(Korisnik::all());
    }

    /**
     * @OA\Post(
     * path="/api/korisnici",
     * summary="Kreiranje novog korisnika",
     * tags={"Korisnici"},
     * security={{"sanctum": {}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="ime", type="string", example="Petar"),
     * @OA\Property(property="prezime", type="string", example="Petrović"),
     * @OA\Property(property="username", type="string", example="petar123"),
     * @OA\Property(property="password", type="string", example="lozinka123"),
     * @OA\Property(property="uloga", type="string", enum={"admin", "obican", "dete"}, example="obican")
     * )
     * ),
     * @OA\Response(response=201, description="Korisnik uspešno kreiran"),
     * @OA\Response(response=422, description="Greška pri validaciji")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|unique:korisnik,username',
            'password' => 'required|string|min:6',
            'uloga' => 'required|in:dete,obican,admin',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $korisnik = Korisnik::create($validated);

        return response()->json($korisnik, 201);
    }

    /**
     * @OA\Get(
     * path="/api/korisnici/{id}",
     * summary="Prikaz detalja jednog korisnika",
     * tags={"Korisnici"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, description="ID korisnika", @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Uspešno pronađen korisnik"),
     * @OA\Response(response=404, description="Korisnik nije pronađen")
     * )
     */
    public function show($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        return response()->json($korisnik);
    }

    /**
     * @OA\Put(
     * path="/api/korisnici/{id}",
     * summary="Izmena podataka o korisniku",
     * tags={"Korisnici"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, description="ID korisnika", @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="ime", type="string"),
     * @OA\Property(property="prezime", type="string"),
     * @OA\Property(property="username", type="string"),
     * @OA\Property(property="password", type="string"),
     * @OA\Property(property="uloga", type="string", enum={"admin", "obican", "dete"})
     * )
     * ),
     * @OA\Response(response=200, description="Podaci uspešno ažurirani"),
     * @OA\Response(response=404, description="Korisnik nije pronađen")
     * )
     */
    public function update(Request $request, $id)
    {
        $korisnik = Korisnik::findOrFail($id);

        $validated = $request->validate([
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|unique:korisnik,username,' . $id . ',idKorisnik',
            'password' => 'sometimes|string|min:3',
            'uloga' => 'sometimes|in:dete,obican,admin',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $korisnik->update($validated);
        return response()->json($korisnik);
    }

    /**
     * @OA\Delete(
     * path="/api/korisnici/{id}",
     * summary="Brisanje korisnika",
     * tags={"Korisnici"},
     * security={{"sanctum": {}}},
     * @OA\Parameter(name="id", in="path", required=true, description="ID korisnika", @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Korisnik uspešno obrisan"),
     * @OA\Response(response=404, description="Korisnik nije pronađen")
     * )
     */
    public function destroy($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        $korisnik->delete();

        return response()->json(['message' => 'Korisnik obrisan.']);
    }
}