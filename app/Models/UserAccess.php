<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccess extends Model
{
    use HasFactory;

		protected $table = 'user_access';

    protected $primaryKey = 'access_id';

		const CREATED_AT = 'date_created';

    public $timestamps = false;

		protected $fillable = [
			'access_id',
			'access_type_id',
			'user_id',
			'status',
			'data_created',
    ];
}
