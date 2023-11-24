<?php

namespace App\Http\Controllers;

use App\Models\DocumentProjectDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyInformation extends Controller
{
    public function register() {
		$user = auth()->user();
		$projectDetails = DocumentProjectDetail::where('sub_id', $user->subscriber_id)
		->orderBy("updated_at", "desc")
		->get();

		$titles = [
			['label' => 'Project Code', 'value' => 'Project Code'],
			['label' => 'Originator', 'value' => 'Originator'],
			['label' => 'Discipline', 'value' => 'Discipline'],
			['label' => 'Type', 'value' => 'Type'],
			['label' => 'Zone', 'value' => 'Zone'],
			['label' => 'Level', 'value' => 'Level'],
			['label' => 'Contract No.', 'value' => 'Contract No.'],
			['label' => 'Location', 'value' => 'Location'],
		];
		
		return Inertia::render("Dashboard/Management/CompanyInformation/Register/index", [
			"projectDetails" => $projectDetails,
			"titles" => $titles
		]);
	}

	public function store(Request $request) {
		$request->validate([
			'title' => ['string', 'required'],
			'value' => ['string', 'required'],
			'name' => ['string', 'nullable']
		]);
		$user = auth()->user();

		DocumentProjectDetail::create([
			'sub_id' => $user->subscriber_id,
			'title' => $request->title,
			'value' => $request->value,
			'name' => $request->name
		]);

		return redirect()->back()
		->with("message", $request->value . " added to " . $request->title . ' successfully!')
		->with("type",  "success");
	}


	public function update(Request $request, DocumentProjectDetail $documentProjectDetail) {
		$request->validate([
			'title' => ['string', 'required'],
			'value' => ['string', 'required'],
			'name' => ['string', 'nullable']
		]);
		$documentProjectDetail->title = $request->title;
		$documentProjectDetail->value = $request->value;
		$documentProjectDetail->name = $request->name;
		$documentProjectDetail->save();
		
		return redirect()->back()
		->with("message", 'Updated successfully!')
		->with("type",  "success");
	}


	public function delete(Request $request) {
		$request->validate([
			"ids" => ["required", "array"]
		]);
		DocumentProjectDetail::whereIn('id', $request->ids)->delete();
		return redirect()->back()
		->with("message", 'Deleted successfully!')
		->with("type",  "success");
	}
}
