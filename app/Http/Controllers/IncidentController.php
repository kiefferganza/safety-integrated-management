<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Services\IncidentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
	public function index() {
		return Inertia::render('Incident/Firstaid');
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
		]);

		Incident::create($request->all());
		
		return redirect()->back()
		->with("message", "Incident submitted successfully!")
		->with("type", "success");
	}


}
