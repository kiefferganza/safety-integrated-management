<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentReviewer extends Model
{
    use HasFactory;

    protected $table = 'tbl_document_reviewer';

    protected $primaryKey = 'review_document_id';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'originator_id',
        'document_id',
        'reviewer_id',
        'review_status',
        'folder_id',
        'is_deleted',
        'date_reviewed'
    ];

		public function documents() {
			// return $this->belongsToMany(Document::class, 'document_id',)
		}
		
		public function users() {
			// return $this->belongsToMany(Employee::class, "employee_id", "reviewer_id");
		}
}
