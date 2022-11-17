<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
	use HasFactory;

	protected $table = 'tbl_employees';

	protected $primaryKey = 'employee_id';

	const CREATED_AT = 'date_created';
	const UPDATED_AT = 'date_updated';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'firstname',
		'middlename',
		'lastname',
		'username',
		'phone_no',
		'email',
		'password',
		'img_src',
		'company',
		'company_type',
		'position',
		'department',
		'nationality',
		'is_active',
		'is_deleted',
		'user_id',
		'sub_id',
		'sex',
		'birth_date',
		'emp_id',
		'deleted'
	];

	public function position() {
		return $this->hasOne(Position::class, "position_id", "position");
	}

	public function department() {
		return $this->hasOne(Department::class, "department_id", "department");
	}

	public function trainings() {
		return $this->hasMany(Training::class, "employee_id");
	}

}
