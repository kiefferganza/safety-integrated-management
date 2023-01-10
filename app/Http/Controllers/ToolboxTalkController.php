<?php

namespace App\Http\Controllers;

use App\Models\ToolboxTalk;
use App\Services\EmployeeService;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ToolboxTalkController extends Controller
{
  function index() {

	}


	function civil_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/CivilList", [
			"tbt" => ToolboxTalkService::getListByType(1)
		]);
	}



	function electrical_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/ElectricalList", [
			"tbt" => ToolboxTalkService::getListByType(2)
		]);
	}


	
	function mechanical_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/MechanicalList", [
			"tbt" => ToolboxTalkService::getListByType(3)
		]);
	}



	function camp_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/CampList", [
			"tbt" => ToolboxTalkService::getListByType(4)
		]);
	}



	function office_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/OfficeList", [
			"tbt" => ToolboxTalkService::getListByType(5)
		]);
	}


	public function create(Request $request) {
		return Inertia::render("Dashboard/Management/ToolboxTalk/Create/index", [
			"sequences" => ToolboxTalkService::getSequenceNo(),
			"participants" => (new EmployeeService())->personels()->position()->get(),
			"tbt_type" => $request->type ? $request->type : "1"
		]);
	}

	public function store(Request $request) {
		$tbt_id = ToolboxTalkService::insertGetID($request->all());
		if(!$tbt_id) {
			abort(500, "Something went wrong!");
		}
		if(isset($request->img_src) && $request->img_src !== null) {
			ToolboxTalkService::insertFile($request->img_src, $tbt_id);
		}
		ToolboxTalkService::insertParticipants($request->participants, $tbt_id);

		$redirect_route = "civil";

		switch ($request->tbt_type) {
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

		return redirect()->route('toolboxtalk.management.'.$redirect_route)
		->with("message", "Toolbox talk added successfully!")
		->with("type", "success");
	}


}
