<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainingCourses extends Model
{
    use HasFactory, SoftDeletes;

	protected static function boot() {
		parent::boot();

		static::updating(function (TrainingCourses $trainingCourse) {
			$originalModel = $trainingCourse->getOriginal();
			Training::where('title', $originalModel['course_name'])->update(['title' => $trainingCourse->course_name]);
		});
	}

	protected $guarded = [];
}
