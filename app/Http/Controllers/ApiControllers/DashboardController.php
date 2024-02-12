<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Inspection;
use App\Models\TbtStatisticMonth;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkParticipant;
use Illuminate\Support\Facades\Storage;
use App\Models\Training;
use App\Services\DashboardService;
use App\Services\ToolboxTalkService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{


	public function index(Request $request)
	{
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to));
		return response()->json([
			"analytics" => $this->analytics($from, $to),
			"graph" => $this->incident_graph_data(),
			"trending_observation" => (new DashboardService())->getTrendingObservation()
		]);
	}


	// -------------- DASHBOARD DATAS ------------------- 

	public function analytics(Carbon $from, Carbon $to)
	{
		$currentMonth = now()->month;
		$currentYear = now()->year;

		$defaultTotal = [
			"totalManHours" => 0,
			"totalManpower" => 0,
			"location" => [],
			"days" => [],
			"totalDays" => 0
		];
		$years = [
			"this_month" => 0
		];
		$months = [
			1 => $defaultTotal,
			2 => $defaultTotal,
			3 => $defaultTotal,
			4 => $defaultTotal,
			5 => $defaultTotal,
			6 => $defaultTotal,
			7 => $defaultTotal,
			8 => $defaultTotal,
			9 => $defaultTotal,
			10 => $defaultTotal,
			11 => $defaultTotal,
			12 => $defaultTotal,
		];

		$yearRange = range($from->year, $to->year);
		$analytics = [
			"daysWoWork" => 0,
			"daysWork" => 0,
			"totalManHours" => 0,
			"totalManpower" => 0,
			"this_month" => [
				"manpower" => 0,
				"manhours" => 0,
				"total_tbt" => 0
			],
			"location" => 0,
			"avg_manpower_day" => 0,
		];

		foreach ($yearRange as $year)
		{
			foreach ($months as $month => $_val)
			{
				$months[$month]['totalDays'] = Carbon::create($year, $month)->daysInMonth;
			}
			$years[$year] = $months;
		}

		$tbt = ToolboxTalk::select("tbt_id", "location", "date_conducted", "location", DB::raw('YEAR(date_conducted) as year'), DB::raw('MONTH(date_conducted) as month'))
			->where("is_deleted", 0)
			->whereBetween("date_conducted", [$from, $to])
			->withCount("participants")
			->get();

		$tbtByYear = $tbt->reduce(function ($current, $tbt) use ($currentMonth, $currentYear, $analytics)
		{
			$dateConducted = Carbon::parse($tbt->date_conducted);
			if (!in_array($dateConducted->day, $current[$tbt->year][$tbt->month]['days']))
			{
				$current[$tbt->year][$tbt->month]['days'][] = $dateConducted->day;
			}

			if (!in_array($tbt->location, $current[$tbt->year][$tbt->month]['location']))
			{
				$current[$tbt->year][$tbt->month]['location'][] = $tbt->location;
			}

			if ($tbt->year == $currentYear && $tbt->month == $currentMonth)
			{
				$current["this_month"] += 1;
			}

			$current[$tbt->year][$tbt->month]['totalManHours'] += $tbt->participants_count * 9;
			$current[$tbt->year][$tbt->month]['totalManpower'] += $tbt->participants_count;

			return $current;
		}, $years);

		$analytics["this_month"]["total_tbt"] = $tbtByYear["this_month"];
		if ($tbtByYear[$currentYear][$currentMonth])
		{
			$analytics["this_month"]["manpower"] = $tbtByYear[$currentYear][$currentMonth]["totalManpower"];
			$analytics["this_month"]["manhours"] = $tbtByYear[$currentYear][$currentMonth]["totalManHours"];
		}

		$yearsAddedToTbt = $tbt->pluck("year")->unique();
		foreach ($yearsAddedToTbt as $year)
		{
			foreach ($tbtByYear[$year] as $data)
			{
				$days = count($data["days"]);
				if ($data['totalManpower'] > 0)
				{
					$analytics["daysWork"] += $days;
					$analytics["daysWoWork"] += $data['totalDays'] - $days;
					$analytics["totalManHours"] += $data["totalManHours"];
					$analytics["totalManpower"] += $data["totalManpower"];
				}
			}
		}
		$analytics['location'] = $tbt->pluck("location")->unique()->count();

		$statistics = TbtStatisticMonth::select("tbt_statistic_months.id", "tbt_statistic_id", "manhours", "manpower", "month_code", "tbt_statistics.year")
			->whereBetween("tbt_statistics.year", [$from->year, $to->year])
			->leftJoin("tbt_statistics", "tbt_statistics.id", "tbt_statistic_months.tbt_statistic_id")
			->get();

		foreach ($statistics as $stat)
		{
			$tbtByYear[$stat->year][$stat->month_code]["totalManHours"] += $stat->manhours;
			$tbtByYear[$stat->year][$stat->month_code]["totalManpower"] += $stat->manpower;
			$analytics["totalManHours"] += round($stat->manhours);
			$analytics["totalManpower"] += round($stat->manpower);
		}

		if ($analytics["totalManpower"] > 0)
		{
			$diffDays = $from->diffInDays($to);
			$analytics["avg_manpower_day"] = ceil($analytics["totalManpower"] / $diffDays);
		}

		return [
			"manhours_worked" => [
				"this_month" => $analytics["this_month"]["manhours"],
				"PTD" => $analytics["totalManHours"],
				"safe_manhours" => (new ToolboxTalkService)->getSafeManhours()
			],
			"man_power" => [
				"ave_day" => $analytics["avg_manpower_day"],
				"this_month" => $analytics["this_month"]["manpower"],
				"PTD" => $analytics["totalManpower"]
			],
			"man_days_of_the_month" => [
				"acident_free" => null,
				"PTD" => null
			],
			"audits" => [
				"internal" => null,
				"roo_dept" => null
			],
			"emerg_drills" => [
				"internal" => null,
				"external" => null
			],
			"hse_inspection" => [
				"this_month" => Inspection::where('is_deleted', 0)->whereMonth('date_issued', $currentMonth)->whereYear('date_issued', $currentYear)->count(),
				"PTD" => Inspection::where('is_deleted', 0)->count(),
			],
			"negative_obs" => [
				"this_month" => Inspection::where('is_deleted', 0)->whereMonth('date_issued', $currentMonth)->whereYear('date_issued', $currentYear)->where('status', 3)->count(),
				"PTD" => Inspection::where('is_deleted', 0)->where("status", 3)->count()
			],
			"toolbox_talk" => [
				"this_month" => $analytics["this_month"]["total_tbt"],
				"PTD" => $tbt->count()
			],
			"hse_training_hours" => [
				"this_month" => Training::where('is_deleted', 0)->whereMonth('date_created', $currentMonth)->whereYear('date_created', $currentYear)->count() * 9,
				"PTD" => Training::where("is_deleted", 0)->count() * 9
			],
		];
	}



	public function incident_graph_data()
	{
		$default = [
			'incident_classification' => [
				'categories' => [
					"FAT",
					"LTC",
					"RWC",
					"MTC",
					"FAC",
					"NM",
					"PD",
					"TRAF",
					"FIRE",
					"ENV",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'recordable_incident' => [
				'categories' => [
					"FAT",
					"LTC",
					"RWC",
					"MTC",
					"FAC",
				],
				'data' => [0, 0, 0, 0, 0]
			],
			'incident_per_location' => [
				'categories' => [
					"Ratqa",
					"Janubia",
					"Markaziya",
					"Shamiya",
					"Mushrif Shamiya",
					"Qurainat",
					"Mushrif Qurainat",
					"SIDS",
					"NIDS",
					"DS5",
					"DS4",
					"DS3",
					"DS2",
					"DS1",
				],
				'data' => [
					[
						"name" => "FAT",
						"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					],
					[
						"name" => "LTC",
						"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					],
					[
						"name" => "RWC",
						"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					],
					[
						"name" => "MTC",
						"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					],
					[
						"name" => "FAC",
						"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					],
				]
			],
			'potential_severity' => [
				'categories' => ['EXTREME 4', 'HIGH 3', 'MEDIUM 2', 'LOW 1'],
				'data' => [0, 0, 0, 0]
			],
			'root_cause_analysis' => [
				'categories' => [
					"Other",
					"Organizational",
					"Workplace Hazards",
					"Integrity of tools...",
					"Protective Systems",
					"Inattention / Lack of...",
					"Use of Protective Methods",
					"Use of Tools,Equipment,...",
					"Not following Procedures",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'leading_indicators' => [
				'categories' => [
					"NEGA...",
					"SAFET...",
					"HSE...",
					"MGT...",
					"PERMI...",
					"TRAIN...",
					"DRILLS",
					"DICIPL...",
					"AUDIT",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'body_part_injured' => [
				'categories' => [
					"Arms",
					"Back",
					"Eyebrow",
					"Hand",
					"Foot",
					"Head",
					"Legs",
					"Mouth",
					"Nose",
					"Eye",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'mechanism_of_injury' => [
				'categories' => [
					"Struct By...",
					"Struct Againts...",
					"Fall to lower level",
					"Fall to same level",
					"Caught In...",
					"Movement, Posture / Manual Handling",
					"Caught On (Snagged, hung)",
					"Caught Between Or Under...",
					"Contact With (particulate, electricity,...",
					"Overstress, Overexertion, Overload",
					"Slip / Trip / Fall at the same level",
					"Working at Heights",
					"Others",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'nature_of_injury' => [
				'categories' => [
					"Abrasion",
					"Asphyxia",
					"Bruise/Contusion",
					"Burn - Thermal",
					"Concussion",
					"Electric Shock",
					"Hearing Loss",
					"Ingetsion",
					"Skin Disorder",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'job_description' => [
				'categories' => [
					"Carpenter",
					"Labour",
					"Driver",
					"Welder",
					"Mechanic",
					"Painter",
					"HVAC",
					"Field Staff",
					"Engineer",
					"Equipment...",
					"Visitor",
					"Fitter",
					"Supervior",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			'equipment_material_involved' => [
				'categories' => [
					"Crane",
					"Forklift",
					"Tanker",
					"Scaffolding",
					"Power Tools",
					"Welding/...",
					"Bus",
					"Coster",
					"SUV",
					"Rebars",
				],
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			]
		];

		$incident_per_month_default = [
			[
				'name' => "FAT",
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			[
				'name' => "LTC",
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			[
				'name' => "MTC",
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			[
				'name' => "FAC",
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			[
				'name' => "NM",
				'data' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
		];

		$currentYear = now()->year;

		$incident_per_month = Incident::select(
			DB::raw("MONTH(incident_date) as month"),
			'incident'
		)
			->whereIn("incident", ["FAT", "LTC", "MTC", "FAC", "NM"])
			->whereNull('deleted_at')
			->whereYear('incident_date', $currentYear)
			->get()
			->reduce(function ($current, $ins)
			{
				switch ($ins->incident)
				{
					case 'FAT':
						$current[0]['data'][$ins->month - 1] += 1;
						return $current;
					case 'LTC':
						$current[1]['data'][$ins->month - 1] += 1;
						return $current;
					case 'MTC':
						$current[2]['data'][$ins->month - 1] += 1;
						return $current;
					case 'FAC':
						$current[3]['data'][$ins->month - 1] += 1;
						return $current;
					case 'NM':
						$current[4]['data'][$ins->month - 1] += 1;
						return $current;
					default:
						return $current;
				}
			}, $incident_per_month_default);

		$incidents = Incident::select('injured_id', 'incident', 'root_cause', 'location', 'body_part', 'severity', 'mechanism', 'nature', 'equipment')
			->with([
				'injured' => fn ($q) => $q->select("employee_id", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			])
			->whereNull('deleted_at')
			->get()
			->reduce(function ($current, $incident)
			{
				if ($incident->injured)
				{
					switch (trim($incident->injured->position))
					{
						case "Carpenter":
							$current['job_description']['data'][0] += 1;
							break;
						case "laborer":
							$current['job_description']['data'][1] += 1;
							break;
						case "Driver":
							$current['job_description']['data'][2] += 1;
							break;
						case "Welder":
							$current['job_description']['data'][3] += 1;
							break;
						case "Mechanical Technician":
							$current['job_description']['data'][4] += 1;
							break;
						case "Mechanical Manager":
							$current['job_description']['data'][4] += 1;
							break;
						case "Painter":
							$current['job_description']['data'][5] += 1;
							break;
						case "HVAC":
							$current['job_description']['data'][6] += 1;
							break;
						case "Field Staff":
							$current['job_description']['data'][7] += 1;
							break;
						case "Engineer":
							$current['job_description']['data'][8] += 1;
							break;
						case "PA/Engineer":
							$current['job_description']['data'][8] += 1;
							break;
						case "QA/QC Engineer":
							$current['job_description']['data'][8] += 1;
							break;
						case "Planner Engineer":
							$current['job_description']['data'][8] += 1;
							break;
						case "Equipment":
							$current['job_description']['data'][9] += 1;
							break;
						case "Visitor":
							$current['job_description']['data'][10] += 1;
							break;
						case "Fitter":
							$current['job_description']['data'][11] += 1;
							break;
						case "Site Supervisor":
							$current['job_description']['data'][12] += 1;
							break;
						case "PA/Supervisor":
							$current['job_description']['data'][12] += 1;
							break;
						default:
							# code...
							break;
					}
				}
				$equipments = explode(',', $incident->equipment);
				foreach ($equipments as $equipment)
				{
					switch ($equipment)
					{
						case "Crane":
							$current['equipment_material_involved']['data'][0] += 1;
							break;
						case "Forklift":
							$current['equipment_material_involved']['data'][1] += 1;
							break;
						case "Tanker":
							$current['equipment_material_involved']['data'][2] += 1;
							break;
						case "Scaffolding":
							$current['equipment_material_involved']['data'][3] += 1;
							break;
						case "Power Tools":
							$current['equipment_material_involved']['data'][4] += 1;
							break;
						case "Welding/Compressors":
							$current['equipment_material_involved']['data'][5] += 1;
							break;
						case "Bus":
							$current['equipment_material_involved']['data'][6] += 1;
							break;
						case "Coaster":
							$current['equipment_material_involved']['data'][7] += 1;
							break;
						case "Suv":
							$current['equipment_material_involved']['data'][8] += 1;
							break;
						case "Rebars":
							$current['equipment_material_involved']['data'][9] += 1;
							break;
						default:
							# code...
							break;
					}
				}
				switch ($incident->nature)
				{
					case "Abrasion":
						$current['nature_of_injury']['data'][0] += 1;
						break;
					case "Asphyxia":
						$current['nature_of_injury']['data'][1] += 1;
						break;
					case "Bruise/Contusion":
						$current['nature_of_injury']['data'][2] += 1;
						break;
					case "Burn/Thermal":
						$current['nature_of_injury']['data'][3] += 1;
						break;
					case "Concussion":
						$current['nature_of_injury']['data'][4] += 1;
						break;
					case "Electrical Shock":
						$current['nature_of_injury']['data'][5] += 1;
						break;
					case "Hearing Loss":
						$current['nature_of_injury']['data'][6] += 1;
						break;
					case "Poisoning":
						$current['nature_of_injury']['data'][7] += 1;
						break;
					case "Skin Disorder":
						$current['nature_of_injury']['data'][8] += 1;
						break;
					default:
						# code...
						break;
				}
				switch ($incident->mechanism)
				{
					case "Struck By Moving Object":
						$current['mechanism_of_injury']['data'][0] += 1;
						break;
					case "Struck Against":
						$current['mechanism_of_injury']['data'][1] += 1;
						break;
					case "Fall to lower level":
						$current['mechanism_of_injury']['data'][2] += 1;
						break;
					case "Fall to same level":
						$current['mechanism_of_injury']['data'][3] += 1;
						break;
					case "Caught In":
						$current['mechanism_of_injury']['data'][4] += 1;
						break;
					case "Movement, Posture / Manual":
						$current['mechanism_of_injury']['data'][5] += 1;
						break;
					case "Caught On":
						$current['mechanism_of_injury']['data'][6] += 1;
						break;
					case "Caught Between Or Under":
						$current['mechanism_of_injury']['data'][7] += 1;
						break;
					case "Contact With (particulate, electricity, heat, cold, radiation,  noise, chemical)":
						$current['mechanism_of_injury']['data'][8] += 1;
						break;
					case "Overstress, Overexertion, Overload":
						$current['mechanism_of_injury']['data'][9] += 1;
						break;
					case "Slip / Trip / Fall at the same level":
						$current['mechanism_of_injury']['data'][10] += 1;
						break;
					case "Working at Heights":
						$current['mechanism_of_injury']['data'][11] += 1;
						break;
					case "other":
						$current['mechanism_of_injury']['data'][12] += 1;
						break;
					default:
						# code...
						break;
				}
				switch ($incident->body_part)
				{
					case "Arms":
						$current['body_part_injured']['data'][0] += 1;
						break;
					case "Back":
						$current['body_part_injured']['data'][1] += 1;
						break;
					case "Eyebrow":
						$current['body_part_injured']['data'][2] += 1;
						break;
					case "Hand":
						$current['body_part_injured']['data'][3] += 1;
						break;
					case "Foot":
						$current['body_part_injured']['data'][4] += 1;
						break;
					case "Head":
						$current['body_part_injured']['data'][5] += 1;
						break;
					case "Legs":
						$current['body_part_injured']['data'][6] += 1;
						break;
					case "Mouth":
						$current['body_part_injured']['data'][7] += 1;
						break;
					case "Nose":
						$current['body_part_injured']['data'][8] += 1;
						break;
					case "Eye":
						$current['body_part_injured']['data'][9] += 1;
						break;
					default:
						# code...
						break;
				}
				switch ($incident->root_cause)
				{
					case "other":
						$current["root_cause_analysis"]['data'][0] += 1;
						break;
					case "Organizational":
						$current["root_cause_analysis"]['data'][1] += 1;
						break;
					case "Workplace Hazards":
						$current["root_cause_analysis"]['data'][2] += 1;
						break;
					case "Integrity of Tools/PLan/Equipment, Material":
						$current["root_cause_analysis"]['data'][3] += 1;
						break;
					case "Protective Systems":
						$current["root_cause_analysis"]['data'][4] += 1;
						break;
					case "Intentional/Lack of Awareness/Behaviors":
						$current["root_cause_analysis"]['data'][5] += 1;
						break;
					case "Use of Protective Methods":
						$current["root_cause_analysis"]['data'][6] += 1;
						break;
					case "Use of Tools Equipment,Materials and Products":
						$current["root_cause_analysis"]['data'][7] += 1;
						break;
					case "Not Following Procedures":
						$current["root_cause_analysis"]['data'][8] += 1;
						break;
					default:
						# code...
						break;
				}
				switch ($incident->severity)
				{
					case 'Minor':
						$current['potential_severity']['data'][3] += 1;
						break;
					case 'Significant':
						$current['potential_severity']['data'][2] += 1;
						break;
					case 'Major':
						$current['potential_severity']['data'][1] += 1;
						break;
					case 'Fatality':
						$current['potential_severity']['data'][0] += 1;
						break;
					default:
						# code...
						break;
				}
				switch ($incident->location)
				{
					case "Ratqa":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][0] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][0] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][0] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][0] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][0] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Janubia":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][1] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][1] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][1] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][1] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][1] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Markaziya":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][2] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][2] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][2] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][2] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][2] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Shamiya":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][3] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][3] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][3] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][3] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][3] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Mushrifcase  Shamiya":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][4] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][4] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][4] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][4] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][4] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Qurainat":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][5] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][5] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][5] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][5] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][5] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "Mushrifcase  Qurainat":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][6] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][6] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][6] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][6] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][6] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "SIDS":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][7] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][7] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][7] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][7] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][7] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "NIDS":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][8] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][8] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][8] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][8] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][8] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "DS5":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][9] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][9] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][9] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][9] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][9] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "DS4":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][10] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][10] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][10] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][10] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][10] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "DS3":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][11] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][11] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][11] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][11] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][11] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "DS2":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][12] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][12] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][12] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][12] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][12] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					case "DS1":
						switch ($incident->incident)
						{
							case "FAT":
								$current['incident_per_location']['data'][0]['data'][13] += 1;
								break;
							case "LTC":
								$current['incident_per_location']['data'][1]['data'][13] += 1;
								break;
							case "RWC":
								$current['incident_per_location']['data'][2]['data'][13] += 1;
								break;
							case "MTC":
								$current['incident_per_location']['data'][3]['data'][13] += 1;
								break;
							case "FAC":
								$current['incident_per_location']['data'][4]['data'][13] += 1;
								break;
							default:
								# code...
								break;
						}
						break;
					default:
						break;
				}
				switch ($incident->incident)
				{
					case 'FAT':
						// classification
						$current['incident_classification']['data'][0] += 1;
						// recordable_incident
						$current['recordable_incident']['data'][0] += 1;
						break;
					case 'LTC':
						// classification
						$current['incident_classification']['data'][1] += 1;
						// recordable_incident
						$current['recordable_incident']['data'][1] += 1;
						break;
					case 'RWC':
						// classification
						$current['incident_classification']['data'][2] += 1;
						// recordable_incident
						$current['recordable_incident']['data'][2] += 1;
						break;
					case 'MTC':
						// classification
						$current['incident_classification']['data'][3] += 1;
						// recordable_incident
						$current['recordable_incident']['data'][3] += 1;
						break;
					case 'FAC':
						// classification
						$current['incident_classification']['data'][4] += 1;
						// recordable_incident
						$current['recordable_incident']['data'][4] += 1;
						break;
					case 'NM':
						$current['incident_classification']['data'][5] += 1;
						break;
					case 'PD':
						$current['incident_classification']['data'][6] += 1;
						break;
					case 'TRAF':
						$current['incident_classification']['data'][7] += 1;
						break;
					case 'FIRE':
						$current['incident_classification']['data'][8] += 1;
						break;
					case 'ENV':
						$current['incident_classification']['data'][9] += 1;
						break;
					default:
						break;
				}
				return $current;
			}, $default);


		$recordable_incidents = ["FAT", "LTC", "RWC", "MTC", "FAC"];
		$recordableCases = ["Amputation", "Asphyxia", "Fracture", "Hearing Loss", "Poisoning"];
		$manpower_LTIR_TRIR_data = ToolboxTalkParticipant::select(DB::raw("MONTH(date_added) as month"), 'tbt_id')
			->whereYear('date_added', $currentYear)
			->where('is_removed', 0)
			->orderBy('month', 'asc')
			->get()
			->reduce(function ($current, $participant) use ($currentYear, $recordable_incidents, $recordableCases)
			{
				if ($current["currentMonth"] !== $participant->month)
				{
					$incident = Incident::select(DB::raw("MONTH(incident_date) as month"), DB::raw("YEAR(incident_date) as year"), "day_loss", "incident", "nature")
						->whereNull("deleted_at")
						->whereMonth("incident_date", $current["currentMonth"])
						->whereYear("incident_date", $currentYear)
						->get()
						->toArray();
					if (!empty($incident))
					{
						foreach ($incident as $inc)
						{
							$current["lost_time_incident"][$participant->month - 1] += $inc['day_loss'];
							if (in_array($inc["incident"], $recordable_incidents) || in_array($inc["nature"], $recordableCases))
							{
								$current["num_recordable_incidents"][$participant->month - 1] += 1;
							}
						}
					}
				}
				$current["manpower"][$participant->month - 1] += 1;
				$current["currentMonth"] = $participant->month;
				return $current;
			}, [
				"currentMonth" => 0,
				"manpower" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				"lost_time_incident" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				"num_recordable_incidents" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			]);
		// dd($manpower_LTIR_TRIR_data);

		$manpower_LTIR_TRIR = [
			[
				"name" => "Manpower",
				"type" => "line",
				"data" => []
			],
			[
				"name" => "LTIR",
				"type" => "column",
				"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			],
			[
				"name" => "TRIR",
				"type" => "column",
				"data" => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			]
		];
		for ($i=0; $i < 12; $i++) { 
			$manpower = $manpower_LTIR_TRIR_data['manpower'][$i];
			$manpower_LTIR_TRIR[0]['data'][] = $manpower;
			$rec_inc = $manpower_LTIR_TRIR_data['num_recordable_incidents'][$i];
			$lost_time = $manpower_LTIR_TRIR_data['lost_time_incident'][$i];
			if($lost_time > 0) {
				// LTIR = (Number of Lost Time Incidents x 1,000,000) / Total Hours Worked
				$manpower_LTIR_TRIR[1]['data'][$i] = ceil(($lost_time * 1_000_000) / ($manpower * 9));
			}
			if($rec_inc > 0) {
				$manpower_LTIR_TRIR[2]['data'][$i] = ceil(($rec_inc * 1_000_000) / ($manpower * 9));
			}
		}
		return [
			...$incidents,
			"incident_per_month" => $incident_per_month,
			"LTIR_TRIR" => $manpower_LTIR_TRIR
		];
	}


	// -------------- END DASHBOARD DATAS -------------------

	public function sliderImages()
	{
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getSliderImages());
	}


	public function toolboxtalks(Request $request)
	{
		// $dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to));

		$tbtService = new ToolboxTalkService;

		$res = $tbtService->totalTbtByYear($from, $to);
		$res['smh'] = $tbtService->getSafeManhours();

		return response()->json($res);
	}

	public function tbtStatistics(Request $request)
	{
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to));

		return response()->json($dashboardService->getTbtStatisticByDate($from, $to));
	}

	public function trainings()
	{
		$currentDate = Carbon::now();
		$incompleteTrainings = [];

		$trainings = Training::select("training_id", "type", "training_hrs", "training_date", "training_hrs", "type")
			->where("is_deleted", 0)
			->with([
				"trainees" => fn ($q) => $q->select("tbl_employees.employee_id"),
				"training_files" => fn ($q) => $q->select("emp_id", "tbl_trainings_files.training_id", "src")
			])
			->get();

		$completedTrainings = $trainings->filter(function (Training $training)
		{
			if ($training->training_files->count() === 0 || $training->training_files->count() !== $training->trainees->count()) return false;
			$trainees = $training->trainees;
			return $training->training_files->every(function ($file) use ($trainees)
			{
				$exist = Storage::disk("public")->exists("media/training/" . $file->src);
				if (!$exist) return false;
				$empId = $file->emp_id;
				return $trainees->every(function ($trainee) use ($empId)
				{
					return $trainee->employee_id === $empId;
				});
			});
		});

		foreach ($trainings as $training)
		{
			if (!$completedTrainings->contains($training))
			{
				$incompleteTrainings[] = $training;
			}
		}

		$trainingsMonth = $completedTrainings->filter(function ($training) use ($currentDate)
		{
			$targetDate = Carbon::parse($training->training_date);
			return $targetDate->month == $currentDate->month && $targetDate->year == $currentDate->year;
		});

		$inductions = $trainings->filter(fn ($tr) => $tr->type === 4);
		$inductionsMonth = $inductions->filter(function ($training) use ($currentDate)
		{
			$targetDate = Carbon::parse($training->training_date);
			return $targetDate->month == $currentDate->month && $targetDate->year == $currentDate->year;
		});

		return response()->json([
			"completedTrainings" => $completedTrainings->flatten(),
			"incompleteTrainings" => $incompleteTrainings,
			"inductions" => $inductions,
			"totalHrsCompleted" => $completedTrainings->sum("training_hrs"),
			"totalHrsMonthCompleted" => $trainingsMonth->sum("training_hrs"),
			"totalInductionCompleted" => $inductions->count(),
			"totalInductionMonthCompleted" => $inductionsMonth->count(),
		]);
	}

	public function trainingsByYear($year)
	{
		$trainings = Training::select("training_id", "type", "training_hrs", "training_date", "training_hrs", "type")
			->where("is_deleted", 0)
			->whereYear("training_date", $year)
			->with([
				"trainees" => fn ($q) => $q->select("tbl_employees.employee_id"),
				"training_files" => fn ($q) => $q->select("emp_id", "tbl_trainings_files.training_id", "src")
			])
			->get();
		$initialData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

		$completedTrainings = [
			"name" => "Training Hours Completed",
			"data" => $initialData
		];

		$inductions = [
			"name" => "Induction Completed",
			"data" => $initialData
		];

		$notCompletedTrainings = [
			"name" => "Training Hours Not Completed",
			"data" => $initialData
		];

		foreach ($trainings as $training)
		{
			$month = Carbon::parse($training->training_date)->month;
			if ($training->training_files->count() === 0 || $training->training_files->count() !== $training->trainees->count())
			{
				if ($training->type !== 4)
				{
					$notCompletedTrainings['data'][$month - 1] += $training->training_hrs;
				}
				else
				{
					$inductions['data'][$month - 1] += $training->training_hrs;
				}
			}
			else
			{
				$trainees = $training->trainees;
				$isValidAndCompleted = $training->training_files->every(function ($file) use ($trainees)
				{
					$exist = Storage::disk("public")->exists("media/training/" . $file->src);
					if (!$exist) return false;
					$empId = $file->emp_id;
					return $trainees->every(function ($trainee) use ($empId)
					{
						return $trainee->employee_id === $empId;
					});
				});
				if ($isValidAndCompleted)
				{
					if ($training->type !== 4)
					{
						$completedTrainings['data'][$month - 1] += $training->training_hrs;
					}
					else
					{
						$inductions['data'][$month - 1] += $training->training_hrs;
					}
				}
				else
				{
					$notCompletedTrainings['data'][$month - 1] += $training->training_hrs;
				}
			}
		}

		return response()->json([
			"notCompletedTrainings" => $notCompletedTrainings,
			"completedTrainings" => $completedTrainings,
			"inductions" => $inductions,
		]);
	}

	public function inspections(Request $request)
	{
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getInspectionByDate($request->year));
	}

	public function incidents()
	{
		$dashboardService = new DashboardService;
		return response()->json($dashboardService->getIncidents());
	}
}
