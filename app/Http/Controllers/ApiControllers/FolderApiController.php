<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\FolderModel;
use App\Models\ShareableLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

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

	public function generateUrl(Document $document) {
		$token = Str::uuid()->toString();
		$shareableLink = URL::route('shared.document.show', ['folder' => $document->folder_id, 'document' => $document->document_id, 'token' => $token]);

		ShareableLink::create([
			'token' => $token,
			'url' => $shareableLink,
			'model_type' => Document::class,
			'model_id' => $document->document_id,
			'expiration_date' => now()->addHours(24),
		]);
		return response()->json(compact('shareableLink'));
	}
}
