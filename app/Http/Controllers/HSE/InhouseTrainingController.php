<?php

namespace App\Http\Controllers\HSE;

use App\Events\NewTrainingEvent;
use App\Http\Controllers\Controller;
use App\Models\DocumentProjectDetail;
use App\Models\Employee;
use App\Models\Training;
use App\Models\TrainingCourses;
use App\Models\TrainingTrainees;
use App\Services\TrainingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class InhouseTrainingController extends Controller
{

  public function index() {
    $inhouse = Training::where([["is_deleted", false], ["type", 1]])
		->orderByDesc("date_created")
    ->withCount("trainees")
    ->with("course")
		->get();

    return Inertia::render("Dashboard/Management/Training/InHouse/List/index", [
			"trainings" => $inhouse
		]);
  }


  public function show(Training $training) {
    $user = auth()->user();
    $rollout_date = Cache::get("training_rollout_date:" . $user->subscriber_id);

    if(!$rollout_date) {
      $rollout_date = Training::select('date_created')->orderBy('date_created')->first();
      if($rollout_date) {
        Cache::put("training_rollout_date:" . $user->subscriber_id, $rollout_date);
      }
    }

    $training = $training->load(["trainees" => fn($query) => $query->with("position")]);
    $training->attachment = $training->attachment;

		return Inertia::render("Dashboard/Management/Training/InHouse/View/index", [
			"training" => $training->load(["trainees" => fn($query) => $query->with("position")]),
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->where([
				["tbl_position.is_deleted", 0],
				["tbl_employees.is_deleted", 0],
				["tbl_employees.is_active", 0],
			])
			->get(),
			"url" => "in-house",
      "rolloutDate" => $rollout_date->date_created
		]);
  }


  public function create() {
		$trainingService = new TrainingService();
		$courses = TrainingCourses::where("type", "in-house")->get();
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');
		
		return Inertia::render("Dashboard/Management/Training/InHouse/Create/index",[
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0]
				])
				->get(),
			"courses" => $courses,
			"sequence" => $trainingService->getSequenceNo(1),
			"projectDetails" => $projectDetails,
		]);
	}


  public function store(Request $request) {
    $request->validate([
			'originator' => ['string', 'required'],
			'project_code' => ['string', 'required'],
			'discipline' => ['string', 'required'],
			'document_type' => ['string', 'required'],
			'location' => ['string', 'required'],
			'contract_no' => ['string', 'required'],
			'trainer' => ['string', 'required'],
			'date_expired' => ['date', 'required'],
			'training_date' => ['date', 'required'],
      'trainees' => ['array', 'min:1'],
      'title' => ['integer', 'required']
		]);
    $user = auth()->user();
    $course = TrainingCourses::findOrfail($request->title);
    
    if($course->last_used !== null && $user->user_type !== 0) {
      return redirect()->back()
      ->with('message', 'Course is not available')
      ->with('type', 'error');
    }

    $user = auth()->user();
		$training = new Training;

		$training->user_id = $user->user_id;
		$training->employee_id = $user->emp_id;
		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
    $training->course_id = $course->id;
		$training->title = $course->course_name;
		$training->location = $request->location;
		$training->contract_no = $request->contract_no;
		$training->trainer = $request->trainer;
		$training->training_date = $request->training_date;
		$training->date_expired = $request->date_expired;
		$training->training_hrs = $request->training_hrs;
		$training->type = 1;
		$training->status = $request->hasFile("attachment") ? "completed" : "published";
		$training->date_created = date("Y-m-d H:i:s");
		$training->is_deleted = 0;


		$training->save();
		$training_id = $training->training_id;

    $course->last_used = now()->year;
    $course->save();

    if($request->hasFile("attachment")) {
      $training->addMediaFromRequest("attachment")->toMediaCollection();
    }

		if(!empty($request->trainees)) {
			$trainees = [];
			foreach ($request->trainees as $trainee) {
				$trainees[] = [
					"training_id" => (int)$training_id,
					"employee_id" => (int)$trainee["emp_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => 0,
					"date_joined" => date("Y-m-d H:i:s")
				];
			}
			TrainingTrainees::insert($trainees);
		}

		event(new NewTrainingEvent($training));

    return redirect()->route("training.management.in_house")
		->with('message', 'Training added successfully')
		->with('type', 'success');
  }


  public function edit(Training $training) {
    $training->load(["course", "trainees" => fn ($query) => $query->with("position")]);
    $training->trainees->transform(fn($tr) => [
      "fullname" => $tr->firstname. " " .$tr->lastname,
      "position" => $tr->toArray()['position']['position'],
      "emp_id" => $tr->employee_id,
      "user_id" => $tr->user_id,
    ]);
		$courses = TrainingCourses::where("type", "in-house")->get();
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');
		
		return Inertia::render("Dashboard/Management/Training/InHouse/Create/index",[
      "currentTraining" => $training,
			"personel" =>  Employee::join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
				->where([
					["tbl_position.is_deleted", 0],
					["tbl_employees.is_deleted", 0],
					["tbl_employees.is_active", 0]
				])
				->get(),
			"courses" => $courses,
			"projectDetails" => $projectDetails,
		]);
  }


  public function update(Request $request, Training $training) {
    $request->validate([
			'originator' => ['string', 'required'],
			'project_code' => ['string', 'required'],
			'discipline' => ['string', 'required'],
			'document_type' => ['string', 'required'],
			'location' => ['string', 'required'],
			'contract_no' => ['string', 'required'],
			'trainer' => ['string', 'required'],
			'date_expired' => ['date', 'required'],
			'training_date' => ['date', 'required'],
      'trainees' => ['array', 'min:1'],
      'title' => ['integer', 'required']
		]);


    if((int)$request->title !== $training->course_id) {
      $course = TrainingCourses::findOrfail($request->title);
      $training->title = $course->course_name;
    }


		$training->originator = $request->originator;
		$training->project_code = $request->project_code;
		$training->discipline = $request->discipline;
		$training->document_type = $request->document_type;
		$training->document_zone = $request->document_zone;
		$training->document_level = $request->document_level;
		$training->location = $request->location;
		$training->contract_no = $request->contract_no;
		$training->trainer = $request->trainer;
		$training->training_date = $request->training_date;
		$training->date_expired = $request->date_expired;
		$training->training_hrs = $request->training_hrs;
		$training->remarks = $request->remarks ? $request->remarks : null;
    $training->date_updated = now();

    if($request->hasFile("attachment")) {
      $training->clearMediaCollection();
      $training->addMediaFromRequest("attachment")->toMediaCollection();
      $training->status = "completed";
    }else if($training->status === "completed" && $request->attachment === null) {
      $training->clearMediaCollection();
      $training->status = "published";
    }

		$training->save();

		if(!empty($request->trainees)) {
      TrainingTrainees::where("training_id", $training->training_id)->delete();
			$trainees = [];
			foreach ($request->trainees as $trainee) {
				$trainees[] = [
					"training_id" => $training->training_id,
					"employee_id" => (int)$trainee["emp_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => 0,
					"date_joined" => date("Y-m-d H:i:s")
				];
			}
			TrainingTrainees::insert($trainees);
		}


		return redirect()->route("training.management.in_house")
		->with("message", "Course updated successfully!")
		->with("type", "success");
	}


  public function inHouseCourses () {
    $courses = TrainingCourses::where("type", "in-house")->get();
    
    return Inertia::render("Dashboard/Management/Training/InHouse/Register/index", [
      "courses" => $courses
    ]);
  }


  public function storeInHouseCourse(Request $request) {
    $request->validate([
      'course_name' => ['string'],
      'attached_file' => ['file']
    ]);

    $user = auth()->user();

    $course = new TrainingCourses();
    $course->course_name = $request->course_name;
    $course->type = 'in-house';
    $course->user_id = $user->user_id;
    $course->sub_id = $user->subscriber_id;
    $course->save();

    $course->addMediaFromRequest('attached_file')->toMediaCollection();

    return redirect()->back()
		->with('message', 'Course added successfully')
		->with('type', 'success');
  }


  public function updateInHouseCourse(Request $request, TrainingCourses $course) {
    $request->validate([
      'course_name' => ['string'],
      'attached_file' => ['file', 'nullable']
    ]);

    $course->course_name = $request->course_name;

    if($request->hasFile('attached_file')) {
      if($course->attached_file) {
        $course->deleteMedia($course->attached_file['id']);
      }
      $course->addMediaFromRequest('attached_file')->toMediaCollection();
    }
    $course->save();

    return redirect()->back()
		->with('message', 'Course updated successfully')
		->with('type', 'success');
  }


  public function matrix(Request $request) {
    $from = $request->from;
		$to = $request->to;
		if(!$from || !$to) {
			if(($from && !$to) || (!$from && $to)) {
				abort(404);
			}
			$currentYear = Carbon::now()->year;
			$from = Carbon::create($currentYear, 1, 1);
			$to = Carbon::create($currentYear, 12, 31);
		}


    return Inertia::render("Dashboard/Management/Training/InHouse/Matrix/index", [
      'from' => $from,
			'to' => $to
    ]);
  }
  
}
