<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingExternalStatus extends Model
{
	use HasFactory;
	protected $table = 'training_external_status';
	protected $guarded = [];
	
	public function training() {
		return $this->belongsTo(Training::class, "training_id", "training_id");
	}
}