<?php

namespace App\Services;

use App\Models\Images;
use App\Models\Incident;
use App\Models\InspectionReportList;
use App\Models\TbtStatistic;
use App\Models\ToolboxTalk;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
		$month = Incident::select("severity", DB::raw("count(*) as total"))
			->whereNull("deleted_at")
			->whereMonth("incident_date", $now->month)
			->groupBy("severity")
			->get()
			->reduce(function($incident, $item) {
				$incident[$item->severity] = $item->total;
				return $incident;
			}, [
				"Minor" => 0,
				"Significant" => 0,
				"Major" => 0,
				"Fatality" => 0,
			]);
		$itd = Incident::select("severity", DB::raw("count(*) as total"))->whereNull("deleted_at")->groupBy("severity")->get()->reduce(function($incident, $item) {
			$incident[$item->severity] = $item->total;
			return $incident;
		}, [
			"Minor" => 0,
			"Significant" => 0,
			"Major" => 0,
			"Fatality" => 0,
		]);

		return [
			"month" => $month,
			"itd" => $itd
		];
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