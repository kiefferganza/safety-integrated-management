<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\API\UserApiService;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Str;

class ImageApiController extends Controller
{
	public function setImageByMediaAndCollectionName(Request $request, User $user) {
		$request->validate([
			"mediaId" => ['integer', 'required'],
			"collectionName" => ['string', 'required']
		]);
		$userApiService = new UserApiService($request->collectionName);
		$userApiService->unsetUserImage($user);

		$media = Media::findOrFail($request->mediaId);
		$media->setCustomProperty('primary', true);
		$media->save();
		cache()->forget("authUser:".$user->id);

		return redirect()->back()
		->with("message", Str::ucfirst($request->collectionName) . " changed successfully!")
		->with("type", "success");
	}

    public function deleteImageById(Media $media) {
		$collectionName = $media->collection_name === "profile" || $media->collection_name === "cover";
		$hasPrimaryProperty = $media->hasCustomProperty('primary');
		$isPrimary = false;
		if($collectionName && $hasPrimaryProperty) {
			$isPrimary = $media->getCustomProperty('primary');
		}
		$id = $media->model_id;
		$media->delete();

		// IF PROFILE PIC
		if($isPrimary) {
			cache()->forget("authUser:".$id);
		}

		return redirect()->back()
		->with("message", "Image deleted successfully!")
		->with("type", "success");
	}

}
