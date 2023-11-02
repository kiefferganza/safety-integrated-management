<?php

use App\Mail\NewDocumentMail;
use App\Mail\NewTrainingMail;
use App\Models\Document;
use App\Models\Training;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function() {
	if(app()->environment('development')) {
		Route::get('/new-training-mail', function() {
			$training = Training::orderByDesc('date_created')->first();
			return new NewTrainingMail($training);
		});

		Route::get('/new-document-mail', function() {
			$doc = Document::find(348)
			->with([
				'folder',
				'approval_employee',
				'reviewer_employees'
			])
			->first();
			$from = 'admin@safety-integrated-management.com';
			$to = 'to@email.com';
			$subject = 'New Notification from Fiafi Group - New Document';
			$message = '<h1>test message</h1>';
			$message .= '<a>Github</a>';
			$mail = new NewDocumentMail(
				document: $doc,
				data: []
			);
			// var_dump($mail->renderEmailContent());
			// dd($mail->renderEmailContent());
			// Mail::send($mail);
			Mail::to('dykennethryan@gmail.com')->send($mail);
			return $mail; 
		});
	}
});