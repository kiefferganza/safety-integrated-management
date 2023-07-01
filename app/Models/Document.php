<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Document extends Model
{
	use HasFactory;

	protected $table = 'tbl_documents';

	protected $primaryKey = 'document_id';

	public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $guarded = [];


	protected static function boot()
	{
		parent::boot();
		static::creating(function ($doc)
		{
			$doc->form_number = self::generateFormNumber($doc);
		});
		
		static::updating(function ($doc)
		{
			$doc->form_number = self::generateFormNumber($doc);
		});
	}


	private static function generateFormNumber(Document $doc) {
		$form_number = sprintf("%s-%s-%s-%s", $doc->project_code, $doc->originator,$doc->discipline,$doc->document_type);
		if($doc->document_zone) {
			$form_number .= "-". $doc->document_zone;
		}
		if($doc->document_level) {
			$form_number .= "-". $doc->document_level;
		}
		$form_number .= "-" . $doc->sequence_no;
		return STR::upper($form_number);
	}


	public function scopeSubmitted($query, $user, $folder_id)
	{
		return $query->where([
			["tbl_documents.user_id", $user->emp_id],
			["folder_id", $folder_id],
			["tbl_documents.is_deleted", 0]
		])
			->subqueriesDocs()
			->orderByDesc("document_id");
	}

	public function scopeReviewDocs($query, $user, $folder_id)
	{
		return $query->join("tbl_document_reviewer", "tbl_documents.document_id", "tbl_document_reviewer.document_id")->select(DB::raw("tbl_documents.document_id,tbl_documents.folder_id,`title`,`description`, tbl_documents.user_id, `approval_id`, `date_uploaded`, tbl_documents.status, `project_code`, `rev`, `originator`, `originator2`, `discipline`,`document_type`,`document_zone`,`document_level`,`sequence_no`,`document_level`, `tbl_documents`.`remarks`"))
			->where([
				["tbl_document_reviewer.reviewer_id", $user->emp_id],
				["tbl_documents.is_deleted", 0],
				["tbl_documents.folder_id", $folder_id],
				["tbl_documents.status", 0]
			])
			->subqueriesDocs()
			->orderByDesc("document_id");
	}

	public function scopeApprovalDocs($query, $user, $folder_id)
	{
		return $query->where([
			["tbl_documents.approval_id", $user->emp_id],
			["tbl_documents.folder_id", $folder_id],
			["tbl_documents.is_deleted", 0],
			["tbl_documents.status", 0]
		])
			->subqueriesDocs()
			->orderByDesc("document_id");;
	}

	public function scopeDocControls($query, $folder_id)
	{
		return $query->where([
			["tbl_documents.folder_id", $folder_id],
			["tbl_documents.is_deleted", 0]
		])
			->groupBy("tbl_documents.document_id")
			->subqueriesDocs()
			->orderByDesc("tbl_documents.document_id");
	}

	public function scopeSubqueriesDocs($query)
	{
		return $query->with([
			"employee" => function ($query)
			{
				$query->with([
					"position",
					"department"
				]);
			},
			"comments",
			"reviewer_sign",
			"approval_sign",
			"files",
			"approval_employee",
			"reviewer_employees",
		]);
	}

	public function comments()
	{
		return $this->hasMany(DocumentCommentReplies::class, "document_id");
	}

	public function folder()
	{
		return $this->belongsTo(FolderModel::class, "folder_id");
	}

	public function files()
	{
		return $this->hasMany(FileModel::class, "document_id");
	}

	public function response_files()
	{
		return $this->hasMany(DocumentResponseFile::class, "document_id");
	}

	public function approval_sign()
	{
		return $this->hasOne(DocumentApprovalSign::class, "document_id");
	}

	public function reviewer_sign()
	{
		return $this->hasMany(DocumentReviewerSign::class, "document_id");
	}

	public function approval_employee()
	{
		return $this->hasOne(Employee::class, "employee_id", "approval_id");
	}

	public function reviewer_employees()
	{
		return $this->belongsToMany(Employee::class, "tbl_document_reviewer", "document_id", "reviewer_id")->withPivot(['review_status', 'review_document_id', 'remarks']);
	}

	public function employee()
	{
		return $this->belongsTo(Employee::class, "user_id", "employee_id");
	}

	public function user()
	{
		return $this->belongsTo(User::class, "user_id");
	}
}