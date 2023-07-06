<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrainingRequest;
use App\Models\Employee;
use App\Models\Training;
use App\Models\TrainingExternal;
use App\Models\TrainingExternalComment;
use App\Models\TrainingExternalStatus;
use App\Models\TrainingFiles;
use App\Models\TrainingTrainees;
use App\Services\TrainingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrainingController extends Controller
{
	public function index() {

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(2),
			"module" => "Client",
			"url" => "client",
			"type" => 2
		]);
	}


	public function in_house() {

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(1),
			"module" => "In House",
			"url" => "in-house",
			"type" => 1
		]);
	}

	public function external() {

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(3),
			"module" => "Third Party",
			"url" => "third-party",
			"type" => 3
		]);
	}

	public function induction() {

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => (new TrainingService)->getTrainingByType(4),
			"module" => "Induction",
			"url" => "induction",
			"type" => 4
		]);
	}


	public function create(Request $request) {
		$trainingService = new TrainingService();
		
		return Inertia::render("Dashboard/Management/Training/Create/index",[
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0]
				])
				->get(),
			"type" => $request->query('type') ? $request->query('type') : 2,
			"sequences" => [
				"1" => $trainingService->getSequenceNo(1),
				"2" => $trainingService->getSequenceNo(2),
				"3" => $trainingService->getSequenceNo(3),
				"4" => $trainingService->getSequenceNo(4),
			]
		]);
	}


	public function store(TrainingRequest $request) {
		$user = Auth::user();
		$training = new Training;

		$training->user_id = $user->user_id;
		$training->employee_id = $user->emp_id;
		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
		$training->title = $request->title;
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

		if($request->type == "3") {
			$training_external = new TrainingExternal;

			$training_external->training_id = $training_id;
			$training_external->currency = $request->currency;
			$training_external->course_price = (float)$request->course_price;
			$training_external->requested_by = (int)$user->emp_id;
			$training_external->reviewed_by = (int)$request->reviewed_by;
			$training_external->approved_by = (int)$request->approved_by;
			$training_external->date_requested = date("Y-m-d H:i:s");

			$training_external->save();

			TrainingExternalStatus::create(["training_id" => $training->training_id]);
		}

		if(!empty($request->trainees)) {
			$trainees = [];
			$files = [];

			foreach ($request->trainees as $trainee) {
				$trainees[] = [
					"training_id" => (int)$training_id,
					"employee_id" => (int)$trainee["emp_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => 0,
					"date_joined" => date("Y-m-d H:i:s")
				];

				if($trainee["src"] !== null) {
					$file = $trainee["src"]->getClientOriginalName();
					$extension = pathinfo($file, PATHINFO_EXTENSION);
					$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
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
			if(!empty($files)) {
				TrainingFiles::insert($files);
			}
			TrainingTrainees::insert($trainees);
		}
		

		return redirect()->back()
		->with("message", "Training added successfully!")
		->with("type", "success");
	}

	public function edit(Training $training) {
		$trainingService = new TrainingService();

		$relation = [
			"trainees" => fn ($query) => $query->with("position"),
			"training_files"
		];
		if($training->type == 3) {
			$relation[] = "external_details";
		}

		return Inertia::render("Dashboard/Management/Training/Edit/index", [
			"training" => $training->load($relation),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0],
				["tbl_employees.is_active", 0],
			])
			->get(),
			"details" => $trainingService->getTrainingType($training->type)
		]);
	}

	public function update(TrainingRequest $request, Training $training) {
		$user = Auth::user();
		
		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
		$training->title = $request->title;
		$training->location = $request->location;
		$training->contract_no = $request->contract_no;
		$training->trainer = $request->trainer;
		$training->training_date = $request->training_date;
		$training->date_expired = $request->date_expired;
		$training->training_hrs = $request->training_hrs;
		$training->remarks = $request->remarks ? $request->remarks : null;
		$training->type = (int)$request->type;
		$training->training_center = $request->training_center;
		$training->increment("revision_no");

		if($training->sequence_no === null) {
			$training->sequence_no = $request->sequence_no;
		}


		$training->save();

		if($request->type == "3") {
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

		if(isset($request->deleted_trainees)) {
			foreach ($request->deleted_trainees as $del_trainee) {
				TrainingTrainees::find($del_trainee["trainee_id"])->delete();
				
				$training_files_to_delete = TrainingFiles::where([
					["training_id", $training->training_id],
					["emp_id", (int)$del_trainee["employee_id"]]
				])->get()->toArray();

				if(!empty($training_files_to_delete)) {
					foreach ($training_files_to_delete as $file_to_delete) {
						if(Storage::exists("public/media/training/" . $file_to_delete["src"])) {
							Storage::delete("public/media/training/" . $file_to_delete["src"]);
						}
					}

					TrainingFiles::find($training_files_to_delete[0]["training_files_id"])->delete();
				}
			}
		}

		if(!empty($request->trainees)) {
			$trainees = [];
			$files = [];

			foreach ($request->trainees as $trainee) {
				if(!isset($trainee["pivot"])) {
					// Delete
					$training_files_to_delete = TrainingFiles::where([
						["training_id", $training->training_id],
						["emp_id", (int)$trainee["emp_id"]]
					])->get()->toArray();
					if(!empty($training_files_to_delete)) {
						foreach ($training_files_to_delete as $file_to_delete) {
							if(Storage::exists("public/media/training/" . $file_to_delete["src"])) {
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
					
					if(!$tr_trainee) {
						$trainees[] = [
							"training_id" => (int)$training->training_id,
							"employee_id" => (int)$trainee["emp_id"],
							"user_id" => (int)$trainee["user_id"],
							"is_removed" => 0,
							"date_joined" => date("Y-m-d H:i:s")
						];
					}
					
	
					if($trainee["src"] !== null) {
						$file = $trainee["src"]->getClientOriginalName();
						$extension = pathinfo($file, PATHINFO_EXTENSION);
						$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
						$trainee["src"]->storeAs('media/training', $file_name, 'public');

						$tr_file = TrainingFiles::where([
							["training_id", $training->training_id],
							["emp_id", (int)$trainee["emp_id"]]
						])->first();

						if($tr_file) {
							if(Storage::exists("public/media/training/" . $tr_file->src)) {
								Storage::delete("public/media/training/" . $tr_file->src);
							}
							$tr_file->src = $file_name;
							$tr_file->save();
						}else {
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
			if(!empty($files)) {
				TrainingFiles::insert($files);
			}
			if(!empty($trainees)) {
				TrainingTrainees::insert($trainees);
			}
		}

		return redirect()->back()
		->with("message", "Course updated successfully!")
		->with("type", "success");
	}


	public function destroy(Request $request) {
		$trainings = Training::whereIn("training_id", $request->ids)->get(['training_id'])->toArray();

		$training_ids = [];
		foreach ($trainings as $training) {
			$training_ids[] = $training['training_id'];
		}

		if(!empty($training_ids)) {
			TrainingTrainees::whereIn("training_id", $training_ids)->delete();

			$training_files = TrainingFiles::whereIn("training_id", $training_ids)
			->get(["training_files_id","training_id", "src"])->toArray();

			if(!empty($training_files)) {
				foreach ($training_files as $file) {
					if(Storage::exists("public/media/training/" . $file["src"])) {
						Storage::delete("public/media/training/" . $file["src"]);
					}
				}
				TrainingFiles::destroy($training_files[0]);
			}
		}

		Training::destroy($trainings);
		
		return redirect()->back()
		->with("message", "Training deleted successfully!")
		->with("type", "success");
	}

	// SHOW
	public function show_in_house(Training $training) {
		if($training->type !== 1) {
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
	
	public function show_client(Training $training) {
		if($training->type !== 2) {
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
			"module" => "Client",
			"url" => "client"
		]);
	}

	public function show_external(Training $training) {
		if($training->type !== 3) {
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
			"module" => "External",
			"url" => "thirdParty"
		]);
	}

	public function show_induction(Training $training) {
		if($training->type !== 4) {
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
			"module" => "Induction",
			"url" => "induction"
		]);
	}

	public function external_action(Training $training) {
		$user = auth()->user();

		$trainingService = new TrainingService();
		
		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);
		
		if($user->emp_id !== $training->external_details->requested_by) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
		]);
		
	}

	public function external_approve_or_deny(Training $training, Request $request) {
		$request->validate([
			"type" => ["string", "required"],
			"statusType" => ["string", "required"],
			"remarks" => ["string", "max:255", "nullable"]
		]);
		$statuses = $training->external_status;
		
		if($request->type === "review" && $statuses->approval_status === "in_review") {
			$statuses->review_status = $request->statusType;
			$statuses->review_remark = $request->remarks;
		}
		if($request->type === "approve") {
			$statuses->approval_status = $request->statusType;
			$statuses->approval_remark = $request->remarks;
		}
		$statuses->save();
		
		return redirect()->back()
		->with("message", "External training updated successfully!")
		->with("type", "success");
	}

	public function external_review(Training $training) {
		$user = auth()->user();

		$trainingService = new TrainingService();
		
		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);
		
		if($user->emp_id !== $training->external_details->reviewed_by) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
			"type" => "review"
		]);
	}

	public function external_approve(Training $training) {
		$user = auth()->user();

		$trainingService = new TrainingService();
		
		$training = $trainingService->loadTraining($training)->load(["external_status", "external_comments"]);
		
		if($user->emp_id !== $training->external_details->approved_by) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Training/View/ThirdParty/index", [
			"training" => $training,
			"type" => "approve"
		]);
		
	}

	public function external_comment(Training $training, Request $request) {
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

		return redirect()->back()
		->with("message", "Comment posted successfully!")
		->with("type", "success");
	}

	public function external_comment_status(TrainingExternalComment $trainingComment, Request $request) {
		$request->validate([
			"status" => ["string", "required"]
		]);

		$trainingComment->status = $request->status;
		$trainingComment->save();

		return redirect()->back()
		->with("message", "Comment". $request->status ."successfully!")
		->with("type", "success");
	}

	public function external_comment_delete(TrainingExternalComment $trainingComment) {
		$trainingComment->delete();

		return redirect()->back()
		->with("message", "Comment deleted successfully!")
		->with("type", "success");
	}

	public function external_reply(TrainingExternalComment $trainingComment, Request $request) {
		$request->validate([
			"reply" => ["string", "max:255", "required"],
			"reply_code" => ["string", "required"]
		]);

		$training = $trainingComment->training;
		$training->increment("revision_no");
		$training->save();

		$trainingComment->reply = $request->reply;
		$trainingComment->reply_code = $request->reply_code;
		$trainingComment->save();

		return redirect()->back()
		->with("message", "Reply posted successfully!")
		->with("type", "success");
	}

}