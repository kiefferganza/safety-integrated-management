<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function ()
{

	Route::get('/', function ()
	{
		return redirect()->route('dashboard');
	});
	Route::get('/dashboard', function ()
	{
		return redirect()->route('dashboard');
	});

	Route::get('/dashboard/app', fn () => Inertia::render("Dashboard/General/App/index"))->name('dashboard');
	Route::get('/dashboard/ecommerce', fn () => Inertia::render("Dashboard/General/Ecommerce/index"))->name('general.ecommerce');
	Route::get('/dashboard/analytics', fn () => Inertia::render("Dashboard/General/Analytics/index"))->name('general.analytics');
	Route::get('/dashboard/banking', fn () => Inertia::render("Dashboard/General/Banking/index"))->name('general.banking');
	Route::get('/dashboard/booking', fn () => Inertia::render("Dashboard/General/Booking/index"))->name('general.booking');
	Route::get('/dashboard/file', fn () => Inertia::render("Dashboard/General/File/index"))->name('general.file');

	// Management
	// User
	Route::get('/dashboard/user/profile', fn () => Inertia::render("Dashboard/Management/User/index"))->name('management.profile');
	Route::get('/dashboard/user/cards', fn () => Inertia::render("Dashboard/Management/User/Cards/index"))->name('management.cards');
	Route::get('/dashboard/user/list', fn () => Inertia::render("Dashboard/Management/User/List/index"))->name('management.list');
	Route::get('/dashboard/user/new', fn () => Inertia::render("Dashboard/Management/User/Create/index"))->name('management.new');
	Route::get('/dashboard/user/edit', fn () => Inertia::render("Dashboard/Management/User/Edit/index"))->name('management.edit');
	Route::get('/dashboard/user/account', fn () => Inertia::render("Dashboard/Management/User/Account/index"))->name('management.account');

	// APP
	Route::get('/dashboard/mail', fn () => Inertia::render("Dashboard/App/Mail/index"))->name('app.mail');
	Route::get('/dashboard/chat', fn () => Inertia::render("Dashboard/App/Chat/index"))->name('app.chat');
	Route::get('/dashboard/calendar', fn () => Inertia::render("Dashboard/App/Calendar/index"))->name('app.calendar');
	Route::get('/dashboard/kanban', fn () => Inertia::render("Dashboard/App/Kanban/index"))->name('app.kanban');
	
});