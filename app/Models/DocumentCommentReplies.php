<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentCommentReplies extends Model
{
	use HasFactory;

	protected $table = 'tbl_document_comments_replies';

	protected $primaryKey = 'response_id';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'response_id ',
		'document_id',
		'reviewer_id',
		'reply',
		'comment',
		'pages',
		'comment_code',
		'reply_code',
		'is_deleted',
		'revised_doc_src',
		'response_status',
		'comment_date',
		'reply_date',
		'comment_status'
	];

	public function documents() {
		// $this->hasMnay(Document::class, "document_id");
		return $this->belongsTo(Document::class, "document_id");
	}

}
