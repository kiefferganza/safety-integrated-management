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

	const UPDATED_AT = 'updated_at';

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

	public function documents() {
		return $this->hasMany(Document::class, "folder_id");
	}

	public function files() {
		return $this->hasMany(FileModel::class, "folder_id");
	}

}
