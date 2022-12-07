<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Follower;
use App\Models\TrainingType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UsersController extends Controller
{
	public function index()
	{
			$user = Auth::user();

			$userslist = User::select(DB::raw("users.user_id, tbl_employees.firstname, tbl_employees.lastname, tbl_employees.email, users.user_type, users.status, users.date_created, tbl_employees.lastname, tbl_employees.firstname, users.emp_id, tbl_employees.img_src"))
			->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
			->where([
					["users.subscriber_id", $user->subscriber_id],
					["users.deleted", 0]
			])->get();

		return Inertia::render("Dashboard/Management/User/List/index", ["users" => $userslist]);
	}

	public function profile() {
		$user = Auth::user();
		$employee = Employee::find($user->emp_id)->with([
			"trainings" => fn ($query) => 
				$query->select("training_id","date_expired","training_date","training_hrs","type","title","employee_id")
				->where("is_deleted", 0),
			"company" => fn ($query) =>
				$query->select("company_id", "company_name")->where("is_deleted", 0),
			"position" => fn ($query) => 
				$query->select("position_id", "position")->where("is_deleted", 0),
			"department" => fn ($query) => 
				$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]])
		])->first();
		return Inertia::render("Dashboard/Management/User/index", [
			"employee" => $employee,
			"trainingTypes" => TrainingType::get()
		]);
	}

	public function show(User $user) {
		return Inertia::render('Dashboard/Management/User/Account/index', [
			"user" => $user->load("employee"),
		]);
	}

	public function edit_user(User $user) {
		$user->employee = $user->employee()->first();
		return Inertia::render("Dashboard/Management/User/Edit/index", ["user" => $user]);
	}

	public function cards()
	{
			$user = Auth::user();

			$userslist = User::select(DB::raw("users.user_id, tbl_employees.firstname, tbl_employees.lastname, tbl_employees.email, users.user_type, users.status, users.date_created, tbl_employees.lastname, tbl_employees.firstname, users.emp_id, tbl_employees.img_src"))
			->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
			->where([
					["users.subscriber_id", $user->subscriber_id],
					["users.deleted", 0]
			])->get();

		return Inertia::render("Dashboard/Management/User/Cards/index", ["users" => $userslist]);
	}


	public function followUser($user_id) {
		$user = Auth::user();
		Follower::firstOrCreate([
			"user_id" => $user->user_id,
			"following_id" => $user_id,
		]);
		return redirect()->back();
	}


}
