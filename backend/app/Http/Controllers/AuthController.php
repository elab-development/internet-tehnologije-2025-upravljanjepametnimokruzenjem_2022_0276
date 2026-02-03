<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Korisnik;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
}