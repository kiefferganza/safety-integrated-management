<?php

namespace App\Http\Controllers;

use App\Models\FolderModel;
use App\Models\Training;
use App\Services\FolderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FilePageController extends Controller
{
	public function index() {
		$storage = Storage::disk("public");
		$training = Training::select("training_id")
		->with("training_files")
		->where("type", 3)
		->where("is_deleted", 0)
		->get()
		->map(fn($training) => $training->training_files);
		$trainingCount = count($training);
		$fileCount = 0;
		$size = 0;
		foreach ($training->flatten() as $file) {
			$path = "media/training/" . $file->src;
			if($storage->exists($path)) {
				$fileCount++;
				$size += $storage->size($path);
			}
		}

		return Inertia::render("Dashboard/Management/FileManager/index", [
			"folders" => (new FolderService)->getFolders(),
			"externalTraining" => [
				"id" => random_int(10000,99999),
				"count" => $trainingCount,
				"files" => $fileCount,
				"size" => $size
			]
		]);
	}
	

	public function create_folder(Request $request) {
		$user = auth()->user();
		FolderModel::create([
			'is_removed' => 1,
			'is_active' => 0,
			'folder_name' => $request->folderName,
			'sub_id' => $user->subscriber_id
		]);

		return Redirect::back()
		->with("message", "Folder added successfully!")
		->with("type", "success");
	}


	public function update(Request $request, FolderModel $folder) {
		$old_name = $folder->folder_name;
		$folder->folder_name = $request->folderName;
		$folder->increment("revision_no");
		$folder->save();

		return Redirect::back()
		->with("message", $old_name . " updated successfully!")
		->with("type", "info");
	}


	public function destroy(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);
		FolderModel::whereIn("folder_id", $fields["ids"])->update(["is_removed" => 0]);

		return Redirect::back()
		->with("message", "File deleted successfully!")
		->with("type", "error");
	}


	public function thirdParty() {
		$trainings = Training::where([["is_deleted", false], ["type", 3]])
		->withCount(["training_files", "trainees"])
		->orderByDesc("date_created")
		->get();

		return Inertia::render("Dashboard/Management/FileManager/Document/External/ThirdPartyTraining/index", [
			"trainings" => $trainings,
			"url" => "third-party",
			"type" => 3
		]);
	}
	

}
