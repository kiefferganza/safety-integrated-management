<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class InventoryReport extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;
	
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
		$attr = $this->attributes;
		// dd($attr);
		if(array_key_exists("project_code", $attr) &&  array_key_exists("originator", $attr) && array_key_exists("discipline", $attr) && array_key_exists("document_type", $attr)) {
			$form_number = sprintf("%s-%s-%s-%s", $attr["project_code"], $attr["originator"],$attr["discipline"],$attr["document_type"]);
			if($attr["document_zone"]) {
				$form_number .= "-". $attr["document_zone"];
			}
			if($attr["document_level"]) {
				$form_number .= "-". $attr["document_level"];
			}
			$form_number .= "-" . $attr["sequence_no"];
			return strtoupper($form_number);
		}
		return "";
	}
	

}