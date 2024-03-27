<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Models\TbtPrePlanning;
use App\Models\TbtPrePlanningAssigned;
use App\Models\TbtTracker;
use App\Models\Training;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

      Employee::where("user_id", 46)->where("employee_id", "!=", 331)->update(["user_id" => null]);
      Employee::find(581)->update(["user_id" => null]);
      Employee::find(579)->update(["user_id" => null]);
      Employee::find(610)->update(["user_id" => null]);

      User::whereIn("id", [57, 60, 78])->delete();

      // $prePlanning = DB::table("tbt_pre_plannings")
      // ->select("tbt_pre_plannings.*", "users.emp_id")
      // ->join("users", "created_by", "users.id")
      // ->get();
      // foreach ($prePlanning as $pre) {
      //   $ass = DB::table("tbt_pre_planning_assigneds")
      //   ->select("emp_id", "witness", "location", "exact_location", "tbt_type", "created_at", "updated_at")
      //   ->where("preplanning", $pre->id)
      //   ->get()
      //   ->toArray();
      //   $trackerEmployees = [];
      //   foreach ($ass as $a) {
      //     $trackerEmployees[] = [
      //       "emp_id" => $a->emp_id,
      //       "witness" => $a->witness,
      //       "location" => $a->location,
      //       "exact_location" => $a->exact_location,
      //       "tbt_type" => $a->tbt_type,
      //       "created_at" => $a->created_at,
      //       "updated_at" => $a->updated_at
      //     ];
      //   }
      //   $tracker = new TbtTracker();
      //   $tracker->created_by = $pre->created_by;
      //   $tracker->emp_id = $pre->emp_id;
      //   $tracker->project_code = $pre->project_code;
      //   $tracker->originator = $pre->originator;
      //   $tracker->discipline = $pre->discipline;
      //   $tracker->document_type = $pre->document_type;
      //   $tracker->sequence_no = $pre->sequence_no;
      //   $tracker->date_assigned = $pre->date_issued;
      //   if($tracker->save()) {
      //     $tracker->trackerEmployees()->createMany($trackerEmployees);
      //   }
      //   dd($tracker);
      // }

      // Sync employee positions
      // $employees = Employee::select("user_id", "employee_id", "img_src", "position")->whereHas("user")->with("user")->get();
      // foreach ($employees as $employee) {
      //   /** @var Employee $employee */
      //   if($employee->position !== $employee->user->position) {
      //     // DB::enableQueryLog();
      //     User::where("user_id", $employee->user_id)->update(["position" => $employee->position]);
      //     // $queries = DB::getQueryLog();
      //     // dd($queries);
      //   }
      // }
    }
}