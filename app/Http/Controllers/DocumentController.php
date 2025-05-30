<?php

namespace App\Http\Controllers;

use App\Mail\NewDocumentMail;
use App\Models\AppSection\Mail as AppSectionMail;
use App\Models\CarbonCopy;
use App\Models\CompanyModel;
use App\Models\Document;
use App\Models\DocumentApprovalSign;
use App\Models\DocumentCommentReplies;
use App\Models\DocumentExternalApprover;
use App\Models\DocumentProjectDetail;
use App\Models\DocumentResponseFile;
use App\Models\DocumentReviewer;
use App\Models\DocumentReviewerSign;
use App\Models\Employee;
use App\Models\FileModel;
use App\Models\FolderModel;
use App\Models\Position;
use App\Models\User;
use App\Notifications\ModuleBasicNotification;
use App\Services\DocumentService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
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
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/FileManager/Document/Create/index", [
			"folder" => $folder,
			"sequence_no" => (new DocumentService)->sequence_no($folder->folder_id),
			"personel" => Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id", "user_id", "email")
				->where("is_deleted", 0)
				->where("is_active", 0)
				->where("user_id", "!=", NULL)
				->where("sub_id", $user->subscriber_id)
				->where("employee_id", "!=", $user->emp_id)
				->with("position")
				->get(),
			'projectDetails' => $projectDetails
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
			'approval_id' => ['nullable'],
			'approver' => ['nullable'],
			'reviewers' => ['array'],
			'cc' => ['array']
		]);

		$user = auth()->user();
		$date_today = date('Y-m-d H:i:s');
		$documentService = new DocumentService;
		$sequence_no = $documentService->sequence_no($folder->folder_id);

		$document = Document::create([
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
		$document_id = $document->document_id;

		// Files
		if($request->hasFile('src')) {
			$file_name = $documentService->upload_file($fields['src']);

			FileModel::insert([
				'user_id' => $user->emp_id,
				'document_id' => $document_id,
				'src' => $file_name,
				'uploader_type' => $user->user_type,
				'folder_id' => $folder->folder_id,
				'is_deleted' => 0,
				'upload_date' => $date_today
			]);
		}

		$emails = [];
		// $ccEmails = [];
		$personels = [];
		// Mail/Notification
		// if(isset($fields['cc']) && count($fields['cc']) > 0) {
		// 	$carbonCopy = [];
		// 	foreach ($fields['cc'] as $cc) {
		// 		$ccEmails[] = $cc['email'];
		// 		$carbonCopy[] = [
		// 			'model_type' => Document::class,
		// 			'model_id' => $document_id,
		// 			'email' => $cc['email'],
		// 			'user_id' => $cc['user_id'],
		// 			'emp_id' => $cc['emp_id']
		// 		];
		// 	}
		// 	CarbonCopy::insert($carbonCopy);
		// }

		// Document Reviewers
		if(isset($fields['reviewers'])) {
			$reviewers = [];
			$reviewersId = [];
			foreach ($fields['reviewers'] as $reviewer) {
				$reviewers[] = array(
					"document_id" => $document_id,
					"originator_id" => $user->emp_id,
					"reviewer_id" => (int)$reviewer["id"],
					"review_status" => "0",
					"folder_id" => $folder->folder_id,
					"is_deleted" => 0
				);
				$reviewersId[] = (int)$reviewer["id"];
				$personels[] = [
					"email" => $reviewer['email'],
					"position" => $reviewer['position'],
					"name" => $reviewer['label'],
					"user_id" => $reviewer['user_id'],
					"type" => 'Reviewer'
				];
			}
			DocumentReviewer::insert($reviewers);
			$userReviewers = User::whereIn('emp_id', $reviewersId)->get();
			Notification::send($userReviewers, new ModuleBasicNotification(
				title: 'added you as a reviewer',
				message: '',
				routeName: 'files.management.show',
				category: 'Document',
				creator: $user,
				params: [
					'folder' => $document_id,
					'document' => $documentService->generateFormNumber($document)
				]
			));
			$emails[] = $userReviewers->pluck('email');

		}

		if(isset($fields['approval_id'])) {
			$userApproval = User::where('emp_id', (int)$fields['approval_id'])->first();
			if($userApproval) {
				$emails[] = $userApproval->email;
				Notification::send($userApproval, new ModuleBasicNotification(
					title: 'added you as a approver',
					message: '',
					routeName: 'files.management.show',
					category: 'Document',
					creator: $user,
					params: [
						'folder' => $document->folder_id,
						'document' => $documentService->generateFormNumber($document)
					]
				));
			}
		}

		// if(isset($fields['approver'])) {
		// 	$personels[] = [
		// 		"email" => $fields['approver']['email'],
		// 		"position" => $fields['approver']['position'],
		// 		"name" => $fields['approver']['label'],
		// 		"user_id" => $fields['approver']['user_id'],
		// 		"type" => 'Approver'
		// 	];
		// }
		

		// $to = [];
		// $subject = 'New Notification from Fiafi Group - New Document';
		// $recipients = [];

		// $date_uploaded = Carbon::parse($document->date_uploaded)->format('M j, Y');
		// $mail = new NewDocumentMail($document, $personels, $folder->folder_name, $date_uploaded);
		// $mail->subject($subject);
		// if($request->hasFile('src')) {
		// 	$file = $request->file('src');
		// 	$mail->attach($file->getRealPath(), [
		// 		'as' => $file->getClientOriginalName(),
		// 		'mime' => $file->getMimeType()
		// 	]);
		// }

		// foreach($personels as $per) {
		// 	$to[] = $per['email'];
		// 	$recipients[] = [
		// 		'user_id' => $per['user_id']
		// 	];
		// }
		// Mail::to(implode(',', $to))->cc(implode(',', $ccEmails))->send($mail);

		// $mailModel = new AppSectionMail();
		// $mailModel->sub_id = $user->subscriber_id;
		// $mailModel->user_id = $user->user_id;
		// $mailModel->from = 'admin@safety-integrated-management.com';
		// $mailModel->to = implode(',', $to);
		// $mailModel->subject = $subject;
		// $mailModel->content = $mail->renderEmailContent();
		// $mailModel->type = 'notification';
		// if(!empty($ccEmails)) {
		// 	$mailModel->properties = json_encode([
		// 		'cc' => implode(',', $ccEmails)
		// 	]);
		// }
		// $mailModel->status = 'sent';
		// $mailModel->save();
		// $mailModel->recipients()->createMany($recipients);

		return redirect()->back()
		->with("message", "Document added successfully!")
		->with("type", "success");
	}


	public function view(Request $request) {
		$request->validate([
			'folder' => 'required|string',
			'document' => 'required|string'
		]);
		$folder = FolderModel::where("is_removed", 1)->findOrFail($request->folder);
		$user = auth()->user();
		$document = Document::where([
				["is_deleted", 0],
				["folder_id", $folder->folder_id],
				["form_number", $request->document]
			])->withWhereHas(
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
				"shareableLink",
				"external_history" => fn($q) => $q->with("approver"),
			])->firstOrFail();

		$documentFirstUpload = Document::
			select("date_uploaded")
			->where([
				"is_deleted" => 0,
				"folder_id" => $request->folder
			])
			->orderBy('date_uploaded')
			->first();

		if($documentFirstUpload) {
			$rolloutDate = $documentFirstUpload->date_uploaded;
		}else {
			$rolloutDate = $document->date_uploaded;
		}
			
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
		// FILES
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

		return Inertia::render("Dashboard/Management/FileManager/Document/Details/index", [
			"folder" => $folder,
			"document" => $document,
			"companies" => CompanyModel::where("sub_id", $user->subscriber_id)->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", $user->subscriber_id)->get(),
			"rolloutDate" => $rolloutDate
		]);
	}


	public function edit(Request $request) {
		$user = auth()->user();

		$folder = FolderModel::where("is_removed", 1)->findOrFail($request->folder);
		$user = auth()->user();
		$document = Document::where([
				["is_deleted", 0],
				["folder_id", $folder->folder_id],
				["form_number", $request->document]
			])->withWhereHas(
				"employee", fn($q) => $q->select("employee_id", "firstname", "lastname", "position", "department", "img_src", "phone_no", "company", "email")->with([
					"position",
					"department"
				])
			)
			->with([
				"files" => fn($q) => $q->orderByRaw('COALESCE(file_id, upload_date) desc'),
				"approval_employee",
				"reviewer_employees",
				"external_approver" => fn($q) => $q->select('id', 'firstname', 'lastname', 'position', 'document_id'),
				"carbon_copy"
			])
			->firstOrFail();
		$document->file = $document->files[0] ?? "";

		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/FileManager/Document/Edit/index", [
			"folder" => $folder,
			"personel" => Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("is_active", 0)
				->where("user_id", "!=", NULL)
				->where("sub_id", $user->subscriber_id)
				->where("employee_id", "!=", $user->emp_id)
				->get(),
			"document" => $document,
			"projectDetails" => $projectDetails
		]);
	}

	public function update(Request $request) {
		$request->validate([
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
			'reviewers' => ['array'],
			"folder" => ['string', 'required'],
			"document" => ['string', 'required'],
		]);

		$folder = FolderModel::where("is_removed", 1)->findOrFail($request->folder);
		$user = auth()->user();

		$document = Document::where([
			["is_deleted", 0],
			["folder_id", $folder->folder_id]
		])->with([
			"approval_employee",
			"reviewer_employees"
		])->findOrFail($request->document);

		$document->description = $request->description;
		$document->title = $request->title;
		$document->originator = $request->originator;
		$document->project_code = $request->project_code;
		$document->discipline = $request->discipline;
		$document->document_type = $request->document_type;
		$document->document_zone = $request->document_zone;
		$document->document_level = $request->document_level;

		if(isset($request->approval_id)) {
			if($document->approval_id !== (int)$request->approval_id) {
				$document->status = "0";
				$document->approval_id = (int)$request->approval_id;
			}
		}

		if(isset($request->external_approver)) {
			foreach($request->external_approver as $extApprover) {
				$externalApprover = DocumentExternalApprover::findOrFail($extApprover['id']);
				$externalApprover->firstname = $extApprover['firstname'];
				$externalApprover->lastname = $extApprover['lastname'];
				$externalApprover->position = $extApprover['position'];
				if($externalApprover->isDirty()) {
					$externalApprover->save();
				}
			}
		}

		// Document Reviewers
		$inReviewers = DocumentReviewer::select("reviewer_id")
			->where([
				"document_id" => $document->document_id,
				"folder_id" => $folder->folder_id,
			])
			->whereIn("reviewer_id", collect($request->reviewers)->pluck("id")->toArray())
			->get()
			->pluck("reviewer_id")
			->toArray();
		if(isset($request->reviewers) && count($request->reviewers) > 0) {
			$reviewers = [];
			foreach ($request->reviewers as $reviewer) {
				if(!in_array((int)$reviewer["id"], $inReviewers)) {
					$reviewers[] = array(
						"document_id" => $document->document_id,
						"originator_id" => $user->emp_id,
						"reviewer_id" => (int)$reviewer["id"],
						"review_status" => "0",
						"folder_id" => $folder->folder_id,
						"is_deleted" => 0
					);
				}
			}
			if(count($reviewers) > 0) {
				DocumentReviewer::insert($reviewers);
			}
			// Delete replaced reviewers
			$isDeleted = DocumentReviewer::select("reviewer_id")
			->where([
				"document_id" => $document->document_id,
				"folder_id" => $folder->folder_id,
			])
			->whereNotIn("reviewer_id", collect($request->reviewers)->pluck("id")->toArray())
			->delete();
			if($isDeleted > 0) {
				$document->status = "0";
			}
		}

		$document->save();

		return redirect()
		->route('files.management.document.edit', [
			'folder' => $request->folder,
			'document' => $document->form_number
		])
		->with("message", "Document updated successfully!")
		->with("type", "success");
	}


	public function destroy(Request $request) {
		$fields = $request->validate([
			"ids" => ["required", "array"]
		]);

		Document::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentReviewer::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentCommentReplies::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		DocumentResponseFile::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		FileModel::whereIn("document_id", $fields["ids"])->update(["is_deleted" => 1]);
		return redirect()->back()
		->with("message", "Document deleted successfully!")
		->with("type", "success");
	}



	public function add_comment(Document $document, Request $request) {
		$body = $request->input();
		$user = auth()->user();
		$documentService = new DocumentService;

		if($request->hasFile('src')) {
			if(Storage::exists("public/media/docs/" . $document->files[0]->src)) {
				Storage::delete("public/media/docs/" . $document->files[0]->src);
			}

			$file_name = $documentService->upload_file($request->file("src"));
			$document->files[0]->update([
				"src" => $file_name,
			]);
		}
		$document->increment('rev');
		$document->save();

		DocumentCommentReplies::create([
			"document_id" => $document->document_id,
			"reviewer_id" => $user->emp_id,
			"comment" => $body["comment"],
			"pages" => $body["pages"],
			"comment_code" => $body["comment_code"],
			"is_deleted" => 0,
			"comment_date" => date("Y-m-d"),
			"response_status" => 1,
			"comment_status" =>  $body["comment_code"] === "2" ? 1 : 0,
		]);

		if($body["comment_code"] === "1") {
			DocumentReviewer::where([
				"reviewer_id" => $user->emp_id,
				"document_id" => $document->document_id
			])->update([
				"review_status" => "C"
			]);
		}
		
		$creator = User::where('emp_id', $document->user_id)->first();
		if($creator) {
			Notification::send($creator, new ModuleBasicNotification(
				title: 'commented on your documment',
				message: '<p>CMS: '. $document->form_number. '</p>',
				routeName: 'files.management.show',
				category: 'Document',
				creator: $user,
				params: [
					'folder' => $document->folder_id,
					'document' => $document->form_number
				]
			));
		}

		// if($document->rev === null){
		// 	$document->rev = 1;
		// }else {
		// 	$document->increment("rev");
		// }
		// $document->save();

		return redirect()->back()
			->with("message", "Comment added successfully!")
			->with("type", "success");
	}


	public function delete_comment(DocumentCommentReplies $comment, Request $request) {
		$user = auth()->user();
		if($comment->reply_code === null) {
			if($request->commentLength == 1) {
				$rev = DocumentReviewer::where("document_id", $comment->document_id)->where("reviewer_id", $user->emp_id)->first();
				if($rev) {
					$rev->review_status = "0";
					$rev->save();
				}
			}
	
			$comment->delete();
		}
		return redirect()->back()
			->with('message', 'Comment deleted successfully.')
			->with('type', 'success');
	}


	public function reply_comment(DocumentCommentReplies $comment, Request $request) {
		$req_body = $request->validate([
			"reply" => "required|string",
			"reply_code" => "required|string|max:2",
			"src" => "required|mimes:ppt,pptx,doc,docx,pdf,xls,xlsx,jpeg,jpg,png|max:204800"
		]);
		$user = auth()->user();
		$date_today = date('Y-m-d');

		$doc = Document::find($comment->document_id);
		$doc->increment("rev");

		$comment->reply = $req_body["reply"];
		$comment->reply_code = $req_body["reply_code"];
		$comment->reply_date = $date_today;
		$comment->response_status = 2;
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

		$creator = User::where('emp_id', $comment->reviewer_id)->first();
		if($creator) {
			Notification::send($creator, new ModuleBasicNotification(
				title: 'replied on your comment',
				message: '<p>CMS: '. $doc->form_number.'</p>',
				category: 'Document',
				routeName: 'files.management.show',
				creator: $user,
				params: [
					'folder' => $doc->folder_id,
					'document' => $doc->form_number
				]
			));
		}

		return redirect()->back()
			->with('message', 'Replied to comment successfully.')
			->with("type", "success");
	}


	public function approve_or_fail_document(Document $document, Request $request) {
		$user = auth()->user();
		$document->load('reviewer_employees');
		if($request->hasFile('src')) {
			$documentService = new DocumentService;
			$file_name = "";
			$file_name = $documentService->upload_file($request->file("src"));

			if($request->docType === "approve") {
				$documentService->approval_action($request, $document, $file_name, $user);
			}else {
				$documentService->reviewer_action($request, $document, $file_name, $user);
			}
			$document->save();
		}else {
			abort(500);
		}
		

		return redirect()->back()
			->with("message", "Action completed")
			->with("type",  "success");
	}

	public function reupload_submitter_file(Document $document, Request $request) {
		$request->validate([
			'file' => ['required', 'file']
		]);


		$document = $document->load('files');

		if($request->remarks) {
			$document->remarks = $request->remarks;
			$document->save();
		}

		if($request->hasFile('file')) {
			$documentService = new DocumentService;
			$file_name = "";
			$file_name = $documentService->upload_file($request->file("file"));
			$file = $document->files[0];
			$file->src = $file_name;
			$file->save();
		}else {
			abort(500);
		}

		// FileModel::insert([
		// 	'user_id' => $user->emp_id,
		// 	'document_id' => $document_id,
		// 	'src' => $file_name,
		// 	'uploader_type' => $user->user_type,
		// 	'folder_id' => $folder->folder_id,
		// 	'is_deleted' => 0,
		// 	'upload_date' => $date_today
		// ]);
		return redirect()->back()
			->with("message", "File updated successfuly!")
			->with("type",  "success");
	}

	public function reupload_approval_file(Document $document, DocumentApprovalSign $signedFile, Request $request) {
		$request->validate([
			'src' => ['required', 'file']
		]);

		if($request->remarks) {
			$document->remarks = $request->remarks;
			$document->save();
		}

		if($request->hasFile('src')) {
			$documentService = new DocumentService;
			$file_name = "";
			$file_name = $documentService->upload_file($request->file("src"));
			$signedFile->src = $file_name;
			$signedFile->save();
		}else {
			abort(500);
		}
		
		return redirect()->back()
			->with("message", "File updated successfuly!")
			->with("type",  "success");
	}

	public function reupload_reviewer_file(Document $document, DocumentReviewerSign $signedFile, Request $request) {
		$request->validate([
			'src' => ['required', 'file']
		]);

		if($request->remarks) {
			$document->remarks = $request->remarks;
			$document->save();
		}

		if($request->hasFile('src')) {
			$documentService = new DocumentService;
			$file_name = "";
			$file_name = $documentService->upload_file($request->file("src"));
			$signedFile->src = $file_name;
			$signedFile->save();
		}else {
			abort(500);
		}
		
		return redirect()->back()
			->with("message", "File updated successfuly!")
			->with("type",  "success");
	}


}