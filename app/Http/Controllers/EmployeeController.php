<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
		tbl_nationalities.`name`"))
		->join("tbl_department", "tbl_employees.department", "tbl_department.department_id")
		->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		->join("tbl_nationalities", "tbl_employees.nationality", "tbl_nationalities.id")
		->join("users", "users.user_id", "tbl_employees.user_id")
		->with(["trainings" => fn ($query) => 
			$query->select("training_id","date_expired","training_date","training_hrs","type","title","employee_id")
			->where("is_deleted", 0)
		])
		->where([
			["tbl_employees.sub_id", $user->subscriber_id],
			["tbl_employees.is_deleted", 0]
		])
		->get();
		return Inertia::render('Employees/AllEmployees', [
			"employees" => $employees,
			"companies" => DB::table("tbl_company")->where([["sub_id", $user->subscriber_id], ["is_deleted", 0]])->get(),
			"departments" => DB::table("tbl_department")->get(),
			"nationalities" => DB::table("tbl_nationalities")->orderBy("name")->get(),
			"positions" => Position::get(),
		]);
	}

	public function store(Request $request) {
		$user = Auth::user();

		$training = new Employee;
		$training->user_id = $user->user_id;
		$training->sub_id = $user->subscriber_id;
		$training->firstname = $request->firstname;
		$training->middlename = $request->middlename ? $request->middlename : " ";
		$training->lastname = $request->lastname;
		$training->sex = $request->sex;
		$training->phone_no = $request->phone_no;
		$training->email = $request->email;
		$training->company = (int)$request->company;
		$training->company_type = $request->company_type;
		$training->position = (int)$request->position;
		$training->department = (int)$request->department;
		$training->nationality = (int)$request->nationality;
		$training->birth_date = $request->birth_date;
		$training->is_active = 0;
		$training->is_deleted = 0;

		if($request->hasFile("img_src")) {
			$file = $request->file("img_src")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("img_src")->storeAs('media/photos/employee', $file_name, 'public');

			$training->img_src = $file_name;
		}

		$training->save();

		return redirect()->back()
		->with("message", "Employee added successfully!")
		->with("type", "success");

	}


	public function manage_positions() {
		$employees = DB::table("tbl_position")
		->join("users", "users.user_id", "tbl_position.user_id")
		->select(DB::raw("tbl_position.position_id, tbl_position.position, tbl_position.date_created as position_date_created"))
		->where("tbl_position.is_deleted", 0)
		->get();
		return Inertia::render('Employees/ManagePositions', ["employees" => $employees]);
	}

	public function department() {
		$user = Auth::user();
		$departments = DB::table("tbl_department")
		->select(DB::raw("tbl_department.department_id, tbl_department.department, tbl_department.date_created"))
		->where([
			["tbl_department.is_deleted", 0],
			["sub_id", $user->subscriber_id]
		])
		->get();
		return Inertia::render('Employees/Department', ["departments" => $departments]);
	}

	public function companies() {
		$companies = DB::table("tbl_company")->where("is_deleted", 0)->get();
		return Inertia::render("Employees/Companies", ["companies" => $companies]);
	}

}
