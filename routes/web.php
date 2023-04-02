<?php

use App\Http\Controllers\ImagesController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/example.php';
require __DIR__.'/dashboard.php';

require __DIR__.'/auth.php';

Route::get('/image/{path}', [ImagesController::class, 'showImage'])
	->where('path', '.*')
	->name('image');

Route::get('/file/{path}', [ImagesController::class, 'showFile'])
	->where('path', '.*')
	->name('file');

