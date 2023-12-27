<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {		
			if($request->from && $request->to) {
				$from = new Carbon($request->from);
				$to = (new Carbon($request->to))->hour(11)->minutes(59)->second(59);
			}else {
				$fromTbt = ToolboxTalk::select("date_created")->orderByDesc("date_created")->first();
				$fromTbtStat = TbtStatistic::select("year")->orderByDesc("year")->first();
				$toTbt = ToolboxTalk::select("date_created")->orderBy("date_created")->first();
				$toTbtStat = TbtStatistic::select("year")->orderBy("year")->first();
				$fromToArr = [
					$fromTbt->date_created,
					$toTbt->date_created,
					$fromTbtStat->year ? new Carbon((string) $fromTbtStat->year . '-1-1') : null,
					$toTbtStat->year ? new Carbon((string) $toTbtStat->year . '-1-1') : null
				];
				$from = min($fromToArr);
				$to = max($fromToArr)->endOfMonth()->hour(11)->minutes(59)->second(59);
			}
			
			return Inertia::render("Dashboard/General/HSEDashboard/index", [
				"from" => $from,
				"to" => $to
			]);
    }
}
