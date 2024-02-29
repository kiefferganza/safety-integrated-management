<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Models\Training;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
      // Sync employee positions
      $employees = Employee::select("user_id", "employee_id", "img_src", "position")->whereHas("user")->with("user")->get();
      foreach ($employees as $employee) {
        /** @var Employee $employee */
        if($employee->position !== $employee->user->position) {
          // DB::enableQueryLog();
          User::where("user_id", $employee->user_id)->update(["position" => $employee->position]);
          // $queries = DB::getQueryLog();
          // dd($queries);
        }
      }
    }
}