<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
	public function index(Request $request) {
		$dashboardService = new DashboardService;
		dd($dashboardService, $request->all());
			
		// if($request->from && $request->to) {
		// 	$from = new Carbon($request->from);
		// 	$to = (new Carbon($request->to))->endOfDay();
		// }else {
		// 	$fromTbt = ToolboxTalk::select("date_created")->orderByDesc("date_created")->first();
		// 	$fromTbtStat = TbtStatistic::select("year")->orderByDesc("year")->first();
		// 	$toTbt = ToolboxTalk::select("date_created")->orderBy("date_created")->first();
		// 	$toTbtStat = TbtStatistic::select("year")->orderBy("year")->first();
		// 	$fromToArr = [
		// 		$fromTbt->date_created,
		// 		$toTbt->date_created,
		// 		$fromTbtStat->year ? new Carbon((string) $fromTbtStat->year . '-1-1') : null,
		// 		$toTbtStat->year ? new Carbon((string) $toTbtStat->year . '-1-1') : null
		// 	];
		// 	$from = min($fromToArr);
		// 	$to = max($fromToArr)->hour(11)->minutes(59)->second(59);
		// }
	}


	public function sliderImages() {
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getSliderImages());
	}


	public function toolboxtalks(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json([
			$dashboardService->getTbtByDate($from, $to),
		]);
	}

	public function tbtStatistics(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json([
			$dashboardService->getTbtStatisticByDate($from, $to),
		]);
	}

}
