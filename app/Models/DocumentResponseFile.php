<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentResponseFile extends Model
{
	use HasFactory;

	protected $table = 'tbl_document_response_files';

	protected $primaryKey = 'response_file_id';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'document_id',
		'reviewer_id',
		'reply',
		'comment',
		'pages',
		'comment_code',
		'reply_code',
		'is_deleted',
		'response_status',
		'comment_date',
		'reply_date',
	];


	public function document() {
		return $this->belongsTo(Document::class, "document_id");
	}
}
