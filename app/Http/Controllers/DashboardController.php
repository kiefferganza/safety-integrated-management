<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use App\Models\ToolboxTalk;
use App\Models\ToolboxTalkParticipant;
use App\Models\Training;
use App\Models\TrainingTrainees;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index() {
		$user = Auth::user();

			
		return Inertia::render("Dashboard/General/Analytics/index", [
			"employeesCount" => Employee::where("is_deleted", 0)->where("sub_id", $user->subscriber_id)->count(),
			"trainings" => Training::select("type", "training_hrs", "training_date")->where("is_deleted", 0)->withCount("training_files")->get(),
		]);
	}
}
