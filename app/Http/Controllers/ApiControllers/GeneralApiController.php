<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Position;

class GeneralApiController extends Controller
{
 public function positions() {
  // !TODO: add subscriber id
  return response()->json(Position::where("is_deleted", 0)->get()->toArray());
 }
}