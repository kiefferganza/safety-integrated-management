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


	public function getInspectionByDate($from, $to) {
		return InspectionReportList::select("list_id", "ref_num", "table_name", "tbl_inspection_reports_list.inspection_id", "ref_score", "section_title", "tbl_inspection_reports.status")
		->whereBetween("tbl_inspection_reports.date_issued", [$from, $to])
		->where("ref_score", "!=", 4)
		->where("section_title", "!=", null)
		->where("tbl_inspection_reports.is_deleted", 0)
		->join("tbl_inspection_reports", "tbl_inspection_reports.inspection_id", "tbl_inspection_reports_list.inspection_id")
		->orderBy("ref_num")
		->get()
		->reduce(function ($arr, $item){
			$ref = $item->ref_num;
			$title = $item->section_title;
			$score = $item->ref_score;
			// && $item->status !== null
			if($title) {
				$tableName = InspectionService::getTableName($ref);
				$arr["data"][$title] ??= [
					"negative" => 0,
					"closed" => 0,
					"positive" => 0,
					"title" => $title,
					"id" => $ref,
					"table" => $tableName
				];
				if($item->status === 3) {
					$arr["data"][$title]["closed"] += 1;
					$arr["total"]["closed"] += 1;
				}else {
					if($score === 1) {
						$arr["data"][$title]["positive"] += 1;
						$arr["total"]["open"] += 1;
					}else {
						$arr["data"][$title]["negative"] += 1;
						$arr["total"]["open"] += 1;
					}
				}
			}
			return $arr;
		}, ["data" => [], "total" => [ "open" => 0, "closed" => 0 ]]);
	}


	public function getIncidents() {
		$now = Carbon::now();
		
		$incidents = Incident::select("severity", "incident_date", "lti", "injured_id", "body_part")
			->whereNull("deleted_at")
			->get()
			->reduce(function($item, $incident) use($now) {
				$incidentDate = Carbon::parse($incident->incident_date);
				
				$tbt = ToolboxTalkParticipant::select(DB::raw("tbl_toolbox_talks.tbt_id, SUM(time) as totalHours"), "date_conducted")
					->join("tbl_toolbox_talks", "tbl_toolbox_talks.tbt_id", "tbl_toolbox_talks_participants.tbt_id")
					->where("is_removed", 0)
					->where("is_deleted", 0)
					->whereDate("date_conducted", $incidentDate->format("Y-m-d"))
					->first();

					if($tbt->totalHours !== null) {
					// LTIFR = (Number of lost time injuries / Total hours worked) x 1,000,000
					$item["ltifr"]["itd"] += round(($incident->lti / (int)$tbt->totalHours) * 1000000);
					if($incidentDate->month === $now->month && $incidentDate->year === $now->year) {
						$item["ltifr"]["month"] += round(($incident->lti / (int)$tbt->totalHours) * 1000000);
					}

					// FAFR = (Number of fatal accidents / Total hours worked) x 1,000,000
					if($incident->severity === "Fatality") {
						$item["fafr"]["itd"] += round((1 / (int)$tbt->totalHours) * 1000000);
						if($incidentDate->month === $now->month && $incidentDate->year === $now->year) {
							$item["fafr"]["itd"] += round((1 / (int)$tbt->totalHours) * 1000000);
						}
					}

					// LTISR = (Number of days lost due to lost time injuries / Total hours worked) x 1,000
					

					// TRI = (Number of recordable injuries and illnesses / Total number of hours worked) x 200,000

				}


				// SEVERITY
				if($incidentDate->month === $now->month && $incidentDate->year === $now->year) {
					$item["severity"]["month"][$incident->severity] += 1;
				}
				$item["severity"]["itd"][$incident->severity] += 1;


				return $item;
			}, [
				"tris" => ["month" => 0, "itd" => 0],
				"ltifr" => ["month" => 0, "itd" => 0],
				"ltisr" => ["month" => 0, "itd" => 0],
				"trcf" => ["month" => 0, "itd" => 0],
				"fafr" => ["month" => 0, "itd" => 0],
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
			
		dd($incidents);
		return $incidents;
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