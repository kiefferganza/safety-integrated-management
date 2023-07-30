<?php

use App\Http\Controllers\Shared\DocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('shared')->prefix('shared')->as('shared.')->group(function() {
	Route::get('/document', [DocumentController::class, 'show'])->name("document.show");
	Route::post('/document/action/{document}/{docExternal}', [DocumentController::class, 'approve_or_fail_document'])->name('document.approveOrFail');
	Route::post('/document/re-upload/{docApprover}', [DocumentController::class, 'reupload_approval_file'])->name('document.reuploadApprovalFile');
	// Comments
	Route::post('/document/{document}/{docExternal}/add-comment', [DocumentController::class, 'post_comment'])->name('document.post_comment');

	Route::post('/document/{comment}/{doc}/reply-comment', [DocumentController::class, 'reply_comment'])->name('document.reply_comment');

	Route::post('/document/{comment}/delete-comment', [DocumentController::class, 'delete_comment'])->name('delete_comment');
});