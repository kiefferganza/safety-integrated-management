<?php

use App\Http\Controllers\ApiControllers\FolderApiController;
use App\Http\Controllers\ApiControllers\ImageApiController;
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

	Route::get('toolbox-talks', function() {
		$tbt = ToolboxTalk::where("is_deleted", 0)
			->with([
				"participants" => fn ($q) => $q->select("firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")->distinct(),
				"file" => fn ($q) => $q->select("tbt_id","img_src"),
				"conducted"
			])
			->orderBy('date_conducted')
			->get();

		return response()->json([
			"tbt" => $tbt
		]);
	})->name('toolbox_talks');

	// Route::post('/user/follow/{user_id}', [UsersController::class, "followUser"]);

	Route::prefix('user')->as('user.')->group(function() {
		Route::get('/{user}', [UserApiController::class, 'profileImages'])->name('profile_images');
		Route::get('/cover/{user}', [UserApiController::class, 'coverImages'])->name('cover_images');
		Route::post('/cover/{user}', [UserApiController::class, 'addCoverImage'])->name('add_cover');
		Route::post('/profile-image-update/{user}', [UserApiController::class, 'updateProfileImage'])->name('update_profile_image');
		Route::post('/set-image/{media}', [UsersController::class, 'setProfilePic'])->name('set-profile');
	});

	Route::prefix('images')->as('images.')->group(function() {
		Route::post('/set-image/{user}', [ImageApiController::class, 'setImageByMediaAndCollectionName'])->name('set-image');
		Route::delete('/delete-image/{media}', [ImageApiController::class, 'deleteImageById'])->name('delete-image');
	});

	Route::prefix('folder')->as('folder.')->group(function() {
		Route::post('/update-order', [FolderApiController::class, 'updateOrder'])->name('update-order');
		Route::post('/generate-url/{document}', [FolderApiController::class, 'generateUrl'])->name('generate-url');
	});

});

// Route::get("/update", function() {
// 	$emp = Employee::where("is_deleted", 1)->get();
// 	foreach ($emp as $e) {
// 		$e->toolboxTalks()->delete();
// 		$e->delete();
// 	}
// 	dd($emp);
// });

// Route::get("/update", function() {
// 	$users = User::where("emp_id", "!=", null)->get();
// 	foreach ($users as $user) {
// 		if($user->employee) {
// 			$emp = $user->employee;
// 			if(!$emp->user_id) {
// 				$emp->user_id = $user->user_id;
// 				$emp->save();
// 			}
// 		}
// 	}
// });

// Route::get("delete/user", function() {
// 	$users = User::where("deleted", 1)->get();
// 	foreach ($users as $user) {
// 		if($user->profile_pic) {
// 			if(Storage::exists("public/media/docs/" . $user->profile_pic)) {
// 				Storage::delete("public/media/docs/" . $user->profile_pic);
// 			}
// 		}
// 		$user->delete();
// 	}
// 	dd($users);
// });
