<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FolderModel extends Model
{
	use HasFactory;

	protected $table = 'tbl_folders';

	protected $primaryKey = 'folder_id';

	const CREATED_AT = 'date_created';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'is_removed',
		'is_active',
		'folder_name',
		'sub_id'
	];
}
