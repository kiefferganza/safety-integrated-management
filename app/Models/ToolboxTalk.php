<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalk extends Model
{
	use HasFactory;

	protected $table = 'tbl_toolbox_talks';

	protected $primaryKey = 'tbt_id';

	protected $guarded = [];


	public function participants() {
		return $this->belongsToMany(Employee::class, "tbl_toolbox_talks_participants", "tbt_id", "employee_id")->withPivot(['time', 'date_added']);
	}
	

}
