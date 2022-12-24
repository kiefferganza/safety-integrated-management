<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionReportList extends Model
{
	use HasFactory;

	protected $table = 'tbl_inspection_reports_list';

	protected $primaryKey = 'list_id';

	public $timestamps = false;

	protected $guarded = [];

}
