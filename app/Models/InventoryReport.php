<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InventoryReport extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $appends = ['form_number'];

	protected static function boot() {
		parent::boot();

		static::creating(function ($inventoryReport) {
			$latestReport = InventoryReport::select("sequence_no")->latest()->first();
			$sequence = $latestReport ? (int)ltrim($latestReport->sequence_no) + 1 : 1;
			$inventoryReport->sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);
			$inventoryReport->uuid = (string)Str::uuid();
		});
	}


	public function inventories() {
		return $this->hasMany(InventoryReportList:: class);
	}


	public function comments() {
		return $this->hasMany(InventoryReportComments:: class);
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


	public function getFormNumberAttribute() {
		$form_number = sprintf("%s-%s-%s-%s", $this->attributes["project_code"], $this->attributes["originator"],$this->attributes["discipline"],$this->attributes["document_type"]);
		if($this->attributes["document_zone"]) {
			$form_number .= "-". $this->attributes["document_zone"];
		}
		if($this->attributes["document_level"]) {
			$form_number .= "-". $this->attributes["document_level"];
		}
		$form_number .= "-" . $this->attributes["sequence_no"];
		return strtoupper($form_number);
	}
	

}
