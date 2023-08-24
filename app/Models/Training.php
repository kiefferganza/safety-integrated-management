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

	protected $guarded = [];

	protected static function boot() {
		parent::boot();

		static::creating(function ($training) {
			$lastSeq = Training::where([["is_deleted", false], ["type", $training->type]])
			->select('sequence_no')->orderBy('sequence_no', 'desc')->first();
			$sequence = 1;
			if($lastSeq) {
				$sequence = (int)ltrim($lastSeq->sequence_no, "0") + 1;
			}
			$training->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
		});
	}

	public function trainees() {
		return $this->belongsToMany(Employee::class, "tbl_training_trainees", "training_id", "employee_id", "training_id")->wherePivot("is_removed", false)->withPivot("trainee_id");
	}
	

	public function training_files() {
		return $this->hasMany(TrainingFiles::class, "training_id", "training_id");
	}

	public function external_details() {
		return $this->hasOne(TrainingExternal::class, "training_id");
	}

	public function user_employee() {
		return $this->hasOne(Employee::class, "user_id", "user_id");
	}

	public function external_status() {
		return $this->hasOne(TrainingExternalStatus::class, "training_id", "training_id");
	}

	public function external_comments() {
		return $this->hasMany(TrainingExternalComment::class, "training_id", "training_id");
	}

}