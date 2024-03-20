<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class User extends Authenticatable implements HasMedia
{
	use HasApiTokens, HasFactory, Notifiable, HasRoles, InteractsWithMedia;

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

	// protected $appends = ['fullname'];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array<int, string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	protected $appends = ['profile'];

	/**
	 * The attributes that should be cast.
	 *
	 * @var array<string, string>
	 */
	protected $casts = [
		'email_verified_at' => 'datetime'
	];


	protected static function boot() {
		parent::boot();
		
		static::updated(function(User $user) {
			$authUser = auth()->user();
			if($authUser->user_id === $user->user_id) {
				cache()->forget("authUser:" . $user->user_id);

				cache()->rememberForever("authUser:".$user->user_id, function() use($user) {
					$user->load([
						"employee" => function($query) {
							$query->leftJoin("tbl_company", "tbl_employees.company", "tbl_company.company_id")
							->leftJoin("tbl_department", "tbl_employees.department", "tbl_department.department_id")
							->leftJoin("tbl_position", "tbl_employees.position", "tbl_position.position_id");
						}
					]);
					
					return [
						"user" => [
							"user_id" => $user->user_id,
							"firstname" => $user->firstname,
							"lastname" => $user->lastname,
							"username" => $user->username,
							"email" => $user->email,
							"password" => $user->password,
							"date_created" => $user->date_created,
							"user_type" => $user->user_type,
							"subscriber_id" => $user->subscriber_id,
							"deleted" => $user->deleted,
							"status" => $user->status,
							"date_updated" => $user->date_updated,
							"profile_pic" => $user->profile_pic,
							"position" => $user->position,
							"emp_id" => $user->emp_id,
							"employee" => $user->employee
						]
					];
				});
			}
		});
	}

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

	public function createdEmployees() {
		return $this->hasMany(Employee::class, "created_by", "user_id");
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
		// return $this->hasMany(Follower::class, 'follower_id', 'user_id');
	}

	public function social_accounts() {
		return $this->hasMany(SocialAccount::class, 'user_id', 'user_id');
	}

	public function following() {
		// return $this->hasMany(Follower::class, 'user_id', 'user_id');
	}
	

	public function getProfileMedia(): Media|null {
        if($this->user_id) {
            return Media::where("model_type", User::class)->where("model_id", $this->user_id)->whereJsonContains("custom_properties", ["primary" => true])->first();
        }
        return null;
    }


	public function getProfileAttribute() {
		if(!$this->user_id) return null;

		$profile = $this->getProfileMedia();
		if($profile) {
			$path = "user/" . md5($profile->id . config('app.key')) . "/" . $profile->file_name;
			return [
				"url" => URL::route("image", ["path" => $path]),
				"thumbnail" => URL::route("image", ["path" => $path, "w" => 40, "h" => 40, "fit" => "crop"]),
				"small" => URL::route("image", ["path" => $path, "w" => 128, "h" => 128, "fit" => "crop"])
			];
		}
		return null;
	}

	// public function getFullnameAttribute() {
	// 	$firstname = $this->attributes['firstname'] && "";
	// 	return  trim($firstname). ' '  . trim($this->attributes['lastname']);
	// }

	// public function sentEmails()
	// {
	// 	return $this->hasMany(Mail::class, 'user_id');
	// }

	// public function receivedEmails()
	// {
	// 	return $this->belongsToMany(Mail::class, 'recipients', 'user_id', 'mail_id');
	// }
}
