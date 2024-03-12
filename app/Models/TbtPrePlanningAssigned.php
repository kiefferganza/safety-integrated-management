<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbtPrePlanningAssigned extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function preplanning() {
        return $this->belongsTo(TbtPrePlanning::class, "preplanning", "id");
    }
}
