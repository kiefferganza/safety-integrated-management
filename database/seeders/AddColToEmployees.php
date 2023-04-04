<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddColToEmployees extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Employee::select("firstname", "lastname", "employee_id", "position", "department", "company", "raw_position", "raw_department", "raw_company")
            ->with([
                "position",
                "department",
                "company"
            ])
            ->get()
            ->map(function ($employee) {
                $emp = $employee->toArray();
                $employee->raw_position = $emp["position"]["position"];
                $employee->raw_company = $emp["company"]["company_name"];
                $employee->raw_department = $emp["department"]["department"];
                $employee->save();
            });
    }
}
