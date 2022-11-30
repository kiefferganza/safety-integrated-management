<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingType extends Model
{
	use HasFactory;

	protected $table = 'tbl_trainings_type';

	protected $primaryKey = 'training_type_id';

	const CREATED_AT = 'date_created';

}
