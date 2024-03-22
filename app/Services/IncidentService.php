<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Incident;
use App\Models\IncidentType;
use App\Models\User;
use Carbon\Carbon;

class IncidentService {

	
	public function getList() {
		$incidentSelect = ["form_number", "id", "uuid", "supervisor_id", "injured_id", "location", "day_loss", "incident_date", "severity", "root_cause"];

		return Incident::select($incidentSelect)
		->with([
			"supervisor" => fn($q) => $q->select("employee_id", "firstname", "middlename", "lastname", "raw_position"),
			"injured" => fn($q) => $q->select("employee_id", "firstname", "middlename", "lastname", "raw_position"),
		])
		->whereNull("deleted_at")
		->get()
		->transform(fn($incident) => [
			"id" => $incident->id,
			"uuid" => $incident->uuid,
			"form_number" => $incident->form_number,
			"location" => $incident->location,
			"day_loss" => $incident->day_loss,
			"severity" => $incident->severity,
			"supervisor" => $incident->supervisor,
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
			$carry[$key] = $type->reduce(function($acc, $t) use($months) {
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

		$incidentSelect = ["day_loss", "incident_date", "severity", "root_cause", "incident", "nature", "indicator", "mechanism", "equipment", "body_part"];

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
		return cache()->rememberForever("employees:".auth()->user()->subscriber_id, fn() => Employee::select("employee_id","firstname", "lastname", "position", "is_deleted", "company", "sub_id", "user_id")->where("is_deleted", 0)->where("is_active", 0)->where("sub_id", $user->subscriber_id)->get());
	}

	
	public function sequence_no() {
		$latest = Incident::select("sequence_no")->latest()->first();
		$sequence = $latest ? (int)ltrim($latest->sequence_no) + 1 : 1;
		
		return str_pad(ltrim($sequence), 6, '0', STR_PAD_LEFT);
	}

	public function types($user) {
		return cache()->rememberForever("incidentTypes:". $user->subscriber_id, fn() => IncidentType::select("id", "name", "description", "type")->whereNull('deleted_at')->get())->groupBy("type");
	}

	public function insert(Request $request, User $user) {
		$incident = Incident::create([
			"project_code" => $request->project_code,
			"originator" => $request->originator,
			"discipline" => $request->discipline,
			"document_type" => $request->document_type,
			"document_zone" => $request->document_zone,
			"document_level" => $request->document_level,
			"injured_id" => $request->injured_id,
			"location" => $request->location,
			"incident" => $request->incident,
			"nature" => $request->nature ?? "other",
			"indicator" => $request->indicator,
			"mechanism" => $request->mechanism ?? "other",
			"severity" => $request->severity,
			"root_cause" => $request->root_cause ?? "other",
			"equipment" => $request->equipment,
			"body_part" => $request->body_part,
			"remarks" => $request->remarks,
			"incident_date" => $request->incident_date,
			"supervisor_id" => $request->supervisor_id,
			"day_loss" => $request->day_loss,
			"root_cause_other" => $request->root_cause_other,
			"mechanism_other" => $request->mechanism_other,
			"nature_other" => $request->nature_other,
			"employee_id" => $user->emp_id,
			"user_id" => $user->id,
		]);

		if($request->hasFile("employee_signiture")) {
			$incident->addMediaFromRequest("employee_signiture")->toMediaCollection("employee_signiture");
		}

		if($request->hasFile("supervisor_signiture")) {
			$incident->addMediaFromRequest("supervisor_signiture")->toMediaCollection("supervisor_signiture");
		}

		$incident->detail()->create([
			"incident_id" => $incident->id,
			"dr_name" => $request->dr_name,
			"dr_phone" => $request->dr_phone,
			"workday" => $request->workday,
			"unsafe_workplace" => $request->unsafe_workplace,
			"unsafe_workplace_reason" => $request->unsafe_workplace_reason,
			"unsafe_workplace_other" => $request->unsafe_workplace_other,
			"unsafe_act" => $request->unsafe_act,
			"unsafe_act_reason" => $request->unsafe_act_reason,
			"unsafe_act_other" => $request->unsafe_act_other,
			"prevention" => $request->prevention,
			"witnesses" => $request->witnesses,
			"similar_incident" => $request->similar_incident,
			"step_by_step" => $request->step_by_step
		]);
	}



}