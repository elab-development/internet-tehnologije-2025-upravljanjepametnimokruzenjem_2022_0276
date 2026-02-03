<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Korisnik;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $korisnik = Korisnik::where('username', $request->username)->first();

        // Provera da li korisnik postoji i da li je šifra ispravna
        if (!$korisnik || !Hash::check($request->password, $korisnik->password)) {
            return response()->json([
                'message' => 'Pogrešni podaci za prijavu.'
            ], 401);
        }

        // Kreiranje tokena (ovaj string 'api-token' može biti bilo šta)
        $token = $korisnik->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $korisnik
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se odjavili, token je obrisan.'
        ], 200);
    }

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