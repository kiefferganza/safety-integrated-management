<?php

namespace App\Services\API;

use App\Models\User;

class UserApiService {

	public $collectionName;

	public function __construct(String $collectionName)
	{
		$this->collectionName = $collectionName;
	}

	public function getImagesByCollection($model) {
		$medias = $model
				->media()
				->where('collection_name', $this->collectionName)
				->paginate(10)
				->withQueryString();
		return $medias;
	}

	/**
	 * Add image from request by collection name with custom property "primary" => true
	 *
	 * @param User $user
	 * @param String $value Name of the request file
	 * @return \Spatie\MediaLibrary\MediaCollections\Models\Media
	 */
	public function addImageToUserByCollectionName(User $user, String $value) {
		return $user
			->addMediaFromRequest($value)
			->withCustomProperties(['primary' => true])
			->toMediaCollection($this->collectionName);
	}

	public function unsetUserImage(User $user) {
		$prevMedia = $user->getFirstMedia($this->collectionName, ["primary" => true]);
		if($prevMedia) {
			$prevMedia->setCustomProperty("primary", false);
			$prevMedia->save();
			return $this;
		}
		return $this;
	}

}