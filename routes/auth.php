<?php

use App\Http\Controllers\Auth\UserAuthController;
use Illuminate\Support\Facades\Route;

Route::get('login', [UserAuthController::class, 'create'])->name('login');
Route::post('login', [UserAuthController::class, 'store']);
Route::get('register', [UserAuthController::class, 'register'])->name('register');
Route::post('logout', [UserAuthController::class, 'destroy'])->middleware('auth');

