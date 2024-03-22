<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileModel extends Model
{
	use HasFactory;

	protected $table = 'tbl_files';

	protected $primaryKey = 'file_id';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'file_id ',
		'document_id',
		'user_id',
		'src',
		'uploader_type',
		'folder_id',
		'is_deleted'
	];

	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}

	public function document()
	{
		return $this->belongsTo(Document::class, "document_id");
	}
}
