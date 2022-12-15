<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
  use HasFactory;

	protected $table = 'tbl_trainings';

	protected $primaryKey = 'training_id';

	const CREATED_AT = 'date_created';
	const UPDATED_AT = 'date_updated';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'originator',
		'project_code',
		'discipline',
		'document_type',
		'document_level',
		'document_zone',
		'sequence_no',
		'title',
		'location',
		'contract_no',
		'remarks',
		'trainer',
		'training_hrs',
		'user_id',
		'employee_id',
		'status',
		'type',
		'training_date',
		'date_expired',
		'is_deleted'
	];

	public function trainees() {
		return $this->belongsToMany(Employee::class, "tbl_training_trainees", "training_id", "employee_id", "training_id")->wherePivot("is_removed", false)->withPivot("trainee_id");
	}

	// public function trainee_pivot() {
	// 	return $this->hasMany(TrainingTrainees::class, "training_id");
	// }

	public function training_files() {
		return $this->hasMany(TrainingFiles::class, "training_id");
	}

	public function external_details() {
		return $this->hasOne(TrainingExternal::class, "training_id");
	}

}
