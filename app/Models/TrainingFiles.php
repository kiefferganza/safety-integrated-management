<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingFiles extends Model
{
	use HasFactory;
	protected $table = 'tbl_trainings_files';

	protected $primaryKey = 'training_files_id';

	protected $guarded = [];
}
