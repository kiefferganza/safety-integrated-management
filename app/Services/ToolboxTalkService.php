<?php

namespace App\Services;

use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkFile;
use App\Models\ToolboxTalkParticipant;
use Illuminate\Support\Facades\Auth;

class ToolboxTalkService {

	public static function getListByType(int $type) {
		// $user = Auth::user();

		$toolbox_talks = ToolboxTalk::where([
			["tbt_type", $type],
			// ["employee_id", $user->emp_id],
			["is_deleted", 0]
		])
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname")
		])
		->orderBy('date_created')
		->get();

		return $toolbox_talks;
	}


	public static function getSequenceNo() {
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
			"1" => str_repeat("0", strlen((string) $sequences["civil"])) . $sequences["civil"],
			"2" => str_repeat("0", strlen((string) $sequences["electrical"])) . $sequences["electrical"],
			"3" => str_repeat("0", strlen((string) $sequences["mechanical"])) . $sequences["mechanical"],
			"4" => str_repeat("0", strlen((string) $sequences["camp"])) . $sequences["camp"],
			"5" => str_repeat("0", strlen((string) $sequences["office"])) . $sequences["office"],
		];
	}


	public static function insertGetID($input) {
		$user = Auth::user();
		$tbt = new ToolboxTalk;

		$sequence = ToolboxTalk::where('is_deleted', 0)->where("tbt_type", $input["tbt_type"])->count() + 1;

		$tbt->employee_id = $user->emp_id;
		$tbt->sequence_no = str_repeat("0", $sequence) . $sequence;
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
		$tbt->conducted_by_id = $input["conducted_by_id"];
		$tbt->description = $input["description"];
		$tbt->status = $input["img_src"] !== null;

		$tbt->save();

		return $tbt->tbt_id;
	}


	public static function insertParticipants($participants, $tbt_id) {
		foreach ($participants as $participant) {
			$tbt_participants = new ToolboxTalkParticipant;
			$tbt_participants->employee_id = $participant["employee_id"];
			$tbt_participants->user_id = $participant["sub_id"];
			$tbt_participants->time = $participant["time"];
			$tbt_participants->tbt_id = $tbt_id;
			$tbt_participants->is_removed = 0;
			$tbt_participants->save();
		}
	}

	public static function insertFile($file, $tbt_id) {
		$newfile = $file->getClientOriginalName();
		$extension = pathinfo($newfile, PATHINFO_EXTENSION);
		$file_name = pathinfo($newfile, PATHINFO_FILENAME). "-" . time(). "." . $extension;
		$file->storeAs('media/toolboxtalks', $file_name, 'public');

		$tbt_file = new ToolboxTalkFile;
		$tbt_file->img_src = $file_name;
		$tbt_file->tbt_id = $tbt_id;
		$tbt_file->type = "attachment";
		$tbt_file->save();

	}



}