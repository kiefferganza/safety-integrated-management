<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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
			cache()->forget("tbtList:" . auth()->user()->subscriber_id);
			$sequence = ToolboxTalk::where('is_deleted', 0)->where("tbt_type", $toolboxTalk->tbt_type)->count() + 1;
			$toolboxTalk->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
		});

		static::updating(function(ToolboxTalk $toolboxTalk) {
			if($toolboxTalk->isDirty("tbt_type")) {
				$sequence = ToolboxTalk::where('is_deleted', 0)->where("tbt_type", $toolboxTalk->tbt_type)->count() + 1;
				$toolboxTalk->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
			}
		});

    static::created(function() {
      $sub = auth()->user()->subscriber_id;
      Cache::forget("safemanhours_" . $sub);
		});

		static::updated(function() {
      $sub = auth()->user()->subscriber_id;
			cache()->forget("tbtList:" . $sub);
      Cache::forget("safemanhours_" . $sub);
		});

		static::deleted(function() {
      $sub = auth()->user()->subscriber_id;
			cache()->forget("tbtList:" . $sub);
      Cache::forget("safemanhours_" . $sub);
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


  public function participants_pivot() {
    return $this->hasMany(ToolboxTalkParticipant::class, "tbt_id", "tbt_id");
  }


	public function file() {
		return $this->hasMany(ToolboxTalkFile::class, "tbt_id", "tbt_id");
	}
	

}
