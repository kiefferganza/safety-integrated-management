<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaManipulationSeeder extends Seeder
{
	use WithoutModelEvents;
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		// DELETE DUPLICATE IMAGES
		// $users = User::get();
		// foreach ($users as $user) {
		// 	$this->deleteDuplcateProfile($user);
		// }
	}


	/** */
	private function deleteDuplcateProfile($user)
	{
		$collectionName = "profile";
		$duplicateMedia = [];
		$duplicateHashes = [];

		$media = Media::where('model_type', User::class)
			->where('model_id', $user->id)
			->where('collection_name', $collectionName)
			->get();
		// Iterate over media items and identify duplicates
		foreach ($media as $item)
		{
			$hash = $this->calculateImageHash($item->getPath()); // Implement your own function to calculate the image hash
			// Check if a media item with the same hash already exists
			if (in_array($hash, $duplicateHashes))
			{
				$duplicateMedia[] = $item;
			}
			else
			{
				$duplicateHashes[] = $hash;
			}
		}

		dump($duplicateMedia);

		// Delete duplicate media items
		foreach ($duplicateMedia as $item)
		{
			$item->delete();
		}
	}


	private function calculateImageHash($filePath)
	{
		if (!file_exists($filePath))
		{
			return null;
		}

		$fileContents = file_get_contents($filePath);
		if ($fileContents === false)
		{
			return null;
		}

		return md5($fileContents);
	}
}
