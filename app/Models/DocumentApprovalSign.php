<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentApprovalSign extends Model
{
	use HasFactory;

	protected $table = 'tbl_document_approval_sign';

	protected $primaryKey = 'approval_sign_id';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		"document_id",
		"user_id",
		"src",
		"is_deleted",
		"created_at",
		"updated_at"
	];

}
