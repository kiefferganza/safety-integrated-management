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
		$now = Carbon::now();

		$date1 = date('Y-m-d', strtotime(date($now->year . "-" . $now->month)));

		$get_itds_table_data = DB::table("tbl_toolbox_talks")->join("tbl_toolbox_talks_participants", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
			->select(DB::raw("COUNT(*) as count, MONTH(date_conducted)  as itd_month, COUNT('tbtp_id') as totals_days, SUM(time) as total_itd, SUM( case when tbl_toolbox_talks.is_deleted = 0 AND YEAR(date_conducted) = $now->year AND MONTH(date_conducted) = $now->month then time else 0 end) as total_hours_selected_month, COUNT( case when tbl_toolbox_talks.is_deleted = 0 AND YEAR(date_conducted) = $now->year AND MONTH(date_conducted) = $now->month then tbtp_id else 0 end) as total_participants_per_month"))
			->whereRaw("date_format(date_conducted, '%Y-%m') <= date_format('$date1', '%Y-%m')")
			->where("is_deleted", "=", 0)
			->orderBy("date_conducted")
			->first();

		$get_itds_manual2 = DB::table('tbl_tds')
			->select(DB::raw("SUM(total_hours_civils + total_hours_office + total_hours_electricals + total_hours_mechanicals + total_hours_camps) as total_itds"))
			->where([
				["itd_year", "<=", $now->year],
				["is_deleted", 0],
			])
			->first();


		$get_contractors = DB::table("tbl_toolbox_talks")
			->leftJoin("tbl_toolbox_talks_participants", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
			->leftJoin("tbl_employees", "tbl_toolbox_talks_participants.employee_id", "tbl_employees.employee_id")
			->select(DB::raw("`date_conducted`, COUNT(case when company_type='main contractor' then tbtp_id else null end) as total_main_contractors, COUNT(case when company_type='sub contractor' then tbtp_id else null end) as total_sub_contractors"))
			->whereRaw("YEAR ( tbl_toolbox_talks.date_conducted ) = ? AND MONTH ( tbl_toolbox_talks.date_conducted ) = ?", [$now->year, 04])
			->where([
				["tbl_toolbox_talks.is_deleted", 0],
				["tbl_employees.is_deleted", 0]
			])
			->first();

		$tbt = ToolboxTalk::select(DB::raw("COUNT(`tbt_id`) as total_tbt"))
		->where("tbl_toolbox_talks.is_deleted", 0);

			
		return Inertia::render("Dashboard/General/Analytics/index", [
			"data" => [
				"itds_data" => $get_itds_table_data,
				"itds_manual" => $get_itds_manual2,
				"contractors" => $get_contractors,
				"training_hours" => [
					"this_month" => TrainingTrainees::join("tbl_trainings", "tbl_training_trainees.training_id", "tbl_trainings.training_id")
						->select(DB::raw("COALESCE(sum(training_hrs),0) as total_hours"))
						->whereRaw("YEAR(training_date) = ? AND MONTH (training_date) = ?", [$now->year, $now->month])
						->where("tbl_trainings.is_deleted", 0)
						->first(),
					"itd" => TrainingTrainees::join("tbl_trainings", "tbl_training_trainees.training_id", "tbl_trainings.training_id")
						->select(DB::raw("COALESCE(sum(training_hrs),0) as total_training_itd"))
						->where("tbl_trainings.is_deleted", 0)
						->first()
				],
				"tbt" => [
					"itd" => $tbt->first(),
					"this_month" => $tbt->whereRaw("YEAR(date_conducted) = ? AND MONTH(date_conducted) = ?", [$now->year, $now->month])->first()
				]
			],
		]);
	}
}
