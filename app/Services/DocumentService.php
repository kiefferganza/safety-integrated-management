<?php

namespace App\Services;

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
				)
		]);
	}

}