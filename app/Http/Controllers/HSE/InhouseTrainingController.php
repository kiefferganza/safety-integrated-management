<?php

namespace App\Http\Controllers\HSE;

use App\Http\Controllers\Controller;
use App\Models\TrainingCourses;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InhouseTrainingController extends Controller
{

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
