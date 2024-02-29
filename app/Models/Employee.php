<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'tbl_employees';

    protected $primaryKey = 'employee_id';

    const CREATED_AT = 'date_created';
    const UPDATED_AT = 'date_updated';

    public $timestamps = false;

    protected $guarded = [];

    protected $appends = ['fullname'];

    protected static function boot() {
			parent::boot();
    	static::created(function() {
    		cache()->forget("employees:".auth()->user()->subscriber_id);
    	});
    	static::updated(function() {
    		cache()->forget("employees:".auth()->user()->subscriber_id);
    	});
    	static::deleted(function() {
    		cache()->forget("employees:".auth()->user()->subscriber_id);
    	});
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id", "user_id");
    }

    public function position()
    {
        return $this->hasOne(Position::class, "position_id", "position");
    }

    public function department()
    {
        return $this->hasOne(Department::class, "department_id", "department");
    }

    public function trainings()
    {
        return $this->hasMany(Training::class, "employee_id");
    }

	// public function training_files($trainingId) {
	// 	return $this->hasManyThrough(TrainingFiles::class, Training::class, 'emp_id', 'training_id')->where('tbl_trainings.training_id', $trainingId);
	// }

    public function participated_trainings()
    {
        return $this->hasMany(TrainingTrainees::class, "employee_id", "employee_id");
    }

    public function nationality()
    {
        return $this->hasOne(Nationality::class, "id", "nationality");
    }

    public function company()
    {
        return $this->hasOne(CompanyModel::class, "company_id", "company");
    }

    public function toolboxTalks()
    {
        return $this->hasMany(ToolboxTalk::class, "employee_id", "employee_id");
    }

    public function inspections()
    {
        return $this->hasMany(Inspection::class, "employee_id", "employee_id");
    }

    public function following()
    {
        return null;
        // return $this->hasMany(Follower::class, "user_id", "user_id");
    }

    public function social_accounts()
    {
        return $this->hasMany(SocialAccount::class, "user_id", "user_id");
    }


    public function getFullnameAttribute()
    {
        if(isset($this->attributes['firstname']) && isset($this->attributes['lastname'])) {
			return trim($this->attributes['firstname']) . ' ' . trim($this->attributes['lastname']);
		}
		return null;
    }


    public function profile(): Media|null {
        if($this->user_id) {
            return Media::where("model_type", User::class)->where("model_id", $this->user_id)->whereJsonContains("custom_properties", ["primary" => true])->first();
        }
        return null;
    }
}
