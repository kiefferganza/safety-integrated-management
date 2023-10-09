<?php

namespace App\Http\Controllers\Operation;

use App\Http\Controllers\Controller;
use App\Models\DocumentProjectDetail;
use App\Models\Employee;
use App\Models\Operation\Store\Store;
use App\Models\Operation\Store\StoreHistory;
use App\Models\Operation\Store\StoreReport;
use App\Models\Operation\Store\StoreReportComment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreReportController extends Controller
{

    public function index()
    {
		$storeReports = StoreReport::with([
			"comments",
			"items",
			"submitted" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"reviewer" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"approver" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		])
		->where('subscriber_id', auth()->user()->subscriber_id)
		->get();

		foreach ($storeReports as $report) {
			/** @var StoreReport $report */
			if($report->hasMedia('actions')) {
				$reviewerLastFile = $report->getFirstMedia('actions', ['type' => 'review']);
				$approverLastFile = $report->getFirstMedia('actions', ['type' => 'approver']);
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
		
		return Inertia::render("Dashboard/Operation/Store/Report/List/index", compact('storeReports'));
    }

	
    public function create()
    {
		$user = auth()->user();
		$stores = Store::select(
			"id",
			"name",
			"min_qty",
			"slug",
			"created_at",
			"updated_at",
			"qty",
			"unit",
			"price",
			"currency",
		)->get()
		->transform(function(Store $store) {
			$thumbnail = $store->getFirstMediaUrl('images', 'thumbnail');
			if(!$thumbnail) {
				$thumbnail = '/storage/assets/placeholder.svg';
			}
			$bounds = StoreHistory::select(DB::raw("SUM(qty) as totalQty, type"))->where("store_id", $store->id)->groupBy("type")->get();
			foreach ($bounds as $bound) {
				$propertyBound = "total_". $bound->type . "_qty";
				$store->$propertyBound = (int)$bound->totalQty;
			}
			$store->setAttribute('thumbnail', $thumbnail);
			return $store;
		});

		$latestReport = StoreReport::select("sequence_no")->latest()->first();
		$submittedDates = StoreReport::select("submitted_date")->get()->pluck("submitted_date");
		$sequence = $latestReport ? (int)ltrim($latestReport->sequence_no) + 1 : 1;
		$sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);

		$employees = Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
		->where("is_deleted", 0)
		->where("is_active", 0)
		->where("sub_id", $user->subscriber_id)
		->where("user_id", "!=", null)
		->get();
		
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');
		
		return Inertia::render("Dashboard/Operation/Store/Report/index", compact(
			'stores',
			'submittedDates',
			'sequence_no',
			'employees',
			'projectDetails'
		));
    }


    public function store(Request $request)
    {
        $request->validate([
			'originator' => 'string|required',
			'project_code' => 'string|required',
			'discipline' => 'string|required',
			'document_type' => 'string|required',
			'approver_id' => 'integer|required',
			'reviewer_id' => 'integer|required',
			'location' => 'string|required',
			'contract_no' => 'string|required',
			'conducted_by' => 'string|required',
			'budget_forcast_date' => 'date|required',
			'inventory_start_date' => 'date|required',
			'inventory_end_date' => 'date|required',
			'submitted_date' => 'date|required',
			'items' => 'array|required|min:1',
		]);

		$storeReport = StoreReport::create([
			'subscriber_id' => auth()->user()->subscriber_id,
			'originator' => $request->originator,
			'project_code' => $request->project_code,
			'discipline' => $request->discipline,
			'document_type' => $request->document_type,
			'document_zone' => $request->document_zone,
			'document_level' => $request->document_level,
	
			'submitted_id' => auth()->user()->emp_id,
			'approver_id' => $request->approver_id,
			'reviewer_id' => $request->reviewer_id,
			'location' => $request->location,
			'contract_no' => $request->contract_no,
			'conducted_by' => $request->conducted_by,
			'budget_forcast_date' => $request->budget_forcast_date,
			'inventory_start_date' => $request->inventory_start_date,
			'inventory_end_date' => $request->inventory_end_date,
			'submitted_date' => $request->submitted_date,
			'remarks' => $request->remarks,
		]);

		$items = [];
		foreach ($request->items as $store) {
			$items[] = array(
				"name" => $store["name"],
				"qty" => $store["qty"],
				"level" => $store["min_qty"],
				"unit" => $store["unit"],
				"price" => $store["price"],
				"currency" => $store["currency"],
				"order" => $store["order"] ?? 0,
				"total_add_qty" => $store["total_add_qty"] ?? 0,
				"total_remove_qty" => $store["total_remove_qty"] ?? 0,
				"thumbnail" => $store["thumbnail"],
				"old_status" => $store["status"],
				"new_status" => $store["inventoryStatus"]
			);
		}
		$storeReport->items()->createMany($items);

		return redirect()->back()
		->with("message", "Report saved successfully!")
		->with("type", "success");
    }


    public function show(StoreReport $storeReport)
    {
        $storeReport->load([
			"comments",
			"items",
			"submitted" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"reviewer" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"approver" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		]);

		if($storeReport->hasMedia('actions')) {
			$currentFile = $storeReport->getMedia('actions')->last();
			$storeReport->setAttribute('currentFile', [
				'name' => $currentFile->name,
				'fileName' => $currentFile->file_name,
				'url' => $currentFile->originalUrl
			]);
			unset($storeReport->media);
		}

		return Inertia::render("Dashboard/Operation/Store/Report/Detail/index", [
			"report" => $storeReport
		]);
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy(StoreReport $inventoryReport)
	{
		$inventoryReport->delete();
		
		return redirect()->back()
		->with("message", "Report deleted successfully!")
		->with("type", "success");
	}

	public function postComment(Request $request, StoreReport $storeReport) {
		$request->validate([
			"comment" => ["string", "max:255", "required"],
			"pages" => ["string", "required"],
			"comment_code" => ["integer", "max:2", "required"],
			"status" => ["string", "required"]
		]);

		$storeReport->comments()->create([
			"reviewer_id" => auth()->user()->emp_id,
			"comment" => $request->comment,
			"comment_page_section" => $request->pages,
			"comment_code" => $request->comment_code,
			"status" => $request->status
		]);
		
		$storeReport->increment("revision_no");
		$storeReport->save();

		return redirect()->back()
		->with("message", "Comment posted successfully!")
		->with("type", "success");
	}

	public function destroyComment(StoreReportComment $reportComment) {
		if($reportComment->reviewer_id !== auth()->user()->emp_id) {
			abort(403);
		}

		$reportComment->delete();

		return redirect()->back()
		->with("message", "Comment deleted successfully!")
		->with("type", "success");
	}

	public function replyComment(Request $request, StoreReportComment $reportComment) {
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


	public function changeCommentStatus(Request $request, StoreReportComment $reportComment) {
		$request->validate([
			"status" => ["string", "required"],
		]);
		$reportComment->status = $request->status;
		$reportComment->save();

		return redirect()->back()
		->with("message", "Comment ". $request->status ." successfully!")
		->with("type", "success");
	}


	public function approveReview(Request $request, StoreReport $storeReport) {
		$request->validate([
			"status" => ["string", "required"],
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", 'required'],
		]);
		
		switch ($request->type) {
			case 'review':
				if($request->remarks) {
					$storeReport->reviewer_remarks = $request->remarks;
				}
				$storeReport->reviewer_status = $request->status;
				$storeReport->status = "for_approval";
				// if($request->status === "A" || $request->status === "D") {
				// 	$storeReport->status = "for_approval";
				// }else {
				// 	$storeReport->status = "for_revision";
				// }
				break;
			case 'approver':
				if($request->remarks) {
					$storeReport->approver_remarks = $request->remarks;
				}
				$storeReport->approver_status = $request->status;
				$storeReport->status = "closed";
				break;
		}

		$storeReport
		->addMediaFromRequest('file')
		->withCustomProperties([
			'type' => $request->type
		])
		->toMediaCollection('actions');

		$storeReport->save();

		return redirect()->back()
		->with("message", "Status updated successfully!")
		->with("type", "success");
	}


	public function reuploadActionFile(Request $request, StoreReport $storeReport) {
		$request->validate([
			"type" => ["string", "required"],
			"file" => ["file", "max:3072", 'required'],
			"remarks" => ["string"]
		]);

		if($storeReport->hasMedia('actions', ['type' => $request->type])) {
			$media = $storeReport->getFirstMedia('actions', ['type' => $request->type]);
			$storeReport->deleteMedia($media);
			switch ($request->type) {
				case 'review':
					$storeReport->reviewer_remarks = $request->remarks ?? "";
					break;
				case 'approver':
					$storeReport->approver_remarks = $request->remarks ?? "";
					break;
			}
			$storeReport->save();
		}
		$storeReport
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
