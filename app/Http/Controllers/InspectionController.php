<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InspectionController extends Controller
{

	public function index()
	{
		// $user = Auth::user();

		// $emp_id = $user->user_id;

		$inspections =	Inspection::select("inspection_id","employee_id", "reviewer_id", "verifier_id","accompanied_by", "date_issued", "form_number", "status", "revision_no", "location", "contract_no", "inspected_by", "inspected_date","inspected_time", "avg_score", "date_issued","date_due")
		->where("is_deleted", 0)
		// ->whereRaw("(employee_id = ? AND is_deleted = 0) OR (reviewer_id = ? AND status = 1 AND is_deleted = 0) OR (verifier_id = ? AND status = 2 AND is_deleted = 0) OR (status != 0 AND is_deleted = 0)", array($emp_id, $emp_id, $emp_id))
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
		$user = Auth::user();

		$count_inspections = Inspection::where('is_deleted', 0)->count();

		$number_of_items =  $count_inspections + 1;
		$number_of_digits = strlen((string) $number_of_items);
		$number_of_zeroes =  5 - $number_of_digits;

		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++) {
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}

		return Inertia::render("Dashboard/Management/Inspection/Create/index", [
			"personel" =>  Employee::select("employee_id", "firstname", "lastname", "user_id")->where([
				["is_deleted", 0],
				["employee_id", "!=", $user->emp_id]
			])->get(),
			"sequence_no" => $sequence_no_zeros . $number_of_items,
		]);
	}


	public function store(Request $request) {
		$user = Auth::user();

		$inspection = new Inspection;
		$inspection->project_code = $request->project_code;
		$inspection->sequence_no = $request->sequence_no;
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
		$inspection->employee_id = $user->emp_id;
		$inspection->status = $request->status;
		$inspection->revision_no = 0;
		$inspection->is_deleted = 0;
		
		$inspection->save();
		$inspection_id = $inspection->inspection_id;

		$sections_merged = array_merge($request->sectionA, $request->sectionB, $request->sectionC, $request->sectionC_B, $request->sectionD, $request->sectionE);

		$sections = array();

		foreach ($sections_merged as $section) {
			$photo_before = null;
			if($section["photo_before"] !== null) {
				$file = $section["photo_before"]->getClientOriginalName();
				$extension = pathinfo($file, PATHINFO_EXTENSION);
				$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
				$section["photo_before"]->storeAs('media/inspection', $file_name, 'public');
				$photo_before = $file_name;
			}
			$sections[] = [
				"inspection_id" => $inspection_id,
				"employee_id" => $user->emp_id,
				"ref_num" => (int)$section["refNumber"],
				"section_title" => $section["title"],
				"ref_score" => (int)$section["score"],
				"photo_before" => $photo_before,
				"findings" => $section["findings"],
				"date_submitted" => $request->date_issued,
				"is_deleted" => 0
			];
		}

		InspectionReportList::insert($sections);

		return redirect()->route('inspection.management.list')
		->with("message", "Inspection added successfully!")
		->with("type", "success");

	}


	public function edit(Inspection $inspection) {
		$user = Auth::user();
		
		if($inspection->employee_id !== $user->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Edit/index", [
			"inspection" => $inspection->load([
				"report_list" => fn($q) => $q->select("list_id", "inspection_id", "ref_num", "ref_score", "photo_before", "findings", "photo_after", "action_taken", "employee_id", "date_submitted", "item_status")->whereIn("ref_score", [2,3])->orderBy("ref_num")
			]),
		]);
	}


	public function review(Inspection $inspection) {
		$user = Auth::user();
		
		if($inspection->reviewer_id !== $user->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Review/index", [
			"inspection" => $inspection->load([
				"report_list" => function($q) use ($inspection) {
					$q->select("list_id", "inspection_id", "ref_num", "ref_score", "photo_before", "findings", "photo_after", "action_taken", "employee_id", "date_submitted", "item_status");
					if($inspection->status === 4) {
						return $q->where("item_status", 2)->orderBy("ref_num");
					}
					return $q->whereIn("ref_score", [2,3])->orderBy("ref_num");
				}
			]),
		]);
	}


	public function verify(Inspection $inspection) {
		$user = Auth::user();
		
		if($inspection->verifier_id !== $user->emp_id) {
			return redirect()->back();
		}

		return Inertia::render("Dashboard/Management/Inspection/Verify/index", [
			"inspection" => $inspection->load([
				"report_list" => fn($q) => $q->select("list_id", "inspection_id", "ref_num", "ref_score", "photo_before", "findings", "photo_after", "action_taken", "employee_id", "date_submitted", "item_status")->whereIn("ref_score", [2,3])->orderBy("ref_num")
			]),
		]);
	}


	public function findings(Inspection $inspection) {
		return Inertia::render("Dashboard/Management/Inspection/Details/index", [
			"inspection" => $inspection->load(["report_list" => fn($q) => $q->where("ref_score",  2)->orWhere("ref_score",  3)])
				->only(["inspection_id", "form_number", "report_list", "revision_no", "location", "date_issued"])
		]);
	}



	public function delete(Request $request) {
		if(isset($request->ids)) {
			Inspection::whereIn("inspection_id", $request->ids)->update(["is_deleted" => 1]);
		}

		return redirect()->back()
		->with("message",	"Item deleted successfully!")
		->with("type", "success");
	}



	public function reportList() {
		dd(InspectionReportList::select("date_submitted")->where("item_status", NULL)->orderByDesc("list_id")->limit(30)->get());
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
