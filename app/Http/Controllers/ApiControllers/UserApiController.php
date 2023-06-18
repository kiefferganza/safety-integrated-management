<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\API\UserApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UserApiController extends Controller
{
	public function profileImages(User $user) {
		$userApiService = new UserApiService();
		$images = $userApiService->getImagesByCollection($user, "profile");
		return response()->json($images->toArray());
	}

	public function coverImages(User $user) {
		$userApiService = new UserApiService();
		$images = $userApiService->getImagesByCollection($user, "cover");
		return response()->json($images->toArray());
	}

	public function deleteImageById(Media $media) {
		if($media->collection_name === "profile") {
			cache()->forget("authUser:".$media->model_id);
		}
		$media->delete();

		return redirect()->back()
		->with("message", "Image deleted successfully!")
		->with("type", "success");
	}

}
