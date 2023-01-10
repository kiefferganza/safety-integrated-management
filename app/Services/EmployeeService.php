<?php

namespace App\Services;

use App\Models\Employee;
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
		return $this->personels->with("position");
	}

	public function get() {
		return $this->personels->get();
	}

}