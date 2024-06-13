<?php

use App\Http\Controllers\KitController;
use App\Http\Controllers\PatternController;
use App\Http\Controllers\SampleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('/kit',KitController::class);
Route::resource('/sample',SampleController::class);
Route::resource('/pattern', PatternController::class);
/* 
Route::middleware('cors')->group(function () {
    Route::resource('/kit',KitController::class);
    Route::resource('/sample',SampleController::class); 
}); */
