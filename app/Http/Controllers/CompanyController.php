<?php

namespace App\Http\Controllers;

use App\Models\CompanyModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyController extends Controller
{
  public function index() {
		return Inertia::render('Dashboard/Management/Company/index', [
			"companies" => CompanyModel::where("is_deleted", 0)->get()
		]);
	}


	public function store(Request $request) {
		$user = Auth::user();
		CompanyModel::create([
			"company_name" => $request->company,
			"sub_id" => $user->subscriber_id,
			"is_deleted" => 0
		]);
		return redirect()->back()
		->with("message", "Position created successfully!")
		->with("type", "success");;
	}


	public function edit(Request $request, CompanyModel $company) {
		$company->company_name = $request->company;
		$company->save();

		return redirect()->back()
		->with("message", "Company $company->company_name updated successfully!")
		->with("type", "success");
	}


	public function destroy(CompanyModel $company) {
		$company->is_deleted = 1;
		$company->save();

		return redirect()->back()
		->with("message", "Company $company->company_name deleted successfully!")
		->with("type", "success");
	}

	public function delete_multiple(Request $request) {
		$fields = $request->validate([
			"ids" => "required|array"
		]);
		CompanyModel::whereIn("company_id", $fields["ids"])->update(["is_deleted" => 1]);

		return redirect()->back()
		->with("message", count($fields['ids'])." positions deleted successfully")
		->with("type", "success");
	}


}
