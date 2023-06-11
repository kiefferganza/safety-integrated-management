<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\InspectionReportList;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateWrongData extends Seeder
{
	use WithoutModelEvents;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		//   InspectionReportList::where("section_title", "STARRT Cards completed for all task taking place?")->update(["section_title" => "START Cards completed for all task taking place?"]);
		//   InspectionReportList::where("section_title", "Mobile Plant/ Equipmentâ€™s")->update(["section_title" => "Mobile Plant/ Equipment's"]);
		//   InspectionReportList::where("section_title", "Tidiness/Housekeeping &Storage of Materials ")->update(["section_title" => "Tidiness/Housekeeping &Storage of Materials"]);
		$employees = Employee::whereNull("user_id")->get();
		foreach ($employees as $employee) {
			$user = User::where("emp_id", $employee->employee_id)->first();
			if($user) {
				$employee->user_id = $user->user_id;
				$employee->save();
			}
		}
    }
}