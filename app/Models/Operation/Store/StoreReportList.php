<?php

namespace App\Models\Operation\Store;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreReportList extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function report() {
		return $this->belongsTo(StoreReport::class);
	}
}
