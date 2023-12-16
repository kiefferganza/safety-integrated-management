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
use Illuminate\Http\Request;
use Inertia\Inertia;

class InhouseTrainingController extends Controller
{


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
    $course = TrainingCourses::findOrfail($request->title);
    
    if($course->last_used !== null) {
      return redirect()->back(422)
      ->with('message', 'Course is not available')
      ->with('type', 'errorr');
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

    if($request->hasFile("attachment")) {
      $training->addMediaFromRequest("attachment");
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

    return redirect()->back()
		->with('message', 'Training added successfully')
		->with('type', 'success');
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
      'title' => ['integer']
		]);

    if($request->title) {
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
		$training->type = (int)$request->type;
		$training->training_center = $request->training_center;

		if($training->sequence_no === null) {
			$training->sequence_no = $request->sequence_no;
		}


		$training->save();

		if(isset($request->deleted_trainees)) {
			foreach ($request->deleted_trainees as $del_trainee) {
				TrainingTrainees::find($del_trainee["trainee_id"])->delete();
			}
		}

		if(!empty($request->trainees)) {
			$trainees = [];
			foreach ($request->trainees as $trainee) {
				if(!isset($trainee["pivot"])) {
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
				}
			}
			if(!empty($trainees)) {
				TrainingTrainees::insert($trainees);
			}
		}

		return redirect()->back()
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

  
}
