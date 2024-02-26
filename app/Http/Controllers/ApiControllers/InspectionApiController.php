<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Services\InspectionService;

class InspectionApiController extends Controller
{

 public function index()
	{
  return response()->json((new InspectionService)->getAllInspections());
	}

	public function employeeWithInspectionCount() {
		return response()->json((new InspectionService)->employees());
	}
}