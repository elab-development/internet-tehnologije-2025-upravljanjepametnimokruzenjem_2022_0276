<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StanController; // Dodaj import ako već nije tu

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});


// ZAŠTIĆENE RUTE 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    
    // NOVE RUTE ZA STANARE (Dodaj ih pre apiResource)
    Route::post('/stanovi/{idStan}/dodaj-stanara', [StanController::class, 'dodajStanaraPoUsername']);
    Route::post('/stanovi/{idStan}/ukloni-stanara', [StanController::class, 'ukloniStanara']);

    Route::apiResource('korisnici', \App\Http\Controllers\KorisnikController::class);
    Route::apiResource('stanovi', StanController::class);
    Route::apiResource('sobe', \App\Http\Controllers\SobaController::class);
    Route::apiResource('uredjaji', \App\Http\Controllers\UredjajController::class);
    Route::apiResource('stanja-uredjaja', \App\Http\Controllers\StanjeUredjajaController::class);

    Route::post('/logout', [AuthController::class, 'logout']);
});