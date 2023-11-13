<?php

namespace App\Http\Controllers;

use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use League\Glide\Responses\LaravelResponseFactory;
use League\Glide\ServerFactory;

class ImagesController extends Controller
{

	public function showImage(Filesystem $filesystem, Request $request, $path) {
		$server = ServerFactory::create([
				'response' => new LaravelResponseFactory($request),
				'source' => $filesystem->getDriver(),
				'cache' => $filesystem->getDriver(),
				'cache_path_prefix' => '.glide-cache',
		]);
		
		try {
			return $server->getImageResponse("public/".$path, $request->all());
		} catch (\Throwable $th) {
			abort(404);
		}
	}

	public function showFile($path) {
		$storage = Storage::disk('public');
		if($storage->exists($path)) {
			return response()->file($storage->path($path));
		};
		abort(404, "file not found");
	}


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


	public function destroy(Images $image) {
		$image->delete();
		
		return redirect()->back()
		->with("message", "Images uploaded successfully!")
		->with("type", "success");
	}


}
