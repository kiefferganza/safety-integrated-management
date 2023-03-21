<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryReportComments extends Model
{
	use HasFactory;
	
	protected $guarded = [];


	public function report() {
		return $this->belongsTo(InventoryReport::class);
	}

}
