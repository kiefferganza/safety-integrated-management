<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\DocumentProjectDetail;
use App\Services\API\ToolboxTalkApiService;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;
class ToolboxTalkController extends Controller
{
	public function index()
	{
		return response()->json(ToolboxTalkService::getList());
	}

	public function byType(Request $request)
	{
		$request->validate([
			'type' => 'required|integer|between:1,5'
		]);
		return response()->json(ToolboxTalkService::getListByType($request->query('type')));
	}


	public function tracker()
	{
		$user = auth()->user();

		$tbtService = new ToolboxTalkApiService();

		[$employees, $preplanning] = $tbtService->getAssignedEmployees();

		$sequenceNo = $tbtService->preplanningLatestSequenceNumber();


		$projectDetails = DocumentProjectDetail::where("sub_id", $user->subscriber_id)->get()->groupBy("title");

		return response()->json(compact("preplanning", "employees", "projectDetails", "sequenceNo"));
	}

	
}
