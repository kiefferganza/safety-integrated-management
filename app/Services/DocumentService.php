<?php

namespace App\Services;

use App\Models\Document;
use App\Models\FolderModel;

class DocumentService {

	public function getDocumentByFolders(FolderModel $folder) {
		return $folder->load([
			"documents" => fn($q) =>
				$q->where("is_deleted", 0)->withWhereHas(
					"employee", fn($q) => $q->select("employee_id", "firstname", "lastname", "position", "department")->with([
						"position",
						"department"
					])
				)->with(
					"comments",
					"reviewer_sign",
					"approval_sign",
					"files",
					"approval_employee",
					"reviewer_employees",
				)->orderByDesc("date_uploaded")
		]);
	}


	public function sequence_no($folder_id) {
		$user = auth()->user();

		$lastSubmittedDoc = Document::select("sequence_no")->where([
			["user_id", $user->emp_id],
			["is_deleted", 0],
			["folder_id", $folder_id]
		])->latest("date_uploaded")->first();

		$sequence = '0001';

		if($lastSubmittedDoc) {
			$zeroes = '';
			$prevSequence = (int)$lastSubmittedDoc->sequence_no + 1;
			$number_of_zeroes = strlen((string) $prevSequence);
			for($i = $number_of_zeroes; $i < 4; $i++) {
				$zeroes .= "0";
			}
			$sequence = $zeroes . $prevSequence;
		}
		return $sequence;
	}

}