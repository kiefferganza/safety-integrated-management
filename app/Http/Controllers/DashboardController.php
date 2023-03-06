<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkParticipant;
use App\Models\Training;
use App\Models\TrainingTrainees;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index() {
			
		return Inertia::render("Dashboard/General/HSEDashboard/index", [
			"trainings" => Training::select("type", "training_hrs", "training_date")->where("is_deleted", 0)->withCount("training_files")->get(),
			"tbtStatistics" => TbtStatistic::select("id","year")->with("months:id,tbt_statistic_id,manhours,manpower,month_code")->get()
		]);
	}
}
