<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable, HasRoles;

	protected $table = 'users';

	protected $primaryKey = 'user_id';

	const CREATED_AT = 'date_created';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'firstname',
		'lastname',
		'username',
		'user_type',
		'subscriber_id',
		'email',
		'password',
		'profile_pic',
		'emp_id',
		'deleted',
		'about'
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array<int, string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	/**
	 * The attributes that should be cast.
	 *
	 * @var array<string, string>
	 */
	protected $casts = [
		'email_verified_at' => 'datetime',
	];

	public function scopePersonel($query, $user) {
		return $query->select("tbl_employees.user_id","tbl_employees.firstname", "tbl_employees.lastname", "tbl_employees.email", "emp_id", "tbl_employees.position")
		->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
		->where([
			["deleted", 0],
			["emp_id", "!=", $user->emp_id],
			["sub_id", $user->subscriber_id],
		])
		->orderBy("tbl_employees.firstname");
	}

	public function employee()
	{
		return $this->hasOne(Employee::class, "employee_id", "emp_id");
	}

	public function position() {
		return $this->hasOne(Position::class, "position_id", "position");
	}

	public function documents()
	{
		return $this->hasMany(Document::class, "user_id");
	}

	public function files()
	{
		return $this->hasMany(FileModel::class, "user_id");
	}

	public function document_review()
	{
		return $this->hasMany(DocumentReviewer::class, "originator_id");
	}

	public function access()
	{
		return $this->hasOne(UserAccess::class, "user_id", "emp_id");
	}

	public function followers() {
		return $this->hasMany(Follower::class, 'follower_id', 'user_id');
	}

	public function social_accounts() {
		return $this->hasMany(SocialAccount::class, 'user_id', 'user_id');
	}

	public function following() {
		return $this->hasMany(Follower::class, 'user_id', 'user_id');
	}
}
