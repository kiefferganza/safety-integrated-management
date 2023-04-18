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

		static::creating(function ($incident) {
			$latest = Incident::select("sequence_no")->latest()->first();
			$sequence = $latest ? (int)ltrim($latest->sequence_no) + 1 : 1;
			$incident->sequence_no = str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);

			$form_number = sprintf("%s-%s-%s-%s", $incident->project_code, $incident->originator,$incident->discipline,$incident->document_type);
			if($incident->document_zone) {
				$form_number .= "-". $incident->document_zone;
			}
			if($incident->document_level) {
				$form_number .= "-". $incident->document_level;
			}
			$form_number .= "-" . $incident->sequence_no;
			$incident->form_number = $form_number;
			$incident->uuid = (string)Str::uuid();
		});

		static::updating(function ($incident) {
			$form_number = sprintf("%s-%s-%s-%s", $incident->project_code, $incident->originator,$incident->discipline,$incident->document_type);
			if($incident->document_zone) {
				$form_number .= "-". $incident->document_zone;
			}
			if($incident->document_level) {
				$form_number .= "-". $incident->document_level;
			}
			$form_number .= "-" . $incident->sequence_no;
			$incident->form_number = $form_number;
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
