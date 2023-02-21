<?php

namespace App\Services;

use App\Models\Document;
use App\Models\DocumentApprovalSign;
use App\Models\DocumentCommentReplies;
use App\Models\DocumentReviewer;
use App\Models\DocumentReviewerSign;
use App\Models\FolderModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

		$sequence = '000001';

		if($lastSubmittedDoc) {
			$zeroes = '';
			$prevSequence = (int)$lastSubmittedDoc->sequence_no + 1;
			$number_of_zeroes = strlen((string) $prevSequence);
			for($i = $number_of_zeroes; $i < 6; $i++) {
				$zeroes .= "0";
			}
			$sequence = $zeroes . $prevSequence;
		}
		return $sequence;
	}


	public function approval_action(Request $request, Document $document, $file_name, $user) {
		$document->status = $request->status;
		if($request->remarks) {
			$document->remarks = $request->remarks;
		}
		DocumentApprovalSign::create([
			"document_id" => $document->document_id,
			"user_id" => $user->emp_id,
			"src" => $file_name
		]);
	}

	public function reviewer_action(Request $request, Document $document, $file_name, $user) {
		$documentReviwer = DocumentReviewer::where(["document_id" => $document->document_id, "reviewer_id" => $user->emp_id])->first();
		if($documentReviwer) {
			if($request->remarks) {
				$documentReviwer->remarks = $request->remarks;
			}
			$documentReviwer->review_status = $request->status;
			$documentReviwer->save();
		}
		if($request->response_id) {
			$comment = DocumentCommentReplies::find($request->response_id);
			if($comment->response_status === 2) {
				$comment->comment_status = 1;
			}
			$comment->increment("response_status");
			$comment->save();
		}else {
			DocumentCommentReplies::where("document_id", $document->document_id)->where("reviewer_id", $user->emp_id)->update(["comment_status" => 1, "response_status" => 3]);
			$doc_rev_sign = DocumentReviewerSign::where(["document_id" => $document->document_id, "user_id" => $user->emp_id])->first();
			
			if($doc_rev_sign && $file_name !== "") {
				if(Storage::exists("public/media/docs/" . $doc_rev_sign->src)) {
					Storage::delete("public/media/docs/" . $doc_rev_sign->src);
				}
				$doc_rev_sign->src = $file_name;
				$doc_rev_sign->save();
			}else {
				DocumentReviewerSign::create([
					"document_id" => $document->document_id,
					"user_id" => $user->emp_id,
					"upload_date" => date('Y-m-d H:i:s'),
					"src" => $file_name,
					"is_deleted" => 0
				]);
			}
		}
	}

}