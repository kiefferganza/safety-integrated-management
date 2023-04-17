<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Incident extends Model
{
	use HasFactory;

	protected $table = 'incidents';

	protected $guarded = [];

	protected static function boot() {
		parent::boot();

		static::creating(function ($inventoryReport) {
			$latest = Incident::select("sequence_no")->latest()->first();
			$sequence = $latest ? (int)ltrim($latest->sequence_no) + 1 : 1;
			$inventoryReport->sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);

			$form_number = sprintf("%s-%s-%s-%s", $inventoryReport->project_code, $inventoryReport->originator,$inventoryReport->discipline,$inventoryReport->document_type);
			if($inventoryReport->document_zone) {
				$form_number .= "-". $inventoryReport->document_zone;
			}
			if($inventoryReport->document_level) {
				$form_number .= "-". $inventoryReport->document_level;
			}
			$form_number .= "-" . $inventoryReport->sequence_no;
			$inventoryReport->form_number = $form_number;
			$inventoryReport->uuid = (string)Str::uuid();
		});

	}



	public function firstAider() {
		return $this->hasOne(Employee::class, "employee_id", "first_aider_id");
	}

	public function engineer() {
		return $this->hasOne(Employee::class, "employee_id", "engineer_id");
	}

	public function injured() {
		return $this->hasOne(Employee::class, "employee_id", "injured_id");
	}


}
