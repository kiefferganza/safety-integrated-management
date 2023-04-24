<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Incident extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

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


	public function supervisor() {
		return $this->hasOne(Employee::class, "employee_id", "supervisor_id");
	}

	public function injured() {
		return $this->hasOne(Employee::class, "employee_id", "injured_id");
	}

	public function detail() {
		return $this->hasOne(IncidentDetail::class, "id", "incident_id");
	}


}
