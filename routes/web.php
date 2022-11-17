<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FilePageController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\TrainingClientController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/example.php';

Route::middleware('auth')->group(function ()
{
	// // Employees
	// Route::get('/employees', [EmployeeController::class, 'index'])->name('employees');
	// Route::post('/employees/create', [EmployeeController::class, 'store'])->name('employees.store');
	// Route::get('/position', [EmployeeController::class, 'manage_positions'])->name('position');
	// Route::get('/department', [EmployeeController::class, 'department'])->name('department');
	// Route::get('/companies', [EmployeeController::class, 'companies'])->name('companies');

	// // Users
	// Route::get('/users', [UsersController::class, 'index'])->name('users');

	// // Incident
	// Route::get('/firstaid', [IncidentController::class, 'index'])->name('firstaid');
	// Route::get('/investigation', fn () => Inertia::render("Maintenance/index"))->name('investigation');
	// Route::get('/incident-report', fn () => Inertia::render("Maintenance/index"))->name('incident_report');

	// // Training
	// Route::get('/training/metrics', fn () => Inertia::render("Maintenance/index"))->name('training.metrics');

	// // Training Client
	// Route::get('/training/in-house', [TrainingClientController::class, 'index'])->name('training.client');
	// Route::get('/training/client', [TrainingClientController::class, 'index'])->name('training.client');
	// Route::post('/training/client', [TrainingClientController::class, 'store'])->name('training.store_client');
	// Route::put('/training/client/{training}', [TrainingClientController::class, 'update'])->name('training.update_client');
	// Route::post('/training/client/delete', [TrainingClientController::class, 'destroy'])->name('training.destroy_client');

	// // Training Third Party
	// Route::get('/training/third-party', fn () => Inertia::render("Maintenance/index"))->name('training.third_party');


	// // Inventory
	// Route::get('/inventory_masterlist', fn () => Inertia::render("Maintenance/index"))->name('inventory.masterlist');
	// Route::get('/inventory_stocks', fn () => Inertia::render("Maintenance/index"))->name('inventory.stocks');
	// Route::get('/inventory_report', fn () => Inertia::render("Maintenance/index"))->name('inventory.report');


	// // Files
	// Route::get('/files', [FilePageController::class, 'index'])->name('files');
	// Route::post('/files', [FilePageController::class, 'create_folder'])->name('files.create_folder');
	// Route::delete('/files', [FilePageController::class, 'delete_folders'])->name('files.delete_folders');
	// Route::get('/files/{folder_name}', [FilePageController::class, 'single_folder'])->name('files.single_folder');
	// Route::put('/files/{folder_id}', [FilePageController::class, 'edit_folder'])->name('files.edit_folder');
	// // Doc
	// Route::post('/files/document/{folder_name}', [FilePageController::class, 'create_document']);
	// Route::delete('/files/document/{folder_name}', [FilePageController::class, 'delete_document']);
	// Route::post('/files/document/action', [FilePageController::class, 'approve_or_fail_document'])->name("files.approve_or_fail_document");
	// // Add comment, reply
	// Route::post('/document/comment', [FilePageController::class, 'add_comment'])->name('files.add_comment');
	// Route::post('/document/update-comment-status/{review_document_id}', [FilePageController::class, 'update_comment_status'])->name('files.update_comment_status');
	// Route::post('/document/delete-comment', [FilePageController::class, 'delete_comment'])->name('files.delete_comment');
	// Route::post('/document/reply', [FilePageController::class, 'reply_document'])->name('files.reply_document');

	// // Inspection
	// Route::get('/inspection', fn () => Inertia::render("Maintenance/index"))->name('inspection.form');
	// // Route::get('/inspection', [InspectionController::class, 'index'])->name('inspection.form');
	// Route::get('/inspection_graph', fn () => Inertia::render("Maintenance/index"))->name('inspection.graph');
	// Route::get('/inspection_machines', fn () => Inertia::render("Maintenance/index"))->name('inspection.machines');
	// Route::get('/inspection_tools_equipments', fn () => Inertia::render("Maintenance/index"))->name('inspection.tools_equipments');
});

require __DIR__.'/auth.php';
