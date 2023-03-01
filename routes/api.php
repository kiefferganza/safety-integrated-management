<?php

use App\Http\Controllers\UsersController;
use App\Models\Employee;
use App\Models\Position;
use App\Models\ToolboxTalk;
use Illuminate\Support\Facades\Auth;
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

Route::middleware('auth')->group(function ()
{

	Route::get('/employees', function() {
		$user = Auth::user();

		return [
			"employees" => Employee::with([
				"position" => fn ($query) => 
					$query->select("position_id", "position")->where("is_deleted", 0),
				"company" => fn ($query) => 
					$query->select("company_id", "company_name")->where("is_deleted", 0),
				"department" => fn ($query) => 
					$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]]),
				"followers"
			])->where("is_deleted", 0)->get(),
		];
	});

	Route::get('toolbox-talks', function() {
		return [
			"tbt" => ToolboxTalk::where("is_deleted", 0)
				->with([
					"participants" => fn ($q) => $q->select("firstname", "lastname", "position")->distinct(),
					"file" => fn ($q) => $q->select("tbt_id","img_src"),
					"conducted"
				])
				->orderBy('date_conducted')
				->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", auth()->user()->subscriber_id)->get()
		];
	});
	
	Route::post('/user/follow/{user_id}', [UsersController::class, "followUser"]);

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