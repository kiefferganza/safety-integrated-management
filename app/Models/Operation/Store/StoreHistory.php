<?php

namespace App\Models\Operation\Store;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreHistory extends Model
{
    use HasFactory;

	public function store()
	{
		return $this->belongsTo(Store::class);
	}

	public function creator()
	{
		return $this->hasOne(Employee::class, 'employee_id', 'requested_by');
	}

	protected $guarded = [];
}
