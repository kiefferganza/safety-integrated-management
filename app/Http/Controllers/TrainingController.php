<?php

namespace App\Http\Controllers;

use App\Enums\CommentTypeEnums;
use App\Events\NewTrainingEvent;
use App\Http\Requests\TrainingRequest;
use App\Models\DocumentProjectDetail;
use App\Models\Employee;
use App\Models\Training;
use App\Models\TrainingCourses;
use App\Models\TrainingExternal;
use App\Models\TrainingExternalComment;
use App\Models\TrainingExternalStatus;
use App\Models\TrainingFiles;
use App\Models\TrainingTrainees;
use App\Models\User;
use App\Notifications\NewTrainingCommentNotification;
use App\Services\TrainingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrainingController extends Controller
{
	public function index()
	{

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(2),
			"module" => "Client",
			"url" => "client",
			"type" => 2
		]);
	}

	public function external()
	{

		$trainings =  (new TrainingService())->getTrainingByType(3);

		foreach ($trainings as $training)
		{
			/** @var Training $training */
			if ($training?->external_status?->hasMedia('actions'))
			{
				$reviewerLastFile = $training->external_status->getFirstMedia('actions', ['type' => 'review']);
				$approverLastFile = $training->external_status->getFirstMedia('actions', ['type' => 'approver']);
				if ($reviewerLastFile)
				{
					$training->external_status->reviewerLatestFile = [
						'name' => $reviewerLastFile->name,
						'fileName' => $reviewerLastFile->file_name,
						'url' => $reviewerLastFile->originalUrl
					];
				}
				if ($approverLastFile)
				{
					$training->external_status->approverLatestFile = [
						'name' => $approverLastFile->name,
						'fileName' => $approverLastFile->file_name,
						'url' => $approverLastFile->originalUrl
					];
				}
			}
		}

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => $trainings,
			"module" => "Third Party",
			"url" => "third-party",
			"type" => 3
		]);
	}

	public function induction()
	{

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(4),
			"module" => "Induction",
			"url" => "induction",
			"type" => 4
		]);
	}


	public function createClient()
	{
		$trainingService = new TrainingService();
		$courses = TrainingCourses::where("type", "client")->get();
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Training/Create/createClient", [
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0]
				])
				->get(),
			"courses" => $courses,
			"sequence" => $trainingService->getSequenceNo(2),
			"projectDetails" => $projectDetails,
		]);
	}

	public function createThirdParty()
	{
		$trainingService = new TrainingService();
		$courses = TrainingCourses::whereNull("type")->get();
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Training/Create/createThirdParty", [
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0]
				])
				->get(),
			"type" => 3,
			"courses" => $courses,
			"sequence" => $trainingService->getSequenceNo(3),
			"projectDetails" => $projectDetails,
		]);
	}


	public function store(TrainingRequest $request)
	{
		$user = Auth::user();
		$training = new Training;

		$training->user_id = $user->id;
		$training->employee_id = $user->emp_id;
		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
		$training->title = $request->title;
		// $training->course_id = $request->title;
		$training->location = $request->location;
		$training->contract_no = $request->contract_no;
		$training->trainer = $request->trainer;
		$training->training_date = $request->training_date;
		$training->date_expired = $request->date_expired;
		$training->training_hrs = $request->training_hrs;
		$training->remarks = $request->remarks ? $request->remarks : null;
		$training->type = (int)$request->type;
		$training->status = "published";
		$training->date_created = date("Y-m-d H:i:s");
		$training->is_deleted = 0;
		$training->training_center = $request->training_center;


		$training->save();
		$training_id = $training->training_id;

		if ($request->type == "3")
		{
			$training_external = new TrainingExternal;

			$training_external->training_id = $training_id;
			$training_external->currency = $request->currency;
			$training_external->course_price = (float)$request->course_price;
			$training_external->requested_by = (int)$user->emp_id;
			$training_external->reviewed_by = $request->reviewed_by ? (int)$request->reviewed_by : null;
			$training_external->approved_by = $request->approved_by ? (int)$request->approved_by : null;
			$training_external->date_requested = date("Y-m-d H:i:s");

			$training_external->save();

			TrainingExternalStatus::create(["training_id" => $training->training_id]);
		}

		if (!empty($request->trainees))
		{
			$trainees = [];
			$files = [];

			foreach ($request->trainees as $trainee)
			{
				$trainees[] = [
					"training_id" => (int)$training_id,
					"employee_id" => (int)$trainee["emp_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => 0,
					"date_joined" => date("Y-m-d H:i:s")
				];

				if ($trainee["src"] !== null)
				{
					$file = $trainee["src"]->getClientOriginalName();
					$extension = pathinfo($file, PATHINFO_EXTENSION);
					$file_name = pathinfo($file, PATHINFO_FILENAME) . "-" . time() . "." . $extension;
					$trainee["src"]->storeAs('media/training', $file_name, 'public');

					$files[] = [
						"src" => $file_name,
						"training_id" => (int)$training_id,
						"emp_id" => (int)$trainee["emp_id"],
						"user_id" => (int)$trainee["user_id"],
						"is_deleted" => 0
					];
				}
			}
			if (!empty($files))
			{
				TrainingFiles::insert($files);
			}
			TrainingTrainees::insert($trainees);
		}
		event(new NewTrainingEvent($training));

		return redirect()->back()
			->with("message", "Training added successfully!")
			->with("type", "success");
	}

	public function edit(Training $training)
	{
		$trainingService = new TrainingService();

		$relation = [
			"trainees" => fn($query) => $query->with("position"),
			"training_files"
		];
		if ($training->type == 3)
		{
			$relation[] = "external_details";
		}

		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Training/Edit/index", [
			"training" => $training->load($relation),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0],
				])
				->get(),
			"courses" => TrainingCourses::get(),
			"details" => $trainingService->getTrainingType($training->type),
			"type" => $trainingService->getTrainingType($training->type),
			"projectDetails" => $projectDetails,
		]);
	}

	public function update(TrainingRequest $request, Training $training)
	{
		$user = Auth::user();

		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
		$training->title = $request->title;
		// $training->course = $request->title;
		$training->location = $request->location;
		$training->contract_no = $request->contract_no;
		$training->trainer = $request->trainer;
		$training->training_date = $request->training_date;
		$training->date_expired = $request->date_expired;
		$training->training_hrs = $request->training_hrs;
		$training->remarks = $request->remarks ? $request->remarks : null;
		$training->type = (int)$request->type;
		$training->training_center = $request->training_center;
		// $training->increment("revision_no");

		if ($training->sequence_no === null)
		{
			$training->sequence_no = $request->sequence_no;
		}


		$training->save();

		if ($request->type == "3")
		{
			$training_external = TrainingExternal::where("training_id", $training->training_id)->first();

			$training_external->training_id = $training->training_id;
			$training_external->currency = $request->currency;
			$training_external->course_price = (float)$request->course_price;
			$training_external->requested_by = (int)$user->emp_id;
			$training_external->reviewed_by = (int)$request->reviewed_by;
			$training_external->approved_by = (int)$request->approved_by;
			$training_external->date_requested = date("Y-m-d H:i:s");

			$training_external->save();
		}

		if (isset($request->deleted_trainees))
		{
			foreach ($request->deleted_trainees as $del_trainee)
			{
				TrainingTrainees::find($del_trainee["trainee_id"])->delete();

				$training_files_to_delete = TrainingFiles::where([
					["training_id", $training->training_id],
					["emp_id", (int)$del_trainee["employee_id"]]
				])->get()->toArray();

				if (!empty($training_files_to_delete))
				{
					foreach ($training_files_to_delete as $file_to_delete)
					{
						if (Storage::exists("public/media/training/" . $file_to_delete["src"]))
						{
							Storage::delete("public/media/training/" . $file_to_delete["src"]);
						}
					}

					TrainingFiles::find($training_files_to_delete[0]["training_files_id"])->delete();
				}
			}
		}

		if (!empty($request->trainees))
		{
			$trainees = [];
			$files = [];

			foreach ($request->trainees as $trainee)
			{
				if (!isset($trainee["pivot"]))
				{
					// Delete
					$training_files_to_delete = TrainingFiles::where([
						["training_id", $training->training_id],
						["emp_id", (int)$trainee["emp_id"]]
					])->get()->toArray();
					if (!empty($training_files_to_delete))
					{
						foreach ($training_files_to_delete as $file_to_delete)
						{
							if (Storage::exists("public/media/training/" . $file_to_delete["src"]))
							{
								Storage::delete("public/media/training/" . $file_to_delete["src"]);
							}
						}

						TrainingFiles::find($training_files_to_delete[0]["training_files_id"])->delete();
					}

					// Insert or update
					$tr_trainee = TrainingTrainees::where([
						["training_id", $training->training_id],
						["employee_id", (int)$trainee["emp_id"]]
					])->first();

					if (!$tr_trainee)
					{
						$trainees[] = [
							"training_id" => (int)$training->training_id,
							"employee_id" => (int)$trainee["emp_id"],
							"user_id" => (int)$trainee["user_id"],
							"is_removed" => 0,
							"date_joined" => date("Y-m-d H:i:s")
						];
					}


					if ($trainee["src"] !== null)
					{
						$file = $trainee["src"]->getClientOriginalName();
						$extension = pathinfo($file, PATHINFO_EXTENSION);
						$file_name = pathinfo($file, PATHINFO_FILENAME) . "-" . time() . "." . $extension;
						$trainee["src"]->storeAs('media/training', $file_name, 'public');

						$tr_file = TrainingFiles::where([
							["training_id", $training->training_id],
							["emp_id", (int)$trainee["emp_id"]]
						])->first();

						if ($tr_file)
						{
							if (Storage::exists("public/media/training/" . $tr_file->src))
							{
								Storage::delete("public/media/training/" . $tr_file->src);
							}
							$tr_file->src = $file_name;
							$tr_file->save();
						}
						else
						{
							$files[] = [
								"src" => $file_name,
								"training_id" => (int)$training->training_id,
								"emp_id" => (int)$trainee["emp_id"],
								"user_id" => (int)$trainee["user_id"],
								"is_deleted" => 0
							];
						}
					}
				}
			}
			if (!empty($files))
			{
				TrainingFiles::insert($files);
			}
			if (!empty($trainees))
			{
				TrainingTrainees::insert($trainees);
			}
		}

		return redirect()->back()
			->with("message", "Course updated successfully!")
			->with("type", "success");
	}


	public function destroy(Request $request)
	{
		$trainings = Training::whereIn("training_id", $request->ids)->get(['training_id'])->toArray();

		$training_ids = [];
		foreach ($trainings as $training)
		{
			$training_ids[] = $training['training_id'];
		}

		if (!empty($training_ids))
		{
			TrainingTrainees::whereIn("training_id", $training_ids)->delete();

			$training_files = TrainingFiles::whereIn("training_id", $training_ids)
				->get(["training_files_id", "training_id", "src"])->toArray();

			if (!empty($training_files))
			{
				foreach ($training_files as $file)
				{
					if (Storage::exists("public/media/training/" . $file["src"]))
					{
						Storage::delete("public/media/training/" . $file["src"]);
					}
				}
				TrainingFiles::destroy($training_files[0]);
			}
		}

		foreach ($training_ids as $id)
		{
			$training = Training::find($id);
			$training->clearMediaCollection();
			$training->delete();
		}

		return redirect()->back()
			->with("message", "Training deleted successfully!")
			->with("type", "success");
	}

	// SHOW
	public function show_in_house(Training $training)
	{
		if ($training->type !== 1)
		{
			return redirect()->back();
		}

		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training);

		$training->training_files = $trainingService->transformFiles($training->training_files);

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0],
				])
				->get(),
			"module" => "In House",
			"url" => "in-house"
		]);
	}

	public function show_client(Training $training)
	{
		if ($training->type !== 2)
		{
			return redirect()->back();
		}

		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training);

		$training->training_files = $trainingService->transformFiles($training->training_files);

		$user = auth()->user();
		$rollout_date = Cache::get("training_inhouse_rollout_date:" . $user->subscriber_id);

		if (!$rollout_date)
		{
			$rollout_date = Training::select('date_created')->where('type', '!=', 1)->orderBy('date_created')->first();
			if ($rollout_date)
			{
				Cache::put("training_rollout_date:" . $user->subscriber_id, $rollout_date);
			}
		}

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0],
				])
				->get(),
			"module" => "Client",
			"url" => "client",
			"rolloutDate" => $rollout_date->date_created
		]);
	}

	public function show_external(Training $training)
	{
		if ($training->type !== 3)
		{
			return redirect()->back();
		}
		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training)->load(["external_status"]);
		if ($training->external_status->hasMedia('actions'))
		{
			$currentFile = $training->external_status->getMedia('actions')->last();
			$training->external_status->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($training->external_status->media);
		}

		$training->training_files = $trainingService->transformFiles($training->training_files);

		$user = auth()->user();
		$rollout_date = Cache::get("training_inhouse_rollout_date:" . $user->subscriber_id);

		if (!$rollout_date)
		{
			$rollout_date = Training::select('date_created')->where('type', '!=', 1)->orderBy('date_created')->first();
			if ($rollout_date)
			{
				Cache::put("training_rollout_date:" . $user->subscriber_id, $rollout_date);
			}
		}

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0],
				])
				->get(),
			"module" => "Third Party",
			"url" => "thirdParty",
			"rolloutDate" => $rollout_date->date_created
		]);
	}

	public function show_induction(Training $training)
	{
		if ($training->type !== 4)
		{
			return redirect()->back();
		}
		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training);

		$training->training_files = $trainingService->transformFiles($training->training_files);

		$user = auth()->user();
		$rollout_date = Cache::get("training_inhouse_rollout_date:" . $user->subscriber_id);

		if (!$rollout_date)
		{
			$rollout_date = Training::select('date_created')->where('type', '!=', 1)->orderBy('date_created')->first();
			if ($rollout_date)
			{
				Cache::put("training_rollout_date:" . $user->subscriber_id, $rollout_date);
			}
		}

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0],
				])
				->get(),
			"module" => "Induction",
			"url" => "induction",
			"rolloutDate" => $rollout_date->date_created
		]);
	}

	public function external_action(Training $training)
	{
		$user = auth()->user();

		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);

		if ($user->emp_id !== $training->external_details->requested_by)
		{
			return redirect()->back();
		}

		if ($training->external_status->hasMedia('actions'))
		{
			$currentFile = $training->external_status->getMedia('actions')->last();
			$training->external_status->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($training->external_status->media);
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
		]);
	}

	public function external_review(Training $training)
	{
		$user = auth()->user();

		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);

		if ($user->emp_id !== $training->external_details->reviewed_by)
		{
			return redirect()->back();
		}

		if ($training->external_status->hasMedia('actions'))
		{
			$currentFile = $training->external_status->getMedia('actions')->last();
			$training->external_status->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($training->external_status->media);
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
			"type" => "review"
		]);
	}

	public function external_approve(Training $training)
	{
		$user = auth()->user();

		$trainingService = new TrainingService();

		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);

		if ($user->emp_id !== $training->external_details->approved_by)
		{
			return redirect()->back();
		}

		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);
		if ($training->external_status->hasMedia('actions'))
		{
			$currentFile = $training->external_status->getMedia('actions')->last();
			$training->external_status->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($training->external_status->media);
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
			"type" => "approve"
		]);
	}

	public function external_comment(Training $training, Request $request)
	{
		$request->validate([
			"comment" => ["string", "max:255", "required"],
			"pages" => ["string", "required"],
			"comment_code" => ["integer", "max:2", "required"],
			"status" => ["string", "required"]
		]);

		$training->external_comments()->create([
			"reviewer_id" => auth()->user()->emp_id,
			"comment" => $request->comment,
			"comment_page_section" => $request->pages,
			"comment_code" => $request->comment_code,
			"status" => $request->status
		]);

		$statuses = $training->external_status;
		$statuses->review_status = "commented";
		$statuses->save();
		$training->increment("revision_no");
		$training->save();

		$creator = User::find($training->user_id);
		if ($creator)
		{
			$creator?->notify(new NewTrainingCommentNotification($training, CommentTypeEnums::COMMENTED));
		}

		return redirect()->back()
			->with("message", "Comment posted successfully!")
			->with("type", "success");
	}

	public function external_comment_status(TrainingExternalComment $trainingComment, Request $request)
	{
		$request->validate([
			"status" => ["string", "required"]
		]);

		$trainingComment->status = $request->status;
		$trainingComment->save();

		return redirect()->back()
			->with("message", "Comment" . $request->status . "successfully!")
			->with("type", "success");
	}

	public function external_comment_delete(TrainingExternalComment $trainingComment)
	{
		$trainingComment->delete();

		return redirect()->back()
			->with("message", "Comment deleted successfully!")
			->with("type", "success");
	}

	public function external_reply(TrainingExternalComment $trainingComment, Request $request)
	{
		$request->validate([
			"reply" => ["string", "max:255", "required"],
			"reply_code" => ["string", "required"]
		]);

		$training = $trainingComment->training;
		$training->save();

		$trainingComment->reply = $request->reply;
		$trainingComment->reply_code = $request->reply_code;
		$trainingComment->save();

		$reviewer = User::where('emp_id', $trainingComment->reviewer_id)->first();
		if ($reviewer)
		{
			$reviewer?->notify(new NewTrainingCommentNotification($training, CommentTypeEnums::REPLIED));
		}

		return redirect()->back()
			->with("message", "Reply posted successfully!")
			->with("type", "success");
	}

	public function approveReview(Request $request, Training $training)
	{
		$request->validate([
			"status" => ["string", "required"],
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", "required"]
		]);
		$training->load(['external_status', 'external_details']);

		/** @var TrainingExternalStatus $statuses */
		$statuses = $training->external_status;


		switch ($request->type)
		{
			case 'review':
				if ($request->remarks)
				{
					$statuses->review_remark = $request->remarks;
				}

				if ($training->external_details->approved_by === null)
				{
					$statuses->status = 'closed';
					$statuses->review_status = $request->status;
					if ($request->status === 'A' || $request->status === 'D')
					{
						$statuses->approval_status = 'approved';
					}
					else
					{
						$statuses->approval_status = 'failed';
					}
				}
				else
				{
					$statuses->status = 'for_approval';
					$statuses->review_status = $request->status;
					$statuses->approval_status = 'pending';
				}
				// if($request->status === 'A') {
				// 	$statuses->status = 'for_approval';
				// 	$statuses->review_status = $request->status;
				// 	$statuses->approval_status = 'pending';
				// }else {
				// 	$statuses->review_status = $request->status;
				// 	$statuses->status = 'for_revision';
				// }
				break;
			case 'approver':
				if ($request->remarks)
				{
					$statuses->approval_remark = $request->remarks;
				}
				$statuses->approval_status = $request->status;
				$statuses->status = "closed";
				break;
		}

		$statuses
			->addMediaFromRequest('file')
			->withCustomProperties([
				'type' => $request->type
			])
			->toMediaCollection('actions');

		$statuses->save();
		$training->save();

		return redirect()->back()
			->with("message", "Status updated successfully!")
			->with("type", "success");
	}


	public function reuploadActionFile(Request $request, Training $training)
	{
		$request->validate([
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", "required"],
			"remarks" => ["string", "nullable"]
		]);

		/** @var TrainingExternalStatus $statuses */
		$statuses = $training->external_status;

		if ($statuses->hasMedia('actions', ['type' => $request->type]))
		{
			$media = $statuses->getFirstMedia('actions', ['type' => $request->type]);
			$statuses->deleteMedia($media);
		}
		switch ($request->type)
		{
			case 'review':
				$statuses->review_remark = $request->remarks ?? "";
				break;
			case 'approval':
				$statuses->approval_remark = $request->remarks ?? "";
				break;
		}
		$statuses->save();
		$statuses
			->addMediaFromRequest('file')
			->withCustomProperties([
				'type' => $request->type
			])
			->toMediaCollection('actions');

		return redirect()->back()
			->with("message", "File updated successfully!")
			->with("type", "success");
	}

	public function courses()
	{
		$user = auth()->user();
		$courses = TrainingCourses::whereNull("type")->where('sub_id', $user->subscriber_id)->orderBy("created_at", "desc")->get();

		return Inertia::render("Dashboard/Management/Training/Register/index", [
			"courses" => $courses
		]);
	}

	public function addCourses(Request $request)
	{
		$request->validate([
			'courses' => ['required', 'array']
		]);
		$user = Auth::user();
		$courses = [];
		foreach ($request->courses as $course)
		{
			$courses[] = [
				'course_name' => $course['course_name'],
				'acronym' => $course['acronym'],
				'type' => null,
				'user_id' => $user->id,
				'sub_id' => $user->subscriber_id,
				'last_used' => null,
				'created_at' => now()
			];
		}
		TrainingCourses::insert($courses);

		return redirect()->back()
			->with('message', 'Course added successfully')
			->with('type', 'success');
	}

	public function updateCourse(Request $request, TrainingCourses $course)
	{
		$request->validate([
			'course_name' => ['string'],
			'acronym' => ['string']
		]);

		$course->course_name = $request->course_name;
		$course->acronym = $request->acronym;

		$course->save();
		return redirect()->back()
			->with('message', 'Course updated successfully')
			->with('type', 'success');
	}

	public function deleteCourse(Request $request)
	{
		$request->validate([
			'ids' => ['array', 'required']
		]);

		TrainingCourses::whereIn('id', $request->ids)->update(['deleted_at' => now()]);

		return redirect()->back()
			->with('message', count($request->ids) . ' items deleted sucessfully')
			->with('type', 'success');
	}


	public function externalMatrix(Request $request)
	{
		$from = $request->from;
		$to = $request->to;
		if (!$from || !$to)
		{
			if (($from && !$to) || (!$from && $to))
			{
				abort(404);
			}
			$currentYear = Carbon::now()->year;
			$from = Carbon::create($currentYear, 1, 1);
			$to = Carbon::create($currentYear, 12, 31);
		}


		return Inertia::render("Dashboard/Management/Training/External/Matrix/index", [
			'from' => $from,
			'to' => $to
		]);
	}


	public function matrix(Request $request)
	{
		$user = auth()->user();

		$from = $request->from;
		$to = $request->to;
		if (!$from || !$to)
		{
			if (($from && !$to) || (!$from && $to))
			{
				abort(404);
			}
			$currentYear = Carbon::now()->year;
			// $currentYear = 2014;
			$from = Carbon::create($currentYear, 1, 1);
			$to = Carbon::create($currentYear, 12, 31);
			// $to = Carbon::create(2023, 12, 31);
		}


		$yearList = Training::selectRaw('EXTRACT(YEAR FROM training_date) AS year')
			->distinct()
			->orderBy('year', 'desc')
			->get()
			->pluck('year');

		$courses = TrainingCourses::select('id', 'course_name')->get();

		$employees = Employee::where('sub_id', $user->subscriber_id)->where('tbl_employees.is_deleted', 0)
			->select('employee_id', 'firstname', 'lastname', 'tbl_position.position')
			->has('participated_trainings')
			->with('participated_trainings', function ($q) use ($from, $to)
			{
				return $q->select([
					'trainee_id',
					'tbl_training_trainees.training_id',
					'tbl_training_trainees.employee_id',
					'tbl_trainings_files.src',
					'tbl_trainings.training_date',
					'tbl_trainings.date_expired',
					'tbl_trainings.title',
					'tbl_trainings.training_hrs'
				])
					->where('tbl_trainings.is_deleted', 0)
					->whereBetween('training_date', [$from, $to])
					->join('tbl_trainings', 'tbl_trainings.training_id', 'tbl_training_trainees.training_id')
					->leftJoin(
						'tbl_trainings_files',
						function ($joinQuery)
						{
							return $joinQuery->on('tbl_trainings_files.training_id', '=', 'tbl_training_trainees.training_id')
								->on('tbl_trainings_files.emp_id', '=', 'tbl_training_trainees.employee_id');
						}
					);
			})
			->leftJoin('tbl_position', 'tbl_position.position_id', 'tbl_employees.position')
			->get();

		$years = collect([]);

		$titles = $courses->pluck('course_name')->toArray();
		$storage = Storage::disk("public");

		foreach ($employees as $employee)
		{
			$employeeFullName = $employee->fullname;
			$employeePosition = trim($employee->position);
			$employeeId = $employee->employee_id;
			foreach ($employee->participated_trainings as $parTraining)
			{
				$year = Carbon::parse($parTraining->training_date)->year;
				$existingYear = $years->get($year, collect([
					[
						'employee_id' => $employeeId,
						'fullName' => $employeeFullName,
						'position' => $employeePosition,
						'completed_count' => 0,
						'total_hrs' => 0,
						'data' => collect([])
					]
				]));

				$employeeData = $existingYear->first(function ($val) use ($employeeId)
				{
					return $val['employee_id'] === $employeeId;
				});

				if (!$employeeData)
				{
					$existingYear->push([
						'employee_id' => $employeeId,
						'fullName' => $employeeFullName,
						'position' => $employeePosition,
						'completed_count' => 0,
						'total_hrs' => 0,
						'data' => collect([])
					]);
				}

				$years->put($year, $existingYear);

				$course = '';
				$title = $parTraining->title;
				if ($title)
				{
					$foundCourse = $courses->first(function ($course) use ($title)
					{
						return strtolower(trim($course->course_name)) === strtolower(trim($title));
					});
					if ($foundCourse)
					{
						$course = $foundCourse->course_name;
					}
					else
					{
						$course = $title;
					}
				}


				if ($course !== '')
				{
					$existingYear->transform(function ($val) use ($employeeId, $parTraining, $storage, $course, $employeePosition)
					{
						if ($val['employee_id'] === $employeeId && !$val['data']->contains('courseName', $course))
						{
							$isCompleted = $parTraining->src ? $storage->exists("media/training/" . $parTraining->src) : false;
							$expiredDate = Carbon::parse($parTraining->date_expired);
							$parTraining->expired = false;
							if (now() >= $expiredDate)
							{
								$parTraining->expired = true;
							}
							$val['data']->push([
								...$parTraining->toArray(),
								'courseName' => $course,
								'isCompleted' => $isCompleted,
								'position' => $employeePosition,
							]);
							if ($isCompleted)
							{
								$val['completed_count'] += 1;
							}
							$val['total_hrs'] += $parTraining->training_hrs;
						}
						return $val;
					});
					$years->put($year, $existingYear);
				}
			}
		}

		$years->transform(function ($year)
		{
			return $year->sortBy('fullName')->values();
		});

		return Inertia::render("Dashboard/Management/Training/Matrix/index", [
			'courses' => $courses,
			'years' => $years,
			'titles' => $titles,
			'yearList' => $yearList,
			'from' => $from,
			'to' => $to
		]);
	}

	public function tracker() {
		return Inertia::render("Dashboard/Management/Training/Tracker/index");
	}

	public function clientCourses() {
		$user = auth()->user();
		$courses = TrainingCourses::where("type", "client")->where('sub_id', $user->subscriber_id)->orderBy("created_at", "desc")->get();

		return Inertia::render("Dashboard/Management/Training/Client/Register/index", [
			"courses" => $courses
		]);
	}

	public function storeClientCourse(Request $request)
	{
		$request->validate([
			'courses' => ['required', 'array']
		]);
		$user = Auth::user();
		$courses = [];
		foreach ($request->courses as $course)
		{
			$courses[] = [
				'course_name' => $course['course_name'],
				'acronym' => $course['acronym'],
				'type' => "client",
				'user_id' => $user->id,
				'sub_id' => $user->subscriber_id,
				'last_used' => null,
				'created_at' => now()
			];
		}
		TrainingCourses::insert($courses);

		return redirect()->back()
			->with('message', 'Course added successfully')
			->with('type', 'success');
	}
}
