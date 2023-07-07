<?php

namespace App\Models\Operation\Store;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreHistory extends Model
{
    use HasFactory;

	public function store()
	{
		return $this->belongsTo(Store::class);
	}

	protected $guarded = [];
}
