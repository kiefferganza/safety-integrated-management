<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Services\InspectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
class InspectionController extends Controller
{

	// public function move_files() { 
	// 	Inspection::where("is_deleted", 1)->delete();
	// 	InspectionReportList::where("is_deleted", 1)->delete();

	// 	$inspectionReport = InspectionReportList::select("list_id", "photo_after", "photo_before")->where('photo_after', '!=', null)->where('photo_before', '!=', null)->get();
	// 	$inspectionReport->map(function ($report) {
	// 		if(Storage::exists("public/media/inspection/".$report->photo_before)) {
	// 			$report->addMedia(Storage::path("public/media/inspection/".$report->photo_before))->toMediaCollection("before");
	// 		}
	// 		if(Storage::exists("public/media/inspection/".$report->photo_after)) {
	// 			$report->addMedia(Storage::path("public/media/inspection/".$report->photo_after))->toMediaCollection("after");
	// 		}
	// 		$report->update(["photo_before" => null, "photo_after" => null]);
	// 		return $report;
	// 	});
	// 	return count($inspectionReport);
	// }

	public function index()
	{
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
				$item->photo_before = $before->getFullUrl();
			}
			if($after) {
				$item->photo_after = $after->getFullUrl();
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



	public function reportList() {
		$inspections = InspectionReportList::select(
			"section_title",
			"table_name",
			"ref_num",
			"list_id",
			"tbl_inspection_reports.is_deleted",
			DB::raw("COUNT(CASE WHEN item_status='1' THEN 1 ELSE NULL END) as 'closed',
				COUNT(CASE WHEN ref_score>1 AND ref_score!=4 THEN 1 ELSE NULL END) as 'negative',
				COUNT(CASE WHEN ref_score=1 THEN 1 ELSE NULL END) as 'positive'"
			)
		)
		->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id")
		->where("item_status", "!=", NULL)
		->where("tbl_inspection_reports.is_deleted", 0)
		->where("ref_num", "<", 35)
		->groupBy("ref_num")
		->get()
		->toArray();
		$others = InspectionReportList::select(
			"section_title",
			"tbl_inspection_reports.is_deleted",
			"list_id",
			DB::raw("COUNT(CASE WHEN item_status='1' THEN 1 ELSE NULL END) as 'closed',
				COUNT(CASE WHEN ref_score>1 AND ref_score!=4 THEN 1 ELSE NULL END) as 'negative',
				COUNT(CASE WHEN ref_score=1 THEN 1 ELSE NULL END) as 'positive'"
			)
		)
		->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id")
		->where("item_status", "!=", NULL)
		->where("ref_num", ">", 35)
		->where("section_title", "!=", "")
		->where("section_title", "!=", NULL)
		->where("tbl_inspection_reports.is_deleted", 0)
		->groupBy("section_title")
		->get()
		->toArray();
		
		return Inertia::render("Dashboard/Management/Inspection/Report/index", [
			"inspectionReport" => array_merge($inspections, $others),
		]);
	}



}
