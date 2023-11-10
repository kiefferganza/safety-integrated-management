<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Inspection extends Model
{
	use HasFactory;

	protected $table = 'tbl_inspection_reports';

	protected $primaryKey = 'inspection_id';

	public $timestamps = false;

	protected $guarded = [];


	protected static function boot() {
		parent::boot();

		static::creating(function ($inspection) {
			$sequence = Inspection::where('is_deleted', 0)->count() + 1;
			$sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
			$inspection->sequence_no = $sequence_no;
			$inspection->form_number = $inspection->form_number . $sequence_no;
		});
	}

	public function submitted() {
		return $this->hasOne(Employee::class, "employee_id");
	}

	public function reviewer() {
		return $this->hasOne(Employee::class, "employee_id", "reviewer_id");
	}

	public function verifier() {
		return $this->hasOne(Employee::class, "employee_id", "verifier_id");
	}


	public function report_list() {
		return $this->hasMany(InspectionReportList::class, "inspection_id");
	}

}
