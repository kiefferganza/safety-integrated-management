<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrainingRequest;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Training;
use App\Models\TrainingExternal;
use App\Models\TrainingFiles;
use App\Models\TrainingTrainees;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TrainingController extends Controller
{
	public function index() {
		$trainings = Training::where([["is_deleted", false], ["type", 2]])
		->with([
			"trainees" => fn ($query) => $query->with("position"),
			"training_files"
		])
		->orderByDesc("date_created")
		->get();

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => $trainings,
			"module" => "Client",
			"url" => "client",
			"type" => 2
		]);
	}


	public function in_house() {
		$trainings = Training::where([["is_deleted", false], ["type", 1]])
		->with([
			"trainees" => fn ($query) => $query->with("position"),
			"training_files"
		])
		->orderByDesc("date_created")
		->get();

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => $trainings,
			"module" => "In House",
			"url" => "in-house",
			"type" => 1
		]);
	}

	public function external() {
		$trainings = Training::where([["is_deleted", false], ["type", 3]])
		->with([
			"trainees" => fn ($query) => $query->with("position"),
			"training_files"
		])
		->orderByDesc("date_created")
		->get();

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => $trainings,
			"module" => "Third Party",
			"url" => "third-party",
			"type" => 3
		]);
	}

	public function induction() {
		$trainings = Training::where([["is_deleted", false], ["type", 4]])
		->with([
			"trainees" => fn ($query) => $query->with("position"),
			"training_files"
		])
		->orderByDesc("date_created")
		->get();

		return Inertia::render("Dashboard/Management/Training/List/index", [
			"trainings" => $trainings,
			"module" => "Induction",
			"url" => "induction",
			"type" => 4
		]);
	}


	public function create(Request $request) {
		$trainings = Training::where([["is_deleted", false]])->get();

		return Inertia::render("Dashboard/Management/Training/Create/index",[
			"trainings" => $trainings,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0]
				])
				->get(),
			"type" => $request->query('type') ? $request->query('type') : 2,
		]);
	}


	public function store(TrainingRequest $request) {
		$user = Auth::user();

		$sequence_no = $request->sequence_no;

		$seq_exist = Training::select("training_id")->where([
			["sequence_no", $request->sequence_no],
			["type", (int)$request->type]
		])->first();

		if($seq_exist || !$sequence_no) {
			$trainings = Training::where([["is_deleted", false], ["type", (int)$request->type]])->get();
			$number_of_trainings = $trainings->count() + 1;

			$number_of_zeroes = strlen((string) $number_of_trainings);
			$sequence_no_zeros = '';
			for ($i = 0; $i <= $number_of_zeroes; $i++)
			{
				$sequence_no_zeros = $sequence_no_zeros . "0";
			}
			$sequence_no =  $sequence_no_zeros . $number_of_trainings;
		}

		$training = new Training;

		$training->user_id = $user->user_id;
		$training->employee_id = $user->emp_id;
		$training->sequence_no = $sequence_no;
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
		->with("trainings", Training::where([["is_deleted", false]])->get())
		->with("message", "Training added successfully!")
		->with("type", "success");
	}

	public function edit(Training $training) {
		$loadedTraining = null;
		if($training->type == 3) {
			$loadedTraining = $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files",
				"external_details"
			]);
		}else {
			$loadedTraining = $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files"
			]);
		}

		$details = $this->getTrainingType($training->type);

		$trainings = Training::where([["is_deleted", false], ["type", $training->type]])->get();
		$number_of_trainings = $trainings->count() + 1;

		$number_of_zeroes = strlen((string) $number_of_trainings);
		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++)
		{
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}
		$sequence =  $sequence_no_zeros . $number_of_trainings;


		return Inertia::render("Dashboard/Management/Training/Edit/index", [
			"training" => $loadedTraining,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
			])
			->get(),
			"details" => $details,
			"sequence_no" => $sequence
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

			foreach ($training_files as $file) {
				if(Storage::exists("public/media/training/" . $file["src"])) {
					Storage::delete("public/media/training/" . $file["src"]);
				}
			}
			TrainingFiles::destroy($training_files);
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

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files",
				"user_employee" => fn($q) => $q->select("user_id", "firstname", "lastname")
			]),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
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

		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files",
				"user_employee" => fn($q) => $q->select("user_id", "firstname", "lastname")
			]),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
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
		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files",
				"external_details" => fn($q) => $q->with([
					"approval" => fn($q) => $q->select("employee_id","firstname", "lastname"),
					"reviewer" => fn($q) => $q->select("employee_id","firstname", "lastname"),
					"requested" => fn($q) => $q->select("employee_id","firstname", "lastname")
				]),
				"user_employee" => fn($q) => $q->select("user_id", "firstname", "lastname")
			]),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
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
		return Inertia::render("Dashboard/Management/Training/View/index", [
			"training" => $training->load([
				"trainees" => fn ($query) => $query->with("position"),
				"training_files",
				"user_employee" => fn($q) => $q->select("user_id", "firstname", "lastname")
			]),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
			])
			->get(),
			"module" => "Induction",
			"url" => "induction"
		]);
	}


	private function getTrainingType($type) {
		switch ($type) {
			case 1:
				return [
					"title" => "In House",
					"url" => "inHouse"
				];
				break;
			case 2:
				return [
					"title" => "Client",
					"url" => "client"
				];
				break;
			case 3:
				return [
					"title" => "External",
					"url" => "thirdParty"
				];
				break;
			case 4:
				return [
					"title" => "Induction",
					"url" => "induction"
				];
				break;
			default:
				return [
					"title" => "Client",
					"url" => "client"
				];
				break;
		}
	}

}
