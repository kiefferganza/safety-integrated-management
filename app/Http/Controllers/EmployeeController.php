<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;
use App\Models\Position;
use App\Models\TrainingType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
  public function index() {
		$user = Auth::user();
		$employees = Employee::select(DB::raw("tbl_employees.employee_id,
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
		->join("tbl_nationalities", "tbl_employees.nationality", "tbl_nationalities.id")
		->where([
			["tbl_employees.sub_id", $user->subscriber_id],
			["tbl_employees.is_deleted", 0]
		])
		->get();

		return Inertia::render("Dashboard/Management/Employee/List/index", [
			"employees" => $employees,
		]);
	}


	public function create() {
		$user = Auth::user();

		return Inertia::render("Dashboard/Management/Employee/Create/index", [
			"companies" => DB::table("tbl_company")->where([["sub_id", $user->subscriber_id], ["is_deleted", 0]])->get(),
			"departments" => DB::table("tbl_department")->get(),
			// "nationalities" => DB::table("tbl_nationalities")->orderBy("name")->get(),
			"positions" => Position::get(),
			"users" => User::select("firstname", "lastname", "email", "position")->where([["deleted", 0], ["firstname", "!=", null]])->get()
		]);
	}


	public function store(EmployeeRequest $request) {
		$user = Auth::user();

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
			$file = $request->file("img_src")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("img_src")->storeAs('media/photos/employee', $file_name, 'public');

			$employee->img_src = $file_name;
		}

		$employee->save();

		return redirect()->route("management.employee.list")
		->with("message", "Employee created successfully!")
		->with("type", "success");

	}


	public function update(Employee $employee) {
		$user = Auth::user();

		return Inertia::render("Dashboard/Management/Employee/Edit/index", [
			"currentEmployee" => $employee,
			"companies" => DB::table("tbl_company")->where([["sub_id", $user->subscriber_id], ["is_deleted", 0]])->get(),
			"departments" => DB::table("tbl_department")->get(),
			// "nationalities" => DB::table("tbl_nationalities")->orderBy("name")->get(),
			"positions" => Position::get(),
		]);
	}


	public function edit(EmployeeRequest $request, Employee $employee) {
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
		$employee->is_active = $request->is_active;
		$employee->sex = $request->sex;
		$employee->about = $request->about;
		$employee->date_updated = Carbon::now();

		if($request->hasFile("img_src")) {
			$file = $request->file("img_src")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("img_src")->storeAs('media/photos/employee', $file_name, 'public');

			if($employee->img_src !== "photo-camera-neon-icon-vector-35706296" || $employee->img_src !== "Picture21" || $employee->img_src !== "Crystal_personal.svg") {
				if(Storage::exists("public/media/docs/" . $employee->img_src)) {
					Storage::delete("public/media/docs/" . $employee->img_src);
				}
			}
			
			$employee->img_src = $file_name;
		}

		$employee->save();
		
		return redirect()->back()
		->with("message", "Employee updated successfully!")
		->with("type", "success");

	}


	public function show(Employee $employee) {
		$user = Auth::user();

		return Inertia::render('Dashboard/Management/Employee/View/index', [
			"employee" => $employee->load([
				"trainings" => fn ($query) => 
					$query->select("training_id","date_expired","training_date","training_hrs","type","title","employee_id")
					->where("is_deleted", 0),
				"company" => fn ($query) =>
					$query->select("company_id", "company_name")->where("is_deleted", 0),
				"position" => fn ($query) => 
					$query->select("position_id", "position")->where("is_deleted", 0),
				"department" => fn ($query) => 
					$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]]),
			]),
			"trainingTypes" => TrainingType::get()
		]);
	}

}
