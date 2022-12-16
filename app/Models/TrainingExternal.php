<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingExternal extends Model
{
	use HasFactory;

	protected $table = 'tbl_trainings_external_details';

	protected $primaryKey = 'training_ext_id';

	const CREATED_AT = 'date_created';

	public $timestamps = false;
	
	protected $guarded = [];


	public function reviewer() {
		return $this->hasOne(Employee::class, "employee_id", "reviewed_by");
	}

	public function approval() {
		return $this->hasOne(Employee::class, "employee_id", "approved_by");
	}


}
