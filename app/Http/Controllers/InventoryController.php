<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryBound;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InventoryController extends Controller
{
	public function add_slug() {
		$inventory = Inventory::select("inventory_id")->pluck("inventory_id")->all();
		foreach ($inventory as $inventory_id) {
			$inv = Inventory::select("item", "slug")->find($inventory_id);
			$inv->slug = Str::slug($inv->item);
			$inv->save();
		}
		// $inventory->map(function ($inv) {
		// 	$inv->slug = Str::slug($inv->item);
		// 	$inv->save(['timestamps' => false]);
		// });
		return Inventory::select("slug", "item", "inventory_id")->get();
	}

	
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
			//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
			//
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
