<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingExternalComment extends Model
{
	use HasFactory;

	protected $table = 'training_external_comment';
	protected $guarded = [];

	public function reviewer() {
		return $this->hasOne(Employee::class, "employee_id", "reviewer_id");
	}
	
	public function training() {
		return $this->belongsTo(Training::class, "training_id", "training_id");
	}
}