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
	const UPDATED_AT = 'updated_at';

	protected $guarded = [];


	public function inventory() {
		return $this->belongsTo(Inventory::class, "inventory_id");
	}


	public function creator() {
		return $this->hasOne(Employee::class, "employee_id", "requested_by_employee");
	}


}
