<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TrainingExternalStatus extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;
	protected $table = 'training_external_status';
	protected $guarded = [];
	
	public function training() {
		return $this->belongsTo(Training::class, "training_id", "training_id");
	}
}