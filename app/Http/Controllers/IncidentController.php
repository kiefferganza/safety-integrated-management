<?php

namespace App\Http\Controllers;

use App\Models\DocumentProjectDetail;
use App\Models\Incident;
use App\Services\IncidentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
	public function index() {
		$incidentService = new IncidentService;

		return Inertia::render("Dashboard/Management/Incident/List/index", [
			"incidents" => $incidentService->getList(),
			"types" => $incidentService->types(auth()->user())
		]);
	}


	public function show(Incident $incident) {
		$incident->load([
			"detail",
			"supervisor",
			"injured"
		]);
		$incident->getFirstMedia();
		dd($incident);
	}


	public function create() {
		$user = auth()->user();

		$incidentService = new IncidentService;

		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Incident/Create/index", [
			"employees" => $incidentService->employees($user),
			"sequence_no" => $incidentService->sequence_no(),
			"types" => $incidentService->types($user),
			"projectDetails" => $projectDetails
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
			"day_loss" => ["required", "integer"],
			"injured_id" => ["required", "integer"],
			"supervisor_id" => ["required", "integer"],
			"incident" => ["required", "string"],
			"nature" => ["required", "string"],
			"indicator" => ["required", "string"],
			"root_cause" => ["required", "string"],
			"mechanism" => ["required", "string"],
			"equipment" => ["required", "string"],
			"severity" => ["required", "string"],
			"body_part" => ["required", "string"],
			"remarks" => ["string", "nullable"],
			"incident_date" => ["string", "required"],
		]);

		$user = auth()->user();
		$incidentService = new IncidentService;

		$incidentService->insert($request, $user);
		
		return redirect()->back()
		->with("message", "Incident submitted successfully!")
		->with("type", "success");
	}


	public function edit(Incident $incident) {
		$user = auth()->user();

		$incidentService = new IncidentService;

		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');

		return Inertia::render("Dashboard/Management/Incident/Edit/index", [
			"incident" => $incident,
			"employees" => $incidentService->employees($user),
			"types" => $incidentService->types($user),
			"projectDetails" => $projectDetails
		]);
	}


	public function update(Request $request, Incident $incident) {
		$incident->incident_date = $request->incident_date;
		$incident->body_part = $request->body_part;
		$incident->severity = $request->severity;
		$incident->equipment = $request->equipment;
		$incident->mechanism = $request->mechanism;
		$incident->root_cause = $request->root_cause;
		$incident->indicator = $request->indicator;
		$incident->nature = $request->nature;
		$incident->incident = $request->incident;
		$incident->first_aider_id = $request->first_aider_id;
		$incident->engineer_id = $request->engineer_id;
		$incident->injured_id = $request->injured_id;
		$incident->site = $request->site;
		$incident->lti = $request->lti;
		$incident->location = $request->location;
		$incident->document_type = $request->document_type;
		$incident->discipline = $request->discipline;
		$incident->originator = $request->originator;
		$incident->project_code = $request->project_code;
		$incident->sequence_no = $request->sequence_no;
		$incident->document_zone = $request->document_zone;
		$incident->document_level = $request->document_level;
		$incident->findings = $request->findings;
		$incident->first_aid = $request->first_aid;
		$incident->remarks = $request->remarks;
		$incident->increment("revision_no");
		$incident->save();

		return redirect()->back()
		->with("message", "Incident updated successfully!")
		->with("type", "success");
	}



	public function destroy(Request $request) {
		Incident::whereIn("id", $request->ids)->update(["deleted_at" => now()]);

		return redirect()->back()
		->with("message", "Incident's deleted successfully!")
		->with("type", "success");
	}


	public function reportList(Request $request) {
		$incidentService = new IncidentService;

		$year = $request->year ?? now()->year;

		$results = $incidentService->getReportList($year);
		
		return Inertia::render("Dashboard/Management/Incident/Report/index", $results->all());
	}

}
