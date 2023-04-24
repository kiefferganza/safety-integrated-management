<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentDetail extends Model
{
	use HasFactory;
	
	protected $table = 'incident_details';

	public $timestamps = false;

	protected $guarded = [];
}
