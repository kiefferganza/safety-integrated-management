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
	Route::get('/position/list', [PositionController::class, 'index'])->name('management.position.list');
	// CRUD
	Route::post('/position/new', [PositionController::class, 'store'])->name('management.position.new');
	Route::post('/position/{position}/edit', [PositionController::class, 'edit']);
	Route::delete('/position/{position}', [PositionController::class, 'destroy']);
	Route::post('/position/delete-multiple', [PositionController::class, 'delete_multiple'])->name('management.position.delete-multiple');



	/**
	 * Management - User
	 */
	// Route::post('/user/{user_id}/follow', [UsersController::class, 'followUser']);
	Route::put('/user/update-socials', [UsersController::class, 'update_socials'])->name('management.user.update_socials');
	Route::get('/user/profile', [UsersController::class, 'profile'])->name('management.user.profile');
	Route::get('/user/settings', fn () => Inertia::render("/Management/User/Account/index"))->name('management.user.settings');
	Route::get('/user/profile/{user}', [UsersController::class, "show"])->name('management.user.show');

	// CRUD
	Route::get('/user/{user}/edit', [UsersController::class, 'edit_user'])->middleware('can:update,App\Models\User,user');
	Route::post('/user/{user}/update', [UsersController::class, 'update'])->middleware('can:update,App\Models\User,user');
	Route::post('/user/change-password', [UsersController::class, 'change_password'])->name('management.user.change_pass');
	Route::post('/user/delete', [UsersController::class, 'delete'])->middleware('can:delete,App\Models\User');
	Route::middleware("can:view,App\Models\User")->group(function() {
		Route::get('/user/cards', [UsersController::class, 'cards'])->name('management.user.cards');
		Route::get('/user/list', [UsersController::class, 'index'])->name('management.user.list');
	});
	Route::middleware("can:create,App\Models\User")->group(function() {
		Route::get('/user/new', [UsersController::class, 'create'])->name('management.user.new');
		Route::post('/user/new', [UsersController::class, 'store'])->name('management.user.store');
	});
	

	/**
	 * Management - Employee/Department
	 */
	Route::get('/department/list', [DepartmentController::class, 'index'])->name('management.department.list');
	// Crud
	Route::post('/department/new', [DepartmentController::class, 'store'])->name('management.department.new');
	Route::post('/department/{department}/edit', [DepartmentController::class, 'edit']);
	Route::delete('/department/{department}', [DepartmentController::class, 'destroy']);
	Route::post('/department/delete-multiple', [DepartmentController::class, 'delete_multiple'])->name('management.department.delete-multiple');


	/**
	 * Management - Employee/Company
	 */
	Route::get('/company/list', [CompanyController::class, 'index'])->name('management.company.list');
	// CRUD
	Route::post('/company/new', [CompanyController::class, 'store'])->name('management.company.new');
	Route::put('/company/{company}/edit', [CompanyController::class, 'edit']);
	Route::delete('/company/{company}', [CompanyController::class, 'destroy']);
	Route::post('/company/delete-multiple', [CompanyController::class, 'delete_multiple'])->name('management.company.delete-multiple');


	/**
	 * Management - Trainings
	 */
	// Lists
	Route::get('/training/client', [TrainingController::class, 'index'])->name('training.management.client');
	Route::get('/training/in-house', [TrainingController::class, 'in_house'])->name('training.management.in_house');
	Route::get('/training/induction', [TrainingController::class, 'induction'])->name('training.management.induction');
	Route::get('/training/third-party', [TrainingController::class, 'external'])->name('training.management.external');

	Route::get('/training/new', [TrainingController::class, 'create'])->name('training.management.create');
	Route::post('/training/create', [TrainingController::class, 'store'])->name('training.management.store');
	Route::put('/training/{training}', [TrainingController::class, 'update'])->name('training.management.update');
	Route::post('/training/delete', [TrainingController::class, 'destroy'])->name('training.management.destroy');
	// Show
	Route::get('/training/client/{training}', [TrainingController::class, 'show_client'])->name('training.management.client.show');
	Route::get('/training/induction/{training}', [TrainingController::class, 'show_induction'])->name('training.management.induction.show');
	Route::get('/training/in-house/{training}', [TrainingController::class, 'show_in_house'])->name('training.management.in_house.show');
	Route::get('/training/third-party/{training}', [TrainingController::class, 'show_external'])->name('training.management.third_party.show');
	// Update
	Route::post('/training/{training}/edit', [TrainingController::class, 'update']);
	Route::get('/training/{training}/edit', [TrainingController::class, 'edit']);


	/**
	 * Management - Inspection
	 */
	// Lists
	Route::get('/inspection/site/list', [InspectionController::class, "index"])->name('inspection.management.list');
	Route::get('/inspection/new', [InspectionController::class, "create"])->name('inspection.management.new');
	Route::post('/inspection/new', [InspectionController::class, "store"])->name('inspection.management.store');
	Route::post('/inspection/delete', [InspectionController::class, "delete"])->name('inspection.management.delete');
	// CRUD
	Route::get('/inspection/{inspection}/edit', [InspectionController::class, "edit"]);
	Route::post('/inspection/{inspection}/edit', [InspectionReportController::class, "update"]);
	Route::get('/inspection/{inspection}/review', [InspectionController::class, "review"]);
	Route::post('/inspection/{inspection}/review', [InspectionReportController::class, "review_update"]);
	Route::get('/inspection/{inspection}/verify', [InspectionController::class, "verify"]);
	Route::post('/inspection/{inspection}/verify', [InspectionReportController::class, "verify_update"]);
	Route::get('/inspection/{inspection}/findings', [InspectionController::class, "findings"]);


	/**
	 * Management - ToolboxTalks
	 */
	Route::get('/toolbox-talks/all', [ToolboxTalkController::class, "index"])->name('toolboxtalk.management.all');
	Route::get('/toolbox-talks/civil', [ToolboxTalkController::class, "civil_list"])->name('toolboxtalk.management.civil');
	Route::get('/toolbox-talks/electrical', [ToolboxTalkController::class, "electrical_list"])->name('toolboxtalk.management.electrical');
	Route::get('/toolbox-talks/mechanical', [ToolboxTalkController::class, "mechanical_list"])->name('toolboxtalk.management.mechanical');
	Route::get('/toolbox-talks/workshop', [ToolboxTalkController::class, "camp_list"])->name('toolboxtalk.management.camp');
	Route::get('/toolbox-talks/office', [ToolboxTalkController::class, "office_list"])->name('toolboxtalk.management.office');
	Route::get('/toolbox-talks/report', [ToolboxTalkController::class, "reportList"])->name('toolboxtalk.management.report');
	// CRUD
	Route::get('/toolbox-talks/{tbt}/view', [ToolboxTalkController::class, "view"]);
	Route::get('/toolbox-talks/new', [ToolboxTalkController::class, "create"])->name('toolboxtalk.management.new');
	Route::post('/toolbox-talks/new', [ToolboxTalkController::class, "store"])->name('toolboxtalk.management.store');
	Route::get('/toolbox-talks/{tbt}/edit', [ToolboxTalkController::class, "edit"]);
	Route::post('/toolbox-talks/{tbt}/edit', [ToolboxTalkController::class, "update"]);
	Route::post('/toolbox-talks/delete', [ToolboxTalkController::class, "soft_delete"])->name('toolboxtalk.management.delete');
	// Route::post('/toolbox-talks/delete', [ToolboxTalkController::class, "delete"])->name('toolboxtalk.management.delete');


	/**
	 * Management - PPE
	 */
	Route::get('/ppe/list', [InventoryController::class, "index"])->name('ppe.management.index');
	Route::get('/ppe/product/{inventory}', [InventoryController::class, "show"])->name('ppe.management.show');
	Route::post('/ppe/product/add-remove-stock/{inventory}', [InventoryController::class, "add_remove_stock"]);
	Route::get('/ppe/new', [InventoryController::class, "create"])->name('ppe.management.create');
	Route::post('/ppe/new', [InventoryController::class, "store"])->name('ppe.management.store');
	Route::post('/ppe/delete', [InventoryController::class, "destroy"])->name('ppe.management.destroy');
	Route::get('/ppe/product/{inventory}/edit', [InventoryController::class, "edit"]);
	Route::post('/ppe/product/{inventory}/update', [InventoryController::class, "update"]);
	


	/**
	 * Management - Folder
	 */
	Route::get('/file-manager', [FilePageController::class, "index"])->name('files.management.index');
	Route::post('/file-manager/new', [FilePageController::class, "create_folder"])->name('files.management.create_folder');
	Route::post('/file-manager/delete', [FilePageController::class, "destroy"])->name('files.management.destroy');
	Route::post('/file-manager/{folder}/edit', [FilePageController::class, "update"])->name('files.management.update');
	// Folder -> Documents
	Route::get('/file-manager/view', [DocumentController::class, "view"]);
	Route::get('/file-manager/{folder}', [DocumentController::class, "index"]);
	Route::get('/file-manager/{folder}/new', [DocumentController::class, "create"]);
	Route::post('/file-manager/{folder}/new', [DocumentController::class, "store"]);
	Route::post('/file-manager/document/delete', [DocumentController::class, "destroy"])->name('filemanager.document.delete');
	Route::post('/file-manager/document/{document}/action', [DocumentController::class, "approve_or_fail_document"]);
	Route::post('/file-manager/document/{document}/add-comment', [DocumentController::class, "add_comment"]);
	Route::post('/file-manager/document/{comment}/reply-comment', [DocumentController::class, "reply_comment"]);
	Route::post('/file-manager/document/{comment}/delete-comment', [DocumentController::class, "delete_comment"]);

});