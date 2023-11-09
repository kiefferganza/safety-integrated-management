<?php

namespace App\Services;

use App\Models\Images;
use App\Models\Incident;
use App\Models\InspectionReportList;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkParticipant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

// use Illuminate\Support\Str;

class DashboardService {

	public function getTbtByDate($from, $to) {
		return ToolboxTalk::select("tbt_id", "location", "date_conducted", "employee_id", "location")
		->where("is_deleted", 0)
		->whereBetween("date_conducted", [$from, $to])
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname", "position", "raw_position")->distinct()
		])
		->orderBy('date_conducted')
		->get();
	}


	public function getTbtStatisticByDate($from, $to) {
		return TbtStatistic::select("id", "year")
		->whereBetween("year", [$from->year, $to->year])
		->orderBy("year")
		->with("months:id,tbt_statistic_id,manhours,manpower,month_code")
		->get();
	}


	public function getInspectionByDate($year) {
		$inspections =  InspectionReportList::select("list_id", "ref_num", "table_name", "tbl_inspection_reports_list.inspection_id", "ref_score", "section_title", "tbl_inspection_reports.status")
		->where("ref_score", "!=", 4)
		->where("section_title", "!=", null)
		->where("tbl_inspection_reports.is_deleted", 0);

		if($year && $year !== "All") {
			$inspections = $inspections->whereYear("tbl_inspection_reports.date_issued", $year);
		}

		$inspections = $inspections->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id")
		->orderBy("ref_num")
		->get()
		->groupBy("section_title")
		->reduce(function($arr, $item) {
			$title = $item->first()?->section_title;
			if($title){
				$arr["summary"]["categories"][] = $title;
				$arr["trendingObservation"]["categories"][] = $title;
			}
			$open = 0;
			$close = 0;
			$negative = 0;
			foreach ($item as $inspecion) {
				if($inspecion->status === 3) {
					$close += 1;
					$arr["openVsClose"]["close"] += 1;
				}else {
					if($inspecion->ref_score === 1) {
						$close += 1;
						$arr["openVsClose"]["close"] += 1;
					}else {
						$open += 1;
						$arr["openVsClose"]["open"] += 1;
						$negative += 1;
					}
				}
			}
			$arr["summary"]["series"][0]["data"][] = $close;
			$arr["summary"]["series"][1]["data"][] = $open;
			$arr["trendingObservation"]["series"][0]["data"][] = $negative;
			$arr["trendingObservation"]["merged"][$title] = $negative;
			return $arr;
		}, [
			"summary" => [
				"categories" => [],
				"series" => [
					[
						"name" => "Closed: ",
						"data" => [],
					],
					[
						"name" => "Open: ",
						"data" => [],
					],
				],
			],
			"openVsClose" => [
				"open" => 0,
				"close" => 0,
			],
			"trendingObservation" => [
				"categories" => [],
				"series" => [
					[
						"name" => "Negative: ",
						"data" => [],
					],
				],
				"merged" => [],
			],
		]);
		$copiedTrend = [...$inspections["trendingObservation"]["series"][0]["data"]];
		rsort($copiedTrend);
		$copiedTrend = array_unique(array_slice($copiedTrend, 0, 5));

		$mergedTrends = collect($inspections["trendingObservation"]["merged"]);
		$trends = [];
		foreach ($copiedTrend as $cTrend) {
			if(count($trends) === 5 || $cTrend === 0) break;
			$getTrend = $mergedTrends->filter(fn($value) => $cTrend === $value)->toArray();
			foreach ($getTrend as $name => $value) {
				if(count($trends) === 5) break;
				$trends[] = [
					"name" => $name,
					"value" => $value
				];
			}
		}
		$inspections["trendingObservation"]["trends"] = $trends;
		return $inspections;
	}


	public function getIncidents() {
		$now = Carbon::now();
		$recordableCases = array("Amputation", "Asphyxia", "Fracture", "Hearing Loss", "Poisoning");
		// $nonRecordableCases = array("Abrasion", "Bites/Stings", "Bruise/Contusion", "Burn/Chemical", "Burn/Thermal", "Cold Related", "Concussion", "Cut/Laceration", "Electrical Shock", "Heat Related", "Skin Disorder");


		
		$incidents = Incident::select("severity", "incident_date", "day_loss", "incident", "indicator", "injured_id", "body_part")
			->whereNull("deleted_at")
			->get()
			->reduce(function($item, $incident) use($now, $recordableCases) {
				$incidentDate = Carbon::parse($incident->incident_date);
				
				$tbt = ToolboxTalkParticipant::select(DB::raw("tbl_toolbox_talks.tbt_id, SUM(time) as totalHours"), "date_conducted")
					->join("tbl_toolbox_talks", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
					->where("is_removed", 0)
					->where("is_deleted", 0)
					->whereDate("date_conducted", $incidentDate->format("Y-m-d"))
					->first();
				$inMonth = $incidentDate->month === $now->month && $incidentDate->year === $now->year;
				if($tbt->totalHours !== null) {
					
					// if($incident->incident === "LTC") {
					// 	$item["ltifr"]["totalHours"] += (int)$tbt->totalHours;
					// 	$item["ltifr"]["lti"] += 1;
					// 	if($inMonth) {
					// 		$item["ltifr"]["monthTotalhours"] += (int)$tbt->totalHours;
					// 		$item["ltifr"]["monthLti"] += 1;
					// 	}

					// 	$item["ltisr"]["totalHours"] += (int)$tbt->totalHours;
					// 	$item["ltisr"]["dayloss"] += $incident->day_loss;
					// 	if($inMonth) {
					// 		$item["ltisr"]["monthTotalhours"] += (int)$tbt->totalHours;
					// 		$item["ltisr"]["monthDayloss"] += $incident->day_loss;
					// 	}
					// }
					
					// FAFR = (Number of fatal accidents / Total hours worked) x 1,000,000
					// if($incident->incident === "FAT") {
					// 	$item["fafr"]["total"] += 1;
					// 	$item["fafr"]["totalHours"] += (int)$tbt->totalHours;
					// 	if($inMonth) {
					// 		$item["fafr"]["monthTotal"] += 1;
					// 		$item["fafr"]["monthTotalHours"] += (int)$tbt->totalHours;
					// 	}
					// }
					// Recordable
					if(in_array($incident->nature, $recordableCases)) {
						$item["trcf"]["total"] += 1;
						$item["trcf"]["totalHours"] += (int)$tbt->totalHours;

						$item["tris"]["total"] += 1;
						$item["tris"]["totalHours"] += (int)$tbt->totalHours;
						if($inMonth) {
							$item["tris"]["monthTotal"] += 1;
							$item["tris"]["monthTotalHours"] += (int)$tbt->totalHours;
							$item["trcf"]["monthTotal"] += 1;
							$item["trcf"]["monthTotalHours"] += (int)$tbt->totalHours;
						}
					}
				}

				$hasTbt = $tbt->totalHours !== null;

				switch ($incident->incident) {
					case 'LTC':
						$item["ltifr"]["totalHours"] = $hasTbt ? $item["ltifr"]["totalHours"] + (int)$tbt->totalHours : $item["ltifr"]["totalHours"];
						$item["ltifr"]["lti"] += 1;
						if($inMonth) {
							$item["ltifr"]["monthTotalhours"] = $hasTbt ? (int)$tbt->totalHours + $item["ltifr"]["monthTotalhours"] : $item["ltifr"]["monthTotalhours"];
							$item["ltifr"]["monthLti"] += 1;
						}

						$item["ltisr"]["totalHours"] = $hasTbt ? (int)$tbt->totalHours + $item["ltisr"]["totalHours"] : $item["ltisr"]["totalHours"];
						$item["ltisr"]["dayloss"] += $incident->day_loss;
						if($inMonth) {
							$item["ltisr"]["monthTotalhours"] = $hasTbt ? (int)$tbt->totalHours + $item["ltisr"]["monthTotalhours"] : $item["ltisr"]["monthTotalhours"];
							$item["ltisr"]["monthDayloss"] += $incident->day_loss;
						}
						break;
					case 'FAT':
						$item["fafr"]["total"] += 1;
						$item["fafr"]["totalHours"] = $hasTbt ? (int)$tbt->totalHours + $item["fafr"]["totalHours"] : $item["fafr"]["totalHours"];
						if($inMonth) {
							$item["fafr"]["monthTotal"] += 1;
							$item["fafr"]["monthTotalHours"] = $hasTbt ? (int)$tbt->totalHours + $item["fafr"]["monthTotalHours"] : $item["fafr"]["monthTotalHours"];
						}

						$item["recordable"]["fat"]["itd"] += 1;
						if($inMonth) {
							$item["recordable"]["fat"]["month"] += 1;
						}
						break;
					case 'MTC':
						$item["recordable"]["mtc"]["itd"] += 1;
						if($inMonth) {
							$item["recordable"]["mtc"]["month"] += 1;
						}
						break;
					case 'RWC':
						$item["recordable"]["rwc"]["itd"] += 1;
						if($inMonth) {
							$item["recordable"]["rwc"]["month"] += 1;
						}
						break;
					case 'NM':
						$item["nonrecordable"]["nm"]["itd"] += 1;
						if($inMonth) {
							$item["nonrecordable"]["nm"]["month"] += 1;
						}
						$item["indicator"]["leading"] += 1;
						break;
					case 'FAC':
						$item["nonrecordable"]["fac"]["itd"] += 1;
						if($inMonth) {
							$item["nonrecordable"]["fac"]["month"] += 1;
						}
						break;
					case 'PD':
						$item["pd"]["itd"] += 1;
						if($inMonth) {
							$item["pd"]["month"] += 1;
						}
						break;
					case 'ENV':
						$item["env"]["itd"] += 1;
						if($inMonth) {
							$item["env"]["month"] += 1;
						}
						break;
					case 'FIRE':
						$item["fire"]["itd"] += 1;
						if($inMonth) {
							$item["fire"]["month"] += 1;
						}
						break;
					case 'TRAF':
						$item["traf"]["itd"] += 1;
						if($inMonth) {
							$item["traf"]["month"] += 1;
						}
						break;
					default:
						break;
				}
				// SEVERITY
				if($inMonth) {
					$item["severity"]["month"][$incident->severity] += 1;
				}
				$item["severity"]["itd"][$incident->severity] += 1;


				return $item;
			}, [
				"tris" => ["monthTotalhours" => 0, "monthTotal" => 0, "totalHours" => 0, "total" => 0],
				"ltifr" => ["monthTotalhours" => 0, "monthLti" => 0, "totalHours" => 0, "lti" => 0],
				"ltisr" => ["monthTotalhours" => 0, "monthDayloss" => 0, "totalHours" => 0, "dayloss" => 0],
				"trcf" => ["total" => 0, "totalHours" => 0, "monthTotal" => 0, "monthTotalHours" => 0],
				"fafr" => ["total" => 0, "totalHours" => 0, "monthTotal" => 0, "monthTotalHours" => 0],
				"pd" => ["itd" => 0, "month" => 0],
				"env" => ["itd" => 0, "month" => 0],
				"fire" => ["itd" => 0, "month" => 0],
				"traf" => ["itd" => 0, "month" => 0],
				"indicator" => [
					"lagging" => 0,
					"leading" => 0
				],
				"recordable" => [
					"rwc" => ["itd" => 0, "month" => 0],
					"ol" => ["itd" => 0, "month" => 0],
					"fat" => ["itd" => 0, "month" => 0],
					"mtc" => ["itd" => 0, "month" => 0],
					"lcc" => ["itd" => 0, "month" => 0]
				],
				"nonrecordable" => [
					"fac" => ["itd" => 0, "month" => 0],
					"nm" => ["itd" => 0, "month" => 0]
				],
				"severity" => [
					"itd" => [
						"Minor" => 0,
						"Significant" => 0,
						"Major" => 0,
						"Fatality" => 0,
					],
					"month" => [
						"Minor" => 0,
						"Significant" => 0,
						"Major" => 0,
						"Fatality" => 0,
					]
				]
			]);

		$incidentReport = [
			"tris" => ["month" => 0, "itd" => 0],
			"ltifr" => ["month" => 0, "itd" => 0],
			"ltisr" => ["month" => 0, "itd" => 0],
			"trcf" => ["month" => 0, "itd" => 0],
			"fafr" => ["month" => 0, "itd" => 0],
			"severity" => $incidents["severity"],
			"pd" => $incidents["pd"],
			"env" => $incidents["env"],
			"fire" => $incidents["fire"],
			"traf" => $incidents["traf"],
			"recordable" => $incidents["recordable"],
			"nonrecordable" => $incidents["nonrecordable"],
		];

		// dd($incidentReport);
		
		// LTIFR = (Number of lost time injuries / Total hours worked) x 1,000,000
		if($incidents["ltifr"]["lti"] > 0 && $incidents["ltifr"]["totalHours"] > 0) {
			$incidentReport["ltifr"]["itd"] = round(($incidents["ltifr"]["lti"] / $incidents["ltifr"]["totalHours"]) * 1000000);
		}
		if($incidents["ltifr"]["monthLti"] > 0 && $incidents["ltifr"]["monthTotalhours"] > 0) {
			$incidentReport["ltifr"]["month"] = round(($incidents["ltifr"]["monthLti"] / $incidents["ltifr"]["monthTotalhours"]) * 1000000);
		}

		// LTISR = (Number of days lost due to lost time injuries / Total hours worked) x 1,000
		if($incidents["ltisr"]["dayloss"] > 0 && $incidents["ltisr"]["totalHours"] > 0) {
			$incidentReport["ltisr"]["itd"] = round(($incidents["ltisr"]["dayloss"] / $incidents["ltisr"]["totalHours"]) * 1000);
		}
		if($incidents["ltisr"]["monthDayloss"] > 0 && $incidents["ltisr"]["monthTotalhours"] > 0) {
			$incidentReport["ltisr"]["month"] = round(($incidents["ltisr"]["monthDayloss"] / $incidents["ltisr"]["monthTotalhours"]) * 1000);
		}
		
		// FAFR = (Number of fatal accidents / Total hours worked) x 1,000,000
		if($incidents["fafr"]["total"] > 0 && $incidents["fafr"]["totalHours"] > 0) {
			$incidentReport["fafr"]["itd"] = round(($incidents["fafr"]["total"] / $incidents["fafr"]["totalHours"]) * 1000000);
		}
		if($incidents["fafr"]["monthTotal"] > 0) {
			$incidentReport["fafr"]["month"] = round(($incidents["fafr"]["monthTotal"] / $incidents["fafr"]["monthTotalhours"]) * 1000000);
		}
		
		// TRI (Total Recordable Incidents ) = (Number of recordable injuries and illnesses / Total number of hours worked) x 200,000
		if($incidents["tris"]["total"] > 0 && $incidents["tris"]["totalHours"] > 0) {
			$incidentReport["tris"]["itd"] = round(($incidents["tris"]["total"] / $incidents["tris"]["totalHours"]) * 200000);
		}
		if($incidents["tris"]["monthTotal"] > 0 && $incidents["tris"]["monthTotalhours"] > 0) {
			$incidentReport["tris"]["month"] = round(($incidents["tris"]["monthTotal"] / $incidents["tris"]["monthTotalhours"]) * 200000);
		}

		// TRCF (Total Recordable Case Frequency) = (Number of Recordable Cases x 200,000) / Total Hours Worked
		if($incidents["trcf"]["total"] > 0) {
			$incidentReport["trcf"]["itd"] = round(($incidents["trcf"]["total"] * 200000) / $incidents["trcf"]["totalHours"]);
		}
		if($incidents["trcf"]["monthTotal"] > 0) {
			$incidentReport["trcf"]["month"] = round(($incidents["trcf"]["monthTotal"] * 200000) / $incidents["trcf"]["monthTotalhours"]);
		}
		
		// dd($incidentReport, $incidents);
			
		return $incidentReport;
	}


	public function getSliderImages() {
		return Images::where("type", "slider")->get()->transform(function ($img) {
			$image = $img->getFirstMedia("slider");
			$img->url = $image->getFullUrl();
			$img->name = $image->name;
			return $img;
		});
	}

}