<?php

namespace App\Http\Controllers;

use App\Models\CompanyModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
  public function index() {
		return Inertia::render('Dashboard/Management/Company/List/index', [
			"companies" => CompanyModel::where("is_deleted", 0)->get()
		]);
	}
}
