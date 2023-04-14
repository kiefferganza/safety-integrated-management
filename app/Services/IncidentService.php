<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Incident;
use App\Models\IncidentType;

class IncidentService {

	
	public function getList() {
		$incidentSelect = ["form_number", "id", "uuid", "first_aider_id", "engineer_id", "injured_id", "location", "site", "lti", "incident_date", "severity", "root_cause"];

		return Incident::select($incidentSelect)
		->with([
			"firstAider" => fn($q) => $q->select("employee_id", "firstname", "middlename", "lastname", "raw_position"),
			"engineer" => fn($q) => $q->select("employee_id", "firstname", "middlename", "lastname", "raw_position"),
			"injured" => fn($q) => $q->select("employee_id", "firstname", "middlename", "lastname", "raw_position"),
		])
		->whereNull("deleted_at")
		->get()
		->transform(fn($incident) => [
			"id" => $incident->id,
			"uuid" => $incident->uuid,
			"form_number" => $incident->form_number,
			"location" => $incident->location,
			"site" => $incident->site,
			"lti" => $incident->lti,
			"severity" => $incident->severity,
			"firstAider" => $incident->firstAider,
			"engineer" => $incident->engineer,
			"injured" => $incident->injured,
			"root_cause" => $incident->root_cause,
			"incident_date" => $incident->incident_date,
		]);
	}


	public function employees($user) {
		return cache()->rememberForever("employees:".auth()->user()->subscriber_id, fn() => Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id", "user_id")->where("is_deleted", 0)->where("sub_id", $user->subscriber_id)->get());
	}

	
	public function sequence_no() {
		$latest = Incident::select("sequence_no")->latest()->first();
		$sequence = $latest ? (int)ltrim($latest->sequence_no) + 1 : 1;
		
		return str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);
	}

	public function types($user) {
		return cache()->rememberForever("incidentTypes:". $user->subscriber_id, fn() => IncidentType::select("id", "name", "type")->whereNull('deleted_at')->get())->groupBy("type");
	}



}