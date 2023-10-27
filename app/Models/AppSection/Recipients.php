<?php

namespace App\Models\AppSection;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipients extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function mail() {
		return $this->belongsTo(Mail::class);
	}

}
