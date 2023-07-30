<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentExternalHistory extends Model
{
    use HasFactory;

	protected $guarded = [];

	public function document() {
		return $this->belongsTo(Document::class, 'document_id');
	}

	public function approver() {
		return $this->belongsTo(DocumentExternalApprover::class, 'approver');
	}
}
