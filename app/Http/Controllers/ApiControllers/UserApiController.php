<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Services\API\UserApiService;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class UserApiController extends Controller
{
	public function addCoverImage(Request $request, User $user) {
		$request->validate([
			"cover" => ['required', 'file', 'mimes:jpeg,png,jpg,webp', 'max:3072']
		]);

		if($request->hasFile('cover')) {
			$userApiService = new UserApiService("cover");
			$userApiService
				->unsetUserImage($user)
				->addImageToUserByCollectionName($user, "cover");
			cache()->forget("authUser:".$user->id);
		}
		
		return redirect()->back()
		->with("message", "Profile changed successfully!")
		->with("type", "success");
	}

	public function profileImages(User $user) {
		$userApiService = new UserApiService("profile");
		$images = $userApiService
			->getImagesByCollection($user)
			->through(function($media){
				$path = "user/" . md5($media->id . config('app.key')). "/" .$media->file_name;
				$transformedData = [
					"id" => $media->id,
					"uuid" => $media->uuid,
					"name" => $media->file_name,
					"alt" => $media->collection_name,
					"properties" => $media->custom_properties,
					"url" => URL::route("image", [ "path" => $path ]),
					"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
					"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ]),
					"medium" => URL::route("image", [ "path" => $path, "w" => 360, "h" => 360, "fit" => "crop"])
				];
				return $transformedData ;
			});
		return response()->json($images->toArray());
	}

	public function coverImages(User $user) {
		$userApiService = new UserApiService("cover");
		$images = $userApiService
			->getImagesByCollection($user)
			->through(function($media){
				$path = "user/" . md5($media->id . config('app.key')). "/" .$media->file_name;
				$transformedData = [
					"id" => $media->id,
					"uuid" => $media->uuid,
					"name" => $media->file_name,
					"alt" => $media->collection_name,
					"properties" => $media->custom_properties,
					"url" => URL::route("image", [ "path" => $path ]),
					"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
					"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ]),
					"medium" => URL::route("image", [ "path" => $path, "w" => 360, "h" => 360, "fit" => "crop"]),
					"cover" => URL::route("image", [ "path" => $path, "w" => 1200, "h" => 480, "fit" => "crop"]),
				];
				return $transformedData ;
			});
		return response()->json($images->toArray());
	}

	public function updateProfileImage(Request $request, User $user) {
		$request->validate([
			"profile_pic" => ['required', 'file', 'mimes:jpeg,png,jpg,webp', 'max:3072']
		]);

		if($request->hasFile('profile_pic')) {
			$userApiService = new UserApiService("profile");
			$userApiService
				->unsetUserImage($user)
				->addImageToUserByCollectionName($user, "profile_pic");
			cache()->forget("authUser:".$user->id);
		}
		
		return redirect()->back()
		->with("message", "Profile changed successfully!")
		->with("type", "success");
	}


	public function notifications() {
		$user = auth()->user();
		$notifications = [];
		if($user) {
			/**
			 * @var App\Models\User $user
			 */
			try {
				$notifications = $user->notifications()->limit(120)->get();
			} catch (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e) {
				info($e);
				$notifications = [];
			}
		}
		return response()->json([
			'notifications' => $notifications
		]);
	}


	public function readNotifications(Request $request) {
		$request->validate(['ids' => ['array', 'required']]);
		$user = auth()->user();
		/**
		 * @var App\Models\User $user
		 */
		$user->notifications()->whereIn('id', $request->ids)->where('read_at', null)->update(['read_at' => new DateTime()]);
		return response()->json([]);
	}


	public function getEmails() {
		$user = auth()->user();
		$data = [];
		$users = User::select('email', 'id')->where('subscriber_id', $user->subscriber_id)->where('deleted', 0)->get();
		foreach ($users as $u) {
			$data[] = [
				'email' => $u->email,
				'id' => $u->id,
				'type' => 'Users'
			];
		}
		$employees = Employee::select('email', 'employee_id')->where('id', null)->where('sub_id', $user->subscriber_id)->where('is_deleted', 0)->get();
		foreach ($employees as $emp) {
			$data[] = [
				'email' => $emp->email,
				'emp_id' => $emp->employee_id,
				'type' => 'Employees'
			];
		}
		return response()->json($data);
	}

}
