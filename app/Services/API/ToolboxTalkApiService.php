<?php

namespace App\Services\API;

use App\Models\Employee;
use App\Models\TbtTracker;
use App\Models\ToolboxTalk;
use App\Models\User;
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
  $preplanning = TbtTracker::query()
  ->select("tbt_trackers.*")
  ->with("tracker_employees")
  ->orderBy("date_assigned", "desc")
  ->get()
  ->transform(function ($pre) use($employees)
  {
    $this->trackDailyStatus = true;
    $employee = $employees->find($pre->emp_id);
    if($employee) {
      $pre->fullname = $employee->fullname;
      $pre->img = $employee->img;
      $pre->position = $employee->position;
    }
    // $date = Carbon::parse($pre->date_assigned);
    // $startDay = $date->startOfDay();
    // $endDay = $date->endOfDay();
    $pre->tracker_employees->transform(function($trackerEmployee) use($employees, $pre) {
      $emp = $employees->find($trackerEmployee->emp_id);
      $trackerEmployee->fullname = $emp->fullname;
      $trackerEmployee->img = $emp->img;
      $trackerEmployee->position = $emp->position;
      $trackerEmployee->date_assigned = $pre->date_assigned;

      $trackerEmployee->submittedTbt = ToolboxTalk::query()
        ->select("tbt_id", "date_created")
        ->where("tbl_toolbox_talks.is_deleted", 0)
        ->where("tbl_toolbox_talks.employee_id", $trackerEmployee->emp_id)
        ->where("tbl_toolbox_talks.location", $trackerEmployee->location)
        ->where("tbl_toolbox_talks.tbt_type", $trackerEmployee->tbt_type)
        ->whereDate("tbl_toolbox_talks.date_created", $pre->date_assigned)
        ->first();

      $trackerEmployee->status = $trackerEmployee->submittedTbt !== null;

      if(!$trackerEmployee->status && $this->trackDailyStatus) {
        $this->trackDailyStatus = false;
      }
      return $trackerEmployee;
    });
    $pre->status = $this->trackDailyStatus;
    $this->trackDailyStatus = false;
    return $pre;
  });

  return [$employees, $preplanning];
 }

 public function preplanningLatestSequenceNumber() {
  $sequence = TbtTracker::count() + 1;
  return str_pad($sequence, 6, '0', STR_PAD_LEFT);
 }
}