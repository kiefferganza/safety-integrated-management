<?php

namespace App\Services\MediaLibrary;

use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaService {

	/**
	 * Get medias of the model and transform the data to a array with all conversions
	 *
	 * @param Model $model
	 * @param string $collection_name - default to 'default' collection name
	 * @return array Media[]
	 */
	public function getAndTransformMedia($model, $collection_name = 'default') {
		return $model->getMedia($collection_name)->transform(function(Media $image) {
			$conversions = $image->getMediaConversionNames();
			$imageData = [
				'original' => $image->getUrl(),
			];
			foreach ($conversions as $conversion) {
				$imageData[$conversion] = $image->getUrl($conversion);
			}
			return array_merge($imageData, [
				'id' => $image->id,
				'name' => $image->name,
				'fileName' => $image->file_name,
				'size' => $image->size,
				'mimeType' => $image->mime_type,
				'customProperties' => $image->custom_properties,
				'created_at' => $image->created_at,
				'updated_at' => $image->updated_at
			]);
		});
	}
}