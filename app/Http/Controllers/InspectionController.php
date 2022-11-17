<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InspectionController extends Controller
{
	public function index()
	{
		$user = Auth::user();
		$submitted = DB::table('tbl_inspection_reports')
			->select(DB::raw("tbl_inspection_reports.inspection_id, 
			tbl_inspection_reports.project_code, 
			tbl_inspection_reports.sequence_no, 
			tbl_inspection_reports.form_number, 
			tbl_inspection_reports.location, 
			tbl_inspection_reports.inspected_by, 
			tbl_inspection_reports.accompanied_by, 
			tbl_inspection_reports.inspected_date, 
			tbl_inspection_reports.inspected_time, 
			tbl_inspection_reports.avg_score, 
			tbl_inspection_reports.`status`, 
			tbl_inspection_reports.employee_id, 
			tbl_inspection_reports.date_issued,
			tbl_inspection_reports.date_due, 
			tbl_inspection_reports.reviewer_id"))
			->join("tbl_employees", "tbl_inspection_reports.employee_id", "tbl_employees.employee_id")
			->join("tbl_company", "tbl_employees.company", "tbl_company.company_id")
			->where([
				["tbl_inspection_reports.employee_id", $user->emp_id],
				["tbl_inspection_reports.is_deleted", 0]
			])
			->get();
		$review = DB::table('tbl_inspection_reports')
			->select(DB::raw("tbl_inspection_reports.inspection_id, 
			tbl_inspection_reports.project_code, 
			tbl_inspection_reports.sequence_no, 
			tbl_inspection_reports.form_number, 
			tbl_inspection_reports.location, 
			tbl_inspection_reports.inspected_by, 
			tbl_inspection_reports.accompanied_by, 
			tbl_inspection_reports.inspected_date, 
			tbl_inspection_reports.inspected_time, 
			tbl_inspection_reports.avg_score, 
			tbl_inspection_reports.`status`, 
			tbl_inspection_reports.employee_id, 
			tbl_inspection_reports.date_issued,
			tbl_inspection_reports.date_due, 
			tbl_inspection_reports.reviewer_id"))
			->join("tbl_employees", "tbl_inspection_reports.employee_id", "tbl_employees.employee_id")
			->join("tbl_company", "tbl_employees.company", "tbl_company.company_id")
			->where([
				["tbl_inspection_reports.reviewer_id", $user->emp_id],
				["tbl_inspection_reports.status", 1],
				["tbl_inspection_reports.is_deleted", 0]
			])
			->get();

		$verify = DB::table('tbl_inspection_reports')
			->select(DB::raw("tbl_inspection_reports.inspection_id, 
			tbl_inspection_reports.project_code, 
			tbl_inspection_reports.sequence_no, 
			tbl_inspection_reports.form_number, 
			tbl_inspection_reports.location, 
			tbl_inspection_reports.inspected_by, 
			tbl_inspection_reports.accompanied_by, 
			tbl_inspection_reports.inspected_date, 
			tbl_inspection_reports.inspected_time, 
			tbl_inspection_reports.avg_score, 
			tbl_inspection_reports.`status`, 
			tbl_inspection_reports.employee_id, 
			tbl_inspection_reports.date_issued,
			tbl_inspection_reports.date_due, 
			tbl_inspection_reports.reviewer_id"))
			->join("tbl_employees", "tbl_inspection_reports.employee_id", "tbl_employees.employee_id")
			->join("tbl_company", "tbl_employees.company", "tbl_company.company_id")
			->where([
				["tbl_inspection_reports.verifier_id", $user->emp_id],
				["tbl_inspection_reports.status", 2],
				["tbl_inspection_reports.is_deleted", 0]
			])
			->get();

		$closeout = DB::table('tbl_inspection_reports')
			->select(DB::raw("tbl_inspection_reports.inspection_id, 
			tbl_inspection_reports.project_code, 
			tbl_inspection_reports.sequence_no, 
			tbl_inspection_reports.form_number, 
			tbl_inspection_reports.location, 
			tbl_inspection_reports.inspected_by, 
			tbl_inspection_reports.accompanied_by, 
			tbl_inspection_reports.inspected_date, 
			tbl_inspection_reports.inspected_time, 
			tbl_inspection_reports.avg_score, 
			tbl_inspection_reports.`status`, 
			tbl_inspection_reports.employee_id, 
			tbl_inspection_reports.date_issued,
			tbl_inspection_reports.date_due, 
			tbl_inspection_reports.reviewer_id"))
			->join("tbl_employees", "tbl_inspection_reports.employee_id", "tbl_employees.employee_id")
			->join("tbl_company", "tbl_employees.company", "tbl_company.company_id")
			->where([
				["tbl_inspection_reports.status", "!=", 0],
				["tbl_inspection_reports.is_deleted", 0]
			])
			->get();

		return Inertia::render("Inspection/Form", ["submitted" => $submitted, "review" => $review, "verify" => $verify, "closeout" => $closeout]);
	}
}
