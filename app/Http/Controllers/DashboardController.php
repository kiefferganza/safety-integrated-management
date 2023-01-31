<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Training;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index() {
		$user = Auth::user();

			
		return Inertia::render("Dashboard/General/Analytics/index", [
			"employeesCount" => Employee::where("is_deleted", 0)->where("sub_id", $user->subscriber_id)->count(),
			"trainings" => Training::select("type", "training_hrs", "training_date")->where("is_deleted", 0)->withCount("training_files")->get()
		]);
		
	}
}
