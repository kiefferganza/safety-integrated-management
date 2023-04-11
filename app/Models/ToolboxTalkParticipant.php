<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalkParticipant extends Model
{
	use HasFactory;

	protected $table = 'tbl_toolbox_talks_participants';

	protected $primaryKey = 'tbtp_id';

	const CREATED_AT = 'date_added';
	const UPDATED_AT = 'date_updated';

	protected $guarded = [];

	public function employee() {
		return $this->belongsTo(Employee::class, "employee_id");
	}

	public function toolboxtalk() {
		return $this->belongsTo(ToolboxTalk::class, "tbt_id");
	}

}
