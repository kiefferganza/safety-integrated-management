<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalk extends Model
{
	use HasFactory;

	protected $table = 'tbl_toolbox_talks';

	protected $primaryKey = 'tbt_id';

	const CREATED_AT = 'date_created';

	protected $guarded = [];


	public function owner() {
		return $this->belongsTo(Employee::class, "employee_id", "employee_id");
	}


	public function conducted() {
		return $this->hasOne(Employee::class, "employee_id", "conducted_by");
	}


	public function participants() {
		return $this->belongsToMany(Employee::class, "tbl_toolbox_talks_participants", "tbt_id", "employee_id")->withPivot(['time', 'date_added']);
	}


	public function file() {
		return $this->hasOne(ToolboxTalkFile::class, "tbt_id", "tbt_id");
	}
	

}
