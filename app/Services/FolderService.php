<?php

namespace App\Services;

use App\Models\FolderModel;
use Illuminate\Support\Facades\Storage;

class FolderService {

	public function getFolders() {
		$user = auth()->user();
		
		$folders = FolderModel::where([
			['is_removed', 1],
			['sub_id', $user->subscriber_id]
		])
		->select('folder_id', 'date_created', 'folder_name', 'revision_no', 'item_order')
		->with([
			'files' => fn($q) => $q->select('src', 'folder_id')->where('is_deleted', 0),
			'documents' => fn($q) => $q
				->select('*', 'tbl_document_reviewer_sign.src as revSrc', 'tbl_document_approval_sign.src as appSrc')
				->where('tbl_documents.is_deleted', 0)
				->withWhereHas('employee')
				->join('tbl_document_reviewer_sign', 'tbl_document_reviewer_sign.document_id', 'tbl_documents.document_id')
				->join('tbl_document_approval_sign', 'tbl_document_approval_sign.document_id', 'tbl_documents.document_id')
		])
		->orderBy("folder_id")
		->get()
		->toArray();

		$srcTracker = [];
		foreach ($folders as $idx => $folder) {
			$folders[$idx]["fileCount"] = 0;
			$folders[$idx]["fileSize"] = 0;
			if(!empty($folder["files"])) {
				foreach ($folder["files"] as $file) {
					$srcTracker[$file["src"]] = 1;
					$filePath = 'public/media/docs/'.$file["src"];
					if(Storage::exists($filePath)){
						$folders[$idx]["fileCount"] += 1;
						$folders[$idx]["fileSize"] += Storage::size($filePath);
					}
				}
			}
			foreach ($folder["documents"] as $doc) {
				if($doc['revSrc'] && !isset($srcTracker[$doc['revSrc']])) {
					$srcTracker[$doc['revSrc']] = 1;
					$filePath = 'public/media/docs/'.$doc["revSrc"];
					if(Storage::exists($filePath)){
						$folders[$idx]["fileCount"] += 1;
						$folders[$idx]["fileSize"] += Storage::size($filePath);
					}
				}
				if($doc['appSrc'] && !isset($srcTracker[$doc['appSrc']])) {
					$srcTracker[$doc['appSrc']] = 1;
					$filePath = 'public/media/docs/'.$doc["appSrc"];
					if(Storage::exists($filePath)){
						$folders[$idx]["fileCount"] += 1;
						$folders[$idx]["fileSize"] += Storage::size($filePath);
					}
				}
			}
		}
		
		return $folders;
	}

}