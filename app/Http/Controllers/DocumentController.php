<?php

namespace App\Http\Controllers;

use App\Models\CompanyModel;
use App\Models\Document;
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

		return Inertia::render("Dashboard/Management/FileManager/Document/Create/index", [
			"folder" => $folder,
			"sequence_no" => (new DocumentService)->sequence_no($folder->folder_id),
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
			'src' => ['required', 'max:204800'],
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
		$sequence_no = (new DocumentService)->sequence_no($folder->folder_id);

		$document_id = $user->documents()->insertGetId([
			'originator' => $fields['originator'],
			'originator2' => $fields['originator'],
			'sequence_no' => $sequence_no,
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


	public function view(Request $request) {
		$folder = FolderModel::where("is_removed", 1)->findOrFail($request->folder);
		$user = auth()->user();
		// dd($user);
		$document = Document::where([
				["is_deleted", 0],
				["folder_id", $folder->folder_id],
				["user_id", $user->emp_id]
			])->withWhereHas(
				"employee", fn($q) => $q->select("employee_id", "firstname", "lastname", "position", "department", "img_src", "phone_no", "company", "email")->with([
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
			)->findOrFail($request->document);


		return Inertia::render("Dashboard/Management/FileManager/Document/Details/index", [
			"folder" => $folder,
			"document" => $document,
			"companies" => CompanyModel::where("sub_id", $user->subscriber_id)->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", $user->subscriber_id)->get()
		]);
	}





}
