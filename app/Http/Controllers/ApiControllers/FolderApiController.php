<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentExternalApprover;
use App\Models\DocumentExternalReviewer;
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

	public function generateUrl(Request $request, Document $document) {
		$token = Str::uuid()->toString();

		$shareableLink = URL::route('shared.document.show', ['folder' => $document->folder->folder_name, 'document' => $document->form_number, 'token' => $token]);

		$personel = new DocumentExternalApprover();
		$personel->document_id = $document->document_id;
		$personel->firstname = $request->firstname;
		$personel->lastname = $request->lastname;
		if($request->position) {
			$personel->position = $request->position;
		}
		$personel->save();

		$createdShare = ShareableLink::create([
			'token' => $token,
			'url' => $shareableLink,
			'model_type' => Document::class,
			'model_id' => $document->document_id,
			'custom_properties' => [
				"id" => $personel->id
			],
			"sub_id" => $document->folder->sub_id,
			'expiration_date' => now()->addWeeks(3),
		]);
		return response()->json(compact('shareableLink', 'createdShare'));
	}
}
