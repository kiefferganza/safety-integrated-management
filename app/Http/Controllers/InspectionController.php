<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Inspection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InspectionController extends Controller
{
	public function index()
	{
		$user = Auth::user();

		$emp_id = $user->user_id;

		$inspections =	Inspection::select("inspection_id","employee_id", "reviewer_id", "verifier_id","accompanied_by", "date_issued", "form_number", "status")
		->whereRaw("(employee_id = ? AND is_deleted = 0) OR (reviewer_id = ? AND status = 1 AND is_deleted = 0) OR (verifier_id = ? AND status = 2 AND is_deleted = 0) OR (status != 0 AND is_deleted = 0)", array($emp_id, $emp_id, $emp_id))
		->with([
			"submitted",
			"reviewer",
			"verifier"
		])
		->get()
		->toArray();

		$submitted = array();
		$review = array();
		$verify = array();
		$closeout = array();

		foreach ($inspections as $inspection) {
			if($inspection["employee_id"] === $emp_id) {
				$submitted[] = $inspection;
			}else if($inspection["reviewer_id"] === $emp_id && $inspection["status"] === 1){
				$review[] = $inspection;
			}else if($inspection["verifier_id"] === $emp_id && $inspection["status"] === 2){
				$verify[] = $inspection;
			}else if($inspection["status"] !== 0) {
				$closeout[] = $inspection;
			}
		}

		return Inertia::render("Dashboard/Management/Inspection/List/index", [
			"inspections" => $inspections,
		]);
	}



	public function create() {
		$user = Auth::user();

		$count_inspections = Inspection::where('is_deleted', 0)->count();

		$number_of_items =  $count_inspections + 1;
		$number_of_digits = strlen((string) $number_of_items);
		$number_of_zeroes =  5 - $number_of_digits;

		$sequence_no_zeros = '';
		for ($i = 0; $i <= $number_of_zeroes; $i++) {
			$sequence_no_zeros = $sequence_no_zeros . "0";
		}

		return Inertia::render("Dashboard/Management/Inspection/Create/index", [
			"personel" =>  Employee::select("employee_id", "firstname", "lastname")->where([
				["is_deleted", 0],
				["employee_id", "!=", $user->emp_id]
			])->get(),
			"sequence_no" => $sequence_no_zeros . $number_of_items,
		]);
	}



}
