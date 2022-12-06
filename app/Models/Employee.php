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

	protected $guarded = [];

	public function position() {
		return $this->hasOne(Position::class, "position_id", "position");
	}

	public function department() {
		return $this->hasOne(Department::class, "department_id", "department");
	}

	public function trainings() {
		return $this->hasMany(Training::class, "employee_id");
	}

	public function nationality() {
		return $this->hasOne(Nationality::class, "id", "nationality");
	}

	public function company() {
		return $this->hasOne(CompanyModel::class, "company_id", "company");
	}

	public function toolboxTalks() {
		return $this->hasMany(ToolboxTalk::class, "employee_id", "employee_id");
	}

	public function following() {
		return $this->hasMany(Follower::class, "user_id", "user_id");
	}

	public function followers() {
		return $this->hasMany(Follower::class, "following_id", "user_id");
	}

}
