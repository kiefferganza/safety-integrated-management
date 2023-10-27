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
		$folder = $folder->load([
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
					"external_approver",
					"shareableLink"
				)->orderByDesc("date_uploaded")
		]);

		$folder->documents->transform(function($document) {
			$files = collect([]);
			$document->currentFile = ["src" => ""];
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
					$medias = [];
					if($externalApprover->src) {
						$media = $externalApprover->getFirstMedia();
						$files->push(["fullSrc" => $media->getFullUrl(), "src" => $media->name, "date" => $media->created_at]);
						$medias[] = $media;
					}
				}
				$document->external_medias = $medias;
			}

			if($files->count() > 0) {
				$document->currentFile = $files->sortByDesc("date")->first();
			}
			return $document;
		});

		return $folder;
	}

	public static function generateFormNumber(Document $doc) {
		$form_number = sprintf("%s-%s-%s-%s", $doc->project_code, $doc->originator,$doc->discipline,$doc->document_type);
		if($doc->document_zone) {
			$form_number .= "-". $doc->document_zone;
		}
		if($doc->document_level) {
			$form_number .= "-". $doc->document_level;
		}
		$form_number .= "-" . $doc->sequence_no;
		return strtoupper($form_number);
	}

	public function sequence_no($folder_id) {
		$sequence = Document::select("sequence_no")->where('is_deleted', 0)->where("folder_id", $folder_id)->orderByDesc("date_uploaded")->first();
		if(!$sequence) {
			$sequence_no = '000000';
			$number = (int)ltrim($sequence_no, '0') + 1;
			return sprintf("%06d", $number);
		}
		$number = (int)ltrim($sequence->sequence_no, '0') + 1;
		return sprintf("%06d", $number);
	}


	public function upload_file($src){
		$file = $src->getClientOriginalName();
		$extension = pathinfo($file, PATHINFO_EXTENSION);
		if(Storage::exists("public/media/docs/" . $file)) {
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time() . "." .$extension;
		}else {
			$file_name = $file;
		}
		$src->storeAs('media/docs', $file_name, 'public');
		return $file_name;
	}


	public function approval_action(Request $request, Document $document, $file_name, $user) {
		$document->status = $request->status;
		$document->approval_status = $request->status;
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
			$isAlreadyReviewed = $document->reviewer_employees->every(function($item) {
				return $item->pivot->review_status !== "0";
			});
			if($isAlreadyReviewed) {
				$document->status = $request->status;
			}
			if($request->remarks) {
				$documentReviwer->remarks = $request->remarks;
			}
			$documentReviwer->review_status = $request->status;
			$documentReviwer->save();
		}
		if(isset($request->response_id)) {
			$comment = DocumentCommentReplies::find($request->response_id);
			if($comment->response_status === 2) {
				$comment->comment_status = 1;
			}
			$comment->increment("response_status");
			$comment->save();
		}else {
			DocumentCommentReplies::where("document_id", $document->document_id)->where("reviewer_id", $user->emp_id)->update(["comment_status" => 1, "response_status" => 3]);
		}
		$allCloseCount = DocumentCommentReplies::where("document_id", $document->document_id)->where("reviewer_id", $user->emp_id)->where("comment_status", 0)->count();
		if($allCloseCount === 0) {
			$this->updateReviewStatus($document, $file_name, $user);
		}
	}

	public function updateReviewStatus(Document $document, $file_name, $user) {
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