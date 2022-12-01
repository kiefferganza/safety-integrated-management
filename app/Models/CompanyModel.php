<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyModel extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $table = 'tbl_company';

	protected $primaryKey = 'company_id';
}
