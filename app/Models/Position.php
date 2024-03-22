<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $table = 'tbl_position';

	protected $primaryKey = 'position_id';

	const CREATED_AT = 'date_created';
	const UPDATED_AT = 'date_updated';

	public $timestamps = false;

	protected static function boot() {
		parent::boot();
		static::created(function() {
			cache()->forget("positions:". auth()->user()->subscriber_id);
		});
		static::updated(function() {
			cache()->forget("positions:". auth()->user()->subscriber_id);
		});
		static::deleted(function() {
			cache()->forget("positions:". auth()->user()->subscriber_id);
		});
	}

	function user() {
		return $this->belongsTo(User::class, "user_id", "id");
	}

	function employee() {
		return $this->belongsTo(Employee::class, "employee_id");
	}
}
