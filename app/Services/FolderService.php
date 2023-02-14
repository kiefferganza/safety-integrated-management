<?php

namespace App\Services;

use App\Models\FolderModel;
use Illuminate\Support\Facades\Storage;

class FolderService {

	public function getFolders() {
		$user = auth()->user();
		
		$folders = FolderModel::where([
			["is_removed", 1],
			["sub_id", $user->subscriber_id]
		])
		->select("folder_id", "date_created", "folder_name", "revision_no")
		->with([
			"files" => fn($q) => $q->select("src", "folder_id")->where("is_deleted", 0),
			"documents" => fn($q) => $q->where("is_deleted", 0)->withWhereHas("employee")
		])
		->orderBy("folder_id")
		->get()
		->toArray();

		foreach ($folders as $idx => $folder) {
			$folders[$idx]["fileCount"] = 0;
			$folders[$idx]["fileSize"] = 0;
			if(!empty($folder["files"])) {
				foreach ($folder["files"] as $file) {
					$filePath = 'public/media/docs/'.$file["src"];
					if(Storage::exists($filePath)){
						$folders[$idx]["fileCount"]++;
						$folders[$idx]["fileSize"] += Storage::size($filePath);
					}
				}
			}
		}
		
		return $folders;
	}

}