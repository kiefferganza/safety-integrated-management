<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbtTrackerEmployee extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function tracker() {
        return $this->belongsTo(TbtTracker::class, "tracker", "id");
    }

    public function employee() {
        return $this->belongsTo(Employee::class, "emp_id", "employee_id");
    }
}
