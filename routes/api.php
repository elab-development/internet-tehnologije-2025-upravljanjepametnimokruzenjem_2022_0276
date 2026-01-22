<?php

use Illuminate\Support\Facades\Route;

// Test ping ruta
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});

/*
|--------------------------------------------------------------------------
| API Routes sa punim namespace-om
|--------------------------------------------------------------------------
|
| Ovo je Laravel 8 sa $namespace=null u RouteServiceProvider
|
*/

// CRUD za korisnike
Route::apiResource('korisnici', \App\Http\Controllers\KorisnikController::class);

// CRUD za stanove
Route::apiResource('stanovi', \App\Http\Controllers\StanController::class);

// CRUD za sobe
Route::apiResource('sobe', \App\Http\Controllers\SobaController::class);

// CRUD za uredjaje
Route::apiResource('uredjaji', \App\Http\Controllers\UredjajController::class);

// CRUD za stanje uredjaja
Route::apiResource('stanja-uredjaja', \App\Http\Controllers\StanjeUredjajaController::class);
