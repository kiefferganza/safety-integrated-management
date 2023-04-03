<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Models\CompanyModel;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Models\Employee;
// use App\Models\Follower;
use App\Models\Position;
use App\Models\TrainingType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  public function index() {
		$user = auth()->user();
		$employees = Employee::select(DB::raw("
		tbl_employees.user_id,
		tbl_employees.employee_id,
		tbl_employees.firstname,
		tbl_employees.middlename,
		tbl_employees.lastname,
		tbl_employees.email,
		tbl_employees.phone_no,
		tbl_employees.img_src,
		tbl_employees.date_created,
		tbl_position.position,
		tbl_department.department,
		tbl_employees.is_deleted,
		tbl_employees.is_active,
		tbl_employees.country"))
		->join("tbl_department", "tbl_employees.department", "tbl_department.department_id")
		->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		// ->join("tbl_nationalities", "tbl_employees.nationality", "tbl_nationalities.id")
		->where([
			["tbl_employees.sub_id", $user->subscriber_id],
			["tbl_employees.is_deleted", 0]
		])
		->with([
			"user" => fn($q) => $q->select("user_id")
		])
		->get()
		->transform(function ($employee) {
			$employee->profile = null;
			if($employee->user) {
				$profile = $employee->user->getFirstMedia("profile", ["primary" => true]);
				if($profile) {
					$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
					$employee->profile = [
						"url" => URL::route("image", [ "path" => $path ]),
						"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
						"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
					];
				}
			}
			return $employee;
		});

		return Inertia::render("Dashboard/Management/Employee/List/index", [
			"employees" => $employees,
			"unassignedUsers" => User::select("username", "user_id")->where("emp_id", null)->get()
		]);
	}


	public function create() {
		$user = auth()->user();

		return Inertia::render("Dashboard/Management/Employee/Create/index", [
			"companies" => DB::table("tbl_company")->where([["sub_id", $user->subscriber_id], ["is_deleted", 0]])->get(),
			"departments" => DB::table("tbl_department")->where("is_deleted", 0)->get(),
			// "nationalities" => DB::table("tbl_nationalities")->orderBy("name")->get(),
			"positions" => Position::where("is_deleted", 0)->get(),
			"users" => User::select("firstname", "lastname", "email", "position")
				->where([
					["deleted", 0],
					["firstname", "!=", null],
					["emp_id", null]
				])
				->get()
		]);
	}


	public function store(EmployeeRequest $request) {
		$user = auth()->user();

		$employee = new Employee;
		$employee->user_id = $user->user_id;
		$employee->sub_id = $user->subscriber_id;
		$employee->firstname = $request->firstname;
		$employee->middlename = $request->middlename ? $request->middlename : " ";
		$employee->lastname = $request->lastname;
		$employee->sex = $request->sex;
		$employee->phone_no = $request->phone_no;
		$employee->email = $request->email;
		$employee->company = (int)$request->company;
		$employee->company_type = $request->company_type;
		$employee->position = (int)$request->position;
		$employee->department = (int)$request->department;
		// $employee->nationality = (int)$request->nationality;
		$employee->country = $request->country;
		$employee->birth_date = $request->birth_date;
		$employee->is_active = 0;
		$employee->is_deleted = 0;
		$employee->sex = $request->sex;
		$employee->about = $request->about;
		$employee->date_created = Carbon::now();
		$employee->date_updated = Carbon::now();

		if($request->hasFile("img_src")) {
			// $employee->user->addMediaFromRequest("profile_pic")->toMediaCollection("profile");
		}

		$employee->save();

		return redirect()->route("management.employee.list")
		->with("message", "Employee created successfully!")
		->with("type", "success");

	}


	public function update(Employee $employee) {
		$user = auth()->user();
		
		if($user->cannot("employee_edit") && $employee->employee_id !== $user->emp_id) {
			abort(403);
		}

		$positions = cache()->rememberForever("positions", fn() => Position::select("position_id", "position")->where("user_id", auth()->user()->subscriber_id)->get());

		return Inertia::render("Dashboard/Management/Employee/Edit/index", [
			"currentEmployee" => $employee,
			"companies" => CompanyModel::where("sub_id", $user->subscriber_id)->get(),
			"departments" => Department::where("sub_id", $user->subscriber_id)->get(),
			// "nationalities" => DB::table("tbl_nationalities")->orderBy("name")->get(),
			"positions" => $positions,
		]);
	}


	public function edit(EmployeeRequest $request, Employee $employee) {
		$user = auth()->user();
		if($user->cannot("employee_edit") && $employee->employee_id !== $user->emp_id) {
			abort(403);
		}

		$employee->firstname = $request->firstname;
		$employee->middlename = $request->middlename ? $request->middlename : " ";
		$employee->lastname = $request->lastname;
		$employee->sex = $request->sex;
		$employee->phone_no = $request->phone_no;
		$employee->email = $request->email;
		$employee->company = (int)$request->company;
		$employee->company_type = $request->company_type;
		$employee->position = (int)$request->position;
		$employee->department = (int)$request->department;
		$employee->country = $request->country;
		$employee->birth_date = $request->birth_date;
		$employee->is_active = $request->is_active;
		$employee->sex = $request->sex;
		$employee->about = $request->about;
		$employee->date_updated = Carbon::now();

		if($request->hasFile("img_src")) {
			$prevProfile = $employee->user->getFirstMedia("profile", ["primary" => true]);
			if($prevProfile) {
				$prevProfile->setCustomProperty("primary", false);
				$prevProfile->save();
			}
			$employee->user
			->addMediaFromRequest("profile_pic")
			->withCustomProperties(['primary' => true])
			->toMediaCollection("profile");
		}

		$employee->save();
		
		return redirect()->back()
		->with("message", "Employee updated successfully!")
		->with("type", "success");

	}


	public function show(Employee $employee) {
		$user = auth()->user();

		if($user->cannot("employee_show") && $employee->employee_id !== $user->emp_id) {
			abort(403);
		}

		$employee->profile = null;
		if($employee->user) {
			$profile = $employee->user->getFirstMedia("profile", ["primary" => true]);
			if($profile) {
				$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
				$employee->profile = [
					"url" => URL::route("image", [ "path" => $path ]),
					"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
					"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
				];
			}
		}

		return Inertia::render('Dashboard/Management/Employee/View/index', [
			"employee" => $employee->load([
				"participated_trainings" => fn ($query) => 
					$query->select("title", "type", "date_expired", "training_date", "training_hrs", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id"),
				"company" => fn ($query) =>
					$query->select("company_id", "company_name")->where("is_deleted", 0),
				"position" => fn ($query) => 
					$query->select("position_id", "position")->where("is_deleted", 0),
				"department" => fn ($query) => 
					$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]]),
				"social_accounts"
			]),
			"trainingTypes" => TrainingType::get()
		]);
	}

	public function profile() {
		$user = auth()->user();

		return Inertia::render('Dashboard/Management/Employee/View/index', [
			"employee" => $user->employee->load([
				"participated_trainings" => fn ($query) => 
					$query->select("title", "type", "date_expired", "training_date", "training_hrs", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id"),
				"company" => fn ($query) =>
					$query->select("company_id", "company_name")->where("is_deleted", 0),
				"position" => fn ($query) => 
					$query->select("position_id", "position")->where("is_deleted", 0),
				"department" => fn ($query) => 
					$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]]),
				"social_accounts"
			]),
			"trainingTypes" => TrainingType::get()
		]);
	}


	public function destroy(Employee $employee) {
		User::where("emp_id", $employee->employee_id)->update(["emp_id" => null]);

		// if($employee->user_id) {
		// 	Follower::where("user_id", $employee->user_id)->orWhere("following_id", $employee->user_id)->delete();
		// }

		if($employee->img_src !== "photo-camera-neon-icon-vector-35706296.png" || $employee->img_src !== "Picture21.jpg" || $employee->img_src !== "Crystal_personal.svg") {
			if(Storage::exists("public/media/photos/employee/" . $employee->img_src)) {
				Storage::delete("public/media/photos/employee/" . $employee->img_src);
			}
		}

		$employee->delete();

		return redirect()->back()
		->with("message", "Employee deleted successfully!")
		->with("type", "success");
	}

	public function delete_multiple(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);

		foreach ($fields['ids'] as $id) {
			$employee = Employee::find($id);
			User::where("emp_id", $employee->employee_id)->update(["emp_id" => null]);

			// if($employee->user_id) {
			// 	Follower::where("user_id", $employee->user_id)->orWhere("following_id", $employee->user_id)->delete();
			// }
			if($employee->img_src && $employee->img_src !== "photo-camera-neon-icon-vector-35706296" || $employee->img_src !== "Picture21" || $employee->img_src !== "Crystal_personal.svg") {
				if(Storage::exists("public/media/photos/employee/" . $employee->img_src)) {
					Storage::delete("public/media/photos/employee/" . $employee->img_src);
				}
			}

			$employee->delete();
		}

		return redirect()->back()
		->with("message", count($fields['ids'])." employee deleted successfully")
		->with("type", "success");
	}

	public function assign_user(Request $request, Employee $employee) {
		$user = User::find($request->user_id);

		if($user) {
			$user->emp_id = $employee->employee_id;
			$employee->user_id = $user->user_id;
			// $employee->firstname = $user->firstname;
			$employee->save();
			$user->save();
		}
		return redirect()->back()
		->with("message", "Success")
		->with("type", "success");
	}

}
