<?php

namespace App\Services;

use App\Models\Training;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class TrainingService {

	private $storage;
	private $path;

	public function __construct() {
		$this->storage = Storage::disk("public");
		$this->path = "media/training/";
	}

	public function loadTraining(Training $training) {
		$relation = [
			"trainees" => fn ($query) => $query->with("position"),
			"user_employee" => fn($q) => $q->select("user_id", "firstname", "lastname"),
			"training_files",
		];
		if($training->type === 3) {
			$relation["external_details"] = fn($q) => $q->with([
				"approval" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
				"reviewer" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
				"requested" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			]);
		}
		return $training->load($relation);
	}


	public function getTrainingByType($type) {
		$relation = [];
		if($type === 3) {
			$relation[] = "external_status";
			$relation["external_details"] = fn($q) => $q->select("approved_by", "reviewed_by", "requested_by", "course_price", "currency", "training_id", "training_ext_id")->with([
				"approval" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
				"reviewer" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position"),
				"requested" => fn($q) => $q->select("employee_id","firstname", "lastname", "tbl_position.position")->join("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			]);
		}
		
		return Training::where([["is_deleted", false], ["type", $type]])
		->with($relation)
		->withCount(["training_files", "trainees"])
		->orderByDesc("date_created")
		->get();

	}


	public function transformFiles($trainingFiles) {
		return $trainingFiles->transform(function($trFile) {
			if($this->storage->exists($this->path . $trFile->src)) {
				$type = explode("/", mime_content_type($this->storage->path($this->path . $trFile->src)))[0];
				$trFile->url = $type === "image" ? URL::route('image', ['path' => $this->path . $trFile->src, 'w' => 600]) : URL::route('file', ['path' => $this->path . $trFile->src]);
			}else {
				$trFile->url = null;
			}
			return $trFile;
		});
	}


	public function getSequenceNo($type) {
		$count = Training::where([["is_deleted", false], ["type", $type]])->count() + 1;
		return str_pad($count, 6, '0', STR_PAD_LEFT);
	}


	public function getTrainingType($type) {
		switch ($type) {
			case 1:
				return [
					"title" => "In House",
					"url" => "inHouse"
				];
				break;
			case 2:
				return [
					"title" => "Client",
					"url" => "client"
				];
				break;
			case 3:
				return [
					"title" => "External",
					"url" => "thirdParty"
				];
				break;
			case 4:
				return [
					"title" => "Induction",
					"url" => "induction"
				];
				break;
			default:
				return [
					"title" => "Client",
					"url" => "client"
				];
				break;
		}
	}


}