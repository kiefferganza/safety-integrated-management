<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PositionController extends Controller
{
	public function index() {
		return Inertia::render('Dashboard/Management/Position/List/index', [
			"positions" => Position::where("is_deleted", 0)->get()
		]);
	}

	public function store(Request $request) {
		$user = Auth::user();


		$positions = [];
		foreach ($request->all() as $position) {
			$positions[] = [
				"user_id" => $user->subscriber_id,
				"is_deleted" => 0,
				"position" => $position["position"]
			];
		}
		Position::insert($positions);
		
		return redirect()->back()
		->with("message", "Position created successfully!")
		->with("type", "success");
	}


	public function edit(Request $request, Position $position) {
		$position->position = $request->position;
		$position->save();

		return redirect()->back()
		->with("message", "Position $position->position updated successfully!")
		->with("type", "success");
	}


	public function destroy(Position $position) {
		$position->is_deleted = 1;
		$position->save();

		return redirect()->back()
		->with("message", "Position $position->position deleted successfully!")
		->with("type", "success");
	}

	public function delete_multiple(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);
		Position::whereIn("position_id", $fields["ids"])->update(["is_deleted" => 1]);

		return redirect()->back()
		->with("message", count($fields['ids'])." positions deleted successfully")
		->with("type", "success");
	}

}
