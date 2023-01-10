<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalkFile extends Model
{
	use HasFactory;
	protected $table = 'tbl_tbt_images';

	protected $primaryKey = 'tbt_img_id';

	const CREATED_AT = 'date_uploaded';

	public $timestamps = false;

	protected $guarded = [];

}
