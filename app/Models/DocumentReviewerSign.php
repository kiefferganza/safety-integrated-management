<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentReviewerSign extends Model
{
	use HasFactory;

	protected $table = 'tbl_document_reviewer_sign';

	protected $primaryKey = 'signed_doc_id';

	public $timestamps = false;

	/**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
			'document_id',
			'user_id',
			'src',
			'upload_date',
			'is_deleted'
	];
	
	public function document() {
		return $this->belongsTo(Document::class, "document_id");
	}

	public function user() {
		return $this->belongsTo(User::class, "user_id", "id");
	}
}
