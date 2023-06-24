<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Services\InspectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class InspectionController extends Controller
{

	// public function move_files() { 
	// 	// Inspection::where("is_deleted", 1)->delete();
	// 	// InspectionReportList::where("is_deleted", 1)->delete();

	// 	$inspectionReport = InspectionReportList::select("list_id", "photo_after", "photo_before")->where('photo_after', '!=', null)->orWhere('photo_before', '!=', null)->get();
	// 	$inspectionReport->map(function ($report) {
	// 		if($report->photo_before) {
	// 			if(Storage::exists("public/media/inspection/".$report->photo_before)) {
	// 				$report->addMedia(Storage::path("public/media/inspection/".$report->photo_before))->toMediaCollection("before");
	// 			}
	// 		}
	// 		if($report->photo_after) {
	// 			if(Storage::exists("public/media/inspection/".$report->photo_after)) {
	// 				$report->addMedia(Storage::path("public/media/inspection/".$report->photo_after))->toMediaCollection("after");
	// 			}
	// 		}
	// 		$report->update(["photo_before" => null, "photo_after" => null]);
	// 		return $report;
	// 	});
	// 	return count($inspectionReport);
	// }

	public function index()
	{
		// $insReport = InspectionReportList::whereHas('media')->get();
		// dd($insReport);
		$inspections =	Inspection::select("inspection_id","employee_id", "reviewer_id", "verifier_id","accompanied_by", "form_number", "status", "revision_no", "location", "contract_no", "inspected_by", "inspected_date","inspected_time", "avg_score", "date_issued","date_due")
		->where("is_deleted", 0)
		->with([
			"reviewer",
			"verifier",
			"report_list" => fn($q) => $q->orderBy("ref_num")
		])
		->get();

		return Inertia::render("Dashboard/Management/Inspection/List/index", [
			"inspections" => $inspections,
		]);
	}


	public function create() {
		$sequence = Inspection::where('is_deleted', 0)->count() + 1;

		return Inertia::render("Dashboard/Management/Inspection/Create/index", [
			"personel" =>  Employee::select("employee_id", "firstname", "lastname", "user_id")->where([
				["is_deleted", 0],
				["is_active", 0],
				["employee_id", "!=", auth()->user()->emp_id]
			])->get(),
			"sequence_no" => str_pad($sequence, 6, '0', STR_PAD_LEFT),
		]);
	}


	public function store(Request $request) {
		(new InspectionService())->insertInspection($request);

		return redirect()->route('inspection.management.list')
		->with("message", "Inspection added successfully!")
		->with("type", "success");

	}


	public function edit(Inspection $inspection) {
		if($inspection->employee_id !== auth()->user()->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Edit/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection)
		]);
	}


	public function view(Inspection $inspection) {
		$inspection->load("report_list")
		->only(["inspection_id", "form_number", "report_list", "revision_no", "location", "date_issued"]);
		$inspection->report_list->transform(function ($item) {
			$before = $item->getFirstMedia("before");
			$after = $item->getFirstMedia("after");
			if($before) {
				$item->photo_before = $item->getFirstMediaUrl("before", "small");
			}
			if($after) {
				$item->photo_after = $item->getFirstMediaUrl("after", "small");
			}
			return $item;
		});
		return Inertia::render("Dashboard/Management/Inspection/Details/index", [
			"inspection" =>  $inspection
		]);
	}


	public function review(Inspection $inspection) {
		if($inspection->reviewer_id !== auth()->user()->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Review/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection),
		]);
	}


	public function verify(Inspection $inspection) {
		if($inspection->verifier_id !== auth()->user()->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Verify/index", [
			"inspection" => (New InspectionService)->getUnsatisfactoryItems($inspection)
		]);
	}


	public function delete(Request $request) {
		if(isset($request->ids)) {
			// $inspections = Inspection::whereIn("inspection_id", $request->ids)->get();
			// $inspections->each(function ($item) {
			// 	$item->report_list()->each->delete();
			// });
			Inspection::whereIn("inspection_id", $request->ids)->delete();
		}

		return redirect()->back()
		->with("message",	"Item deleted successfully!")
		->with("type", "success");
	}



	public function reportList(Request $request) {
		// dump($request->from, $request->to);
		$from = "2023-04-01";
		$to = "2023-04-30";
		$q = InspectionReportList::
		select("list_id", "ref_num", "table_name", "tbl_inspection_reports_list.inspection_id", "ref_score", "section_title", "tbl_inspection_reports.status", "tbl_inspection_reports.date_issued")
		->where("ref_score", "!=", 4)
		->where("section_title", "!=", null)
		->where("tbl_inspection_reports.is_deleted", 0)
		->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id");
		
		// $q->whereBetween("tbl_inspection_reports.date_issued", [$from, $to]);
		if($request->from && $request->to) {
			$q->whereBetween("tbl_inspection_reports.date_issued", [$request->from, $request->to]);
		}

		// dd($q->orderBy("ref_num")
		// ->limit(40)
		// ->get());

		$inspections = $q
		->orderBy("ref_num")
		->get()
		->reduce(function ($arr, $item){
			$ref = $item->ref_num;
			$title = $item->section_title;
			$score = $item->ref_score;
			// && $item->status !== null
			if($title) {
				$tableName = InspectionService::getTableName($ref);
				$arr[$title] ??= [
					"negative" => 0,
					"closed" => 0,
					"positive" => 0,
					"title" => $title,
					"id" => $ref,
					"table" => $tableName
				];
				if($item->status === 3) {
					$arr[$title]["closed"] += 1;
				}else {
					if($score === 1) {
						$arr[$title]["positive"] += 1;
					}else {
						// $arr[$title]["ins_id"] ??= [$item->inspection_id];
						// $arr[$title]["ins_id"][] = $item->inspection_id;
						$arr[$title]["negative"] += 1;
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



}