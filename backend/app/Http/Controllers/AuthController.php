<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Korisnik;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(name="Autentifikacija", description="Operacije za prijavu, registraciju i odjavu")
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     * path="/api/login",
     * summary="Prijava korisnika",
     * tags={"Autentifikacija"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="username", type="string", example="admin"),
     * @OA\Property(property="password", type="string", example="password123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Uspešna prijava",
     * @OA\JsonContent(
     * @OA\Property(property="access_token", type="string"),
     * @OA\Property(property="token_type", type="string", example="Bearer"),
     * @OA\Property(property="user", type="object")
     * )
     * ),
     * @OA\Response(response=401, description="Pogrešni podaci")
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $korisnik = Korisnik::where('username', $request->username)->first();

        if (!$korisnik || !Hash::check($request->password, $korisnik->password)) {
            return response()->json([
                'message' => 'Pogrešni podaci za prijavu.'
            ], 401);
        }

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $korisnik
        ]);
    }

    /**
     * @OA\Post(
     * path="/api/logout",
     * summary="Odjava korisnika",
     * tags={"Autentifikacija"},
     * security={{"sanctum": {}}},
     * @OA\Response(response=200, description="Uspešna odjava"),
     * @OA\Response(response=401, description="Neautorizovan pristup")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se odjavili, token je obrisan.'
        ], 200);
    }

    /**
     * @OA\Post(
     * path="/api/register",
     * summary="Registracija novog korisnika",
     * tags={"Autentifikacija"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="ime", type="string", example="Marko"),
     * @OA\Property(property="prezime", type="string", example="Markovic"),
     * @OA\Property(property="username", type="string", example="marko123"),
     * @OA\Property(property="password", type="string", example="password123"),
     * @OA\Property(property="uloga", type="string", enum={"admin", "dete", "obican"}, example="obican")
     * )
     * ),
     * @OA\Response(response=201, description="Korisnik uspešno kreiran"),
     * @OA\Response(response=422, description="Validaciona greška")
     * )
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:korisnik,username',
            'password' => 'required|string|min:8',
            'uloga' => 'required|string|in:admin,dete,obican',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $korisnik = Korisnik::create([
            'ime' => $request->ime,
            'prezime' => $request->prezime,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'uloga' => $request->uloga,
        ]);

        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => $korisnik,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}