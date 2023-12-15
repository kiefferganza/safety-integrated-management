<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TrainingCourses extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

	protected static function boot() {
		parent::boot();

		static::updating(function (TrainingCourses $trainingCourse) {
			$originalModel = $trainingCourse->getOriginal();
			Training::where('title', $originalModel['course_name'])->update(['title' => $trainingCourse->course_name]);
		});
	}

	protected $guarded = [];

  protected $hidden = [
		'media'
	];


  protected $appends = [
    'attached_file'
  ];

  public function getAttachedFileAttribute() {
    if($this->type === null) return null;
    $media = $this->getFirstMedia();
    if(!$media) return null;
    return [
      'id' => $media->id,
      'name' => $media->file_name,
      'url' => $media->getFullUrl()
    ];
  }
  
}
