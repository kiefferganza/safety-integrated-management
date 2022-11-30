<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
	public function index() {
		return Inertia::render('Dashboard/Management/Position/List/index', [
			"positions" => Position::where("is_deleted", 0)->get()
		]);
	}
}
