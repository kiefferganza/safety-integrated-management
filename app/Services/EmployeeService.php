<?php

namespace App\Services;

use App\Http\Requests\EmployeeRequest;
use App\Models\CompanyModel;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class EmployeeService {

	public $personels;

	public function personels() {
		$user = Auth::user();
		$this->personels = Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id")
			->where("is_deleted", 0)
			->where("sub_id", $user->subscriber_id)
			->where("employee_id", "!=", $user->emp_id);
		
		return $this;
	}

	public function position() {
		if($this->personels) {
			return $this->personels->with([
				"position" => fn($q) => $q->where("is_deleted", 0)
			]);
		}else {
			return Position::where("is_deleted", 0)->get();
		}
	}

	public function get() {
		return $this->personels->get();
	}


	public function create(EmployeeRequest $request) {
		$user = auth()->user();

		$pos = Position::firstOrFail($request->position);
		$dep = Department::firstOrFail($request->department);
		$com = CompanyModel::firstOrFail($request->company);

		$employee = new Employee;
		// $employee->user_id = $user->user_id;
		$employee->sub_id = $user->subscriber_id;
		$employee->firstname = $request->firstname;
		$employee->middlename = $request->middlename ? $request->middlename : " ";
		$employee->lastname = $request->lastname;
		$employee->sex = $request->sex;
		$employee->phone_no = $request->phone_no;
		$employee->email = $request->email;
		$employee->position = $pos->position_id;
		$employee->raw_position = $pos->position;
		$employee->department = $dep->department_id;
		$employee->raw_department = $dep->department;
		$employee->raw_company = $com->company_name;
		$employee->company = $com->company_id;
		$employee->company_type = $request->company_type;
		// $employee->nationality = (int)$request->nationality;
		$employee->country = $request->country;
		$employee->birth_date = $request->birth_date;
		$employee->is_active = 0;
		$employee->is_deleted = 0;
		$employee->sex = $request->sex;
		$employee->about = $request->about;
		$employee->date_created = Carbon::now();
		$employee->date_updated = Carbon::now();

		// if($request->hasFile("img_src")) {
		// 	// $employee->user->addMediaFromRequest("profile_pic")->toMediaCollection("profile");
		// }

		return $employee->save();
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
		$employee->country = $request->country;
		$employee->birth_date = $request->birth_date;
		$employee->is_active = $request->is_active;
		$employee->sex = $request->sex;
		$employee->about = $request->about;
		$employee->date_updated = Carbon::now();


		if($employee->position !== (int)$request->position) {
			$pos = Position::select("position_id", "position")->findOrFail($request->position);
			$employee->position = $pos->position_id;
			$employee->raw_position = $pos->position;
		}

		if($employee->department !== (int)$request->department) {
			$dep = Department::select("department_id", "department")->findOrFail($request->department);
			$employee->department = $dep->department_id;
			$employee->raw_department = $dep->department;
		}

		if($employee->company !== (int)$request->company) {
			$pos = CompanyModel::select("company_id", "company_name")->findOrFail($request->company);
			$employee->company = $pos->company_id;
			$employee->raw_company = $pos->company_name;
		}

		if($request->hasFile("img_src") && $employee->user) {
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

		return $employee->save();
	}

}