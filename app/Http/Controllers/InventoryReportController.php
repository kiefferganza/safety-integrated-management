<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\InventoryReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Inventory;
use App\Models\InventoryBound;
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
			$bounds = InventoryBound::select(DB::raw("MAX(qty) as maxQty, MIN(qty) as minQty, SUM(qty) as totalQty, type"))->where("inventory_id", $inventory->inventory_id)->groupBy("type")->get();
			foreach ($bounds as $bound) {
				$propertyBound = $bound->type . "TotalQty";
				$propertyMax = $bound->type . "MaxQty";
				$propertyMin = $bound->type . "MinQty";
				$inventory->$propertyBound = (int)$bound->totalQty;
				$inventory->$propertyMax = $bound->maxQty;
				$inventory->$propertyMin = $bound->minQty;
			}
			return $inventory;
		});

		$sequence = InventoryReport::count() + 1;

		return Inertia::render("Dashboard/Management/PPE/Report/index", [
			"inventories" => $inventories,
			"sequence_no" => str_pad($sequence, 6, '0', STR_PAD_LEFT),
			"employees" => Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("sub_id", auth()->user()->subscriber_id)
				->get()
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
				"inbound_max_qty" => $inventory["inboundMaxQty"] ?? 0,
				"inbound_min_qty" => $inventory["inboundMinQty"] ?? 0,
				"outbound_total_qty" => $inventory["outboundTotalQty"] ?? 0,
				"outbound_max_qty" => $inventory["outboundMaxQty"] ?? 0,
				"outbound_min_qty" => $inventory["outboundMinQty"] ?? 0,
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

	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  \App\Models\InventoryReport  $inventoryReport
	 * @return \Illuminate\Http\Response
	 */
	public function destroy(InventoryReport $inventoryReport)
	{

	}




	public function reportList() {
		$inventoryReports = InventoryReport::with([
			"inventories",
			"submitted" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"reviewer" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"approval" => fn($q) =>
				$q->select("employee_id", "firstname", "lastname", "tbl_position.position")->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
		])->get()->toArray();
		
		return Inertia::render("Dashboard/Management/PPE/ReportList/index", [
			"inventoryReports" => $inventoryReports
		]);
	}



}
