<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Incident;
use App\Models\TbtStatisticMonth;
use Illuminate\Http\Request;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkFile;
use App\Models\ToolboxTalkParticipant;
use App\Models\User;
use App\Notifications\ModuleBasicNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class ToolboxTalkService {

	private $cms;

	public function __construct($input = false){
		$this->cms = $this->getCms($input);
	}


	public function getRouteByType($tbt_type) {
		$redirect_route = "civil";

		switch ($tbt_type) {
			case '2':
				$redirect_route = "electrical";
				break;
				break;
			case "3":
				$redirect_route = "mechanical";
				break;
			case "4":
				$redirect_route = "camp";
				break;
			case "5":
				$redirect_route = "office";
				break;
			default:
				break;
		}
		return $redirect_route;
	}

	public function getCms($input) {
		if($input) {
			$cms = sprintf("%s-%s-%s-%s", $input["project_code"], $input["originator"],$input["discipline"],$input["document_type"]);
			if($input["document_zone"]) {
				$cms .= "-". $input["document_zone"];
			}
			if($input["document_level"]) {
				$cms .= "-". $input["document_level"];
			}
			$cms .= "-" . $input["sequence_no"];
			return strtoupper($cms);
		}
		return false;
	}

	public static function getList() {
		return ToolboxTalk::where("is_deleted", 0)
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
			"file" => fn ($q) => $q->select("tbt_id","img_src"),
			"conducted"
		])
		->orderBy('date_conducted')
		->get();
	}


	public static function getListByType(int $type) {
		// $user = Auth::user();

		$toolbox_talks = ToolboxTalk::where([
			["tbt_type", $type],
			// ["employee_id", $user->emp_id],
			["is_deleted", 0]
		])
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname"),
			"file" => fn ($q) => $q->select("tbt_id","img_src"),
			"conducted"
		])
		->get();

		return $toolbox_talks;
	}


	public function getSequenceNo() {
		$tbt = ToolboxTalk::select("is_deleted", "tbt_type")->where('is_deleted', 0)->get()->toArray();

		$sequences = array(
			"civil" => 1,
			"electrical" => 1,
			"mechanical" => 1,
			"camp" => 1,
			"office" => 1,
		);
		
		foreach ($tbt as $t) {
			switch ($t["tbt_type"]) {
				case '1':
					$sequences["civil"]++;
					break;
				case '2':
					$sequences["electrical"]++;
					break;
				case '3':
					$sequences["mechanical"]++;
					break;
				case '4':
					$sequences["camp"]++;
					break;
				case '5':
					$sequences["office"]++;
					break;
				default:
					break;
			}
		}

		return [
			"1" => str_pad((string) $sequences["civil"], 6, '0', STR_PAD_LEFT),
			"2" => str_pad((string) $sequences["electrical"], 6, '0', STR_PAD_LEFT),
			"3" => str_pad((string) $sequences["mechanical"], 6, '0', STR_PAD_LEFT),
			"4" => str_pad((string) $sequences["camp"], 6, '0', STR_PAD_LEFT),
			"5" => str_pad((string) $sequences["office"], 6, '0', STR_PAD_LEFT),
			// "1" => str_repeat("0", strlen((string) $sequences["civil"])) . $sequences["civil"],
			// "2" => str_repeat("0", strlen((string) $sequences["electrical"])) . $sequences["electrical"],
			// "3" => str_repeat("0", strlen((string) $sequences["mechanical"])) . $sequences["mechanical"],
			// "4" => str_repeat("0", strlen((string) $sequences["camp"])) . $sequences["camp"],
			// "5" => str_repeat("0", strlen((string) $sequences["office"])) . $sequences["office"],
		];
	}


	public function insertGetID($input) {
		$user = auth()->user();
		
		$tbt = new ToolboxTalk();

		$tbt->employee_id = $user->emp_id;
		$tbt->originator = $input["originator"];
		$tbt->project_code = $input["project_code"];
		$tbt->discipline = $input["discipline"];
		$tbt->document_type = $input["document_type"];
		$tbt->document_zone = $input["document_zone"];
		$tbt->document_level = $input["document_level"];
		$tbt->title = $input["title"];
		$tbt->location = $input["location"];
		$tbt->contract_no = $input["contract_no"];
		$tbt->tbt_type = $input["tbt_type"];
		$tbt->date_conducted = $input["date_conducted"];
		$tbt->time_conducted = $input["time_conducted"];
		$tbt->conducted_by = $input["conducted_by"];
		$tbt->description = $input["description"];
		$tbt->status = $input["img_src"] !== null;
		$tbt->remarks = $input["remarks"];
		$tbt->moc_wo_no = $input["moc_wo_no"];
		$tbt->site = $input["site"];

		if($tbt->save()) {
			$type = "Civil";

			switch ($input["tbt_type"]) {
				case '2':
					$type = "Electrical";
					break;
				case "3":
					$type = "Mechanical";
				case "4":
					$type = "Workshop";
				case "5":
					$type = "Office";
				default:
					break;
			}
			foreach ($input['participants'] as $participant) {
				if($participant['user_id']) {
					$creator = User::find($participant['user_id']);
					$conductedBy = Employee::find($input['conducted_by']);
					if($creator) {
						$dateConducted = Carbon::parse($input["date_conducted"])->format('F j, Y');
						$time = Carbon::createFromFormat('H:i', $input["time_conducted"])->format('g:i A');

						$message = '<p>Title: <strong>'. $input['title'] .'</strong></p>';
						if($conductedBy) {
							$message .= '<p>Conducted By: <strong>'. $conductedBy->fullname .'</strong></p>';
						}
						$message .= '<p>Location: <strong>'. $input['location'] .'</strong></p>';
						$message .= '<p>Date & Time: <strong>'. $dateConducted .' '. $time .'</strong></p>';
						$message .= '<p>CMS: <strong>'. $this->getCms($input). '</strong></p>';
						Notification::send($creator, new ModuleBasicNotification(
							title: 'created toolbox talks',
							message: $message,
							category: 'Toolbox Talks - ' . $type,
							routeName: 'toolboxtalk.management.show',
							creator: $user,
							params: $tbt->tbt_id
						));
					}
				}
			}
		}

		return $tbt->tbt_id;
	}


	public function insertParticipants($participants, $tbt_id) {
		$participants_arr = [];
		foreach ($participants as $participant) {
			$participants_arr[] = [
				"employee_id" => $participant["employee_id"],
				"user_id" =>$participant["sub_id"],
				"time" => "9",
				"tbt_id" => $tbt_id,
				"is_removed" => 0,
			];
			// $tbt_participants = new ToolboxTalkParticipant;
			// $tbt_participants->employee_id = $participant["employee_id"];
			// $tbt_participants->user_id = $participant["sub_id"];
			// $tbt_participants->time = $participant["time"];
			// $tbt_participants->time = "9";
			// $tbt_participants->tbt_id = $tbt_id;
			// $tbt_participants->is_removed = 0;
			// $tbt_participants->save();
		}
		ToolboxTalkParticipant::insert($participants_arr);
	}

	public function insertFile($files, $tbt_id) {
		$filesToInsert = array();

		foreach ($files as $idx => $file) {
			$newfile = $file->getClientOriginalName();
			$extension = pathinfo($newfile, PATHINFO_EXTENSION);
			$file_name = date("Ymds"). $idx . '-' .$newfile. "." . $extension; 
			$file->storeAs('media/toolboxtalks', $file_name, 'public');

			$filesToInsert[] = [
				"img_src" => $file_name,
				"type" => "attachment",
				"tbt_id" => $tbt_id
			];
		}

		if(!empty($filesToInsert)) {
			ToolboxTalkFile::insert($filesToInsert);
		}
	}


	public function update(ToolboxTalk $tbt, Request $request) {
		if($tbt->sequence_no === "") {
			$tbt->sequence_no = $request->sequence_no;
		}
		$tbt->originator = $request->originator;
		$tbt->project_code = $request->project_code;
		$tbt->discipline = $request->discipline;
		$tbt->document_type = $request->document_type;
		$tbt->document_zone = $request->document_zone;
		$tbt->document_level = $request->document_level;
		$tbt->title = $request->title;
		$tbt->location = $request->location;
		$tbt->contract_no = $request->contract_no;
		$tbt->tbt_type = $request->tbt_type;
		$tbt->date_conducted = $request->date_conducted;
		$tbt->time_conducted = $request->time_conducted;
		$tbt->conducted_by = $request->conducted_by;
		$tbt->description = $request->description;
		$tbt->status = $request->status;
		$tbt->remarks = $request->remarks;
		$tbt->moc_wo_no = $request->moc_wo_no;
		$tbt->site = $request->site;

		$tbt->increment("revision_no");

		ToolboxTalkParticipant::where("tbt_id", $tbt->tbt_id)->delete();
		$this->insertParticipants($request->participants, $tbt->tbt_id);


		// DELETE OLD FILE
		if(isset($request->removed_files) && !empty($request->removed_files)) {
			$oldFileIds = array();
			foreach ($request->removed_files as $oldFile) {
				if(Storage::exists("public/media/toolboxtalks/" . $oldFile["img_src"])) {
					Storage::delete("public/media/toolboxtalks/" . $oldFile["img_src"]);
				}
				$oldFileIds[] = (int)$oldFile["tbt_img_id"];
			}
			if(!empty($oldFileIds)) {
				ToolboxTalkFile::whereIn("tbt_img_id", $oldFileIds)->delete();
			}
		}

		if(!empty($request->img_src)) {
			// INSERT NEW FILE
			$this->insertFile($request->img_src, $tbt->tbt_id);
		}

		return $tbt->save();
	}


	public function soft_delete($ids) {
		if(!empty($ids)) {
			ToolboxTalk::whereIn("tbt_id", $ids)->update(["is_deleted" => 1]);
			ToolboxTalkParticipant::whereIn("tbt_id", $ids)->update(["is_removed" => 1]);
			ToolboxTalkFile::whereIn("tbt_id", $ids)->update(["is_deleted" => 1]);
		}
	}


  public function getSafeManhours() {
    $user = auth()->user();
    $cachedSafeManhours = Cache::get("safemanhours_" . $user->subscriber_id);
    
    if($cachedSafeManhours) {
      return $cachedSafeManhours;
    }
    $tbt = ToolboxTalk::select("tbt_id", "is_deleted")
		->where("is_deleted", 0)
    ->withCount("participants")
    ->get()
    ->reduce(function($current, $tbt) {
      $current += $tbt->participants_count * 9;
      return $current;
    }, 0);
    $stats = TbtStatisticMonth::select("tbt_statistic_months.id", "tbt_statistic_id", "manhours", "manpower", "month_code", "tbt_statistics.year")
    ->leftJoin("tbt_statistics", "tbt_statistics.id", "tbt_statistic_months.tbt_statistic_id")
    ->get()
    ->reduce(function($current, $stat) {
      $current += round($stat->manhours);
      return $current;
    },0);

    $incidents = Incident::sum('day_loss');

    $smh = ($tbt + $stats) - $incidents;
    Cache::put("safemanhours_" . $user->subscriber_id, $smh);
    return $smh;
  }

  public function totalTbtByYear(Carbon $from, Carbon $to) {
    $defaultTotal = [
      "totalManHours" => 0,
      "totalManpower" => 0,
      "location" => [],
      "days" => [],
      "totalDays" => 0
    ];
    $years = [];
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
      "location" => 0,
      "avg_manpower_day" => 0,
    ];
    
    foreach ($yearRange as $year) {
      foreach ($months as $month => $val) {
        $months[$month]['totalDays'] = Carbon::create($year, $month)->daysInMonth;
      }
      $years[$year] = $months;
    }

    $tbt = ToolboxTalk::select("tbt_id", "location", "date_conducted", "location", DB::raw('YEAR(date_conducted) as year'), DB::raw('MONTH(date_conducted) as month'))
		->where("is_deleted", 0)
		->whereBetween("date_conducted", [$from, $to])
    ->withCount("participants")
    ->get();

    $tbtByYear = $tbt->reduce(function($current, $tbt) {
      $dateConducted = Carbon::parse($tbt->date_conducted);
      if(!in_array($dateConducted->day, $current[$tbt->year][$tbt->month]['days'])) {
        $current[$tbt->year][$tbt->month]['days'][] = $dateConducted->day;
      }

      if(!in_array($tbt->location, $current[$tbt->year][$tbt->month]['location'])) {
        $current[$tbt->year][$tbt->month]['location'][] = $tbt->location;
      }
      $current[$tbt->year][$tbt->month]['totalManHours'] += $tbt->participants_count * 9;
      $current[$tbt->year][$tbt->month]['totalManpower'] += $tbt->participants_count;
      return $current;
    },$years);

    $yearsAddedToTbt = $tbt->pluck("year")->unique();
    foreach ($yearsAddedToTbt as $year) {
      foreach ($tbtByYear[$year] as $data) {
        $days = count($data["days"]);
        if($data['totalManpower'] > 0) {
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

    foreach ($statistics as $stat) {
      $tbtByYear[$stat->year][$stat->month_code]["totalManHours"] += $stat->manhours;
      $tbtByYear[$stat->year][$stat->month_code]["totalManpower"] += $stat->manpower;
      $analytics["totalManHours"] += round($stat->manhours);
      $analytics["totalManpower"] += round($stat->manpower);
    }

    if($analytics["totalManpower"] > 0) {
      $diffDays = $from->diffInDays($to);
      $analytics["avg_manpower_day"] = ceil($analytics["totalManpower"] / $diffDays);
    }

    $monthRolling = [
      'categories' => [],
      'manpower' => [],
      'manhours' => [],
      'safemanhours' => [],
    ];
    $copyStart = $to->copy()->subMonths(11)->day(1)->hour(0)->minutes(0)->second(0);
    // dd($copyStart, $to);
    $incidents = Incident::select(DB::raw('YEAR(incident_date) as year'), DB::raw('MONTH(incident_date) as month'), 'day_loss')
    ->where('incident_date', '>=', $copyStart->toDateTimeString())
    ->get();
    for ($i = 0; $i < 12; $i++) {
      $c = $copyStart->copy()->addMonth($i);
      if($i === 12) {
        $c->day($c->daysInMonth);
      }
      $y = $c->year;
      $m = $c->month;
      if(isset($tbtByYear[$y][$m])) {
        $t = $tbtByYear[$y][$m];
        $monthRolling['categories'][] = $c->format('M'). ' ' .$y;

        $monthRolling['manpower'][$y.'-'.$m] = $t['totalManpower'];
        $monthRolling['manhours'][$y.'-'.$m] = $t['totalManHours'];
        $monthRolling['safemanhours'][$y.'-'.$m] = $t['totalManHours'];
      }
      $s = $statistics->where("year", $y)->where("month_code", $m)->first();
      if($s) {
        $monthRolling['manpower'][$y.'-'.$m] = $monthRolling['manpower'][$y.'-'.$m] ? $monthRolling['manpower'][$y.'-'.$m] + $s->manpower : $s->manpower;
        $monthRolling['manhours'][$y.'-'.$m] = $monthRolling['manhours'][$y.'-'.$m] ? $monthRolling['manhours'][$y.'-'.$m] + $s->manhours : $s->manhours;
        $monthRolling['safemanhours'][$y.'-'.$m] = $monthRolling['manhours'][$y.'-'.$m] ? $monthRolling['manhours'][$y.'-'.$m] + $s->manhours : $s->manhours;
      }
      $incident = $incidents->where("year", $y)->where("month", $m)->first();
      if($incident &&  $monthRolling['safemanhours'][$incident->year.'-'.$incident->month] > 0) {
        $monthRolling['safemanhours'][$incident->year.'-'.$incident->month] -= $incident->day_loss;
      }
    }
    
    return compact("tbtByYear", "analytics", "monthRolling");
  }


}