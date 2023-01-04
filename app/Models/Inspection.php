<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspection extends Model
{
	use HasFactory;

	protected $table = 'tbl_inspection_reports';

	protected $primaryKey = 'inspection_id';

	public $timestamps = false;

	protected $guarded = [];


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
