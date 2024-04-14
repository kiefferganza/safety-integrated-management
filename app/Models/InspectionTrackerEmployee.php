<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InspectionTrackerEmployee extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function tracker() {
        return $this->belongsTo(InspectionTracker::class, "tracker", "id");
    }

    public function employee() {
        return $this->belongsTo(Employee::class, "emp_id", "employee_id");
    }

    public function reviewer() {
        return $this->belongsTo(Employee::class, "action_id", "employee_id");
    }

    public function verifier() {
        return $this->belongsTo(Employee::class, "verifier_id", "employee_id");
    }
}
