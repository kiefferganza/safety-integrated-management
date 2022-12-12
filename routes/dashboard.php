<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function ()
{
	// General
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
	Route::post('/dashboard/user/{user_id}/follow', [UsersController::class, 'followUser']);
	Route::post('/dashboard/user/change-password', [UsersController::class, 'change_password'])->name('management.user.change_pass');
	Route::put('/dashboard/user/update-socials', [UsersController::class, 'update_socials'])->name('management.user.update_socials');
	Route::get('/dashboard/user/profile', [UsersController::class, 'profile'])->name('management.user.profile');
	Route::get('/dashboard/user/settings', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.user.settings');
	Route::get('/dashboard/user/profile/{user}', [UsersController::class, "show"])->name('management.user.show');

	// CRUD
	Route::middleware("can:update,App\Models\User")->group(function() {
		Route::get('/dashboard/user/{user}/edit', [UsersController::class, 'edit_user']);
		Route::post('/dashboard/user/{user}/update', [UsersController::class, 'update']);
	});
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


});