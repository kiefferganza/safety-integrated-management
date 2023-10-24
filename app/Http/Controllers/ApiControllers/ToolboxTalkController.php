<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Services\ToolboxTalkService;
use Illuminate\Http\Request;

class ToolboxTalkController extends Controller
{
    public function index() {
		return response()->json(ToolboxTalkService::getList());
	}

	public function byType(Request $request) {
		$request->validate([
			'type' => 'required|integer|between:1,5'
		]);
		return response()->json(ToolboxTalkService::getListByType($request->query('type')));
	}
}
