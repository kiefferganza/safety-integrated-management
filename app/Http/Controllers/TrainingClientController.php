<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Training;
use App\Models\TrainingFiles;
use App\Models\TrainingTrainees;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainingClientController extends Controller
{
	public function index() {
		$trainings = Training::where([["is_deleted", false], ["type", 4]])
		->with([
			"trainees" => fn ($query) => $query->with("position")
		])
		->orderByDesc("date_created")
		->get();

		$number_of_trainings = $trainings->count() + 1;
		$number_of_zeroes = strlen((string) $number_of_trainings);
		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++)
		{
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}
		$sequence =  $sequence_no_zeros . $number_of_trainings;

		return Inertia::render("Dashboard/Management/Training/Client/index", [
			"trainings" => $trainings,
			"sequence_no" => $sequence,
			"personel" =>  User::personel(Auth::user())->get(),
			"positions" => Position::all("position", "position_id"),
		]);
	}


	public function store(Request $request) {
		$user = Auth::user();

		$training = new Training;

		$training->user_id = $user->user_id;
		$training->employee_id = $user->emp_id;
		$training->sequence_no = $request->sequence_no;
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
		$training->status = "Scheduled";
		$training->type = 4;
		$training->date_created = date("Y-m-d H:i:s");

		if($request->hasFile("src")) {
			$file = $request->file("src")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("src")->storeAs('media/docs', $file_name, 'public');

			$training->src = $file_name;
		}

		$training->save();
		$training_id = $training->training_id;

		if(!empty($request->trainees)) {
			$trainees = [];
			foreach ($request->trainees as $trainee) {
				$trainees[] = [
					"training_id" => (int)$training_id,
					"employee_id" => (int)$trainee["emp_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => false,
					"date_joined" => date("Y-m-d H:i:s")
				];
			}
			TrainingTrainees::insert($trainees);
		}
		

		return redirect()->back()
		->with("message", "Training added successfully!")
		->with("type", "success");
	}


	public function update(Training $training, Request $request) {
		if($request->remarks) {
			$training->remarks = $request->remarks;
		}
		if(!empty($request->participants)) {
			TrainingTrainees::where("training_id", $training->training_id)->delete();
			foreach ($request->participants as $trainee) {
				$trainees[] = [
					"training_id" => $training->training_id,
					"employee_id" => (int)$trainee["employee_id"],
					"user_id" => (int)$trainee["user_id"],
					"is_removed" => false,
					"date_joined" => date("Y-m-d H:i:s")
				];
			}
			TrainingTrainees::insert($trainees);
			$training->increment("revision_no");
		}

		$training->save();

		return redirect()->back()
		->with("message", "Course updated successfully!")
		->with("type", "success");
	}


	public function destroy(Request $request) {
		$trainings = Training::whereIn("training_id", $request->ids);
		
		foreach ($trainings->get() as $training) {
			TrainingTrainees::where("training_id", $training->training_id)->delete();
		}
		$trainings->update(["is_deleted" => 1]);
		return redirect()->back()
		->with("message", "Training deleted successfully!")
		->with("type", "error");
	}

}
