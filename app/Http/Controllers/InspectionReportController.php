<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Models\User;
use App\Notifications\ModuleBasicNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

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


  public function review_update(Inspection $inspection, Request $request) {
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

			$user = auth()->user();
			$verifier = User::where("emp_id", $inspection->verifier_id)->first();
			if($verifier) {
				// Notification
				$message = '<p>CMS: <strong>'. $inspection->form_number .'</strong></p>';
				$message .= '<p>Due Date: <strong>'. Carbon::parse($inspection->date_due)->format('M j, Y') .'</strong></p>';

				Notification::send($verifier, new ModuleBasicNotification(
					title: 'finish taking action',
					message: $message,
					category: 'Inspection',
					routeName: 'inspection.management.view',
					creator: $user,
					params: $inspection->inspection_id,
					label: [
						'title' => 'Waiting For Closure',
						'color' => 'warning',
						'icon' => null
					]
				));
			}
		}

		$inspection->save();

		return redirect()->back()
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
	}


	public function verify_update(Inspection $inspection, Request $request) {
		$faileds = [];
		foreach ($request->reports as $report) {
			$inspection_report = InspectionReportList::find($report["list_id"]);
			if($inspection_report) {
				$inspection_report->item_status = $report["item_status"];
				if($report['item_status'] === "2") {
					$faileds[] = $report["ref_num"];
				}
				$inspection_report->save();
			}
		}
		if($request->fails) {
			$user = auth()->user();
			$toReviewer = User::where("emp_id", $inspection->reviewer_id)->first();
			if($toReviewer) {
				// Notification
				$message = '<p>CMS: <strong>'. $inspection->form_number .'</strong></p>';
				$message .= '<p>Ref #: <strong>'. implode(', ', $faileds) .'</strong></p>';
				$message .= '<p>Due Date: <strong>'. Carbon::parse($inspection->date_due)->format('M j, Y') .'</strong></p>';

				Notification::send($toReviewer, new ModuleBasicNotification(
					title: 'has requested revisions for the inspection',
					message: $message,
					category: 'Inspection',
					routeName: 'inspection.management.view',
					creator: $user,
					params: $inspection->inspection_id,
					label: [
						'title' => 'Action Failed',
						'color' => 'error',
						'icon' => null
					]
				));
			}
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