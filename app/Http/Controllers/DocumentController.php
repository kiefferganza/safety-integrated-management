<?php

namespace App\Http\Controllers;

use App\Models\DocumentReviewer;
use App\Models\Employee;
use App\Models\FolderModel;
use App\Models\Position;
use App\Services\DocumentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
  public function index(FolderModel $folder){
		if($folder->is_removed === 0) {
			return redirect()->back();
		}
		return Inertia::render("Dashboard/Management/FileManager/Document/index", [
			"folder" => (new DocumentService)->getDocumentByFolders($folder),
			"positions" => Position::select("position_id", "position")->where("user_id", auth()->user()->subscriber_id)->get()
		]);
	}


	public function create(FolderModel $folder) {
		$user = auth()->user();
		$folder = $folder->loadCount([
			"documents" => fn($q) =>
				$q->where([
					["tbl_documents.user_id", $user->emp_id],
					["tbl_documents.is_deleted", 0]
				])
		]);
		$number_of_documents = $folder->documents_count + 1;
		$number_of_zeroes = strlen((string) $number_of_documents);
		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++)
		{
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}
		$sequence =  $sequence_no_zeros . $number_of_documents;

		return Inertia::render("Dashboard/Management/FileManager/Document/Create/index", [
			"folder" => $folder,
			"sequence_no" => $sequence,
			"personel" => Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("user_id", "!=", NULL)
				->where("sub_id", $user->subscriber_id)
				->where("employee_id", "!=", $user->emp_id)
				->get()
		]);
	}


	public function store(FolderModel $folder, Request $request) {
		$fields = $request->validate([
			'src' => ['required', 'mimes:ppt,pptx,doc,docx,pdf,xls,xlsx,jpeg,jpg,png', 'max:204800'],
			'originator' => ['required', 'max:255'],
			'sequence_no' => ['nullable'],
			'description' => ['nullable', 'max:255'],
			'title' => ['required', 'string', 'max:255'],
			'project_code' => ['required', 'string', 'max:255'],
			'discipline' => ['required', 'string', 'max:255'],
			'document_type' => ['required','string', 'max:255'],
			'document_zone' => ['nullable', 'max:255'],
			'document_level' => ['nullable', 'max:255'],
			// 'manual_cc' => ['nullable', 'email'],
			// 'cc' => ['array'],
			'approval_id' => ['nullable'],
			'reviewers' => ['array']
		]);

		$user = auth()->user();
		$date_today = date('Y-m-d H:i:s');

		$document_id = $user->documents()->insertGetId([
			'originator' => $fields['originator'],
			'originator2' => $fields['originator'],
			'sequence_no' => $fields['sequence_no'],
			'description' => $fields['description'],
			'title' => $fields['title'],
			'folder_id' => $folder->folder_id,
			'project_code' => $fields['project_code'],
			'discipline' => $fields['discipline'],
			'document_type' => $fields['document_type'],
			'document_zone' => $fields['document_zone'],
			'document_level' => $fields['document_level'],
			'approval_id' => isset($fields['approval_id']) ? (int)$fields['approval_id'] : NULL,
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
				'folder_id' => $folder->folder_id,
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
					"reviewer_id" => (int)$reviewer["id"],
					"review_status" => "0",
					"folder_id" => $folder->folder_id,
					"is_deleted" => 0
				);
			}
			DocumentReviewer::insert($reviewers);
		}

		return redirect()->back()
		->with("message", "Document added successfully!")
		->with("type", "success");

		// try {
		// 	$title = "New Notification from Fiafi Group";
		// 	$msg = "A new document has been created by $user->firstname $user->lastname on ". $fields['folder_name'] ." folder. please check the document info in the link below or visit the document page directly.";
		// 	Mail::to($user)
		// 	->cc(isset($body["cc"]) ? $body["cc"] : [])
		// 	->send(new FileMailable($fields, $file_name, $title, $msg));
		// } catch (\Throwable $th) {
		// 	dd($th);
		// }

		// return Redirect::back()
		// ->with("message", "Document added successfully!")
		// ->with("type", "success");
	}


}
