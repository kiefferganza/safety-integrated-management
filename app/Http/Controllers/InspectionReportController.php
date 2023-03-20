<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\InspectionReportList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InspectionReportController extends Controller
{

	public function update(Inspection $inspection,Request $request) {
		foreach ($request->reports as $report) {
			$inspectionReport = InspectionReportList::find($report["list_id"]);
			if($inspectionReport) {
				$inspectionReport->findings = $report["findings"];

				if($report["photo_before"]) {
					$inspectionReport->clearMediaCollection("before");
					$inspectionReport->addMedia($report["photo_before"])->toMediaCollection("before");
				}
				$inspectionReport->save();
			}
		}

		$inspection->increment('revision_no');
		$inspection->save();

		return redirect()->back()
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
		

	}


  public function review_update(Inspection $inspection,Request $request) {
		foreach ($request->reports as $report) {
			$inspectionReport = InspectionReportList::find($report["list_id"]);
			if($inspectionReport) {
				$inspectionReport->action_taken = $report["action_taken"];

				if($report["photo_after"]) {
					$inspectionReport->clearMediaCollection("after");
					$inspectionReport->addMedia($report["photo_after"])->toMediaCollection("after");
				}
				$inspectionReport->save();
			}
		}
		if($request->isCompleted && $request->isCompleted !== "0") {
			$inspection->status = 2;
		}

		$inspection->save();

		return redirect()->back()
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
		

	}


	public function verify_update(Inspection $inspection, Request $request) {
		foreach ($request->reports as $report) {
			$inspection_report = InspectionReportList::find($report["list_id"]);
			if($inspection_report) {
				$inspection_report->item_status = $report["item_status"];
				$inspection_report->save();
			}
		}
		
		if($request->fails) {
			$inspection->status = 4;
		}else {
			$inspection->status = 3;
		}

		$inspection->increment('revision_no');
		$inspection->save();

		return redirect()->route("inspection.management.list")
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
		

	}


}
