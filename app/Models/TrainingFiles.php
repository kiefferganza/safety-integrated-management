<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingFiles extends Model
{
	use HasFactory;
	protected $table = 'tbl_trainings_files';

	protected $primaryKey = 'trainee_id ';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'training_id',
		'user_id',
		'src',
		'is_deleted',
	];
}
