<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});


// ZAŠTIĆENE RUTE 
Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('korisnici', \App\Http\Controllers\KorisnikController::class);
    Route::apiResource('stanovi', \App\Http\Controllers\StanController::class);
    Route::apiResource('sobe', \App\Http\Controllers\SobaController::class);
    Route::apiResource('uredjaji', \App\Http\Controllers\UredjajController::class);
    Route::apiResource('stanja-uredjaja', \App\Http\Controllers\StanjeUredjajaController::class);

    Route::post('/logout', [AuthController::class, 'logout']);
});