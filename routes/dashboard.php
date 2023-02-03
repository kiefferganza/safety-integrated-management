<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FilePageController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\InspectionReportController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ToolboxTalkController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function ()
{
	Route::get('/', function () {
		return redirect()->route('dashboard');
	});
	Route::get('/dashboard', function () {
		return redirect()->route('dashboard');
	});

	// General
	Route::get('/dashboard/hse-dashboard', [DashboardController::class, 'index'])->name('dashboard');
	Route::get('/dashboard/employees', fn () => Inertia::render("Dashboard/General/Employee/index"))->name('general.employee');


	/**
	 * Management - Employee
	 */
	Route::get('/dashboard/employee/list', [EmployeeController::class, "index"])->name('management.employee.list');
	// CRUD
	Route::get('/dashboard/employee/new', [EmployeeController::class, "create"])->name('management.employee.create');
	Route::post('/dashboard/employee/new', [EmployeeController::class, "store"])->name('management.employee.new');
	Route::get('/dashboard/employee/{employee}', [EmployeeController::class, "show"])->name('management.employee.show');
	Route::get('/dashboard/employee/{employee}/edit', [EmployeeController::class, "update"])->name('management.employee.update');
	Route::post('/dashboard/employee/{employee}/edit', [EmployeeController::class, "edit"])->name('management.employee.edit');
	Route::delete('dashboard/employee/{employee}/delete', [EmployeeController ::class, 'destroy']);
	Route::post('dashboard/delete/delete-multiple', [EmployeeController ::class, 'delete_multiple'])->name('management.employee.delete-multiple');


	/**
	 * Management - Employee/Position
	 */
	Route::get('dashboard/position/list', [PositionController::class, 'index'])->name('management.position.list');
	// CRUD
	Route::post('dashboard/position/new', [PositionController::class, 'store'])->name('management.position.new');
	Route::post('dashboard/position/{position}/edit', [PositionController::class, 'edit']);
	Route::delete('dashboard/position/{position}', [PositionController::class, 'destroy']);
	Route::post('dashboard/position/delete-multiple', [PositionController::class, 'delete_multiple'])->name('management.position.delete-multiple');



	/**
	 * Management - User
	 */
	// Route::post('/dashboard/user/{user_id}/follow', [UsersController::class, 'followUser']);
	Route::put('/dashboard/user/update-socials', [UsersController::class, 'update_socials'])->name('management.user.update_socials');
	Route::get('/dashboard/user/profile', [UsersController::class, 'profile'])->name('management.user.profile');
	Route::get('/dashboard/user/settings', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.user.settings');
	Route::get('/dashboard/user/profile/{user}', [UsersController::class, "show"])->name('management.user.show');

	// CRUD
	Route::get('/dashboard/user/{user}/edit', [UsersController::class, 'edit_user'])->middleware('can:update,App\Models\User,user');
	Route::post('/dashboard/user/{user}/update', [UsersController::class, 'update'])->middleware('can:update,App\Models\User,user');
	Route::post('/dashboard/user/change-password', [UsersController::class, 'change_password'])->name('management.user.change_pass');
	Route::post('/dashboard/user/delete', [UsersController::class, 'delete'])->middleware('can:delete,App\Models\User');
	Route::middleware("can:view,App\Models\User")->group(function() {
		Route::get('/dashboard/user/cards', [UsersController::class, 'cards'])->name('management.user.cards');
		Route::get('/dashboard/user/list', [UsersController::class, 'index'])->name('management.user.list');
	});
	Route::middleware("can:create,App\Models\User")->group(function() {
		Route::get('/dashboard/user/new', [UsersController::class, 'create'])->name('management.user.new');
		Route::post('/dashboard/user/new', [UsersController::class, 'store'])->name('management.user.store');
	});
	

	/**
	 * Management - Employee/Department
	 */
	Route::get('dashboard/department/list', [DepartmentController::class, 'index'])->name('management.department.list');
	// Crud
	Route::post('dashboard/department/new', [DepartmentController::class, 'store'])->name('management.department.new');
	Route::post('dashboard/department/{department}/edit', [DepartmentController::class, 'edit']);
	Route::delete('dashboard/department/{department}', [DepartmentController::class, 'destroy']);
	Route::post('dashboard/department/delete-multiple', [DepartmentController::class, 'delete_multiple'])->name('management.department.delete-multiple');


	/**
	 * Management - Employee/Company
	 */
	Route::get('dashboard/company/list', [CompanyController::class, 'index'])->name('management.company.list');
	// CRUD
	Route::post('dashboard/company/new', [CompanyController::class, 'store'])->name('management.company.new');
	Route::put('dashboard/company/{company}/edit', [CompanyController::class, 'edit']);
	Route::delete('dashboard/company/{company}', [CompanyController::class, 'destroy']);
	Route::post('dashboard/company/delete-multiple', [CompanyController::class, 'delete_multiple'])->name('management.company.delete-multiple');


	/**
	 * Management - Trainings
	 */
	// Lists
	Route::get('dashboard/training/client', [TrainingController::class, 'index'])->name('training.management.client');
	Route::get('dashboard/training/in-house', [TrainingController::class, 'in_house'])->name('training.management.in_house');
	Route::get('dashboard/training/induction', [TrainingController::class, 'induction'])->name('training.management.induction');
	Route::get('dashboard/training/third-party', [TrainingController::class, 'external'])->name('training.management.external');

	Route::get('dashboard/training/new', [TrainingController::class, 'create'])->name('training.management.create');
	Route::post('dashboard/training/create', [TrainingController::class, 'store'])->name('training.management.store');
	Route::put('dashboard/training/{training}', [TrainingController::class, 'update'])->name('training.management.update');
	Route::post('dashboard/training/delete', [TrainingController::class, 'destroy'])->name('training.management.destroy');
	// Show
	Route::get('dashboard/training/client/{training}', [TrainingController::class, 'show_client'])->name('training.management.client.show');
	Route::get('dashboard/training/induction/{training}', [TrainingController::class, 'show_induction'])->name('training.management.induction.show');
	Route::get('dashboard/training/in-house/{training}', [TrainingController::class, 'show_in_house'])->name('training.management.in_house.show');
	Route::get('dashboard/training/third-party/{training}', [TrainingController::class, 'show_external'])->name('training.management.third_party.show');
	// Update
	Route::post('dashboard/training/{training}/edit', [TrainingController::class, 'update']);
	Route::get('dashboard/training/{training}/edit', [TrainingController::class, 'edit']);


	/**
	 * Management - Inspection
	 */
	// Lists
	Route::get('dashboard/inspection/site/list', [InspectionController::class, "index"])->name('inspection.management.list');
	Route::get('dashboard/inspection/new', [InspectionController::class, "create"])->name('inspection.management.new');
	Route::post('dashboard/inspection/new', [InspectionController::class, "store"])->name('inspection.management.store');
	Route::post('dashboard/inspection/delete', [InspectionController::class, "delete"])->name('inspection.management.delete');
	// CRUD
	Route::get('dashboard/inspection/{inspection}/edit', [InspectionController::class, "edit"]);
	Route::post('dashboard/inspection/{inspection}/edit', [InspectionReportController::class, "update"]);
	Route::get('dashboard/inspection/{inspection}/review', [InspectionController::class, "review"]);
	Route::post('dashboard/inspection/{inspection}/review', [InspectionReportController::class, "review_update"]);
	Route::get('dashboard/inspection/{inspection}/verify', [InspectionController::class, "verify"]);
	Route::post('dashboard/inspection/{inspection}/verify', [InspectionReportController::class, "verify_update"]);
	Route::get('dashboard/inspection/{inspection}/findings', [InspectionController::class, "findings"]);


	/**
	 * Management - ToolboxTalks
	 */
	Route::get('dashboard/toolbox-talks/all', [ToolboxTalkController::class, "index"])->name('toolboxtalk.management.all');
	Route::get('dashboard/toolbox-talks/civil', [ToolboxTalkController::class, "civil_list"])->name('toolboxtalk.management.civil');
	Route::get('dashboard/toolbox-talks/electrical', [ToolboxTalkController::class, "electrical_list"])->name('toolboxtalk.management.electrical');
	Route::get('dashboard/toolbox-talks/mechanical', [ToolboxTalkController::class, "mechanical_list"])->name('toolboxtalk.management.mechanical');
	Route::get('dashboard/toolbox-talks/camp', [ToolboxTalkController::class, "camp_list"])->name('toolboxtalk.management.camp');
	Route::get('dashboard/toolbox-talks/office', [ToolboxTalkController::class, "office_list"])->name('toolboxtalk.management.office');
	Route::get('dashboard/toolbox-talks/report', [ToolboxTalkController::class, "reportList"])->name('toolboxtalk.management.report');
	// CRUD
	Route::get('dashboard/toolbox-talks/{tbt}/view', [ToolboxTalkController::class, "view"]);
	Route::get('dashboard/toolbox-talks/new', [ToolboxTalkController::class, "create"])->name('toolboxtalk.management.new');
	Route::post('dashboard/toolbox-talks/new', [ToolboxTalkController::class, "store"])->name('toolboxtalk.management.store');
	Route::get('dashboard/toolbox-talks/{tbt}/edit', [ToolboxTalkController::class, "edit"]);
	Route::post('dashboard/toolbox-talks/{tbt}/edit', [ToolboxTalkController::class, "update"]);
	Route::post('dashboard/toolbox-talks/delete', [ToolboxTalkController::class, "soft_delete"])->name('toolboxtalk.management.delete');
	// Route::post('dashboard/toolbox-talks/delete', [ToolboxTalkController::class, "delete"])->name('toolboxtalk.management.delete');


	/**
	 * Management - Files
	 */
	Route::get('dashboard/file-manager', [FilePageController::class, "index"])->name('files.management.index');
	Route::post('dashboard/file-manager/new', [FilePageController::class, "create_folder"])->name('files.management.create_folder');

});