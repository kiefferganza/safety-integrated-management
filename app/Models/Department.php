<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $table = 'tbl_department';

	protected $primaryKey = 'department_id';

	public $timestamps = false;

}
