<?php

namespace App\Services\API;

use App\Models\Employee;
use App\Models\TbtPrePlanning;
use App\Models\TbtPrePlanningAssigned;
use App\Models\ToolboxTalk;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ToolboxTalkApiService
{
 private $userIds;

 private $trackDailyStatus = true;


 public function __construct() {
  $this->userIds = collect([
   "default" => URL::route("image", ["path" => "assets/images/default-profile.jpg", "w" => 40, "h" => 40, "fit" => "crop"])
  ]);
 }
 

 public function getProfile(int|null $user_id)
 {
  $cachedProfile = $this->userIds->get($user_id);
  if($cachedProfile) {
   return $cachedProfile;
  } else if($user_id) {
   $profile = Media::where("model_type", User::class)->where("model_id", $user_id)->whereJsonContains("custom_properties", ["primary" => true])->first();
    if ($profile) {
     $path = "user/" . md5($profile->id . config('app.key')) . "/" . $profile->file_name;
     $url = URL::route("image", ["path" => $path, "w" => 40, "h" => 40, "fit" => "crop"]);
     $this->userIds->put($user_id, $url);
     return $url;
    }
    else {
     return $this->userIds->get("default");
    }
  }
  return $this->userIds->get("default");
 }

 public function getEmployees() {
  return Employee::select("employee_id", "tbl_employees.employee_id as emp_id", "firstname", "lastname", "tbl_position.position", "tbl_employees.user_id")
  ->whereHas("user")
  ->where([
    ["tbl_employees.is_deleted", 0],
    ["tbl_employees.is_active", 0],
  ])
  ->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
  ->get()
  ->transform(function ($employee)
  {
    $employee->img = $this->getProfile($employee->user_id);
    return $employee;
  });
 }

 public function getAssignedEmployees() {
  $employees = $this->getEmployees();
  $preplanning = TbtPrePlanning::select("id", "location", "date_issued", "created_by")->with("assigned")
  ->orderBy("date_issued", "desc")
  ->get()
  ->transform(function ($pre) use($employees)
  {
    $employee = $employees->find($pre->created_by);
    if($employee) {
      $pre->fullname = $employee->fullname;
      $pre->img = $employee->img;
      $pre->position = $employee->position;
    }
    $pre->assigned->transform(function($ass) use($employees, $pre) {
      $emp = $employees->find($ass->emp_id);
      $ass->fullname = $emp->fullname;
      $ass->img = $emp->img;
      $ass->position = $emp->position;

      $ass->submittedTbt = ToolboxTalk::query()
        ->where("tbl_toolbox_talks.is_deleted", 0)
        ->where("tbl_toolbox_talks.employee_id", $ass->emp_id)
        ->whereDate("tbl_toolbox_talks.date_created", $pre->date_issued)
        ->count();

      if($ass->submittedTbt === 0 && $this->trackDailyStatus) {
        $this->trackDailyStatus = false;
      }
      return $ass;
    });
    $pre->status = $this->trackDailyStatus;
    $this->trackDailyStatus = false;
    return $pre;
  });

  return [$employees, $preplanning];
 }

//  public function dailySubmitted()
//  {
//     return TbtPrePlanningAssigned::query()
//       ->select("tbt_pre_planning_assigneds.emp_id", "preplanning", "firstname", "lastname", "tbl_employees.user_id", "tbl_position.position", "tbt_pre_plannings.date_issued")
//       ->join("tbt_pre_plannings", "tbt_pre_plannings.id", "tbt_pre_planning_assigneds.preplanning")
//       ->join("tbl_employees", "tbl_employees.employee_id", "tbt_pre_planning_assigneds.emp_id")
//       ->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
//       ->orderBy("date_issued", "desc")
//       ->get()
//       ->transform(function($emp) {
//         $emp->profile = $this->getProfile($emp->user_id);
//         $emp->fulname = $emp->firstname. " " .$emp->lastname;
//         $emp->tbt = ToolboxTalk::select("tbl_toolbox_talks.employee_id", "tbt_id", "location")
//         ->addSelect(
//         DB::raw("(SELECT COUNT(*) FROM tbl_toolbox_talks_participants WHERE tbl_toolbox_talks_participants.tbt_id = tbl_toolbox_talks.tbt_id) as participants")
//         )
//         ->where("tbl_toolbox_talks.is_deleted", 0)
//         ->where("tbl_toolbox_talks.employee_id", $emp->emp_id)
//         ->whereDate("tbl_toolbox_talks.date_created", $emp->date_issued)
//         ->get();
//         dd($emp->tbt->count());
//         return $emp;
//       });
//   }
}

// return TbtPrePlanning::query()
//  ->select("id", "tbt_pre_plannings.created_by", "date_issued", "firstname", "lastname", "tbl_employees.user_id", "tbl_position.position")
//  ->join("tbl_employees", "tbl_employees.employee_id", "tbt_pre_plannings.created_by")
//  ->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
//  ->with([
//   "assigned" => fn ($q) => $q->select("tbt_pre_planning_assigneds.emp_id", "preplanning", "firstname", "lastname", "tbl_employees.user_id", "tbl_position.position")
//    ->join("tbl_employees", "tbl_employees.employee_id", "tbt_pre_planning_assigneds.emp_id")
//    ->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
//  ])
//  ->orderBy("date_issued", "desc")
//  ->get()
//  ->transform(function ($emp)
//  {
//   $emp->profile = $this->getProfile($emp->user_id);
//   $emp->fulname = $emp->firstname. " " .$emp->lastname;
//   $emp->assigned->transform(function ($ass) use ($emp)
//   {
//    $ass->fulname = $ass->firstname. " " .$ass->lastname;
//    $tbt = ToolboxTalk::select("tbl_toolbox_talks.employee_id", "tbt_id", "location")
//     ->addSelect(
//      DB::raw("(SELECT COUNT(*) FROM tbl_toolbox_talks_participants WHERE tbl_toolbox_talks_participants.tbt_id = tbl_toolbox_talks.tbt_id) as participants")
//     )
//     ->where("tbl_toolbox_talks.is_deleted", 0)
//     ->where("tbl_toolbox_talks.employee_id", $ass->emp_id)
//     ->whereDate("tbl_toolbox_talks.date_created", $emp->date_issued)
//     ->get();

//    $ass->profile = $this->getProfile($ass->user_id);
//    $ass->tbt = $tbt;
//    return $ass;
//   });
//   return $emp;
//  });