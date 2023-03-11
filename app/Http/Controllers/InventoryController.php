<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Inventory;
use App\Models\InventoryBound;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryController extends Controller
{	
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return Inertia::render("Dashboard/Management/PPE/List/index", [
			"inventory" => Inventory::where("is_removed", 0)->get(),
			"employee" => Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("sub_id", auth()->user()->subscriber_id)
				->get()
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		$sequence = Inventory::where('is_removed', 0)->count() + 1;
		return Inertia::render("Dashboard/Management/PPE/Create/index", [
			"sequence_no" => str_pad($sequence, 6, '0', STR_PAD_LEFT)
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
			"type" => "string|required",
			"min_qty" => "integer|required",
			"current_stock_qty" => "integer|required",
			"item_price" => "integer|required",
			"description" => "string",
			"item" => [
				"required",
				"string",
				Rule::unique('tbl_inventory')
			],
		]);
		$user = auth()->user();
		$inventory = new Inventory;

		$inventory->item = $request->item;
		$inventory->description = $request->description;
		$inventory->min_qty = $request->min_qty;
		$inventory->current_stock_qty = $request->current_stock_qty;
		$inventory->try = $request->type;
		$inventory->item_currency = $request->item_currency;
		$inventory->item_price = $request->item_price;
		$inventory->user_id = $user->user_id;
		$inventory->is_removed = 0;
		
		if($request->hasFile("img_src")) {
			$file = $request->file("img_src")->getClientOriginalName();
			if(Storage::exists("public/media/photos/inventory/" . $file)) {
				$extension = pathinfo($file, PATHINFO_EXTENSION);
				$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time() . "." .$extension;
			}else {
				$file_name = $file;
			}
			$request->file("img_src")->storeAs('media/photos/inventory', $file_name, 'public');
			$inventory->img_src = $file_name;
		}

		$inventory->save();

		return redirect()->back()
		->with("message", "Product added successfully!")
		->with("type", "success");
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  \App\Models\Inventory  $inventory
	 * @return \Illuminate\Http\Response
	 */
	public function show(Inventory $inventory)
	{
		return Inertia::render("Dashboard/Management/PPE/Detail/index", [
			"inventory" => $inventory->load([
				"bound" => fn($q) => $q->with([
					"creator" => fn($qn) => $qn->select("employee_id", "firstname", "lastname")
				])
			]),
			"employee" => Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
				->where("is_deleted", 0)
				->where("sub_id", auth()->user()->subscriber_id)
				->get()
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  \App\Models\Inventory  $inventory
	 * @return \Illuminate\Http\Response
	 */
	public function edit(Inventory $inventory)
	{
		return Inertia::render("Dashboard/Management/PPE/Edit/index", [
			"inventory" => $inventory
		]);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \App\Models\Inventory  $inventory
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, Inventory $inventory)
	{
		$request->validate([
			"type" => "string|required",
			"min_qty" => "integer|required",
			"item_price" => "integer|required",
			"description" => "string",
			"item" => [
				"required",
				"string",
				Rule::unique('tbl_inventory')->where("is_removed", 0)->ignore($inventory)
			],
		]);

		$oldItemName = $inventory->item;

		if($request->hasFile("img_src")) {
			if($inventory->img_src !== null){
				if(Storage::exists("public/media/photos/inventory/". $inventory->img_src)) {
					Storage::delete("public/media/photos/inventory/" . $inventory->img_src);
				}
			}
			$file = $request->file("img_src")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			if(Storage::exists("public/media/photos/inventory" . $file)) {
				$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time() . "." .$extension;
			}else {
				$file_name = $file;
			}
			$request->file("img_src")->storeAs('media/photos/inventory', $file_name, 'public');
			$inventory->img_src = $file_name;
		}

		$inventory->try = $request->type;
		$inventory->min_qty = $request->min_qty;
		$inventory->item_price = $request->item_price;
		$inventory->description = $request->description;
		$inventory->item = $request->item;
		$inventory->slug = Str::slug($inventory->item);
		$inventory->save();

		return redirect()->route("ppe.management.index")
		->with("message", $oldItemName . " updated successfully!")
		->with("type", "success");
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function destroy(Request $request)
	{
		$request->validate(["ids" => 'array|min:1']);

		Inventory::whereIn("inventory_id", $request->ids)->update(["is_removed" => 1]);

		return redirect()->back()
		->with("message", count($request->ids) . " items deleted successfully!")
		->with("type", "success");
	}


	public function report() {
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

		return Inertia::render("Dashboard/Management/PPE/Report/index", [
			"inventories" => $inventories
		]);
	}
	

	public function add_remove_stock(Inventory $inventory, Request $request) {
		$request->validate([
			"qty" => 'required|integer',
			"type" => 'required|string'
		]);

		$inventoryBound = new InventoryBound;
		$inventoryBound->inventory_id = $inventory->inventory_id;
		$inventoryBound->previous_qty = $inventory->current_stock_qty;
		$inventoryBound->qty = $request->qty;

		if($request->type === "add") {
			$user = auth()->user();
			$newQty = $inventory->current_stock_qty + $request->qty;

			
			$inventoryBound->type = "inbound";
			$inventoryBound->requested_by_employee = (string)$user->user_id;
			$inventoryBound->requested_by_location = NULL;

			$inventory->current_stock_qty = $newQty;
		}else if($request->type === "remove" && ($request->employee_id !== null || $request->location !== null)) {
			$newQty = $inventory->current_stock_qty - $request->qty;

			$inventoryBound->type = "outbound";
			$inventoryBound->requested_by_employee = $request->employee_id ? (string)$request->employee_id : null;
			$inventoryBound->requested_by_location = $request->location;

			$inventory->current_stock_qty = $newQty;
		}else {
			abort(500);
		}

		$inventoryBound->save();
		$inventory->save();


		return redirect()->back()
		->with("message", $request->type === "add" ? "Re-stocked successfully!" : "Unstocked successfully!")
		->with("type", "success");

	}

}
