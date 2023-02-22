<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryBound extends Model
{
	use HasFactory;

	protected $table = 'tbl_inventory_bound';

	protected $primaryKey = 'inventory_bound_id';

	const CREATED_AT = 'date';

	protected $guarded = [];


	public function inventory() {
		return $this->belongsTo(Inventory::class, "inventory_id");
	}


}
