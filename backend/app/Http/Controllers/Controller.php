<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;



/**
 * @OA\Info(
 * title="Sistem Pametne Kuće API",
 * version="1.0.0",
 * description="API dokumentacija sistema za upravljanje pametnim uredjajima.",
 * @OA\Contact(
 * email="admin@example.com"
 * )
 * )
 *
 * @OA\Server(
 * url="http://localhost:8000",
 * description="Lokalni razvojni server"
 * )
 *
 * @OA\SecurityScheme(
 * type="http",
 * description="Ovde unesite access_token dobijen nakon logovanja.",
 * name="Authorization",
 * in="header",
 * scheme="bearer",
 * bearerFormat="JWT",
 * securityScheme="sanctum"
 * )
 */
class Controller extends BaseController
{   
    //php artisan l5-swagger:generate
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}