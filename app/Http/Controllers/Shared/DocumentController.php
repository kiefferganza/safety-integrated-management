<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\CompanyModel;
use App\Models\Document;
use App\Models\FolderModel;
use App\Models\Position;
use App\Models\ShareableLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class DocumentController extends Controller
{
    function show(Request $request) {
		$request->validate([
			'token' => ['string', 'required']
		]);

		$sharedLink = $request->shareableLink;
		
		if($sharedLink->model_type !== Document::class) {
			abort(404);
		}

		$document = Document::withWhereHas(
				"employee", fn($q) => $q->select("employee_id", "firstname", "lastname", "position", "department", "img_src", "phone_no", "company", "email", "user_id")->with([
					"position",
					"department",
					"user"
				])
			)->with(
				"comments",
				"reviewer_sign",
				"approval_sign",
				"files",
				"approval_employee",
				"reviewer_employees",
			)->findOrFail($sharedLink->model_id);

		$folder = FolderModel::select('sub_id')->findOrFail($document->folder_id);

		// Submitter Profile
		$document->employee->profile = null;
		if($document->employee->user) {
			$profile = $document->employee->user->getFirstMedia("profile", ["primary" => true]);
			if($profile) {
				$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
				$document->employee->profile = [
					"url" => URL::route("image", [ "path" => $path ]),
					"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
					"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
				];
			}
		}
		
		// FIlES
		$files = collect([]);
		$document->currentFile = null;
		if(count($document->files) > 0) {
			$files->push(["src" => $document->files[0]->src,"date" => $document->files[0]->upload_date]);
		}
		if($document->approval_sign) {
			$files->push(["src" => $document->approval_sign->src, "date" => $document->approval_sign->created_at->format('Y-m-d H:i:s')]);
		}
		if(count($document->reviewer_sign) > 0) {
			foreach ($document->reviewer_sign as $revSign) {
				$files->push(["src" => $revSign->src, "date" => $revSign->upload_date]);
			}
		}
		if($files->count() > 0) {
			$document->currentFile = $files->sortByDesc("date")->first();
		}
		
		return Inertia::render("Shared/Document/index", [
			"document" => $document,
			"companies" => CompanyModel::where("sub_id", $folder->sub_id)->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", $folder->sub_id)->get()
		]);
	}
}
