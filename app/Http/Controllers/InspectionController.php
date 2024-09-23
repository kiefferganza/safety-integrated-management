<?php

namespace App\Http\Controllers;

use App\Models\DocumentProjectDetail;
use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionRegisteredPosition;
use App\Models\InspectionReportList;
use App\Services\InspectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
class InspectionController extends Controller
{

	public function checkAuthorizedPersonel() {
		$user = auth()->user();
		if($user->user_type !== 0) {
			$registeredPositions = InspectionRegisteredPosition::where("position_id", $user->employee->position)->first();
			if(!$registeredPositions) {
				abort(403);
			}
		}
	}

	public function index()
	{
		return Inertia::render("Dashboard/Management/Inspection/List/index");
	}


	public function create() {
		$this->checkAuthorizedPersonel();
		$sequence = Inspection::where('is_deleted', 0)->count() + 1;
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Inspection/Create/index", [
			"personel" =>  Employee::select("employee_id", "firstname", "lastname", "user_id")->where([
				["is_deleted", 0],
				["is_active", 0]
			])->get(),
			"sequence_no" => str_pad($sequence, 6, '0', STR_PAD_LEFT),
			"projectDetails" => $projectDetails
		]);
	}


	public function store(Request $request) {
		$this->checkAuthorizedPersonel();
		(new InspectionService())->insertInspection($request);

		return redirect()->route('inspection.management.list')
		->with("message", "Inspection added successfully!")
		->with("type", "success");

	}


	public function edit(Inspection $inspection) {

		if($inspection->employee_id !== auth()->user()->emp_id) {
			if(Gate::denies('inspection_edit')) {
				abort(403);
			}
		}

		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Inspection/Edit/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection),
			"projectDetails" => $projectDetails
		]);
	}


	public function view(Inspection $inspection) {
		$inspection->load("report_list")
		->only(["inspection_id", "form_number", "report_list", "revision_no", "location", "date_issued"]);
		$inspection->report_list->transform(function ($item) {
			$before = $item->getFirstMedia("before");
			$after = $item->getFirstMedia("after");
			if($before) {
				$item->photo_before = $before->hasGeneratedConversion("small") ? $before->getUrl("small") : $before->getUrl();
			}
			if($after) {
				$item->photo_after = $after->hasGeneratedConversion("small") ? $after->getUrl("small") : $after->getUrl();
			}
			return $item;
		});

		$inspectionFirstUpload = Inspection::
			select("date_issued")
			->where([
				"is_deleted" => 0
			])
			->orderBy('date_issued')
			->first();
		
		if($inspectionFirstUpload) {
			$rolloutDate = $inspectionFirstUpload->date_issued;
		}else {
			$rolloutDate = $inspection->date_issued;
		}

		return Inertia::render("Dashboard/Management/Inspection/Details/index", [
			"inspection" =>  $inspection,
			"rolloutDate" => $rolloutDate
		]);
	}


	public function review(Inspection $inspection) {
		if($inspection->reviewer_id !== auth()->user()->emp_id) {
			return redirect()->back();
		}

		$inspectionFirstUpload = Inspection::
			select("date_issued")
			->where([
				"is_deleted" => 0
			])
			->orderBy('date_issued')
			->first();
		
		if($inspectionFirstUpload) {
			$rolloutDate = $inspectionFirstUpload->date_issued;
		}else {
			$rolloutDate = $inspection->date_issued;
		}

		return Inertia::render("Dashboard/Management/Inspection/Review/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection),
			"rolloutDate" => $rolloutDate
		]);
	}


	public function verify(Inspection $inspection) {
		if($inspection->verifier_id !== auth()->user()->emp_id) {
			return redirect()->back();
		}

				$inspectionFirstUpload = Inspection::
			select("date_issued")
			->where([
				"is_deleted" => 0
			])
			->orderBy('date_issued')
			->first();
		
		if($inspectionFirstUpload) {
			$rolloutDate = $inspectionFirstUpload->date_issued;
		}else {
			$rolloutDate = $inspection->date_issued;
		}

		return Inertia::render("Dashboard/Management/Inspection/Verify/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection),
			"rolloutDate" => $rolloutDate
		]);
	}


	public function delete(Request $request) {
		if(isset($request->ids)) {
			// $inspections = Inspection::whereIn("inspection_id", $request->ids)->get();
			// $inspections->each(function ($item) {
			// 	$item->report_list()->each->delete();
			// });
			Inspection::whereIn("inspection_id", $request->ids)->update(['is_deleted' => 1]);
		}

		return redirect()->back()
		->with("message",	"Item deleted successfully!")
		->with("type", "success");
	}



	public function reportList(Request $request) {
		$q = InspectionReportList::
		select("list_id", "ref_num", "table_name", "tbl_inspection_reports_list.inspection_id", "ref_score", "section_title", "tbl_inspection_reports.status", "tbl_inspection_reports.date_issued")
		->where("ref_score", "!=", 4)
		->where("section_title", "!=", null)
		->where("tbl_inspection_reports.is_deleted", 0)
		->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id");
		
		if($request->from && $request->to) {
			$q->whereBetween("tbl_inspection_reports.date_issued", [$request->from, $request->to]);
		}

		$inspections = $q
		->orderBy("ref_num")
		->get()
		->reduce(function ($arr, $item){
			$ref = $item->ref_num;
			$title = $item->section_title;
			$score = $item->ref_score;
			if($title) {
				$tableName = InspectionService::getTableName($ref);
				$arr[$title] ??= [
					"negative" => 0,
					"inprogress" => 0,
					"closed" => 0,
					"positive" => 0,
					"title" => $title,
					"id" => $ref,
					"table" => $tableName
				];
				if($item->status === 3) {
					$arr[$title]["closed"] += 1;
					$arr[$title]["negative"] += 1;
				}else {
					if($score === 1) {
						$arr[$title]["positive"] += 1;
					}else {
						$arr[$title]["inprogress"] += 1;
					}
				}
			}
			return $arr;
		}, []);
		
		return Inertia::render("Dashboard/Management/Inspection/Report/index", [
			"inspectionReport" => $inspections,
			"from" => $request->from,
			"to" => $request->to
		]);
	}



	public function updateDetails(Request $request, Inspection $inspection) {
		$request->validate([
			"contract_no" => ["string", "required"],
			"project_code" => ["string", "required"],
			"form_number" => ["string", "required"],
			"location" => ["string", "required"],
			"inspected_date" => ["string", "required"],
			"inspected_time" => ["string", "required"],
			"accompanied_by" => ["string", "required"],
		]);

		$inspection->contract_no = $request->contract_no;
		$inspection->project_code = $request->project_code;
		$inspection->form_number = $request->form_number;
		$inspection->location = $request->location;
		$inspection->inspected_date = $request->inspected_date;
		$inspection->inspected_time = $request->inspected_time;
		$inspection->accompanied_by = $request->accompanied_by;
		$inspection->save();
		
		return redirect()->back()
		->with('type', 'success')
		->with('message', 'Inspection updated successfully');
	}


	public function inspection_list_pdf_post(Request $request)
	{
		if(!$request->inspections && empty($request->all())) {
			abort(404);
			Cache::forget("inspection_pdf");
		}

		Cache::put("inspection_pdf", $request->all());

		return redirect()->route("inspection.management.pdfListGet");
	}

	public function inspection_list_pdf_get()
	{
		
		$inspectionsCached = Cache::get("inspection_pdf");
		if(!$inspectionsCached) {
			abort(404);
		}

		$inspections = [];

		foreach ($inspectionsCached['inspections'] as $inspection) {
			$inspection_report = $inspection["report_list"];
			$inspection["report_list"] = [
				"observation" => [],
				"result" => [],
				"titles" => []
			];
			foreach ($inspection_report as $report) {
				$inspection["report_list"]["titles"][] = $report["section_title"];
				$inspection["report_list"]["observation"][] = $report["findings"];
				$inspection["report_list"]["result"][] = $report["action_taken"];
			}
			$inspections[] = $inspection;
		}


		return Inertia::render("Dashboard/Management/Inspection/List/PDF/index", [
			"inspections" => $inspections,
			"info" => $inspectionsCached["info"]
		]);
	}


	// INSPECTOR
	public function emplooyes() {
		$authorizedPositions = InspectionRegisteredPosition::all()->toArray();
		return Inertia::render("Dashboard/Management/Inspection/Inspector/Employees/index", compact("authorizedPositions"));
	}

	public function authorizedPositionList() {
		$positions = InspectionRegisteredPosition::all()->toArray();
		return Inertia::render("Dashboard/Management/Inspection/Inspector/AuthorizedPositions/index", [
			"positions" => $positions
		]);
	}


	public function addPosition(Request $request) {
		$request->validate([
			"positions" => ["required", "array", "min:1"],
			"positions.*.position" => ["required", "string"],
			"positions.*.position_id" => ["required", "numeric"],
		]);

		InspectionRegisteredPosition::truncate();
		InspectionRegisteredPosition::insert($request->positions);
		
		return redirect()->back()
		->with("message", "Position ". $request->position ." added successfully!")
		->with("type", "success");
	}


	public function deletePosition(Request $request) {
		if(isset($request->ids)) {
			InspectionRegisteredPosition::whereIn("id", $request->ids)->update(['deleted_at' => now()]);
		}

		return redirect()->back()
		->with("message",	"Item deleted successfully!")
		->with("type", "success");
	}


}