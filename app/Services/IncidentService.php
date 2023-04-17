<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Incident;
use App\Models\IncidentType;
use Carbon\Carbon;

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

	public function getReportList($year) {
		$months = [
			"1" => [
				"value" => 0,
			],
			"2" => [
				"value" => 0,
			],
			"3" => [
				"value" => 0,
			],
			"4" => [
				"value" => 0,
			],
			"5" => [
				"value" => 0,
			],
			"6" => [
				"value" => 0,
			],
			"7" => [
				"value" => 0,
			],
			"8" => [
				"value" => 0,
			],
			"9" => [
				"value" => 0,
			],
			"10" => [
				"value" => 0,
			],
			"11" => [
				"value" => 0,
			],
			"12" => [
				"value" => 0,
			],
		];
		$user = auth()->user();

		$types = $this->types($user);

		$reportByTypes = $types->reduce(function($carry, $type, $key) use ($months) {
			$carry[$key] = $type->reduce(function($acc, $t) use($months, $carry) {
				if($t->type === "indicator") {
					$acc[$t->name] = [
						"months" => $months,
						"total" => 0,
						"name" => $t->name
					];
				}else {
					$acc[$t->name] = 0;
				}
				return $acc;
			}, []);
			return $carry;
		}, [
			"lti" => $months
		]);

		$incidentSelect = ["lti", "incident_date", "severity", "root_cause", "incident", "nature", "indicator", "mechanism", "equipment", "body_part"];

		$incidents = Incident::select($incidentSelect)
		->whereYear("incident_date", $year)
		->whereNull("deleted_at")
		->get()
		->reduce(function($carry, $incident) {
			$month = Carbon::create($incident->incident_date)->month;
			$carry["lti"][$month]["value"] += $incident->lti;

			$carry["indicator"][$incident->indicator]["months"][$month]["value"] += 1;
			$carry["indicator"][$incident->indicator]["total"] += $carry["indicator"][$incident->indicator]["months"][$month]["value"];
			$carry["indicatorTotal"] = isset($carry["indicatorTotal"]) ? $carry["indicatorTotal"] + 1 : 1;

			$carry["root_cause"][$incident->root_cause] += 1;

			$carry["severity"][$incident->severity] += 1;
			$carry["severityTotal"] = isset($carry["severityTotal"]) ? $carry["severityTotal"] + 1 : 1;
			
			$carry["nature"][$incident->nature] += 1;
			$carry["natureTotal"] = isset($carry["natureTotal"]) ? $carry["natureTotal"] + 1 : 1;
			
			$carry["mechanism"][$incident->mechanism] += 1;
			$carry["mechanismTotal"] = isset($carry["mechanismTotal"]) ? $carry["mechanismTotal"] + 1 : 1;

			$equipments = explode(",", $incident->equipment);

			foreach ($equipments as $equipment) {
				$carry["equipment"][$equipment] += 1;
				$carry["equipmentTotal"] = isset($carry["equipmentTotal"]) ? $carry["equipmentTotal"] + 1 : 1;
			}

			$bodyParts = explode(",", $incident->body_part);

			foreach ($bodyParts as $bodyPart) {
				$carry["body_part"][$bodyPart] += 1;
				$carry["bodyPartTotal"] = isset($carry["bodyPartTotal"]) ? $carry["bodyPartTotal"] + 1 : 1;
			}

			return $carry;
		}, $reportByTypes);

		return collect([
			"incidents" => count($incidents) < 0 ? $reportByTypes : $incidents
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