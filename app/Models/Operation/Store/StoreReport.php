<?php

namespace App\Models\Operation\Store;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class StoreReport extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

	protected $guarded = [];

	protected static function boot() {
		parent::boot();

		static::creating(function (StoreReport $storeReport) {
			$storeReport->uuid = (string)Str::uuid();
			if(!$storeReport->sequence_no){
				$latestReport = StoreReport::select("sequence_no")->latest()->first();
				$sequence = $latestReport ? (int)ltrim($latestReport->sequence_no) + 1 : 1;
				$storeReport->sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);
			}
		});

		// Update form_fumber when the name is updated
		static::saving(function (StoreReport $storeReport)
		{
			if ($storeReport->isDirty('project_code') || $storeReport->isDirty('originator') || $storeReport->isDirty('document_type') || $storeReport->isDirty('document_zone') || $storeReport->isDirty('document_level') || $storeReport->isDirty('discipline'))
			{
				$form_number = sprintf("%s-%s-%s-%s", $storeReport->project_code, $storeReport->originator,$storeReport->discipline,$storeReport->document_type);
				if($storeReport->document_zone) {
					$form_number .= "-". $storeReport->document_zone;
				}
				if($storeReport->document_level) {
					$form_number .= "-". $storeReport->document_level;
				}
				
				if(!$storeReport->sequence_no) {
					$latestReport = StoreReport::select("sequence_no")->latest()->first();
					$sequence = $latestReport ? (int)ltrim($latestReport->sequence_no) + 1 : 1;
					$sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);
				}else {
					$sequence_no = $storeReport->sequence_no;
				}
				$form_number .= "-" . $sequence_no;
				$storeReport->form_number = STR::upper($form_number);
			}
		});
	}

	public function items() {
		return $this->hasMany(StoreReportList:: class);
	}


	public function comments() {
		return $this->hasMany(StoreReportComment:: class);
	}


	public function submitted() {
		return $this->hasOne(Employee::class, "employee_id", "submitted_id");
	}

	public function reviewer() {
		return $this->hasOne(Employee::class, "employee_id", "reviewer_id");
	}

	public function approver() {
		return $this->hasOne(Employee::class, "employee_id", "approver_id");
	}
}
