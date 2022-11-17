<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index(Request $request)
	{

		// $fields = $request->all();
		// if (empty($fields))
		// {
		// 	$fields = array(
		// 		"year" => date("Y"),
		// 		"select_month" => date("m")
		// 	);
		// }

		// $user = Auth::user();

		// $date1 = date('Y-m-d', strtotime(date($fields['year'] . "-" . $fields['select_month'])));
		// $year = $fields['year'];
		// $select_month = $fields['select_month'];

		// $get_itds_table_data = DB::table("tbl_toolbox_talks")->join("tbl_toolbox_talks_participants", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
		// 	->select(DB::raw("COUNT(*) as count, MONTH(date_conducted)  as itd_month, COUNT('tbtp_id') as totals_days, SUM(time) as total_itd, SUM( case when tbl_toolbox_talks.is_deleted = 0 AND YEAR(date_conducted) = $year AND MONTH(date_conducted) = $select_month then time else 0 end) as total_hours_selected_month, COUNT( case when tbl_toolbox_talks.is_deleted = 0 AND YEAR(date_conducted) = $year AND MONTH(date_conducted) = $select_month then tbtp_id else 0 end) as total_participants_per_month"))
		// 	->whereRaw("date_format(date_conducted, '%Y-%m') <= date_format('$date1', '%Y-%m')")
		// 	->where("is_deleted", "=", 0)
		// 	->orderBy("date_conducted")
		// 	->first();

		// $get_itds_manual2 = DB::table('tbl_tds')
		// 	->select(DB::raw("SUM(total_hours_civils + total_hours_office + total_hours_electricals + total_hours_mechanicals + total_hours_camps) as total_itds"))
		// 	->where([
		// 		["itd_year", "<=", $year],
		// 		["is_deleted", 0],
		// 	])
		// 	->first();

		// $get_contractors = DB::table("tbl_toolbox_talks")
		// 	->leftJoin("tbl_toolbox_talks_participants", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
		// 	->leftJoin("tbl_employees", "tbl_toolbox_talks_participants.employee_id", "tbl_employees.employee_id")
		// 	->select(DB::raw("`date_conducted`, COUNT(case when company_type='main contractor' then tbtp_id else null end) as total_main_contractors, COUNT(case when company_type='sub contractor' then tbtp_id else null end) as total_sub_contractors"))
		// 	->whereRaw("YEAR ( tbl_toolbox_talks.date_conducted ) = ? AND MONTH ( tbl_toolbox_talks.date_conducted ) = ?", [$year, $select_month])
		// 	->where([
		// 		["tbl_toolbox_talks.is_deleted", 0],
		// 		["tbl_employees.is_deleted", 0]
		// 	])
		// 	->first();

		// $training_hrs_monthly = DB::table("tbl_training_trainees")
		// 	->join("tbl_trainings", "tbl_training_trainees.training_id", "tbl_trainings.training_id")
		// 	->select(DB::raw("COALESCE(sum(training_hrs),0) as total_hours"))
		// 	->whereRaw("YEAR(training_date) = ? AND MONTH (training_date) = ?", [$year, $select_month])
		// 	->where("tbl_trainings.is_deleted", 0)
		// 	->first();

		// $training_hrs_itd = DB::table("tbl_training_trainees")
		// 	->join("tbl_trainings", "tbl_training_trainees.training_id", "tbl_trainings.training_id")
		// 	->select(DB::raw("COALESCE(sum(training_hrs),0) as total_training_itd"))
		// 	->whereRaw("date_format(training_date, '%Y-%m')  <=  date_format('$date1', '%Y-%m')")
		// 	->where("tbl_trainings.is_deleted", 0)
		// 	->first();

		// $get_tbt = DB::table("tbl_toolbox_talks")
		// 	->select(DB::raw("COUNT(`tbt_id`) as total_tbt_this_month"))
		// 	->whereRaw("YEAR(date_conducted) = ? AND MONTH(date_conducted) = ?", [$year, $select_month])
		// 	->where("tbl_toolbox_talks.is_deleted", 0)
		// 	->first();


		// $get_tbt_itd = DB::table("tbl_toolbox_talks")
		// 	->select(DB::raw("COUNT(`tbt_id`) as total_tbt_itd"))
		// 	->whereRaw("YEAR(date_conducted) <= ? AND MONTH (date_conducted) <= ?", [$year, $select_month])
		// 	->where("tbl_toolbox_talks.is_deleted", 0)
		// 	->first();

		// $monthly_days = cal_days_in_month(CAL_GREGORIAN, $select_month, $year);

		return Inertia::render('Dashboard/App/index', [
			// "itdsTable" => $get_itds_table_data,
			// "contractors" => $get_contractors,
			// "trainingHrsMonthly" => $training_hrs_monthly,
			// "trainingHrsItd" => $training_hrs_itd,
			// "toolboxTalks" => $get_tbt,
			// "toolboxTalksItd" => $get_tbt_itd,
			// "getItdsManual2" => $get_itds_manual2,
			// "monthlyDays" => $monthly_days,
			// "chartsData" => $this->getAllChartsData($year, $user)
		]);
	}


	private function getAllChartsData($year, $user)
	{
		$incidentTypes = DB::table("tbl_incident")
			->leftJoin("tbl_first_aid", "tbl_incident.incident_id", "tbl_first_aid.incident_type")
			->select(DB::raw("tbl_incident.incident,incident_id,
		COUNT( CASE WHEN tbl_first_aid.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year then incident_type else NULL end) as number_per_incident"))
			->where("tbl_incident.is_deleted", 0)
			->groupBy("tbl_incident.incident_id");

		$indicators = DB::table("tbl_indicators")
			->leftJoin("tbl_first_aid", "tbl_indicators.indicator_id", "tbl_first_aid.leading_indicator")
			->select(DB::raw("indicator_id,indicator, 
		COUNT(CASE WHEN tbl_first_aid.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then leading_indicator else NULL end) as number_per_indicator"))
			->groupBy("indicator_id")
			->get();

		$severities = DB::table("tbl_severity")
			->select(DB::raw("severity_id,tbl_severity.severity, COUNT(CASE WHEN tbl_first_aid.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year  AND emp_id = $user->emp_id then leading_indicator else NULL end) AS number_per_severity"))
			->leftJoin("tbl_first_aid", "tbl_severity.severity_id", "tbl_first_aid.severity")
			->groupBy("severity_id")
			->get();

		$causes = DB::table("tbl_root_causes")
			->leftJoin("tbl_first_aid", "tbl_root_causes.cause_id", "tbl_first_aid.root_causes")
			->select(DB::raw("cause_id,tbl_root_causes.cause, COUNT(CASE WHEN tbl_first_aid.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then root_causes else NULL end) AS number_per_cause"))
			->groupBy("cause_id")
			->get();

		$bodyParts = DB::table("tbl_body_parts")
			->leftJoin("tbl_body_parts_injured", "tbl_body_parts.part_id", "tbl_body_parts_injured.part_id")
			->leftJoin("tbl_first_aid", "tbl_body_parts_injured.fa_id", "tbl_first_aid.fa_id")
			->select(DB::raw("tbl_body_parts.part_id AS part_number, COUNT(CASE WHEN tbl_body_parts_injured.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then tbl_body_parts_injured.part_id else NULL end) AS number_per_part, part_name"))
			->where("tbl_body_parts.is_deleted", 0)
			->groupBy("tbl_body_parts.part_id")
			->get();

		$equipments = DB::table("tbl_equipment")
			->leftJoin("tbl_fa_equipment", "tbl_equipment.equipment_id", "tbl_fa_equipment.equip_id")
			->leftJoin("tbl_first_aid", "tbl_fa_equipment.fa_id", "tbl_first_aid.fa_id")
			->select(DB::raw("tbl_equipment.equipment_id as equip_id, COUNT(CASE WHEN tbl_first_aid.is_deleted = 0  AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then tbl_fa_equipment.equip_id else NULL end) as number_of_equipments, equipment_description"))
			->where("tbl_equipment.is_deleted", 0)
			->groupBy("tbl_equipment.equipment_id")
			->get();

		$positions = DB::table("tbl_position")
			->select(DB::raw("position_id,tbl_position.position, COALESCE(COUNT(CASE WHEN tbl_first_aid.is_deleted = 0 AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then tbl_first_aid.injured_id else null end ),0) as number_per_position"))
			->leftJoin("tbl_employees", "tbl_position.position_id", "tbl_employees.position")
			->leftJoin("tbl_first_aid", "tbl_employees.employee_id", "tbl_first_aid.injured_id")
			->where("tbl_position.is_deleted", 0)
			->groupBy("tbl_position.position_id")
			->get();

		$natures = DB::table("tbl_nature")
			->select(DB::raw("tbl_nature.nature_id,tbl_nature.nature AS nature_description, COUNT(CASE WHEN tbl_first_aid.is_deleted = 0  AND YEAR(tbl_first_aid.date_created) = $year AND emp_id = $user->emp_id then tbl_first_aid.nature else NULL end) as number_per_nature"))
			->leftJoin("tbl_first_aid", "tbl_nature.nature_id", "tbl_first_aid.nature")
			->groupBy("nature_id")
			->get();

		return [
			array(
				"title" => "Incident Classification",
				"label" => "Incident",
				"labelKey" => "incident",
				"dataKey" => "number_per_incident",
				"type" => "bar",
				"indexAxis" => "x",
				"barThickness" => 40,
				"data" => $incidentTypes->get()
			),
			array(
				"title" => "Leading Indicators",
				"label" => "Indicators",
				"labelKey" => "indicator",
				"dataKey" => "number_per_indicator",
				"type" => "bar",
				"indexAxis" => "x",
				"barThickness" => 40,
				"data" => $indicators
			),
			array(
				"title" => "Potential Severity",
				"label" => "Severity",
				"labelKey" => "severity",
				"dataKey" => "number_per_severity",
				"type" => "bar",
				"indexAxis" => "y",
				"barThickness" => 40,
				"data" => $severities
			),
			array(
				"title" => "Root Cause Analysis",
				"label" => "Root Causes",
				"labelKey" => "cause",
				"dataKey" => "number_per_cause",
				"type" => "bar",
				"indexAxis" => "y",
				"barThickness" => 30,
				"data" => $causes
			),
			array(
				"title" => "Body Parts Analysis",
				"label" => "Body Parts",
				"labelKey" => "part_name",
				"dataKey" => "number_per_part",
				"type" => "bar",
				"indexAxis" => "x",
				"barThickness" => 30,
				"data" => $bodyParts
			),
			array(
				"title" => "Nature of Injury",
				"label" => "Injury",
				"labelKey" => "equipment_description",
				"dataKey" => "number_of_equipments",
				"type" => "bar",
				"indexAxis" => "x",
				"barThickness" => 40,
				"data" => $equipments
			),
			array(
				"title" => "Recordable Incident",
				"labelKey" => "incident",
				"dataKey" => "number_per_incident",
				"type" => "pie",
				"indexAxis" => "y",
				"barThickness" => 40,
				"data" => $incidentTypes->where("tbl_incident.incident_id", "<=", 5)->get()
			),
			array(
				"title" => "Job Description",
				"label" => "Job Description",
				"labelKey" => "position",
				"dataKey" => "number_per_position",
				"type" => "bar",
				"indexAxis" => "y",
				"barThickness" => 20,
				"data" => $positions
			),
			array(
				"title" => "Mechanism of Injury",
				"label" => "Mechanism of Injury",
				"labelKey" => "nature_description",
				"dataKey" => "number_per_nature",
				"type" => "bar",
				"indexAxis" => "y",
				"barThickness" => 20,
				"data" => $natures
			),
			array(
				"title" => "Equipment Involved",
				"label" => "Equipment Involved",
				"labelKey" => "equipment_description",
				"dataKey" => "number_of_equipments",
				"type" => "bar",
				"indexAxis" => "x",
				"barThickness" => 60,
				"data" => $equipments
			),
		];
	}
}
