<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function ()
{
	// General
	Route::get('/dashboard/employees', fn () => Inertia::render("Dashboard/General/Employee/index"))->name('general.employee');

	// Management - User
	Route::get('/dashboard/user/list', [UsersController::class, 'index'])->name('management.user.list');

	Route::get('/dashboard/user/{user}/edit', [UsersController::class, 'edit_user'])->name('management.user.edit');

	Route::get('/dashboard/user/profile', fn () => Inertia::render("Dashboard/Management/User/index"))->name('management.user.profile');
	Route::get('/dashboard/user/cards', [UsersController::class, 'cards'])->name('management.user.cards');
	Route::get('/dashboard/user/new', fn () => Inertia::render("Dashboard/Management/User/Create/index"))->name('management.user.new');
	Route::get('/dashboard/user/account', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.user.account');

	// Management - Employee
	Route::get('/dashboard/employee/list', [EmployeeController::class, "index"])->name('management.employee.list');
	Route::get('/dashboard/employee/new', [EmployeeController::class, "create"])->name('management.employee.create');
	Route::post('/dashboard/employee/new', [EmployeeController::class, "store"])->name('management.employee.new');
	Route::get('/dashboard/employee/{employee}/edit', [EmployeeController::class, "update"])->name('management.employee.update');
	Route::post('/dashboard/employee/{employee}/edit', [EmployeeController::class, "edit"])->name('management.employee.edit');

});