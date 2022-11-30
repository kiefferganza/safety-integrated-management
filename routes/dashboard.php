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
	 * Management - User
	 */
	Route::get('/dashboard/user/list', [UsersController::class, 'index'])->name('management.user.list');
	// Edit
	Route::get('/dashboard/user/{user}/edit', [UsersController::class, 'edit_user'])->name('management.user.edit');
	Route::get('/dashboard/user/profile', fn () => Inertia::render("Dashboard/Management/User/index"))->name('management.user.profile');
	Route::get('/dashboard/user/cards', [UsersController::class, 'cards'])->name('management.user.cards');
	Route::get('/dashboard/user/account', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.user.account');
	// Create
	Route::get('/dashboard/user/new', fn () => Inertia::render("Dashboard/Management/User/Create/index"))->name('management.user.new');

	/**
	 * Management - Employee
	 */
	Route::get('/dashboard/employee/list', [EmployeeController::class, "index"])->name('management.employee.list');
	// Create
	Route::get('/dashboard/employee/new', [EmployeeController::class, "create"])->name('management.employee.create');
	Route::post('/dashboard/employee/new', [EmployeeController::class, "store"])->name('management.employee.new');
	// Edit
	Route::get('/dashboard/employee/{employee}/edit', [EmployeeController::class, "update"])->name('management.employee.update');
	Route::post('/dashboard/employee/{employee}/edit', [EmployeeController::class, "edit"])->name('management.employee.edit');
	// View
	Route::get('/dashboard/employee/{employee}', [EmployeeController::class, "show"])->name('management.employee.show');
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
	 * Management - Employee/Department
	 */
	Route::get('dashboard/department/list', [DepartmentController::class, 'index'])->name('management.department.list');
	// Create
	Route::post('dashboard/department/new', [DepartmentController::class, 'store'])->name('management.department.new');
	/**
	 * Management - Employee/Company
	 */
	Route::get('dashboard/company/list', [CompanyController::class, 'index'])->name('management.company.list');
	// Create
	Route::post('dashboard/company/new', [CompanyController::class, 'store'])->name('management.company.new');


});