<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\TbtPrePlanning;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ToolboxTalkController extends Controller
{
	public function index()
	{
		return response()->json(ToolboxTalkService::getList());
	}

	public function byType(Request $request)
	{
		$request->validate([
			'type' => 'required|integer|between:1,5'
		]);
		return response()->json(ToolboxTalkService::getListByType($request->query('type')));
	}


	public function preplanningRegister()
	{
		$employees = Employee::select("employee_id as emp_id", "firstname", "lastname", "tbl_position.position", "tbl_employees.user_id")
			->whereHas("user")
			->where([
				["tbl_employees.is_deleted", 0],
				["tbl_employees.is_active", 0],
			])
			->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->get()
			->transform(function ($employee)
			{
				/** @var Employee $employee */
				$employee->profile = null;
				if ($employee->user_id)
				{
					$profile = $employee->profile(["primary" => true]);
					if ($profile)
					{
						$path = "user/" . md5($profile->id . config('app.key')) . "/" . $profile->file_name;
						$employee->profile = [
							"thumbnail" => URL::route("image", ["path" => $path, "w" => 40, "h" => 40, "fit" => "crop"])
						];
					}
				}
				return $employee;
			});
		$preplanning = TbtPrePlanning::with("assigned")->get()
			->transform(function ($pre) use ($employees)
			{
				$employeeList = [];
				$selfEmp = $employees->first(function ($employee) use ($pre)
				{
					return $employee->emp_id === $pre->created_by;
				});
				if($selfEmp) {
					$pre->fullname = $selfEmp->fullname;
					$pre->profile = $selfEmp->profile;
					$pre->position = $selfEmp->position;
				}

				foreach ($pre->assigned as $emp)
				{
					$foundEmp = $employees->first(function ($employee) use ($emp)
					{
						return $employee->emp_id === $emp->emp_id;
					});
					if ($foundEmp)
					{
						$employeeList[] = $foundEmp->toArray();
					}
				}
				$pre->employees = $employeeList;
				return $pre;
			});

			return response()->json(["employees" => $employees, "preplanning" => $preplanning]);
	}
}
