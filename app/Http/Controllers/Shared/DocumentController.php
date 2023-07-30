<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\CompanyModel;
use App\Models\Document;
use App\Models\DocumentExternalApprover;
use App\Models\DocumentExternalComment;
use App\Models\DocumentExternalHistory;
use App\Models\FolderModel;
use App\Models\Position;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
		)->with([
			"comments",
			"reviewer_sign",
			"approval_sign",
			"files",
			"approval_employee",
			"reviewer_employees",
			"external_approver",
			"external_comments",
			"external_history" => fn($q) => $q->with("approver"),
		])->findOrFail($sharedLink->model_id);

		$personId = $sharedLink->custom_properties['id'];

		// dd($sharedLink->token);

		$customUser = $document->external_approver->first(function($app) use($personId) {
			return $app->id === $personId;
		});
		
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

		if(count($document->external_approver) > 0) {
			foreach ($document->external_approver as $externalApprover) {
				if($externalApprover->src) {
					$media = $externalApprover->getFirstMedia();
					$files->push(["fullSrc" => $media->getFullUrl(), "src" => $media->name, "date" => $media->created_at]);
				}
			}
		}

		if($files->count() > 0) {
			$document->currentFile = $files->sortByDesc("date")->first();
		}
		
		return Inertia::render("Shared/Document/index", [
			"document" => $document,
			"companies" => CompanyModel::where("sub_id", $folder->sub_id)->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", $folder->sub_id)->get(),
			"customUser" => $customUser,
			"sharedLink" => $sharedLink
		]);
	}


	public function post_comment(Document $document, DocumentExternalApprover $docExternal, Request $request) {
		$body = $request->input();
		$documentService = new DocumentService;

		if($request->hasFile('src')) {
			if(Storage::exists("public/media/docs/" . $document->files[0]->src)) {
				Storage::delete("public/media/docs/" . $document->files[0]->src);
			}
			
			$file_name = $documentService->upload_file($request->file("src"));
			$document->files[0]->update([
				"src" => $file_name
			]);

			DocumentExternalHistory::create([
				"document_id" => $document->document_id,
				"approver" => $docExternal->id,
				"type" => "commented",
				"src" => $file_name
			]);
		}

		DocumentExternalComment::create([
			"document_id" => $document->document_id,
			"approver" => $docExternal->id,
			"comment" => $body["comment"],
			"comment_page_section" => $body["pages"],
			"comment_code" => $body["comment_code"],
			"status" =>  $body["comment_code"] === "2" ? 1 : 0,
		]);

		return redirect()->back()
			->with("message", "Comment added successfully!")
			->with("type", "success");
	}


	public function delete_comment(DocumentExternalComment $comment) {
		$comment->delete();
		return redirect()->back()
			->with('message', 'Comment deleted successfully.')
			->with('type', 'success');
	}


	public function reply_comment(DocumentExternalComment $comment, Document $doc, Request $request) {
		$req_body = $request->validate([
			"reply" => "required|string",
			"reply_code" => "required|string|max:2",
			"src" => "required|mimes:ppt,pptx,doc,docx,pdf,xls,xlsx,jpeg,jpg,png|max:204800"
		]);

		$doc->increment("rev");

		$comment->reply = $req_body["reply"];
		$comment->reply_code = $req_body["reply_code"];
		$comment->status = 2;
		$comment->save();
		
		// Add file to response file and upload to storage
		if($request->hasFile('src')) {
			$file_name = time(). '-' . $req_body['src']->getClientOriginalName();
			$req_body['src']->storeAs('media/docs', $file_name, 'public');
			if(Storage::exists("public/media/docs/" . $doc->files[0]->src)) {
				Storage::delete("public/media/docs/" . $doc->files[0]->src);
			}
			$doc->files[0]->update([
				"src" => $file_name,
			]);
		}

		return redirect()->back()
			->with('message', 'Replied to comment successfully.')
			->with("type", "success");
	}


	public function approve_or_fail_document(Document $document, DocumentExternalApprover $docExternal, Request $request) {
		$request->validate([
			'file' => ['required', 'file'],
			'status' => ['required', 'string'],
			'remarks' => ['string', 'nullable']
		]);
		
		if($request->hasFile('file')) {
			$docExternal->clearMediaCollection();
			$docExternal->addMediaFromRequest('file')->toMediaCollection();
			$docExternal->remarks = $request->remarks;
			$docExternal->src = $request->file('file')->getClientOriginalName();
			$docExternal->status = $request->status;
			$docExternal->save();
			
			DocumentExternalHistory::create([
				"document_id" => $document->document_id,
				"approver" => $docExternal->id,
				"type" => "reviewed",
				"src" => $request->file('file')->getClientOriginalName()
			]);

			$document->status = $request->status;
			$document->increment('rev');
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
			$docApprover->src = $request->file('src')->getClientOriginalName();
			$docApprover->remarks = $request->remarks ? $request->remarks : NULL;
			$docApprover->save();

			$document = Document::find($docApprover->document_id);

			$docExtHistory = DocumentExternalHistory::where([
				"document_id" => $document->document_id,
				"approver" => $docApprover->id,
				"type" => "reviewed"
			])
			->latest()
			->first();

			if($docExtHistory) {
				$docExtHistory->src = $request->file('src')->getClientOriginalName();
				$docExtHistory->save();
			}

			$document->increment('rev');
			$document->save();
		}else {
			abort(500);
		}
		
		return redirect()->back()
			->with("message", "File updated successfuly!")
			->with("type",  "success");
	}
	
}
