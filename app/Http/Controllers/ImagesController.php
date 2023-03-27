<?php

namespace App\Http\Controllers;

use App\Models\Images;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImagesController extends Controller
{


	public function storeSlider(Request $request) {
		if(!$request->hasFile('images')) {
			return redirect()->back();
		}

		foreach ($request->images as $image) {
			Images::create([
				"type" => "slider",
				"user_id" => auth()->user()->user_id
			])->addMedia($image)->toMediaCollection("slider");
		}
		return redirect()->back()
		->with("message", "Images uploaded successfully!")
		->with("type", "success");
	}


}
