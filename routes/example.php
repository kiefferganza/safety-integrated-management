<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function ()
{

	Route::get('/dashboard/inventory', fn () => Inertia::render("Dashboard/General/App/index"))->name('general.inventory');
	
	// Route::get('/dashboard/banking', fn () => Inertia::render("Dashboard/General/Banking/index"))->name('general.banking');
	// Route::get('/dashboard/booking', fn () => Inertia::render("Dashboard/General/Booking/index"))->name('general.booking');
	Route::get('/dashboard/file', fn () => Inertia::render("Dashboard/General/File/index"))->name('general.file');

	// Management Secition
	// Management - PPE
	Route::get('/dashboard/ppe/shop', fn () => Inertia::render("Dashboard/Management/Ecommerce/Shop/index"))->name('management.ecommerce.shop');
	Route::get('/dashboard/ppe/product/nike-air-force-1-ndestrukt', fn () => Inertia::render("Dashboard/Management/Ecommerce/Product/index"))->name('management.ecommerce.product');
	Route::get('/dashboard/ppe/list', fn () => Inertia::render("Dashboard/Management/Ecommerce/List/index"))->name('management.ecommerce.list');
	Route::get('/dashboard/ppe/product/new', fn () => Inertia::render("Dashboard/Management/Ecommerce/Create/index"))->name('management.ecommerce.new');
	Route::get('/dashboard/ppe/product/nike-blazer-low-77-vintage/edit', fn () => Inertia::render("Dashboard/Management/Ecommerce/Edit/index"))->name('management.ecommerce.edit');
	Route::get('/dashboard/ppe/checkout', fn () => Inertia::render("Dashboard/Management/Ecommerce/Checkout/index"))->name('management.ecommerce.checkout');
	// Management - Invoice
	Route::get('/dashboard/invoice/list', fn () => Inertia::render("Dashboard/Management/Invoice/List/index"))->name('management.invoice.list');
	Route::get('/dashboard/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5', fn () => Inertia::render("Dashboard/Management/Invoice/Details/index"))->name('management.invoice.details');
	Route::get('/dashboard/invoice/new', fn () => Inertia::render("Dashboard/Management/Invoice/Create/index"))->name('management.invoice.new');
	Route::get('/dashboard/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5/edit', fn () => Inertia::render("Dashboard/Management/Invoice/Edit/index"))->name('management.invoice.edit');
	// Management - Blog
	Route::get('/dashboard/blog/posts', fn () => Inertia::render("Dashboard/Management/Blog/Posts/index"))->name('management.blog.posts');
	Route::get('/dashboard/blog/post/apply-these-7-secret-techniques-to-improve-event', fn () => Inertia::render("Dashboard/Management/Blog/Post/index"))->name('management.blog.post');
	Route::get('/dashboard/blog/new', fn () => Inertia::render("Dashboard/Management/Blog/Create/index"))->name('management.blog.new');
	// Management - FileManager
	Route::get('/dashboard/files-manager', fn () => Inertia::render("Dashboard/Management/FileManager/index"))->name('management.blog.filesmanager');

	// APP
	Route::get('/dashboard/mail', fn () => Inertia::render("Dashboard/App/Mail/index"))->name('app.mail');
	Route::get('/dashboard/chat', fn () => Inertia::render("Dashboard/App/Chat/index"))->name('app.chat');
	Route::get('/dashboard/calendar', fn () => Inertia::render("Dashboard/App/Calendar/index"))->name('app.calendar');
	Route::get('/dashboard/kanban', fn () => Inertia::render("Dashboard/App/Kanban/index"))->name('app.kanban');
	
});