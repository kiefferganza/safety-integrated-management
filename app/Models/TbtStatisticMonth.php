<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbtStatisticMonth extends Model
{
	use HasFactory;
	
	protected $guarded = [];

	public function year() {
		return $this->belongsTo(TbtStatistic::class);
	}


}
