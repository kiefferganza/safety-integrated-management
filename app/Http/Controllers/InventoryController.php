<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Inventory;

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
			"inventory" => Inventory::where("is_removed", 0)->get()
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		return Inertia::render("Dashboard/Management/PPE/Create/index");
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
			if(Storage::exists("public/media/photos/inventory" . $file)) {
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
			//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  \App\Models\Inventory  $inventory
	 * @return \Illuminate\Http\Response
	 */
	public function edit(Inventory $inventory)
	{
			//
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
			//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  \App\Models\Inventory  $inventory
	 * @return \Illuminate\Http\Response
	 */
	public function destroy(Inventory $inventory)
	{
			//
	}
}
