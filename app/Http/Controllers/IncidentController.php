<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Services\IncidentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
	public function index() {
		$incidentSelect = ["form_number", "id", "uuid", "first_aider_id", "engineer_id", "injured_id", "location", "site", "lti", "incident_date", "severity"];

		return Inertia::render("Dashboard/Management/Incident/List/index", [
			"incidents" => Incident::select($incidentSelect)
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
					"incident_date" => $incident->incident_date,
				])
		]);
	}


	public function create() {
		$user = auth()->user();

		$incidentService = new IncidentService;

		return Inertia::render("Dashboard/Management/Incident/Create/index", [
			"employees" => $incidentService->employees($user),
			"sequence_no" => $incidentService->sequence_no(),
			"types" => $incidentService->types($user)
		]);
	}


	public function store(Request $request) {
		$request->validate([
			"project_code" => ["required", "string"],
			"originator" => ["required", "string"],
			"discipline" => ["required", "string"],
			"document_type" => ["required", "string"],
			"document_zone" => ["string", "nullable"],
			"document_level" => ["string", "nullable"],
			"location" => ["required", "string"],
			"lti" => ["required", "integer"],
			"site" => ["required", "string"],
			"injured_id" => ["required", "integer"],
			"engineer_id" => ["required", "integer"],
			"first_aider_id" => ["required", "integer"],
			"incident" => ["required", "string"],
			"nature" => ["required", "string"],
			"indicator" => ["required", "string"],
			"root_cause" => ["required", "string"],
			"mechanism" => ["required", "string"],
			"equipment" => ["required", "string"],
			"severity" => ["required", "string"],
			"body_part" => ["required", "string"],
			"findings" => ["string", "nullable"],
			"first_aid" => ["string", "nullable"],
			"remarks" => ["string", "nullable"],
			"incident_date" => ["string", "required"],
		]);
		$user = auth()->user();
		
		$fields = $request->all();
		$fields["employee_id"] = $user->emp_id;
		$fields["user_id"] = $user->user_id;

		Incident::create($fields);
		
		return redirect()->back()
		->with("message", "Incident submitted successfully!")
		->with("type", "success");
	}


}
