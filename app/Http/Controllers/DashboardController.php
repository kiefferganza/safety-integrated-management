<?php

namespace App\Http\Controllers;

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
		$user = Auth::user();

		$now = Carbon::now();

		return Inertia::render("Dashboard/General/Analytics/index", [
			// "toolboxtalks" => [
			// 	"participants" => ToolboxTalk::select("tbt_id", "employee_id")
			// 		->with([
			// 			"participants"
			// 		])
			// 		->where("employee_id", $user->emp_id)
			// 		->get(),
			// 	"tbt" => ToolboxTalk::select(DB::raw("COUNT(`tbt_id`) as total_tbt_itd"))
			// 		->whereRaw("YEAR(date_conducted) <= ? AND MONTH (date_conducted) <= ?", [$now->year, $now->month])
			// 		->where([
			// 			["tbl_toolbox_talks.is_deleted", 0],
			// 			["employee_id", $user->emp_id]
			// 		])
			// 		->first(),
			// ],
			"toolboxtalks" => ToolboxTalk::select("tbt_id", "employee_id")
				->with([
					"participants"
				])
				->where("employee_id", $user->emp_id)
				->get(),
			"trainees" => TrainingTrainees::select(DB::raw("COALESCE(sum(training_hrs),0) as total_hours"))
				->join("tbl_trainings", "tbl_training_trainees.training_id", "tbl_trainings.training_id")
				->where("tbl_trainings.is_deleted", 0)
				->first(),
		]);
	}
}
