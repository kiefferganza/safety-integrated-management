<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Incident;
use App\Models\IncidentType;

class IncidentService {

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