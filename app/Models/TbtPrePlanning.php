<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TbtPrePlanning extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function assigned() {
        return $this->hasMany(TbtPrePlanningAssigned::class, "preplanning", "id");
    }
}
