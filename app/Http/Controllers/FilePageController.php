<?php

namespace App\Http\Controllers;

use App\Mail\FileMailable;
use App\Mail\TestMailable;
use App\Models\Document;
use App\Models\DocumentApprovalSign;
use App\Models\DocumentCommentReplies;
use App\Models\DocumentResponseFile;
use App\Models\DocumentReviewer;
use App\Models\DocumentReviewerSign;
use App\Models\FileModel;
use App\Models\FolderModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FilePageController extends Controller
{
	public function index()
	{
		$user = Auth::user();

		$folders = FolderModel::where([
				["is_removed", 1],
				["sub_id", $user->subscriber_id]
			])
			->orderBy("folder_id")
			->get();

		return Inertia::render("Files/Index", ["folders" => $folders]);
	}
	
	public function create_folder(Request $request) {
		$user = Auth::user();
		FolderModel::create([
			'is_removed' => 1,
			'is_active' => 0,
			'folder_name' => $request->folder_name,
			'sub_id' => $user->subscriber_id
		]);

		return Redirect::back()
		->with("message", "Folder added successfully!")
		->with("type", "success");
	}

	public function single_folder(Request $request, $folder_name)
	{
		$user = Auth::user();
		$folder = FolderModel::select(["folder_id", "date_created", "revision_no"])->where([
			["folder_name", $folder_name],
			["is_removed", 1],
			["sub_id", $user->subscriber_id]
		])->first();
		if ($folder) {
			$folder_id = $folder->folder_id;
		}
		else {
			return redirect()->route("files");
		}

		$submitted = Document::submitted($user, $folder_id)->get();
		$review_documents = Document::reviewDocs($user, $folder_id)->get();
		$approval_documents = Document::approvalDocs($user, $folder_id)->get();
		$folder_docs = Document::docControls($folder_id)->get();

		$number_of_documents = $submitted->count() + 1;
		$number_of_zeroes = strlen((string) $number_of_documents);
		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++)
		{
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}
		$sequence =  $sequence_no_zeros . $number_of_documents;

		$personel = User::personel($user)->get();

		$positions = DB::table('tbl_position')->get();

		return Inertia::render("Files/SingleFolder", array(
			"folderName" => $folder_name,
			"folderCreatedDate" => $folder->date_created,
			"folderId" => $folder_id,
			"folderRev" => $folder->revision_no,
			"sequenceNo" => $sequence,
			"personel" => $personel,
			"positions" => $positions,
			"documents" => array(
				["title" => "Submitted Documents", "type" => "submitted_docs", "data" => $submitted],
				["title" => "For Review Documents", "type" => "review_docs","data" => $review_documents],
				["title" => "For Approval Documents","type" => "approval_docs", "data" => $approval_documents],
				["title" => "Documents Control","type" => "control_docs", "data" => $folder_docs]
			)
		));
	}

	public function edit_folder(Request $request, $folder_id) {
		$folder = FolderModel::find($folder_id);
		
		$old_name = $folder->folder_name;
		$folder->folder_name = $request->folder_name;
		$folder->increment("revision_no");
		$folder->save();

		return Redirect::back()
		->with("message", $old_name . " updated successfully!")
		->with("type", "info");
	}

	public function delete_folders(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);
		FolderModel::whereIn("folder_id", $fields["ids"])->update(["is_removed" => 0]);

		return Redirect::back()
		->with("message", "File deleted successfully!")
		->with("type", "error");
	}
	
	public function create_document(Request $request)
	{
		$fields = $request->validate([
			'folder_name' => ['required', 'string'],
			'src' => ['required', 'mimes:ppt,pptx,doc,docx,pdf,xls,xlsx', 'max:204800'],
			'manual_cc' => ['nullable', 'email'],
			'originator' => ['required', 'max:255'],
			'sequence_no' => ['nullable'],
			'description' => ['nullable', 'max:255'],
			'title' => ['required', 'string', 'max:255'],
			'folder_id' => ['required', 'integer'],
			'project_code' => ['required', 'string', 'max:255'],
			'discipline' => ['required', 'string', 'max:255'],
			'document_type' => ['required','string', 'max:255'],
			'document_zone' => ['nullable', 'max:255'],
			'document_level' => ['nullable', 'max:255'],
			'cc' => ['array'],
			'approval' => ['array'],
			'reviewers' => ['array']
		]);

		$user = Auth::user();
		$date_today = date('Y-m-d H:i:s');

		$document_id = $user->documents()->insertGetId([
			'originator' => $fields['originator'],
			'originator2' => $fields['originator'],
			'sequence_no' => $fields['sequence_no'],
			'description' => $fields['description'],
			'title' => $fields['title'],
			'folder_id' => (int)$fields['folder_id'],
			'project_code' => $fields['project_code'],
			'discipline' => $fields['discipline'],
			'document_type' => $fields['document_type'],
			'document_zone' => $fields['document_zone'],
			'document_level' => $fields['document_level'],
			'approval_id' => isset($fields['approval']) ? (int)$fields['approval']['emp_id'] : NULL,
			'date_uploaded' => $date_today,
			'status' => '0',
			'is_deleted' => 0,
			'rev' => 0,
			'user_id' => $user->emp_id
		]);

		// Files
		if($request->hasFile('src')) {
			$file = $fields['src']->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$fields['src']->storeAs('media/docs', $file_name, 'public');

			$user->files()->insert([
				'user_id' => $user->emp_id,
				'document_id' => $document_id,
				'src' => $file_name,
				'uploader_type' => $user->user_type,
				'folder_id' => (int)$fields['folder_id'],
				'is_deleted' => 0
			]);
		}

		// Document Reviewers
		if(isset($fields['reviewers'])) {
			$reviewers = [];
			foreach ($fields['reviewers'] as $reviewer) {
				$reviewers[] = array(
					"document_id" => $document_id,
					"originator_id" => $user->emp_id,
					"reviewer_id" => (int)$reviewer["emp_id"],
					"review_status" => "0",
					"folder_id" => (int)$fields["folder_id"],
					"is_deleted" => 0
				);
			}
			DocumentReviewer::insert($reviewers);
		}

		// try {
		// 	$title = "New Notification from Fiafi Group";
		// 	$msg = "A new document has been created by $user->firstname $user->lastname on ". $fields['folder_name'] ." folder. please check the document info in the link below or visit the document page directly.";
		// 	Mail::to($user)
		// 	->cc(isset($body["cc"]) ? $body["cc"] : [])
		// 	->send(new FileMailable($fields, $file_name, $title, $msg));
		// } catch (\Throwable $th) {
		// 	dd($th);
		// }

		return Redirect::back()
		->with("message", "Document added successfully!")
		->with("type", "success");
		
	}


	public function approve_or_fail_document(Request $request) {
		$body = $request->input();
		$user = Auth::user();

		$doc = Document::find($body["document_id"]);
		$doc->status = $body["status"];
		
		if(isset($body["remarks"])) {
			$doc->remarks = $body["remarks"];
		}
		$doc->save();
		
		if($request->hasFile('src')) {
			$file = $request->file('src')->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time() . "." .$extension;
			$request->file('src')->storeAs('media/docs', $file_name, 'public');
			DocumentApprovalSign::create([
				"document_id" => $body["document_id"],
				"user_id" => $user->emp_id,
				"src" => $file_name
			]);
		}
		return Redirect::back()
		->with("message", $body["status"] === "A" ? "Document approved successfully!" : "Document rejected successfully!")
		->with("type", $body["status"] === "A" ? "success" : "error")
		->with("data", ["type" => "doc_actioned", "document_id" => $body["document_id"]]);
	}


	public function delete_document(Request $request) {
		$fields = $request->validate([
			"ids" => ["required", "array"]
		]);

		Document::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentReviewer::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentCommentReplies::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentResponseFile::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		FileModel::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		return Redirect::back()
		->with("message", "Document deleted successfully!")
		->with("type", "error");
	}
	

	
	public function add_comment(Request $request) {
		$body = $request->input();
		$user = Auth::user();

		$doc = Document::find($body["document_id"]);

		if($request->hasFile('src')) {
			if(Storage::exists("public/media/docs/" . $doc->files[0]->src)) {
				Storage::delete("public/media/docs/" . $doc->files[0]->src);
			}
			$file_name = time(). '-' . $request->file("src")->getClientOriginalName();
			$request->file("src")->storeAs('media/docs', $file_name, 'public');
			$doc->files[0]->update([
				"src" => $file_name,
			]);
		}

		DocumentCommentReplies::create([
			"document_id" => $body["document_id"],
			"reviewer_id" => $user->emp_id,
			"comment" => $body["comment"],
			"pages" => $body["pages"],
			"comment_code" => $body["comment_code"],
			"is_deleted" => 0,
			"comment_date" => date("Y-m-d"),
			"response_status" => 1,
			"comment_status" =>  $body["comment_code"] == 2 ? 1 : 0,
		]);

		DocumentReviewer::where([
			"reviewer_id" => $user->emp_id,
			"document_id" => $body["document_id"]
		])->update([
			"review_status" => $body["comment_code"] == 2 ? "0" : "C",
			"remarks" => isset($body["remarks"]) ? $body["remarks"] : NULL,
		]);

		Redirect::back()
			->with("message", "Comment added successfully!")
			->with("type", "success")
			->with("data", ["type" => "add_comment","document_id" => $body["document_id"]]);
	}



	public function update_comment_status(Request $request, $review_document_id) {
		$doc_reviewer = DocumentReviewer::find($review_document_id);
		$user = Auth::user();
		$date_now = date('Y-m-d H:i:s');
		
		if($doc_reviewer) {
			$doc_reviewer->review_status = $request->review_status;
			if(isset($request->remarks)) {
				$doc_reviewer->remarks = $request->remarks;
			}
			$doc_reviewer->save();
		}

		if($request->response_id) {
			$comment = DocumentCommentReplies::find($request->response_id);
			if($comment) {
				if($comment->response_status === 2) {
					$comment->comment_status = 1;
					// Add file to response file and upload to storage
					if($request->hasFile('src')) {
						$doc = Document::find($request->document_id);
						if(Storage::exists("public/media/docs/" . $doc->files[0]->src)) {
							Storage::delete("public/media/docs/" . $doc->files[0]->src);
						}
						$file_name = time(). '-' . $request->src->getClientOriginalName();
						$request->src->storeAs('media/docs', $file_name, 'public');
						$doc->files[0]->update([
							"src" => $file_name,
						]);
					}
				}
				$comment->increment("response_status");
				$comment->save();
			}
		}else {
			if($request->hasFile('src')) {
				$file = $request->file('src')->getClientOriginalName();
				$extension = pathinfo($file, PATHINFO_EXTENSION);
				$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time() . "." .$extension;
				$request->file('src')->storeAs('media/docs', $file_name, 'public');
				
				$doc_rev_sign = DocumentReviewerSign::where(["document_id" => $request->document_id, "user_id" => $user->emp_id])->first();
				
				if($doc_rev_sign) {
					if(Storage::exists("public/media/docs/" . $doc_rev_sign->src)) {
						Storage::delete("public/media/docs/" . $doc_rev_sign->src);
					}
					$doc_rev_sign->src = $file_name;
					$doc_rev_sign->save();
				}else {
					DocumentReviewerSign::create([
						"document_id" => $request->document_id,
						"user_id" => $user->emp_id,
						"upload_date" => $date_now,
						"src" => $file_name,
						"is_deleted" => 0
					]);
				}
			}
		}
		


		Redirect::back()
			->with("message", 'Status updated successfully.')
			->with("type", "info")
			->with("data", ["type" => "add_comment", "document_id" => $request->document_id]);
	}


	public function delete_comment(Request $request) {
		$comment = DocumentCommentReplies::find($request->response_id);

		if($request->comment_length == 1) {
			$rev = DocumentReviewer::find($request->review_document_id);
			$rev->review_status = "0";
			$rev->save();
		}

		$comment->delete();
		
		Redirect::back()
			->with('message', 'Comment deleted successfully.')
			->with("type", "error")
			->with("data", ["type" => "add_comment", "document_id" => $request->document_id]);
	}


	public function reply_document(Request $request) {
		$req_body = $request->validate([
			"response_id" => "required|integer",
			"reply" => "required|string",
			"reply_code" => "required|string|max:2",
			"src" => "required|mimes:ppt,pptx,doc,docx,pdf,xls,xlsx|max:204800",
			"document_id" => "required|integer",
			"folder_id" => "required|integer",
		]);

		$date_today = date('Y-m-d');

		$doc = Document::find($req_body["document_id"]);
		$doc->increment("rev");

		DocumentCommentReplies::where("response_id", $req_body["response_id"])->update([
			"reply" => $req_body["reply"],
			"reply_code" => $req_body["reply_code"],
			"reply_date" => $date_today,
			"response_status" => 2
		]);
		
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

		Redirect::back()
		->with('message', 'Comment added successfully.')
		->with("type", "success")
		->with("data", ["type" => "add_comment", "document_id" => $req_body["document_id"]]);
	}
}
