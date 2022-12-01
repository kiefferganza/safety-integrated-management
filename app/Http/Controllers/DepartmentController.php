<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartmentController extends Controller
{
  public function index() {
		$user = Auth::user();
		
		return Inertia::render('Dashboard/Management/Department/List/index', [
			"departments" => Department::where([
					["is_deleted", 0],
					["sub_id", $user->subscriber_id]
				])->get()
		]);
	}


	public function store(Request $request) {
		$user = Auth::user();
		Department::create([
			"department" => $request->department,
			"sub_id" => $user->subscriber_id,
			"user_id" => $user->user_id,
			"is_deleted" => 0
		]);
		return redirect()->back()
		->with("message", "Department created successfully!")
		->with("type", "success");;
	}


	public function edit(Request $request, Department $department) {
		$department->department = $request->department;
		$department->save();

		return redirect()->back()
		->with("message", "Department $department->department updated successfully!")
		->with("type", "success");
	}


	public function destroy(Department $department) {
		$department->is_deleted = 1;
		$department->save();

		return redirect()->back()
		->with("message", "Department $department->department deleted successfully!")
		->with("type", "success");
	}

	public function delete_multiple(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);
		Department::whereIn("department_id", $fields["ids"])->update(["is_deleted" => 1]);

		return redirect()->back()
		->with("message", count($fields['ids'])." positions deleted successfully")
		->with("type", "success");
	}



}
