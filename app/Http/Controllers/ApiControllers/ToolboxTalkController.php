<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\DocumentProjectDetail;
use App\Models\Employee;
use App\Models\TbtPrePlanning;
use App\Models\TbtPrePlanningAssigned;
use App\Models\ToolboxTalk;
use App\Services\API\ToolboxTalkApiService;
use App\Services\ToolboxTalkService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

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


	public function tbtDailies()
	{
		$user = auth()->user();
		
		$tbtService = new ToolboxTalkApiService();
		
		[$employees, $preplanning] = $tbtService->getAssignedEmployees();


		$locations = DocumentProjectDetail::select("value", "id")->where("sub_id", $user->subscriber_id)->where("title", "Location")->get();

			return response()->json(compact("employees", "preplanning", "locations"));
	}

	
}
