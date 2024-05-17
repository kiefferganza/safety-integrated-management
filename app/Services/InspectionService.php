<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionRegisteredPosition;
use App\Models\InspectionReportList;
use App\Models\InspectionTracker;
use App\Models\TbtTracker;
use App\Models\User;
use App\Notifications\ModuleBasicNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class InspectionService
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

	public function insertInspection(Request $request)
	{
		$user = auth()->user();
		$request->validate([
			"project_code" => ["string", "required"],
			"form_number" => ["string", "required"],
			"location" => ["string", "required"],
			"inspected_by" => ["string", "required"],
			"accompanied_by" => ["string", "required"],
			"inspected_date" => ["string", "required"],
			"inspected_time" => ["string", "required"],
			"date_due" => ["string", "required"],
			"reviewer_id" => ["string", "required"],
			"verifier_id" => ["string", "required"],
			"autoClose" => ["boolean", "required"]
		]);
		// TODO: GENERATE FORM NUMBER ON CREATING AND UPDATE ALL FORM NUMBER
		$inspection = new Inspection;
		$inspection->project_code = $request->project_code;
		$inspection->form_number = $request->form_number;
		$inspection->location = $request->location;
		$inspection->inspected_by = $request->inspected_by;
		$inspection->accompanied_by = $request->accompanied_by;
		$inspection->inspected_date = $request->inspected_date;
		$inspection->inspected_time = $request->inspected_time;
		$inspection->contract_no = $request->contract_no;
		$inspection->avg_score = $request->avg_score;
		$inspection->reviewer_id = (int)$request->reviewer_id;
		$inspection->verifier_id = (int)$request->verifier_id;
		$inspection->date_issued = $request->date_issued;
		$inspection->date_due = $request->date_due;
		$inspection->employee_id = auth()->user()->emp_id;
		$inspection->status = $request?->autoClose ? 3 : $request->status;
		$inspection->revision_no = 0;
		$inspection->is_deleted = 0;

		$inspection->save();
		$inspection_id = $inspection->inspection_id;

		$sectionE = $request->sectionE ? $request->sectionE : [];
		$sections_merged = array_merge($request->sectionA, $request->sectionB, $request->sectionC, $request->sectionC_B, $request->sectionD, $sectionE);

		$obs = [
			"total" => 0,
			"positive" => 0,
			"negative" => 0
		];

		foreach ($sections_merged as $section)
		{
			if ($section['score'] !== null)
			{
				if ($section["score"] !== "4")
				{
					$obs['total'] += 1;
				}
				if ($section["score"] === "1")
				{
					$obs['positive'] += 1;
				}
				else if ($section["score"] === "2" || $section["score"] === "3")
				{
					$obs['negative'] += 1;
				}
			}

			$report = InspectionReportList::create([
				"inspection_id" => $inspection_id,
				"employee_id" => auth()->user()->emp_id,
				"ref_num" => (int)$section["refNumber"],
				"section_title" => $section["title"],
				"ref_score" => (int)$section["score"],
				"findings" => $section["findings"],
				"date_submitted" => $request->date_issued,
				"is_deleted" => 0
			]);
			if ($section["photo_before"] !== null)
			{
				$report->addMedia($section["photo_before"])->toMediaCollection("before");
			}
		}

		// Notification
		$message = '<p>Total Observation: <strong>' . $obs['total'] . '</strong></p>';
		$message .= '<p>Positive Observation: <strong>' . $obs['positive'] . '</strong></p>';
		$message .= '<p>Negative Observation: <strong>' . $obs['negative'] . '</strong></p>';
		$message .= '<p>Due Date: <strong>' . Carbon::parse($request->date_due)->format('M j, Y') . '</strong></p>';
		$message .= '<p>CMS: <strong>' . $request->form_number . '</strong></p>';

		$toReviewer = User::where("emp_id", $request->reviewer_id)->first();
		if ($toReviewer)
		{
			Notification::send($toReviewer, new ModuleBasicNotification(
				title: 'set you as a reviewer',
				message: $message,
				category: 'Inspection',
				routeName: 'inspection.management.view',
				creator: $user,
				params: $inspection_id
			));
		}
		$toApprover = User::where("emp_id", $request->verifier_id)->first();
		if ($toApprover)
		{
			Notification::send($toApprover, new ModuleBasicNotification(
				title: 'set you as an approver',
				message: $message,
				category: 'Inspection',
				routeName: 'inspection.management.view',
				creator: $user,
				params: $inspection_id
			));
		}
	}

	public function getUnsatisfactoryItems(Inspection $inspection)
	{
		$inspection->load([
			"report_list" => function ($q) use ($inspection)
			{
				$q->select("list_id", "inspection_id", "ref_num", "ref_score", "photo_before", "findings", "photo_after", "action_taken", "employee_id", "date_submitted", "item_status");
				// if($inspection->status === 4) {
				// 	return $q->where("item_status", 2)->orderBy("ref_num");
				// }
				return $q->whereIn("ref_score", [2, 3])->orderBy("ref_num");
			}
		]);

		$inspection->report_list->transform(function ($item)
		{
			$before = $item->getFirstMedia("before");
			$after = $item->getFirstMedia("after");
			if ($before)
			{
				$item->photo_before = $before->getFullUrl();
			}
			if ($after)
			{
				$item->photo_after = $after->getFullUrl();
			}
			return $item;
		});
		return $inspection;
	}

	public static function getTableName($ref)
	{
		if ($ref <= 6) return "Offices/Welfare Facilities";
		if ($ref >= 7 && $ref <= 13) return "Monitoring/Control";
		if ($ref >= 14 && $ref <= 31) return "Site Operations";
		if ($ref >= 32 && $ref <= 34) return "Environmental";
		return "Others";
	}


	public function getAllInspections()
	{
		return Inspection::select("inspection_id", "tbl_inspection_reports.employee_id", "reviewer_id", "verifier_id", "accompanied_by", "form_number", "status", "revision_no", "location", "contract_no", "inspected_by", "inspected_date", "inspected_time", "avg_score", "date_issued", "date_due")
			->where("tbl_inspection_reports.is_deleted", 0)
			->rightJoin("tbl_employees", "tbl_employees.employee_id", "tbl_inspection_reports.employee_id")
			->with([
				"reviewer",
				"verifier",
				"report_list" => fn ($q) => $q->orderBy("ref_num")
			])
			->get()
			->reverse()
			->flatten()
			->transform(function ($inspection)
			{
				return [
					...$inspection->toArray(),
					"id" => $inspection->inspection_id,
					"reviewer" => trim($inspection?->reviewer?->fullName ?? ""),
					"verifier" => trim($inspection?->verifier?->fullName ?? ""),
					"status" => $this->getInspectionStatus($inspection->status),
					"type" => $this->getInspectionType($inspection->status),
					...$this->getObservation($inspection?->report_list ?? collect([])),
					"dueStatus" => $this->getDueDateStatus($inspection->date_due),
				];
			});
	}

	public function getObservation($reports)
	{
		return $reports->reduce(function ($acc, $curr)
		{
			if ($curr["ref_score"] !== 0 && $curr["ref_score"] !== 4 && $curr["ref_score"] !== null)
			{
				$acc["totalObservation"] += 1;
			}
			if ($curr["ref_score"] === 1)
			{
				$acc["positiveObservation"] += 1;
			}
			else if (($curr["ref_score"] === 2 || $curr["ref_score"] === 3) && $curr["item_status"] !== "2")
			{
				$acc["negativeObservation"] += 1;
			}
			return $acc;
		}, ["totalObservation" => 0, "positiveObservation" => 0, "negativeObservation" => 0]);
	}


	private function getInspectionType($status)
	{
		switch ($status)
		{
			case 1:
			case 0:
				return "submitted";
			case 2:
				return "verify";
			case 3:
				return "closeout";
			default:
				return "review";
		}
	}

	private function getInspectionStatus($status)
	{
		$result = [
			"code" => $status,
			"classType" => "default",
			"text" => "",
			"tooltip" => "",
		];
		switch ($status)
		{
			case 1:
			case 0:
				$result["classType"] = "warning";
				$result["text"] = "I P";
				$result["tooltip"] = "In Progress";
				break;
			case 2:
				$result["classType"] = "warning";
				$result["text"] = "W F C";
				$result["tooltip"] = "Waiting For Closure";
				break;
			case 3:
				$result["classType"] = "success";
				$result["text"] = "C";
				$result["tooltip"] = "Closed";
				break;
			default:
				$result["classType"] = "error";
				$result["text"] = "F R";
				$result["tooltip"] = "For Revision";
		}
		return $result;
	}

	public function getDueDateStatus($dueDate)
	{
		$date = Carbon::parse($dueDate);
		$diff = now()->diffInDays($date, false);

		if ($diff === 0)
		{
			return [
				"text" => "A.T.",
				"tooltip" => "Active Today",
				"classType" => "warning",
			];
		}

		return [
			"text" => $diff > 0 ? abs($diff) . " A.D." : abs($diff) . " O.D.",
			"tooltip" => $diff > 0 ? "Active " . $diff . " days" : "Overdue " . abs($diff),
			"classType" => $diff > 0 ? "success" : "error",
			"type" => $diff > 0 ? "A.D." : "O.D.",
		];
	}

	public function registeredPosition()
	{
		return InspectionRegisteredPosition::all();
	}

	public function employees($filterDate, $authorizedPositions)
	{
		return Employee::select(DB::raw("
		tbl_employees.user_id,
		tbl_employees.employee_id,
		tbl_employees.firstname,
		tbl_employees.middlename,
		tbl_employees.lastname,
		tbl_employees.email,
		tbl_employees.phone_no,
		tbl_employees.date_created,
		tbl_position.position,
		tbl_department.department,
		tbl_employees.is_deleted,
		tbl_employees.country"))
			->whereIn("tbl_employees.position", $authorizedPositions)	
			->where("tbl_employees.is_deleted", 0)
			->leftJoin("tbl_department", "tbl_employees.department", "tbl_department.department_id")
			->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->withCount(["inspections" => function($q) use($filterDate){
				if($filterDate) {
					$start = Carbon::parse($filterDate[0]);
					$end = Carbon::parse($filterDate[1]);
					$q->whereBetween("date_issued", [$start, $end]);
				}
					$q->where("is_deleted", 0);
			}])
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
	}


	public function getEmployees() {
		return Employee::select("employee_id", "tbl_employees.employee_id as emp_id", "firstname", "lastname", "tbl_position.position", "tbl_employees.user_id")
		->where([
		  ["tbl_employees.is_deleted", 0],
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
		$tracker = InspectionTracker::query()
		->select("inspection_trackers.*")
		->with("trackerEmployees")
		->orderBy("date_assigned", "desc")
		->get()
		->transform(function ($tracker) use($employees) {
			$this->trackDailyStatus = true;
			$employee = $employees->find($tracker->emp_id);
			if($employee) {
				$tracker->fullname = $employee->fullname;
				$tracker->img = $employee->img;
				$tracker->position = $employee->position;
			}
			$tracker->trackerEmployees->transform(function($trackerEmployee) use($employees, $tracker) {
				$date = Carbon::parse($tracker->date_assigned);
				$inspectedDate = $date->format("d-M-Y");
				$emp = $employees->find($trackerEmployee->emp_id);
				if(!$emp) {
					dd($trackerEmployee, $employees->toArray());
				}
				$trackerEmployee->fullname = $emp->fullname;
				$trackerEmployee->img = $emp->img;
				$trackerEmployee->position = $emp->position;
				$trackerEmployee->date_assigned = $tracker->date_assigned;
				$reviewer = $employees->find($trackerEmployee->action_id);
				if($reviewer) {
					$trackerEmployee->reviewer = [
						"fullname" => $reviewer->fullname,
						"img" => $reviewer->img,
						"position" => $reviewer->position,
					];
				}
				$verifier = $employees->find($trackerEmployee->verifier_id);
				if($verifier) {
					$trackerEmployee->verifier = [
						"fullname" => $verifier->fullname,
						"img" => $verifier->img,
						"position" => $verifier->position,
					];
				}
				$submittedInspection = Inspection::select("inspection_id")
				->where("employee_id", $trackerEmployee->emp_id)
				->where("reviewer_id", $trackerEmployee->action_id)
				->where("verifier_id", $trackerEmployee->verifier_id)
				->where("location", $trackerEmployee->location)
				->where("inspected_date", $inspectedDate)
				->first();

				$trackerEmployee->status = $submittedInspection !== null;

				if(!$trackerEmployee->status) {
					$this->trackDailyStatus = false;
					$trackerEmployee->link = null;
				} else {
					$trackerEmployee->link = URL::route("inspection.management.view", [$submittedInspection->inspection_id]);
				}

				return $trackerEmployee;
			});
			$tracker->status = $this->trackDailyStatus;
			$this->trackDailyStatus = false;
			return $tracker;
		});
		
		return [$employees, $tracker];
	}
	  
	public function tbtTrackerLatestSequenceNumber() {
		$sequence = InspectionTracker::withTrashed()->count() + 1;
		return str_pad($sequence, 6, '0', STR_PAD_LEFT);
	}
}
