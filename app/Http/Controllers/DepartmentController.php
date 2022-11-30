<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartmentController extends Controller
{
  public function index() {
		$user = Auth::user();
		
		return Inertia::render('Dashboard/Management/Department/List/index', [
			"departments" => Department::where([
					["is_deleted", 0],
					["sub_id", $user->subscriber_id]
				])->get()
		]);
	}



}
