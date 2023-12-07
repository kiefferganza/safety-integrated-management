<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\InventoryReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Inventory;
use App\Models\InventoryBound;
use App\Models\InventoryReportComments;
use App\Services\ProjectDetailService;
use Illuminate\Support\Facades\DB;

class InventoryReportController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$user = auth()->user();
		$inventories = Inventory::select(
			"inventory_id",
			"item",
			"min_qty",
			"slug",
			"date_created",
			"date_updated",
			"current_stock_qty",
			"try",
			"item_price",
			"item_currency",
			"img_src"
		)->where("is_removed", 0)->get();

		$inventories->transform(function($inventory) {
			$bounds = InventoryBound::select(DB::raw("SUM(qty) as totalQty, type"))->where("inventory_id", $inventory->inventory_id)->groupBy("type")->get();
			foreach ($bounds as $bound) {
				$propertyBound = $bound->type . "TotalQty";
				$inventory->$propertyBound = (int)$bound->totalQty;
			}
			return $inventory;
		});

		$latestReport = InventoryReport::select("sequence_no")->latest()->first();
		$submittedDates = InventoryReport::select("submitted_date")->get()->pluck("submitted_date");
		$sequence = $latestReport ? (int)ltrim($latestReport->sequence_no) + 1 : 1;

		return Inertia::render("Dashboard/Management/PPE/Report/index", [
			"inventories" => $inventories,
			"submittedDates" => $submittedDates,
			"sequence_no" => str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT),
			"employees" => Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("is_active", 0)
				->where("sub_id", $user->subscriber_id)
				->where("user_id", "!=", null)
				->where("user_id", "!=", $user->user_id)
				->get(),
			"projectDetails" => ProjectDetailService::getProjectDetails($user)
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		$request->validate([
			'originator' => 'string|required',
			'project_code' => 'string|required',
			'discipline' => 'string|required',
			'document_type' => 'string|required',
			'approval_id' => 'integer|required',
			'reviewer_id' => 'integer|required',
			'location' => 'string|required',
			'contract_no' => 'string|required',
			'conducted_by' => 'string|required',
			'budget_forcast_date' => 'date|required',
			'inventory_start_date' => 'date|required',
			'inventory_end_date' => 'date|required',
			'submitted_date' => 'date|required',
			'inventories' => 'array|required|min:1',
		]);

		$inventoryReport = new InventoryReport;
		$inventoryReport->originator = $request->originator;
		$inventoryReport->project_code = $request->project_code;
		$inventoryReport->discipline = $request->discipline;
		$inventoryReport->document_type = $request->document_type;
		$inventoryReport->document_zone = $request->document_zone;
		$inventoryReport->document_level = $request->document_level;

		$inventoryReport->submitted_id = auth()->user()->emp_id;
		$inventoryReport->approval_id = $request->approval_id;
		$inventoryReport->reviewer_id = $request->reviewer_id;
		$inventoryReport->location = $request->location;
		$inventoryReport->contract_no = $request->contract_no;
		$inventoryReport->conducted_by = $request->conducted_by;
		$inventoryReport->budget_forcast_date = $request->budget_forcast_date;
		$inventoryReport->inventory_start_date = $request->inventory_start_date;
		$inventoryReport->inventory_end_date = $request->inventory_end_date;
		$inventoryReport->submitted_date = $request->submitted_date;
		$inventoryReport->remarks = $request->remarks;

		$inventoryReport->save();

		$inventories = [];
		foreach ($request->inventories as $inventory) {
			$inventories[] = array(
				"inventory_id" => $inventory["inventory_id"],
				"item" => $inventory["item"],
				"img_src" => $inventory["img_src"],
				"qty" => $inventory["current_stock_qty"],
				"level" => $inventory["min_qty"],
				"try" => $inventory["try"],
				"price" => $inventory["item_price"],
				"currency" => $inventory["item_currency"],
				"inbound_total_qty" => $inventory["inboundTotalQty"] ?? 0,
				"outbound_total_qty" => $inventory["outboundTotalQty"] ?? 0,
				"max_order" => $inventory["maxOrder"] ?? 0,
				"min_order" => $inventory["minOrder"] ?? 0,
				"status" => $inventory["status"],
			);
		}
		$inventoryReport->inventories()->createMany($inventories);

		return redirect()->back()
		->with("message", "Report saved successfully!")
		->with("type", "success");
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  \App\Models\InventoryReport  $inventoryReport
	 * @return \Illuminate\Http\Response
	 */
	public function edit(InventoryReport $inventoryReport)
	{
    
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \App\Models\InventoryReport  $inventoryReport
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, InventoryReport $inventoryReport)
	{
    $validated = $request->validate([
			'originator' => 'string|required',
			'project_code' => 'string|required',
			'discipline' => 'string|required',
			'document_type' => 'string|required',
      'document_zone' => ['string', 'nullable'],
      'document_level' => ['string', 'nullable'],
			'location' => 'string|required',
			'contract_no' => 'string|required',
			'budget_forcast_date' => 'date|required',
			'inventory_start_date' => 'date|required',
			'inventory_end_date' => 'date|required',
			'submitted_date' => 'date|required',
		]);
    
    $updated = $inventoryReport->update($validated);

    if(!$updated) {
      return redirect()->back()
      ->with("message", "Something went wrong updating " . $inventoryReport->form_number  ."!")
      ->with("type", "error");
    }
    
    return redirect()->back()
		->with("message", "Report" . $inventoryReport->form_number  ." updated successfully!")
		->with("type", "success");
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  \App\Models\InventoryReport  $inventoryReport
	 * @return \Illuminate\Http\Response
	 */
	public function destroy(InventoryReport $inventoryReport)
	{
		$inventoryReport->delete();
		
		return redirect()->back()
		->with("message", "Report deleted successfully!")
		->with("type", "success");
	}


	public function show(InventoryReport $inventoryReport) {
		$inventoryReport->load([
			"comments",
			"inventories",
			"submitted" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"reviewer" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"approval" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		]);
		if($inventoryReport->hasMedia('actions')) {
			$currentFile = $inventoryReport->getMedia('actions')->last();
			$inventoryReport->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($inventoryReport->media);
		}
		
		return Inertia::render("Dashboard/Management/PPE/ReportDetail/index", [
			"report" => $inventoryReport
		]);
	}


	public function reportList() {
    $user = auth()->user();
		$inventoryReports = InventoryReport::with([
			"comments",
			"inventories",
			"submitted" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"reviewer" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"approval" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		])->get();

		foreach ($inventoryReports as $report) {
			/** @var InventoryReport $report */
			if($report->hasMedia('actions')) {
				$reviewerLastFile = $report->getFirstMedia('actions', ['type' => 'review']);
				$approverLastFile = $report->getFirstMedia('actions', ['type' => 'approval']);
				if($reviewerLastFile) {
					$report->reviewerLatestFile = [
						'name' => $reviewerLastFile->name,
						'fileName' => $reviewerLastFile->file_name,
						'url' => $reviewerLastFile->originalUrl
					];
				}
				if($approverLastFile) {
					$report->approverLatestFile = [
						'name' => $approverLastFile->name,
						'fileName' => $approverLastFile->file_name,
						'url' => $approverLastFile->originalUrl
					];
				}

			}
		}
		$submittedDates = InventoryReport::select("submitted_date")->get()->pluck("submitted_date");
		
		return Inertia::render("Dashboard/Management/PPE/ReportList/index", [
      "submittedDates" => $submittedDates,
			"inventoryReports" => $inventoryReports,
      "projectDetails" => ProjectDetailService::getProjectDetails($user)
		]);
	}



	public function postComment(Request $request, InventoryReport $inventoryReport) {
		$request->validate([
			"comment" => ["string", "max:255", "required"],
			"pages" => ["string", "required"],
			"comment_code" => ["integer", "max:2", "required"],
			"status" => ["string", "required"]
		]);
		if($inventoryReport->status === 'for_approval' && $request->comment_code == '1') {
			$inventoryReport->status = 'for_review';
			$inventoryReport->reviewer_status = 'C';
			$inventoryReport->save();
		}
		$inventoryReport->comments()->create([
			"inventory_report_id" => $inventoryReport->id,
			"reviewer_id" => auth()->user()->emp_id,
			"comment" => $request->comment,
			"comment_page_section" => $request->pages,
			"comment_code" => $request->comment_code,
			"status" => $request->status
		]);

		return redirect()->back()
		->with("message", "Comment posted successfully!")
		->with("type", "success");
	}

	public function destroyComment(InventoryReportComments $reportComment) {
		if($reportComment->reviewer_id !== auth()->user()->emp_id) {
			abort(403);
		}

		$reportComment->delete();

		return redirect()->back()
		->with("message", "Comment deleted successfully!")
		->with("type", "success");
	}

	public function replyComment(Request $request, InventoryReportComments $reportComment) {
		$request->validate([
			"reply" => ["string", "max:255", "required"],
			"reply_code" => ["string", "max:2", "required"],
		]);
		
		$reportComment->reply = $request->reply;
		$reportComment->reply_code = $request->reply_code;
		$reportComment->save();

		return redirect()->back()
		->with("message", "Reply posted successfully!")
		->with("type", "success");
	}


	public function changeCommentStatus(Request $request, InventoryReportComments $reportComment) {
		$request->validate([
			"status" => ["string", "required"],
		]);
		$reportComment->status = $request->status;
		$reportComment->save();

		return redirect()->back()
		->with("message", "Comment ". $request->status ." successfully!")
		->with("type", "success");
	}


	public function approveReview(Request $request, InventoryReport $inventoryReport) {
		$request->validate([
			"status" => ["string", "required"],
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", "required"]
		]);
		
		switch ($request->type) {
			case 'review':
				if($request->remarks) {
					$inventoryReport->reviewer_remarks = $request->remarks;
				}
				$inventoryReport->reviewer_status = $request->status;
				$inventoryReport->status = "for_approval";
				break;
			case 'approval':
				if($request->remarks) {
					$inventoryReport->approval_remarks = $request->remarks;
				}
				$inventoryReport->approval_status = $request->status;
				$inventoryReport->status = "closed";
				break;
		}

		$inventoryReport
		->addMediaFromRequest('file')
		->withCustomProperties([
			'type' => $request->type
		])
		->toMediaCollection('actions');

		$inventoryReport->increment('revision_no');
		$inventoryReport->save();

		return redirect()->back()
		->with("message", "Status updated successfully!")
		->with("type", "success");
	}


	public function reuploadActionFile(Request $request, InventoryReport $inventoryReport) {
		$request->validate([
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", "required"],
			"remarks" => ["string"]
		]);

		if($inventoryReport->hasMedia('actions', ['type' => $request->type])) {
			$media = $inventoryReport->getFirstMedia('actions', ['type' => $request->type]);
			$inventoryReport->deleteMedia($media);
		}
		switch ($request->type) {
			case 'review':
				$inventoryReport->reviewer_remarks = $request->remarks ?? "";
				break;
			case 'approval':
				$inventoryReport->approval_remarks = $request->remarks ?? "";
				break;
		}
		$inventoryReport->save();
		$inventoryReport
		->addMediaFromRequest('file')
		->withCustomProperties([
			'type' => $request->type
		])
		->toMediaCollection('actions');

		return redirect()->back()
		->with("message", "File updated successfully!")
		->with("type", "success");
	}

}