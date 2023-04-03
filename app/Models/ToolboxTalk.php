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

	protected static function boot() {
		parent::boot();
		
		static::creating(function(ToolboxTalk $toolboxTalk) {
			cache()->forget("tbtList");
			$sequence = ToolboxTalk::where('is_deleted', 0)->where("tbt_type", $toolboxTalk->tbt_type)->count() + 1;
			$toolboxTalk->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
		});
		static::updated(function() {
			cache()->forget("tbtList");
		});
		static::deleted(function() {
			cache()->forget("tbtList");
		});
	}


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
		return $this->hasMany(ToolboxTalkFile::class, "tbt_id", "tbt_id");
	}
	

}
