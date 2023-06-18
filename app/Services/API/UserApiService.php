<?php

namespace App\Services\API;

use Illuminate\Support\Facades\URL;

class UserApiService {
	public function getImagesByCollection($model, $name) {
		$medias = $model
				->media()
				->where('collection_name', $name)
				->paginate(10)
				->withQueryString()
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
		return $medias;
	}
}