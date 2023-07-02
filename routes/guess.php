<?php

use App\Http\Controllers\Shared\DocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('shared')->prefix('shared')->as('shared.')->group(function() {
	Route::get('/document', [DocumentController::class, 'show'])->name("document.show");
	Route::post('/document/action/{document}', [DocumentController::class, 'approve_or_fail_document'])->name("document.approveOrFail");
	Route::post('/document/re-upload/{docApprover}', [DocumentController::class, 'reupload_approval_file'])->name("document.reuploadApprovalFile");
});