<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class InspectionReportList extends Model implements HasMedia 
{
	use HasFactory, InteractsWithMedia;

	protected $table = 'tbl_inspection_reports_list';

	protected $primaryKey = 'list_id';

	public $timestamps = false;

	protected $guarded = [];

	public function registerMediaConversions(Media $media = null): void{
		$this->addMediaConversion('small')->width(300);
	}

}
