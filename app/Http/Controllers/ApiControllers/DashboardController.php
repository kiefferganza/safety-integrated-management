<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use App\Models\Training;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
	public function sliderImages() {
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getSliderImages());
	}


	public function toolboxtalks(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json($dashboardService->getTbtByDate($from, $to));
	}

	public function tbtStatistics(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json($dashboardService->getTbtStatisticByDate($from, $to));
	}

	public function trainings() {
		return response()->json(Training::select("type", "training_hrs", "training_date")->where("is_deleted", 0)->withCount("training_files")->get());
	}

	public function inspections(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json($dashboardService->getInspectionByDate($from, $to));
	}

	public function incidents() {
		$dashboardService = new DashboardService;
		return response()->json($dashboardService->getIncidents());
	}

}
