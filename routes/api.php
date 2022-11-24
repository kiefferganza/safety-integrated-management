<?php

use ExpoSDK\Expo;
use ExpoSDK\ExpoMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/send/notification", function(Request $request) {
	$request->validate([
		"to" => "required|string|starts_with:ExponentPushToken[",
		"title" => "required|string",
		"body" => "required|string",
		"data" => "array"
	]);
	$message = new ExpoMessage();

	$message = (new ExpoMessage([
    'title' => 'You have new notification',
	]))
	->setTo($request->to)
	->setTitle($request->title)
	->setBody($request->body);

	(new Expo())->send($message)->push();
	return ["ok" => 1];
});