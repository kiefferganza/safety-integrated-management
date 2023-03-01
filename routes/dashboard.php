<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FilePageController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\InspectionReportController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ToolboxTalkController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
	return redirect()->route('dashboard');
});

Route::middleware('auth')->prefix('dashboard')->group(function ()
{
	Route::get('/', function () {
		return redirect()->route('dashboard');
	});

	// General
	Route::get('/hse-dashboard', [DashboardController::class, 'index'])->name('dashboard');
	Route::get('/employees', fn () => Inertia::render("/General/Employee/index"))->name('general.employee');

	/**
	 * Management - Employee
	 */
	Route::prefix('employee')->group(function() {
		Route::get('/list', [EmployeeController::class, "index"])->name('management.employee.list');
		// CRUD
		Route::get('/new', [EmployeeController::class, "create"])->name('management.employee.create');
		Route::post('/new', [EmployeeController::class, "store"])->name('management.employee.new');
		Route::get('/{employee}', [EmployeeController::class, "show"])->name('management.employee.show');
		Route::get('/{employee}/edit', [EmployeeController::class, "update"])->name('management.employee.update');
		Route::post('/{employee}/edit', [EmployeeController::class, "edit"])->name('management.employee.edit');
		Route::delete('/{employee}/delete', [EmployeeController ::class, 'destroy']);
		Route::post('/delete/delete-multiple', [EmployeeController ::class, 'delete_multiple'])->name('management.employee.delete-multiple');
	});
	/**
	 * Management - Employee/Position 
	 */
	Route::prefix('position')->group(function() {
		Route::get('/list', [PositionController::class, 'index'])->name('management.position.list');
		// CRUD
		Route::post('/new', [PositionController::class, 'store'])->name('management.position.new');
		Route::post('/{position}/edit', [PositionController::class, 'edit']);
		Route::delete('/{position}', [PositionController::class, 'destroy']);
		Route::post('/delete-multiple', [PositionController::class, 'delete_multiple'])->name('management.position.delete-multiple');
	});
	/**
	 * Management - Employee/Department
	 */
	Route::prefix("department")->group(function() {
		Route::get('/list', [DepartmentController::class, 'index'])->name('management.department.list');
		// Crud
		Route::post('/new', [DepartmentController::class, 'store'])->name('management.department.new');
		Route::post('/{department}/edit', [DepartmentController::class, 'edit']);
		Route::delete('/{department}', [DepartmentController::class, 'destroy']);
		Route::post('/delete-multiple', [DepartmentController::class, 'delete_multiple'])->name('management.department.delete-multiple');
	});
	/**
	 * Management - Employee/Company
	 */
	Route::prefix('company')->group(function() {
		Route::get('/list', [CompanyController::class, 'index'])->name('management.company.list');
		// CRUD
		Route::post('/new', [CompanyController::class, 'store'])->name('management.company.new');
		Route::put('/{company}/edit', [CompanyController::class, 'edit']);
		Route::delete('/{company}', [CompanyController::class, 'destroy']);
		Route::post('/delete-multiple', [CompanyController::class, 'delete_multiple'])->name('management.company.delete-multiple');
	});

	/**
	 * Management - User
	 */
	Route::prefix('user')->group(function() {
		// Route::post('/user/{user_id}/follow', [UsersController::class, 'followUser']);
		Route::put('/update-socials', [UsersController::class, 'update_socials'])->name('management.user.update_socials');
		Route::get('/profile', [UsersController::class, 'profile'])->name('management.user.profile');
		Route::get('/settings', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.user.settings');
		Route::get('/profile/{user}', [UsersController::class, "show"])->name('management.user.show');

		// CRUD
		Route::post('/change-password', [UsersController::class, 'change_password'])->name('management.user.change_pass');
		// Can update
		Route::get('/{user}/edit', [UsersController::class, 'edit_user'])->middleware('can:update,App\Models\User,user');
		Route::post('/{user}/update', [UsersController::class, 'update'])->middleware('can:update,App\Models\User,user');
		// Can delete
		Route::post('/delete', [UsersController::class, 'delete'])->middleware('can:delete,App\Models\User');
		// Can view
		Route::middleware("can:view,App\Models\User")->group(function() {
			Route::get('/cards', [UsersController::class, 'cards'])->name('management.user.cards');
			Route::get('/list', [UsersController::class, 'index'])->name('management.user.list');
		});
		// Can create
		Route::middleware("can:create,App\Models\User")->group(function() {
			Route::get('/new', [UsersController::class, 'create'])->name('management.user.new');
			Route::post('/new', [UsersController::class, 'store'])->name('management.user.store');
		});
	});

	/**
	 * Management - Training
	 */
	Route::prefix('training')->group(function() {
		// Lists
		Route::get('/client', [TrainingController::class, 'index'])->name('training.management.client');
		Route::get('/in-house', [TrainingController::class, 'in_house'])->name('training.management.in_house');
		Route::get('/induction', [TrainingController::class, 'induction'])->name('training.management.induction');
		Route::get('/third-party', [TrainingController::class, 'external'])->name('training.management.external');

		Route::get('/new', [TrainingController::class, 'create'])->name('training.management.create');
		Route::post('/create', [TrainingController::class, 'store'])->name('training.management.store');
		Route::put('/{training}', [TrainingController::class, 'update'])->name('training.management.update');
		Route::post('/delete', [TrainingController::class, 'destroy'])->name('training.management.destroy');
		// Show
		Route::get('/client/{training}', [TrainingController::class, 'show_client'])->name('training.management.client.show');
		Route::get('/induction/{training}', [TrainingController::class, 'show_induction'])->name('training.management.induction.show');
		Route::get('/in-house/{training}', [TrainingController::class, 'show_in_house'])->name('training.management.in_house.show');
		Route::get('/third-party/{training}', [TrainingController::class, 'show_external'])->name('training.management.third_party.show');
		// Update
		Route::post('/{training}/edit', [TrainingController::class, 'update']);
		Route::get('/{training}/edit', [TrainingController::class, 'edit']);

	});

	/**
	 * Management - Inspection
	 */
	Route::prefix('inspection')->group(function() {
		// Lists
		Route::get('/site/list', [InspectionController::class, "index"])->name('inspection.management.list');
		Route::get('/new', [InspectionController::class, "create"])->name('inspection.management.new');
		Route::post('/new', [InspectionController::class, "store"])->name('inspection.management.store');
		Route::post('/delete', [InspectionController::class, "delete"])->name('inspection.management.delete');
		// CRUD
		Route::get('/{inspection}/edit', [InspectionController::class, "edit"]);
		Route::post('/{inspection}/edit', [InspectionReportController::class, "update"]);
		Route::get('/{inspection}/review', [InspectionController::class, "review"]);
		Route::post('/{inspection}/review', [InspectionReportController::class, "review_update"]);
		Route::get('/{inspection}/verify', [InspectionController::class, "verify"]);
		Route::post('/{inspection}/verify', [InspectionReportController::class, "verify_update"]);
		Route::get('/{inspection}/findings', [InspectionController::class, "findings"]);
	});

	/**
	 * Management - ToolboxTalks
	 */
	Route::prefix('toolbox-talks')->group(function() {
		Route::get('/all', [ToolboxTalkController::class, "index"])->name('toolboxtalk.management.all');
		Route::get('/civil', [ToolboxTalkController::class, "civil_list"])->name('toolboxtalk.management.civil');
		Route::get('/electrical', [ToolboxTalkController::class, "electrical_list"])->name('toolboxtalk.management.electrical');
		Route::get('/mechanical', [ToolboxTalkController::class, "mechanical_list"])->name('toolboxtalk.management.mechanical');
		Route::get('/workshop', [ToolboxTalkController::class, "camp_list"])->name('toolboxtalk.management.camp');
		Route::get('/office', [ToolboxTalkController::class, "office_list"])->name('toolboxtalk.management.office');
		Route::get('/report', [ToolboxTalkController::class, "reportList"])->name('toolboxtalk.management.report');
		// CRUD
		Route::get('/{tbt}/view', [ToolboxTalkController::class, "view"]);
		Route::get('/new', [ToolboxTalkController::class, "create"])->name('toolboxtalk.management.new');
		Route::post('/new', [ToolboxTalkController::class, "store"])->name('toolboxtalk.management.store');
		Route::get('/{tbt}/edit', [ToolboxTalkController::class, "edit"]);
		Route::post('/{tbt}/edit', [ToolboxTalkController::class, "update"]);
		Route::post('/delete', [ToolboxTalkController::class, "soft_delete"])->name('toolboxtalk.management.delete');
		// Statistic
		Route::get('/statistic', [ToolboxTalkController::class, "statistic"])->name('toolboxtalk.management.statistic');
		Route::post('/statistic/new', [ToolboxTalkController::class, "store_statistic"])->name('toolboxtalk.management.store_statistic');
	});

	/**
	 * Management - PPE
	 */
	Route::prefix('ppe')->group(function() {
		Route::get('/list', [InventoryController::class, "index"])->name('ppe.management.index');
		Route::get('/new', [InventoryController::class, "create"])->name('ppe.management.create');
		Route::post('/new', [InventoryController::class, "store"])->name('ppe.management.store');
		Route::post('/delete', [InventoryController::class, "destroy"])->name('ppe.management.destroy');

		Route::post('/product/add-remove-stock/{inventory}', [InventoryController::class, "add_remove_stock"]);
		Route::get('/product/{inventory}', [InventoryController::class, "show"])->name('ppe.management.show');
		Route::get('/product/{inventory}/edit', [InventoryController::class, "edit"]);
		Route::post('/product/{inventory}/update', [InventoryController::class, "update"]);
	});

	/**
	 * Management - Folder
	 */
	Route::prefix('file-manager')->group(function() {
		Route::get('/', [FilePageController::class, "index"])->name('files.management.index');
		Route::post('/new', [FilePageController::class, "create_folder"])->name('files.management.create_folder');
		Route::post('/delete', [FilePageController::class, "destroy"])->name('files.management.destroy');
		Route::post('/{folder}/edit', [FilePageController::class, "update"])->name('files.management.update');
		// Folder -> Documents
		Route::get('/view', [DocumentController::class, "view"]);
		Route::get('/{folder}', [DocumentController::class, "index"]);
		Route::get('/{folder}/new', [DocumentController::class, "create"]);
		Route::post('/{folder}/new', [DocumentController::class, "store"]);
		Route::post('/document/delete', [DocumentController::class, "destroy"])->name('filemanager.document.delete');
		Route::post('/document/{document}/action', [DocumentController::class, "approve_or_fail_document"]);
		Route::post('/document/{document}/add-comment', [DocumentController::class, "add_comment"]);
		Route::post('/document/{comment}/reply-comment', [DocumentController::class, "reply_comment"]);
		Route::post('/document/{comment}/delete-comment', [DocumentController::class, "delete_comment"]);
	});

});