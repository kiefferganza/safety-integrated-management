<?php

namespace App\Services\API;

use App\Models\Employee;
use App\Models\TbtTracker;
use App\Models\TbtTrackerEmployee;
use App\Models\ToolboxTalk;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
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
  if(!$user_id) return $this->userIds->get("default");

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
 }

 public function getEmployees() {
  $user = auth()->user();
  return Employee::select("employee_id", "tbl_employees.employee_id as emp_id", "firstname", "lastname", "tbl_position.position", "tbl_employees.user_id", "tbl_company.company_name")
  ->where([
    ["tbl_employees.is_deleted", 0],
    ["tbl_employees.is_active", 0],
    ["tbl_employees.sub_id", $user->subscriber_id]
  ])
  ->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
  ->leftJoin("tbl_company", "tbl_employees.company", "tbl_company.company_id")
  ->get()
  ->transform(function ($employee)
  {
    $employee->img = $this->getProfile($employee->user_id);
    return $employee;
  });
 }

 public function getAssignedEmployees() {
  
  // dd(TbtTracker::query()
  // ->select("tbt_trackers.*")
  // // ->with("trackerEmployees")
  // ->orderBy("date_assigned", "desc")
  // ->get()->toArray());

  $employees = $this->getEmployees();
  $preplanning = TbtTracker::query()
  ->select("tbt_trackers.*")
  ->with("trackerEmployees")
  ->orderBy("created_at", "desc")
  ->get()
  ->transform(function ($pre) use($employees)
  {
    $this->trackDailyStatus = true;
    $employee = $employees->find($pre->emp_id);
    if($employee) {
      $pre->fullname = $employee->fullname;
      $pre->img = $employee->img;
      $pre->company_name = $employee->company_name;
      $pre->position = $employee->position;
    }
    // $date = Carbon::parse($pre->date_assigned);
    // $startDay = $date->startOfDay();
    // $endDay = $date->endOfDay();
    $pre->trackerEmployees->transform(function($trackerEmployee) use($employees, $pre) {
      $emp = $employees->find($trackerEmployee->emp_id);
      if($emp) {
        $trackerEmployee->fullname = $emp->fullname;
        $trackerEmployee->img = $emp->img;
        $trackerEmployee->position = $emp->position;
        $trackerEmployee->company_name = $emp->company_name;
        $trackerEmployee->date_assigned = $pre->date_assigned;
      }

      $witnessEmp = $employees->first(function($emp) use($trackerEmployee) {
        return $emp->fullname === $trackerEmployee->witness;
      });

      if($witnessEmp) {
        $trackerEmployee->witnessImg = $witnessEmp->img;
      } else {
        $trackerEmployee->witnessImg = URL::route("image", ["path" => "assets/images/default-profile.jpg", "w" => 40, "h" => 40, "fit" => "crop"]);
      }

      $trackerEmployee->submittedTbt = ToolboxTalk::query()
        ->select("tbt_id", "date_created")
        ->where("tbl_toolbox_talks.is_deleted", 0)
        ->where("tbl_toolbox_talks.employee_id", $trackerEmployee->emp_id)
        ->where("tbl_toolbox_talks.location", $trackerEmployee->location)
        ->where("tbl_toolbox_talks.tbt_type", $trackerEmployee->tbt_type)
        ->where(function($q) use($pre) {
          $q->whereDate("tbl_toolbox_talks.date_conducted", $pre->date_assigned)
          ->orWhereDate("tbl_toolbox_talks.date_created", $pre->date_assigned);
        })
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

 public function tbtTrackerLatestSequenceNumber() {
  $sequence = TbtTracker::withTrashed()->count() + 1;
  return str_pad($sequence, 6, '0', STR_PAD_LEFT);
 }

 public function getTracker() {
  $user = auth()->user();
  
  $tracker = TbtTrackerEmployee::query()->where("emp_id", $user->emp_id)->withWhereHas("tracker")->with([
    "tracker" => fn($q) => $q->with("employee")
  ])->get()->transform(function(TbtTrackerEmployee $trackerEmp) {
    $tracker = $trackerEmp->getRelations()["tracker"];
    $tracker->employee->img = $this->getProfile($tracker->employee->user_id);
    $trackerEmp->tracker = $tracker;
    $tbt = ToolboxTalk::query()->where("tbl_toolbox_talks.is_deleted", 0)
    ->where("tbl_toolbox_talks.employee_id", $trackerEmp->emp_id)
    ->where("tbl_toolbox_talks.location", $trackerEmp->location)
    ->where("tbl_toolbox_talks.tbt_type", $trackerEmp->tbt_type)
    ->where(function(Builder $q) use($tracker) {
      return $q->whereDate("tbl_toolbox_talks.date_conducted", $tracker->date_assigned)
      ->orWhereDate("tbl_toolbox_talks.date_created", $tracker->date_assigned);
    })->count();
    $trackerEmp->tbt = $tbt;
    return $trackerEmp;
  })->filter(fn($tracker) => $tracker->tbt === 0)->flatten();

  return $tracker;
 }
}