<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\UserAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('login', [UserAuthController::class, 'create'])->name('login');
Route::post('login', [UserAuthController::class, 'store']);
Route::get('register', [RegisteredUserController::class, 'create'])->name('create');
Route::post('register', [RegisteredUserController::class, 'store'])->name('register');
Route::get('reset-password', fn () => Inertia::render("Auth/ResetPasswordPage"))->name('resetpassword');
Route::post('logout', [UserAuthController::class, 'destroy'])->middleware('auth');

