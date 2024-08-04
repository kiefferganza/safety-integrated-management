<?php

use App\Http\Controllers\ApiControllers\BillingController;
use App\Http\Controllers\ApiControllers\DashboardController;
use App\Http\Controllers\ApiControllers\FolderApiController;
use App\Http\Controllers\ApiControllers\GeneralApiController;
use App\Http\Controllers\ApiControllers\ImageApiController;
use App\Http\Controllers\ApiControllers\InspectionApiController;
use App\Http\Controllers\ApiControllers\ToolboxTalkController;
use App\Http\Controllers\ApiControllers\TrainingApiController;
use App\Http\Controllers\ApiControllers\UserApiController;
use App\Http\Controllers\UsersController;
use App\Models\ToolboxTalk;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth')->as('api.')->group(function ()
{

	Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

	Route::prefix('dashboard')->as('dashboard.')->group(function ()
	{
		Route::get('/slider-images', [DashboardController::class, 'sliderImages'])->name('slider_images');
		Route::get('/toolboxtalks', [DashboardController::class, 'toolboxtalks'])->name('toolboxtalks');
		Route::get('/toolboxtalks-statistics', [DashboardController::class, 'tbtStatistics'])->name('tbt_statistics');
		Route::get('/trainings', [DashboardController::class, 'trainings'])->name('trainings');
		Route::get('/trainings-chart-by-year/{year}', [DashboardController::class, 'trainingsByYear'])->name('trainings_by_year');
		Route::get('/incidents', [DashboardController::class, 'incidents'])->name('incidents');
		Route::get('/inspections', [DashboardController::class, 'inspections'])->name('inspections');
	});

	Route::prefix('toolbox-talks')->as('tbt.')->group(function ()
	{
		Route::get('/all', [ToolboxTalkController::class, 'index'])->name('index');
		Route::get('/type', [ToolboxTalkController::class, 'byType'])->name('type');

		// Preplanning
		Route::get('/assigned-tracker', [ToolboxTalkController::class, 'assignedTracker'])->name('tracker.assigned');
		Route::prefix('preplanning')->as('preplanning.')->group(function() {
			Route::get('/tracker', [ToolboxTalkController::class, 'tracker'])->name('tracker');
		});
	});

	Route::prefix('training')->as('training.')->group(function ()
	{
		Route::get('in-house/matrix', [TrainingApiController::class, 'inhouseMatrix'])->name('inhouse_matrix');
		Route::get('external/matrix', [TrainingApiController::class, 'externalMatrix'])->name('external_matrix');
	});


	Route::prefix('inspections')->as('inspections.')->group(function ()
	{
		Route::get('/', [InspectionApiController::class, 'index'])->name('index');

		Route::prefix('inspectors')->as('inspectors.')->group(function () {
			Route::get('/employees', [InspectionApiController::class, 'employeeWithInspectionCount'])->name("employees");
		});

		Route::get('/assigned-tracker', [InspectionApiController::class, 'assignedTracker'])->name('tracker.assigned');
		Route::get('/tracker', [InspectionApiController::class, "tracker"])->name('tracker');
	});


	Route::get("/positions", [GeneralApiController::class, "positions"])->name("positions");

	// USED IN TBT REPORT AND STATISTICS
	Route::get('toolbox-talks', function ()
	{
		$tbt = ToolboxTalk::where("is_deleted", 0)
			->with([
				"participants" => fn ($q) => $q->select("firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
				"file" => fn ($q) => $q->select("tbt_id", "img_src"),
				"conducted"
			])
			->orderBy('date_conducted')
			->get();

		return response()->json([
			"tbt" => $tbt
		]);
	})->name('toolbox_talks');

	// Route::post('/user/follow/{user_id}', [UsersController::class, "followUser"]);

	Route::prefix('user')->as('user.')->group(function ()
	{
		Route::get('/emails', [UserApiController::class, 'getEmails'])->name('emails');
		Route::get('/notifications', [UserApiController::class, 'notifications'])->name('notifications');
		Route::post('/read-notifications', [UserApiController::class, 'readNotifications'])->name('read_notifications');

		Route::get('/cover/{user}', [UserApiController::class, 'coverImages'])->name('cover_images');
		Route::post('/cover/{user}', [UserApiController::class, 'addCoverImage'])->name('add_cover');
		Route::post('/profile-image-update/{user}', [UserApiController::class, 'updateProfileImage'])->name('update_profile_image');
		Route::post('/set-image/{media}', [UsersController::class, 'setProfilePic'])->name('set-profile');
		Route::get('/{user}', [UserApiController::class, 'profileImages'])->name('profile_images');
	});

	Route::prefix('images')->as('images.')->group(function ()
	{
		Route::post('/set-image/{user}', [ImageApiController::class, 'setImageByMediaAndCollectionName'])->name('set-image');
		Route::delete('/delete-image/{media}', [ImageApiController::class, 'deleteImageById'])->name('delete-image');
	});

	Route::prefix('folder')->as('folder.')->group(function ()
	{
		Route::post('/update-order', [FolderApiController::class, 'updateOrder'])->name('update-order');
		Route::post('/generate-url/{document}', [FolderApiController::class, 'generateUrl'])->name('generate-url');
	});

	Route::prefix("billing")->as("billing.")->group(function() {
		Route::get("/cancel-subscription", [BillingController::class, "cancelSubscription"])->name("cancelSubscription");
	});
});