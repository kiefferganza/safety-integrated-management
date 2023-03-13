<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryReportList extends Model
{
	use HasFactory;

	protected $guarded = [];

	
	public function report() {
		return $this->belongsTo(InventoryReportList::class);
	}

	public function inventoryBound() {
		return $this->belongsTo(InventoryBound::class);
	}
	
}
