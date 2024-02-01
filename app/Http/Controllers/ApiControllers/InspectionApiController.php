<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Services\InspectionService;

class InspectionAPIController extends Controller
{

 public function index()
	{
  return response()->json((new InspectionService)->getAllInspections());
	}
}