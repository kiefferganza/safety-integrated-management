<?php

namespace App\Services;

use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Models\User;
use App\Notifications\ModuleBasicNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class InspectionService {

	public function insertInspection(Request $request){
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
			"verifier_id" => ["string", "required"]
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
		$inspection->status = $request->status;
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
		
		foreach ($sections_merged as $section) {
			if($section['score'] !== null) {
				if($section["score"] !== "4") {
					$obs['total'] += 1;
				}
				if($section["score"] === "1") {
					$obs['positive'] += 1;
				}else if($section["score"] === "2" || $section["score"] === "3") {
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
			if($section["photo_before"] !== null) {
				$report->addMedia($section["photo_before"])->toMediaCollection("before");
			}
		}

		// Notification
		$message = '<p>Total Observation: <strong>'. $obs['total'] .'</strong></p>';
		$message .= '<p>Positive Observation: <strong>'. $obs['positive'] .'</strong></p>';
		$message .= '<p>Negative Observation: <strong>'. $obs['negative'] .'</strong></p>';
		$message .= '<p>Due Date: <strong>'. Carbon::parse($request->date_due)->format('M j, Y') .'</strong></p>';
		$message .= '<p>CMS: <strong>'. $request->form_number .'</strong></p>';

		$toReviewer = User::where("emp_id", $request->reviewer_id)->first();
		if($toReviewer) {
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
		if($toApprover) {
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
				$item->photo_before = $before->getFullUrl();
			}
			if($after) {
				$item->photo_after = $after->getFullUrl();
			}
			return $item;
		});
		return $inspection;
	}

	public static function getTableName($ref) {
		if($ref <= 6) return "Offices/Welfare Facilities";
		if($ref >= 7 && $ref <= 13) return "Monitoring/Control";
		if($ref >= 14 && $ref <= 31) return "Site Operations";
		if($ref >= 32 && $ref <= 34) return "Environmental";
		return "Others";
	}

}