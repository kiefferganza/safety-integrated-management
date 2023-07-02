<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\CompanyModel;
use App\Models\Document;
use App\Models\DocumentExternalApprover;
use App\Models\DocumentExternalReviewer;
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
			"external_approver",
			"external_reviewer"
		)->findOrFail($sharedLink->model_id);

		$customUser = null;

		$personId = $sharedLink->custom_properties['id'];

		if($sharedLink->custom_properties['type'] === 'reviewer') {
			$customUser = $document->external_reviewer->first(function($app) use($personId) {
				return $app->id === $personId;
			});
			$customUser->type = "reviewer";
		}else {
			$customUser = $document->external_approver->first(function($app) use($personId) {
				return $app->id === $personId;
			});
			$customUser->type = "approver";
		}

		$customUser->token = $sharedLink->token;
		
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

		if(count($document->external_reviewer) > 0) {
			foreach ($document->external_reviewer as $externalReviewer) {
				$media = $externalReviewer->getFirstMedia();
				$files->push(["fullSrc" => $media->getFullUrl(), "src" => $media->name, "date" => $media->created_at]);
			}
		}

		if(count($document->external_approver) > 0) {
			foreach ($document->external_approver as $externalApprover) {
				$media = $externalApprover->getFirstMedia();
				$files->push(["fullSrc" => $media->getFullUrl(), "src" => $media->name, "date" => $media->created_at]);
			}
		}

		if($files->count() > 0) {
			$document->currentFile = $files->sortByDesc("date")->first();
		}
		
		return Inertia::render("Shared/Document/index", [
			"document" => $document,
			"companies" => CompanyModel::where("sub_id", $folder->sub_id)->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", $folder->sub_id)->get(),
			"customUser" => $customUser
		]);
	}

	public function approve_or_fail_document(Document $document, Request $request) {
		$request->validate([
			'src' => ['required', 'file'],
			'status' => ['required', 'string'],
			'remarks' => ['string']
		]);
		
		if($request->hasFile('src')) {
			if($request->docType === "approver") {
				$docExternal = DocumentExternalApprover::findOrFail($request->id);
			}else {
				$docExternal = DocumentExternalReviewer::findOrFail($request->id);
			}
			$docExternal->clearMediaCollection();
			$docExternal->addMediaFromRequest('src')->toMediaCollection();
			$docExternal->remarks = $request->remarks ? $request->remarks : NULL;
			$docExternal->src = $request->file('src')->getClientOriginalName();
			$docExternal->status = $request->status;
			$docExternal->save();

			$document->status = $request->status;
			$document->save();
		}else {
			abort(500);
		}
		

		return redirect()->back()
			->with("message", "Action completed")
			->with("type",  "success");
	}

	public function reupload_approval_file(DocumentExternalApprover $docApprover, Request $request) {
		$request->validate([
			'src' => ['required', 'file']
		]);

		if($request->hasFile('src')) {
			$docApprover->clearMediaCollection();
			$docApprover->addMediaFromRequest('src')->toMediaCollection();
			$docApprover->remarks = $request->remarks ? $request->remarks : NULL;
			$docApprover->save();
		}else {
			abort(500);
		}
		
		return redirect()->back()
			->with("message", "File updated successfuly!")
			->with("type",  "success");
	}
	
}
