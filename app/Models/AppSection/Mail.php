<?php

namespace App\Models\AppSection;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Mail extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

	protected $guarded = [];

	public function recipients() {
		return $this->hasMany(Recipients::class);
	}

}
