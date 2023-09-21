<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingTrainees extends Model
{
	use HasFactory;

	protected $table = 'tbl_training_trainees';

	protected $primaryKey = 'trainee_id';

	const CREATED_AT = 'date_joined';
	const UPDATED_AT = null;

	protected $guarded = [];


	public function training() {
		return $this->belongsTo(Training::class, "training_id");
	}

}
