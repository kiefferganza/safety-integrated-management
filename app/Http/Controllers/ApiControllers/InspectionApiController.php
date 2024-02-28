<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Services\InspectionService;
use Illuminate\Http\Request;

class InspectionApiController extends Controller
{

 public function index()
	{
  return response()->json((new InspectionService)->getAllInspections());
	}

	public function employeeWithInspectionCount(Request $request) {
		$positions = $request->positions ? explode(",", $request->positions) : "";
		return response()->json((new InspectionService)->employees($request->filterDate, $positions));
	}
}