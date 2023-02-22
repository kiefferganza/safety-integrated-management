<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentApprovalSign;
use App\Models\DocumentCommentReplies;
use App\Models\DocumentResponseFile;
use App\Models\DocumentReviewer;
use App\Models\DocumentReviewerSign;
use App\Models\FileModel;
use App\Models\FolderModel;
use App\Models\User;
use App\Services\FolderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FilePageController extends Controller
{
	public function index() {
		return Inertia::render("Dashboard/Management/FileManager/index", [
			"folders" => (new FolderService)->getFolders()
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

	

}
