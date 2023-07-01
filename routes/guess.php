<?php

use App\Http\Controllers\Shared\DocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('shared')->prefix('shared')->as('shared.')->group(function() {
	Route::get('/document', [DocumentController::class, 'show'])->name("document.show");
});