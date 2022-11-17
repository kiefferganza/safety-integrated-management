<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IncidentController extends Controller
{
	public function index() {
		$user = Auth::user();
		$employee_id = $user->employee->employee_id;
		$incidents = DB::table('tbl_first_aid')
		->join("tbl_incident", "tbl_first_aid.incident_type", "tbl_incident.incident_id")
		->join("tbl_root_causes", "tbl_first_aid.root_causes", "tbl_root_causes.cause_id")
		->join("tbl_employees", "tbl_first_aid.emp_id", "tbl_employees.employee_id")
		->select(DB::raw("`fa_id`,
		`location`,
		`nature`,
		`injured_id`,
		`engineer_id`,
		`severity`,
		`age`,
		`treatment`,
		`nurse_findings`,
		`lti_injured`,
		`incident_type`,
		`incident`,
		`root_causes`,
		tbl_first_aid.date_created,
		`first_aider_id`,
		`cause`,
		(SELECT CONCAT(firstname,' ',lastname) FROM tbl_employees WHERE employee_id = engineer_id) as engineer_name,
		(SELECT CONCAT(firstname,' ',lastname) FROM tbl_employees WHERE employee_id = injured_id) as injured_name,
		(SELECT CONCAT(firstname,' ',lastname) FROM tbl_employees WHERE employee_id = first_aider_id) as first_aider_name"))
		->where([
			["tbl_first_aid.is_deleted", 0],
			["emp_id", $employee_id],
			["sub_id", $user->subscriber_id]
		])
		->get();
		return Inertia::render('Incident/Firstaid', ["incidents" => $incidents]);
	}
}
