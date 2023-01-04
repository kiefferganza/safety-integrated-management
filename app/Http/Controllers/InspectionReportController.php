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
			$inspection_report = InspectionReportList::find($report["list_id"]);
			if($inspection_report) {
				$inspection_report->findings = $report["findings"];

				if($report["photo_before"]) {
					if(Storage::exists("public/media/inspection/" . $inspection_report->photo_before)) {
						Storage::delete("public/media/inspection/" . $inspection_report->photo_before);
					}

					$file = $report["photo_before"]->getClientOriginalName();
					$extension = pathinfo($file, PATHINFO_EXTENSION);
					$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
					$report["photo_before"]->storeAs('media/inspection', $file_name, 'public');
					$inspection_report->photo_before = $file_name;

				}
				$inspection_report->save();
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
			$inspection_report = InspectionReportList::find($report["list_id"]);
			if($inspection_report) {
				$inspection_report->action_taken = $report["action_taken"];

				if($report["photo_after"]) {
					if(Storage::exists("public/media/inspection/" . $inspection_report->photo_after)) {
						Storage::delete("public/media/inspection/" . $inspection_report->photo_after);
					}

					$file = $report["photo_after"]->getClientOriginalName();
					$extension = pathinfo($file, PATHINFO_EXTENSION);
					$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
					$report["photo_after"]->storeAs('media/inspection', $file_name, 'public');
					$inspection_report->photo_after = $file_name;

				}
				$inspection_report->save();
			}
		}
		if($request->isCompleted && $request->isCompleted !== "0") {
			$inspection->status = 2;
		}

		$inspection->increment('revision_no');
		$inspection->save();

		return redirect()->back()
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
		

	}


	public function verify_update(Inspection $inspection,Request $request) {
		foreach ($request->reports as $report) {
			$inspection_report = InspectionReportList::find($report["list_id"]);
			if($inspection_report) {
				$inspection_report->item_status = (int)$report["item_status"];
				$inspection_report->save();
			}
		}
		
		if(isset($request->fails)) {
			$inspection->status = 4;
		}

		$inspection->increment('revision_no');
		$inspection->save();

		return redirect()->back()
		->with("message", $inspection->form_number . " updated successfully!")
		->with("type", "success");
		

	}


}
