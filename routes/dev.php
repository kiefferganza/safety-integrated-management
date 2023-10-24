<?php

use App\Mail\NewDocumentMail;
use App\Mail\NewTrainingMail;
use App\Models\Document;
use App\Models\Training;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function() {
	if(app()->environment('development')) {
		// Route::get('/new-training-mail', function() {
		// 	$training = Training::orderByDesc('date_created')->first();
		// 	return new NewTrainingMail($training);
		// });

		Route::get('/new-document-mail', function() {
			$document = Document::orderByDesc('date_uploaded')->first();
			return new NewDocumentMail($document);
		});
	}
});