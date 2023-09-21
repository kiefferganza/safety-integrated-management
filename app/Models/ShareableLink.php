<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShareableLink extends Model
{
    use HasFactory;

	protected $casts = [
		'custom_properties' => 'array',
	];

	protected $guarded = [];
}
