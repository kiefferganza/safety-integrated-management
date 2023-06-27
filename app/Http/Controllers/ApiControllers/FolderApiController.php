<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\FolderModel;
use Illuminate\Http\Request;

class FolderApiController extends Controller
{
    public function updateOrder(Request $request) {
		$request->validate([
			'folders' => ['array', 'required']
		]);
		foreach ($request->folders as $folder) {
			$folder = FolderModel::where("folder_id",$folder['folder_id'])->update(['item_order' => $folder['order']], ['timestamps' => false]);
		}

		return response()->json([
			'success' => true,
		]);
	}
}
