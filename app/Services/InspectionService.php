<?php

namespace App\Services;

use App\Models\Inspection;
use App\Models\InspectionReportList;
use Illuminate\Http\Request;

class InspectionService {

	public function insertInspection(Request $request){
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
			"verifier_id" => ["string", "required"]
		]);
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
		$inspection->status = $request->status;
		$inspection->revision_no = 0;
		$inspection->is_deleted = 0;
		
		$inspection->save();
		$inspection_id = $inspection->inspection_id;

		$sections_merged = array_merge($request->sectionA, $request->sectionB, $request->sectionC, $request->sectionC_B, $request->sectionD, $request->sectionE);

		foreach ($sections_merged as $section) {
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
			if($section["photo_before"] !== null) {
				$report->addMedia($section["photo_before"])->toMediaCollection("before");
			}
		}
	}

	public function getUnsatisfactoryItems(Inspection $inspection) {
		$inspection->load([
			"report_list" => function($q) use ($inspection) {
				$q->select("list_id", "inspection_id", "ref_num", "ref_score", "photo_before", "findings", "photo_after", "action_taken", "employee_id", "date_submitted", "item_status");
				// if($inspection->status === 4) {
				// 	return $q->where("item_status", 2)->orderBy("ref_num");
				// }
				return $q->whereIn("ref_score", [2,3])->orderBy("ref_num");
			}
		]);
		
		$inspection->report_list->transform(function ($item) {
			$before = $item->getFirstMedia("before");
			$after = $item->getFirstMedia("after");
			if($before) {
				$item->photo_before = $before->getUrl();
			}
			if($after) {
				$item->photo_after = $after->getUrl();
			}
			return $item;
		});
		return $inspection;
	}

}