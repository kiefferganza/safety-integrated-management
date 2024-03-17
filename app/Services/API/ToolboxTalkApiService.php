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
  $preplanning = TbtPrePlanning::with("assigned")
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
      $ass->date_issued = $pre->date_issued;

      $ass->submittedTbt = ToolboxTalk::query()
        ->where("tbl_toolbox_talks.is_deleted", 0)
        ->where("tbl_toolbox_talks.employee_id", $ass->emp_id)
        ->whereDate("tbl_toolbox_talks.date_conducted", $pre->date_issued)
        ->count();

      $ass->status = $ass->submittedTbt > 0;

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

 public function preplanningLatestSequenceNumber() {
  $sequence = TbtPrePlanning::count() + 1;
  return str_pad($sequence, 6, '0', STR_PAD_LEFT);
 }
}