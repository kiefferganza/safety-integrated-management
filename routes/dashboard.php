<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FilePageController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\InspectionReportController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\InventoryReportController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ToolboxTalkController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('dashboard'));

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
	Route::prefix('employee')->as('management.employee.')->group(function() {
		Route::get('/list', [EmployeeController::class, "index"])
			->middleware("permission:employee_show")
			->name('list');
		// CRUD
		Route::middleware("permission:employee_create")->group(function() {
			Route::get('/new', [EmployeeController::class, "create"])->name('create');
			Route::post('/new', [EmployeeController::class, "store"])->name('new');
		});
		Route::get('/{employee}/profile', [EmployeeController::class, "show"])->name('show');
		Route::get('/{employee}/profile/gallery', [EmployeeController::class, "profileGallery"])->name('profileGallery');
		Route::get('/{employee}/profile/trainings', [EmployeeController::class, "profileTrainings"])->name('profileTrainings');
		Route::get('/{employee}/edit', [EmployeeController::class, "update"])->name('update');
		Route::post('/{employee}/edit', [EmployeeController::class, "edit"])->name('edit');
		Route::middleware("permission:employee_delete")->group(function() {
			Route::delete('/{employee}/delete', [EmployeeController ::class, 'destroy']);
			Route::post('/delete/delete-multiple', [EmployeeController ::class, 'delete_multiple'])->name('delete-multiple');
		});
	});
	/**
	 * Management - Employee/Position 
	 */
	Route::prefix('position')->as('management.position.')->group(function() {
		Route::get('/list', [PositionController::class, 'index'])->name('list');
		// CRUD
		Route::post('/new', [PositionController::class, 'store'])->name('new');
		Route::post('/{position}/edit', [PositionController::class, 'edit']);
		Route::delete('/{position}', [PositionController::class, 'destroy']);
		Route::post('/delete-multiple', [PositionController::class, 'delete_multiple'])->name('delete-multiple');
	});
	/**
	 * Management - Employee/Department
	 */
	Route::prefix("department")->as('management.department.')->group(function() {
		Route::get('/list', [DepartmentController::class, 'index'])->name('list');
		// Crud
		Route::post('/new', [DepartmentController::class, 'store'])->name('new');
		Route::post('/{department}/edit', [DepartmentController::class, 'edit']);
		Route::delete('/{department}', [DepartmentController::class, 'destroy']);
		Route::post('/delete-multiple', [DepartmentController::class, 'delete_multiple'])->name('delete-multiple');
	});
	/**
	 * Management - Employee/Company
	 */
	Route::prefix('company')->as('management.company.')->group(function() {
		Route::get('/list', [CompanyController::class, 'index'])->name('list');
		// CRUD
		Route::post('/new', [CompanyController::class, 'store'])->name('new');
		Route::put('/{company}/edit', [CompanyController::class, 'edit']);
		Route::delete('/{company}', [CompanyController::class, 'destroy']);
		Route::post('/delete-multiple', [CompanyController::class, 'delete_multiple'])->name('delete-multiple');
	});

	/**
	 * Management - User
	 */
	Route::prefix('user')->as('management.user.')->group(function() {
		// Route::post('/user/{user_id}/follow', [UsersController::class, 'followUser']);
		Route::middleware("permission:user_show")->group(function() {
			Route::get('/profile', [UsersController::class, 'profile'])->name('profile');
			Route::get('/settings', [UsersController::class, 'settings'])->name('settings');
			Route::get('/profile/{user:username}', [UsersController::class, "show"])->name('show');
		});
		
		// CRUD
		// Can update
		Route::middleware("permission:user_edit")->group(function() {
			Route::put('/update-socials', [UsersController::class, 'update_socials'])->name('update_socials');
			Route::post('/change-password', [UsersController::class, 'change_password'])->name('change_pass');
			Route::get('/{user:username}/edit', [UsersController::class, 'edit_user'])->name("edit");
			Route::post('/{user}/update', [UsersController::class, 'update'])->name("update");
		});
		// Can delete
		Route::post('/delete', [UsersController::class, 'delete'])->middleware('permission:user_delete');
		// Can create
		Route::middleware("permission:user_create")->group(function() {
			Route::get('/new', [UsersController::class, 'create'])->name('new');
			Route::post('/new', [UsersController::class, 'store'])->name('store');
		});

		Route::middleware("permission:user_access")->group(function() {
			Route::get('/cards', [UsersController::class, 'cards'])->name('cards');
			Route::get('/list', [UsersController::class, 'index'])->name('list');

			Route::put('/{user}/activate',  [UsersController::class, 'activate'])->name("activate");
			Route::put('/{user}/deactivate',  [UsersController::class, 'deactivate'])->name("deactivate");

			// Update role or permissions
			Route::put('/{user}/update-permission', [PermissionController::class, "updateUserPermission"])->name("updateUserPermission");
		});
	});


	// IMAGES
	Route::prefix('image')->as('image.')->group(function() {
		Route::post('/new/slider', [ImagesController::class, "storeSlider"])->name("storeSlider")->middleware( "permission:image_upload_slider");
		Route::delete('/delete/{image}', [ImagesController::class, "destroy"])->name("destroy")->middleware("permission:image_upload_delete");
	});


	/**
	 * Management - Training
	 */
	Route::prefix('training')->as('training.management.')->group(function() {
		// Lists
		Route::middleware("permission:training_show")->group(function() {
			Route::get('/client', [TrainingController::class, 'index'])->name('client');
			Route::get('/in-house', [TrainingController::class, 'in_house'])->name('in_house');
			Route::get('/induction', [TrainingController::class, 'induction'])->name('induction');
			Route::get('/third-party', [TrainingController::class, 'external'])->name('external');
			// Show
			Route::get('/client/{training}', [TrainingController::class, 'show_client'])->name('client.show');
			Route::get('/induction/{training}', [TrainingController::class, 'show_induction'])->name('induction.show');
			Route::get('/in-house/{training}', [TrainingController::class, 'show_in_house'])->name('in_house.show');
			Route::get('/third-party/{training}', [TrainingController::class, 'show_external'])->name('external.show');
		});

		// Create
		Route::middleware("permission:training_create")->group(function() {
			Route::get('/new', [TrainingController::class, 'create'])->name('create');
			Route::post('/create', [TrainingController::class, 'store'])->name('store');
		});

		Route::post('/delete', [TrainingController::class, 'destroy'])
			->middleware("permission:training_delete")
			->name('destroy');
		
		// Update
		Route::middleware("permission:training_edit")->group(function() {
			Route::post('/{training}/edit', [TrainingController::class, 'update']);
			Route::get('/{training}/edit', [TrainingController::class, 'edit']);
		});
		
	});

	/**
	 * Management - Inspection
	 */
	Route::prefix('inspection')->as('inspection.management.')->group(function() {
		Route::get('/site/report', [InspectionController::class, "reportList"])->name('report');
		// CRUD
		Route::middleware("permission:inspection_create")->group(function() {
			Route::get('/new', [InspectionController::class, "create"])->name('new');
			Route::post('/new', [InspectionController::class, "store"])->name('store');
		});
		Route::post('/delete', [InspectionController::class, "delete"])
			->middleware("permission:inspection_delete")
			->name('delete');
		Route::middleware("permission:inspection_show")->group(function () {
			Route::get('/site/list', [InspectionController::class, "index"])->name('list');
			Route::get('/{inspection}', [InspectionController::class, "view"])->name('view');
		});
		Route::middleware("permission:inspection_edit")->group(function() {
			Route::get('/{inspection}/edit', [InspectionController::class, "edit"]);
			Route::post('/{inspection}/edit', [InspectionReportController::class, "update"]);
			Route::get('/{inspection}/review', [InspectionController::class, "review"]);
			Route::post('/{inspection}/review', [InspectionReportController::class, "review_update"]);
			Route::get('/{inspection}/verify', [InspectionController::class, "verify"]);
			Route::post('/{inspection}/verify', [InspectionReportController::class, "verify_update"]);
		});
	});

	/**
	 * Management - ToolboxTalks
	 */
	Route::prefix('toolbox-talks')->as('toolboxtalk.management.')->group(function() {
		// CRUD
		Route::middleware("permission:talk_toolbox_show")->group(function() {
			Route::get('/all', [ToolboxTalkController::class, "index"])->name('all');
			Route::get('/civil', [ToolboxTalkController::class, "civil_list"])->name('civil');
			Route::get('/electrical', [ToolboxTalkController::class, "electrical_list"])->name('electrical');
			Route::get('/mechanical', [ToolboxTalkController::class, "mechanical_list"])->name('mechanical');
			Route::get('/workshop', [ToolboxTalkController::class, "camp_list"])->name('camp');
			Route::get('/office', [ToolboxTalkController::class, "office_list"])->name('office');
			Route::get('/{tbt}/view', [ToolboxTalkController::class, "view"]);
		});
		Route::middleware("permission:talk_toolbox_create")->group(function() {
			Route::get('/new', [ToolboxTalkController::class, "create"])->name('new');
			Route::post('/new', [ToolboxTalkController::class, "store"])->name('store');
		});
		Route::middleware("permission:talk_toolbox_edit")->group(function() {
			Route::get('/{tbt}/edit', [ToolboxTalkController::class, "edit"]);
			Route::post('/{tbt}/edit', [ToolboxTalkController::class, "update"]);
		});
		Route::post('/delete', [ToolboxTalkController::class, "soft_delete"])
			->middleware("permission:talk_toolbox_delete")
			->name('delete');
		Route::get('/report', [ToolboxTalkController::class, "reportList"])->name('report');
		// Statistic
		Route::get('/statistic', [ToolboxTalkController::class, "statistic"])->name('statistic');
		Route::post('/statistic/new', [ToolboxTalkController::class, "storeStatistic"])->name('store_statistic');
		Route::post('/statistic/{statistic}/edit', [ToolboxTalkController::class, "updateStatistic"]);
		Route::delete('/statistic/{statistic}/delete', [ToolboxTalkController::class, "destroyStatistic"]);
	});

	/**
	 * Management - PPE
	 */
	Route::prefix('ppe')->as('ppe.management.')->group(function() {
		Route::get('/list', [InventoryController::class, "index"])
			->middleware("permission:inventory_show")
			->name('index');
		Route::post('/delete', [InventoryController::class, "destroy"])
			->middleware("permission:inventory_delete")
			->name('destroy');
		Route::middleware("permission:inventory_create")->group(function() {
			Route::get('/new', [InventoryController::class, "create"])->name('create');
			Route::post('/new', [InventoryController::class, "store"])->name('store');
		});

		// Products
		Route::get('/product/{inventory}', [InventoryController::class, "show"])
			->middleware("permission:stock_show")
			->name('show');
		Route::post('/product/add-remove-stock/{inventory}', [InventoryController::class, "add_remove_stock"])
			->middleware("permission:stock_addOrRemove");

		Route::middleware("permission:inventory_edit")->group(function() {
			Route::get('/product/{inventory}/edit', [InventoryController::class, "edit"])->name('edit');
			Route::post('/product/{inventory}/edit', [InventoryController::class, "update"])->name('update');
		});

		// Report
		Route::get('/report', [InventoryReportController::class, "index"])->name('report');
		Route::get('/report-list', [InventoryReportController::class, "reportList"])->name('report.list');
		Route::post('/report/new', [InventoryReportController::class, "store"])->name('report.store');

		Route::post('/report/comment/{inventoryReport}', [InventoryReportController::class, "postComment"])->name('report.comment');
		Route::delete('/report/comment/{reportComment}', [InventoryReportController::class, "destroyComment"])->name('report.destroyComment');
		Route::put('/report/comment/{reportComment}', [InventoryReportController::class, "changeCommentStatus"])->name('report.changeCommentStatus');
		Route::post('/report/reply/{reportComment}', [InventoryReportController::class, "replyComment"])->name('report.reply');
		Route::post('/report/review/{inventoryReport}', [InventoryReportController::class, "review"])->name('report.review');
		Route::post('/report/approve-review/{inventoryReport}', [InventoryReportController::class, "approveReview"])->name('report.approveReview');
		Route::get('/report/{inventoryReport}', [InventoryReportController::class, "show"])->name('report.show');
		Route::delete('/report/{inventoryReport}', [InventoryReportController::class, "destroy"])->name('report.destroy');
	});



	Route::prefix('incident')->as('incident.management.')->group(function() {
		Route::get('/report', [IncidentController::class, "reportList"])->name('report');
		Route::middleware("permission:incident_show")->group(function() {
			Route::get('/list', [IncidentController::class, "index"])->name('index');
		});
		Route::middleware("permission:incident_create")->group(function() {
			Route::get('/create', [IncidentController::class, "create"])->name('create');
			Route::post('/create', [IncidentController::class, "store"])->name('store');
		});

		Route::middleware("permission:incident_delete")->group(function() {
			Route::post('/delete', [IncidentController::class, "destroy"])->name('destroy');
		});
	});



	/**
	 * Management - Folder
	 */
	Route::prefix('file-manager')->as('files.management.')->group(function() {
		Route::get('/', [FilePageController::class, "index"])
			->middleware("permission:folder_show")
			->name('index');
		Route::post('/new', [FilePageController::class, "create_folder"])
			->middleware("permission:folder_create")
			->name('create_folder');
		Route::post('/delete', [FilePageController::class, "destroy"])
			->middleware("permission:folder_delete")
			->name('destroy');
		Route::post('/{folder}/edit', [FilePageController::class, "update"])
			->middleware("permission:folder_edit")
			->name('update');
		// Folder -> Documents
		Route::get('/view', [DocumentController::class, "view"])->name("show")->middleware(["permission:file_show", "permission:folder_show"]);
		Route::get('/external', [FilePageController::class, "thirdParty"])->name("external")->middleware("permission:folder_show");
		Route::get('/{folder}', [DocumentController::class, "index"])->name("document.show")->middleware("permission:folder_show");
		Route::middleware("permission:file_create")->group(function() {
			Route::get('/{folder}/new', [DocumentController::class, "create"])->name("create");
			Route::post('/{folder}/new', [DocumentController::class, "store"]);
		}); 
		Route::post('/document/delete', [DocumentController::class, "destroy"])
			->middleware("permission:file_delete")
			->name('filemanager.document.delete');
		Route::middleware("permission:file_edit")->group(function() {
			Route::post('/document/{document}/action', [DocumentController::class, "approve_or_fail_document"]);
			Route::post('/document/{document}/add-comment', [DocumentController::class, "add_comment"]);
			Route::post('/document/{comment}/reply-comment', [DocumentController::class, "reply_comment"]);
			Route::post('/document/{comment}/delete-comment', [DocumentController::class, "delete_comment"]);
		});
	});

});