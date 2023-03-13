<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryReport extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected static function boot() {
		parent::boot();

		static::creating(function ($inventoryReport) {
			$sequence = InventoryReport::count() + 1;
			$inventoryReport->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
		});
	}


	public function inventories() {
		return $this->hasMany(InventoryReportList:: class);
	}


	public function submitted() {
		return $this->hasOne(Employee::class, "employee_id", "submitted_id");
	}

	public function reviewer() {
		return $this->hasOne(Employee::class, "employee_id", "reviewer_id");
	}

	public function approval() {
		return $this->hasOne(Employee::class, "employee_id", "approval_id");
	}


	

}
