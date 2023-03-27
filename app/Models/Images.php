<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Images extends Model implements HasMedia 
{
	use HasFactory, InteractsWithMedia;

	protected $table = 'images';

	protected $guarded = [];
}
