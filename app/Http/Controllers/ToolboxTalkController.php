<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\ToolboxTalk;
use App\Services\EmployeeService;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ToolboxTalkController extends Controller
{
  public function index() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/All", [
			"tbt" => ToolboxTalkService::getList(1)
		]);
	}


	public function reportList() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/Report/index", [
			"tbt" => ToolboxTalk::select("tbt_id", "tbt_type", "date_conducted")->where("is_deleted", 0)
								->with([
									"participants" => fn ($q) => $q->select("firstname", "lastname", "position")
								])
								->orderBy('date_conducted')
								->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", auth()->user()->user_id)->get()
		]);
	}


	public function view(ToolboxTalk $tbt) {
		return Inertia::render("Dashboard/Management/ToolboxTalk/View/index", [
			"tbt" => $tbt->load([
				"participants" => fn ($q) => $q->select("firstname", "lastname", "position")->with("position"),
				"conducted"	=> fn ($q) => $q->select("employee_id", "firstname", "lastname"),
				"file" => fn ($q) => $q->select("tbt_id","img_src")
			])
		]);
	}


	public function create(Request $request) {
		$tbtService = new ToolboxTalkService();

		return Inertia::render("Dashboard/Management/ToolboxTalk/Create/index", [
			"sequences" => $tbtService->getSequenceNo(),
			"participants" => (new EmployeeService())->personels()->position()->get(),
			"tbt_type" => $request->type ? $request->type : "1"
		]);
	}


	public function store(Request $request) {
		$tbtService = new ToolboxTalkService($request);
		$tbt_id = $tbtService->insertGetID($request->all());
		if(!$tbt_id) {
			abort(500, "Something went wrong!");
		}

		if($request->hasFile("img_src")) {
			$tbtService->insertFile($request->img_src, $tbt_id);
		}
		$tbtService->insertParticipants($request->participants, $tbt_id);

		$redirect_route = $tbtService->getRouteByType($request->tbt_type);

		return redirect()->route('toolboxtalk.management.'.$redirect_route)
		->with("message", "Toolbox talk added successfully!")
		->with("type", "success");
	}


	public function edit(ToolboxTalk $tbt) {
		$tbtService = new ToolboxTalkService();
		return Inertia::render("Dashboard/Management/ToolboxTalk/Edit/index", [
			"sequences" => $tbtService->getSequenceNo(),
			"tbt" => $tbt->load(["participants", "file"]),
			"participants" => (new EmployeeService())->personels()->position()->get(),
		]);
	}


	public function update(ToolboxTalk $tbt, Request $request) {
		$tbtService = new ToolboxTalkService($request);
		$updated = $tbtService->update($tbt, $request);
		if(!$updated) {
			abort(500, "Something went wrong!");
		}

		return redirect()->back()
		->with("message", "Toolbox talk updated successfully!")
		->with("type", "success");
	}


	public function soft_delete(Request $request) {
		(new ToolboxTalkService)->soft_delete($request->ids);
		
		return redirect()->back()
		->with("message", "Toolbox talk deleted successfully!")
		->with("type", "success");
	}


	public function civil_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/CivilList", [
			"tbt" => ToolboxTalkService::getListByType(1)
		]);
	}



	public function electrical_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/ElectricalList", [
			"tbt" => ToolboxTalkService::getListByType(2)
		]);
	}


	
	public function mechanical_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/MechanicalList", [
			"tbt" => ToolboxTalkService::getListByType(3)
		]);
	}



	public function camp_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/CampList", [
			"tbt" => ToolboxTalkService::getListByType(4)
		]);
	}



	public function office_list() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/OfficeList", [
			"tbt" => ToolboxTalkService::getListByType(5)
		]);
	}


}
