<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\DocumentProjectDetail;
use App\Services\InspectionService;
use Illuminate\Http\Request;

class InspectionApiController extends Controller
{

	public function index()
	{
		return response()->json((new InspectionService)->getAllInspections());
	}

	public function employeeWithInspectionCount(Request $request)
	{
		$filterDate = $request->filterDate ? explode(",", $request->filterDate) : null;
		$authorizedPositions = $request->authorizedPositions ? explode(",", $request->authorizedPositions) : [];
		return response()->json((new InspectionService)->employees($filterDate, $authorizedPositions));
	}

	public function tracker()
	{
		$user = auth()->user();

		$inspectionService = new InspectionService();

		[$employees, $tracker] = $inspectionService->getAssignedEmployees();

		$sequenceNo = $inspectionService->tbtTrackerLatestSequenceNumber();


		$projectDetails = DocumentProjectDetail::where("sub_id", $user->subscriber_id)->get()->groupBy("title");

		return response()->json(compact("tracker", "employees", "projectDetails", "sequenceNo"));
	}

	public function assignedTracker() {
		$inspectionService = new InspectionService();
		$tracker = $inspectionService->getTracker();
		return response()->json($tracker);
	}
}
