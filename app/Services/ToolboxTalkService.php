<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkFile;
use App\Models\ToolboxTalkParticipant;
use Illuminate\Support\Facades\Auth;
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
			case "3":
				$redirect_route = "mechanical";
			case "4":
				$redirect_route = "camp";
			case "5":
				$redirect_route = "office";
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
		$toolbox_talks = ToolboxTalk::where("is_deleted", 0)
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname", "position")->distinct(),
			"file" => fn ($q) => $q->select("tbt_id","img_src"),
			"conducted"
		])
		->orderBy('date_conducted')
		->get();

		return $toolbox_talks;
	}


	public static function getListByType(int $type) {
		// $user = Auth::user();

		$toolbox_talks = ToolboxTalk::where([
			["tbt_type", $type],
			// ["employee_id", $user->emp_id],
			["is_deleted", 0]
		])
		->with([
			"participants" => fn ($q) => $q->select("firstname", "lastname")->distinct(),
			"file" => fn ($q) => $q->select("tbt_id","img_src"),
			"conducted"
		])
		->orderBy('date_created')
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
			"1" => str_repeat("0", strlen((string) $sequences["civil"])) . $sequences["civil"],
			"2" => str_repeat("0", strlen((string) $sequences["electrical"])) . $sequences["electrical"],
			"3" => str_repeat("0", strlen((string) $sequences["mechanical"])) . $sequences["mechanical"],
			"4" => str_repeat("0", strlen((string) $sequences["camp"])) . $sequences["camp"],
			"5" => str_repeat("0", strlen((string) $sequences["office"])) . $sequences["office"],
		];
	}


	public function insertGetID($input) {
		$user = \auth()->user();
		
		$sequence = ToolboxTalk::where('is_deleted', 0)->where("tbt_type", $input["tbt_type"])->count() + 1;
		
		$tbt = new ToolboxTalk();

		$tbt->employee_id = $user->emp_id;
		$tbt->sequence_no = str_repeat("0", strlen((string) $sequence)) . $sequence;
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

		$tbt->save();

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


}