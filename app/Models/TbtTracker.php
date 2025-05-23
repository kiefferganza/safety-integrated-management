<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TbtTracker extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $appends = ['form_number'];

    protected static function boot() {
		parent::boot();
		
		static::creating(function(TbtTracker $tbtTracker) {
			$sequence = TbtTracker::withTrashed()->count() + 1;
			$tbtTracker->sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
		});
	}

    public function getFormNumberAttribute()
    {
        if($this->project_code && $this->document_type && $this->discipline && $this->originator && $this->sequence_no) {
            return sprintf("%s-%s-%s-%s-%s", $this->project_code, $this->originator,$this->discipline,$this->document_type, $this->sequence_no);
        }
        return "";
    }

    public function employee() {
        return $this->belongsTo(Employee::class, "emp_id", "employee_id");
    }


    public function trackerEmployees() {
        return $this->hasMany(TbtTrackerEmployee::class, "tracker", "id");
    }
}
