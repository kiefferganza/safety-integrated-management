<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\TbtStatistic;
use App\Models\TbtStatisticMonth;
use App\Models\ToolboxTalk;
use App\Services\EmployeeService;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ToolboxTalkController extends Controller
{
  public function index() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/List/All", [
			"tbt" => ToolboxTalkService::getList(),
			"positions" => Position::select("position_id", "position")->where("user_id", auth()->user()->subscriber_id)->get()
		]);
	}


	public function reportList() {
		return Inertia::render("Dashboard/Management/ToolboxTalk/Report/index", [
			// "tbt" => ToolboxTalk::select("tbt_id", "tbt_type", "date_conducted")->where("is_deleted", 0)
			// 					->with([
			// 						"participants" => fn ($q) => $q->select("firstname", "lastname", "position")->distinct()
			// 					])
			// 					->orderBy('date_conducted')
			// 					->get(),
			"positions" => Position::select("position_id", "position")->where("user_id", auth()->user()->subscriber_id)->get()
		]);
	}


	public function view(ToolboxTalk $tbt) {
		return Inertia::render("Dashboard/Management/ToolboxTalk/View/index", [
			"tbt" => $tbt->load([
				"participants" => fn ($q) => $q->select("firstname", "lastname", "position")->distinct()->with("position"),
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
			"tbt" => $tbt->load(["participants" => fn($q) => $q->distinct(), "file"]),
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


	public function statistic() {
		$statistics = TbtStatistic::with("months:id,tbt_statistic_id,manhours,manpower,month_code,month")->get();
		$statistics->transform(function($item) {
			$item->src = $item->getMedia()[0]->getFullUrl();
			return $item;
		});

		return Inertia::render("Dashboard/Management/ToolboxTalk/Statistic/index", [
			"statistics" => $statistics
		]);
	}


	public function storeStatistic(Request $request) {
		$request->validate([
			"year" => "integer|required",
			"file_src" => "file|required",
			"months" => "array|required|min:12",
		]);
		$user = auth()->user();

		$statistic = TbtStatistic::create([
			"year" => (string)$request->year,
			"user_id" => $user->user_id,
			"employee_id" => $user->emp_id,
			// "file_src" => $file->getClientOriginalName()
		]);
		$statistic->addMediaFromRequest("file_src")->toMediaCollection();
		$statistic->months()->createMany($request->months);

		return redirect()->back()
		->with("message", "Statistic record added successfully!")
		->with("type", "success");
	}


	public function updateStatistic(TbtStatistic $statistic, Request $request) {
		$request->validate([
			"year" => "integer|required",
			"file_src" => "required",
			"months" => "array|required|min:12",
		]);
		
		foreach ($request->months as $month) {
			TbtStatisticMonth::where([
				["tbt_statistic_id", $statistic->id],
				["month_code", $month["month_code"]],
				["month", $month["month"]],
			])->update(["manpower" => $month["manpower"], "manhours" => $month["manhours"]]);
		}

		if($request->hasFile('file_src')) {
			$statistic->media()->delete();
			$statistic->addMediaFromRequest("file_src")->toMediaCollection();
		}
		$statistic->touch();

		return redirect()->back()
		->with("message", "Record updated successfully!")
		->with("type", "success");
	}


	public function destroyStatistic(TbtStatistic $statistic) {
		$statistic->months()->delete();
		$statistic->delete();

		return redirect()->back()
		->with("message", "Record deleted successfully!")
		->with("type", "success");
	}
	

}
