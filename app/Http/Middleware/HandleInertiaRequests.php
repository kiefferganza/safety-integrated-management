<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed[]
     */
    public function share(Request $request)
    {
			$user = auth()->user();

			$authData = [];

			if($user) {
				$authData = cache()->rememberForever("authUser:".$user->user_id, function() {
					$user = auth()->user();
					$user->load([
						"employee" => function($query) {
							$query->leftJoin("tbl_company", "tbl_employees.company", "tbl_company.company_id")
							->leftJoin("tbl_department", "tbl_employees.department", "tbl_department.department_id")
							->leftJoin("tbl_position", "tbl_employees.position", "tbl_position.position_id");
						}
					]);
					$userData = [
						"user_id" => $user->user_id,
						"firstname" => $user->firstname,
						"lastname" => $user->lastname,
						"username" => $user->username,
						"email" => $user->email,
						"password" => $user->password,
						"date_created" => $user->date_created,
						"user_type" => $user->user_type,
						"subscriber_id" => $user->subscriber_id,
						"deleted" => $user->deleted,
						"status" => $user->status,
						"date_updated" => $user->date_updated,
						"profile" => null,
						"position" => $user->position,
						"emp_id" => $user->emp_id,
						"employee" => $user->employee
					];
					$profile = $user->getFirstMedia("profile", ["primary" => true]);
					if($profile) {
						$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
						$userData["profile"] = [
							"url" => URL::route("image", [ "path" => $path ]),
							"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
							"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
						];
					}
					
					$cover = $user->getFirstMedia("cover", ["primary" => true]);
					if($cover) {
						$path = "user/" . md5($cover->id . config('app.key')). "/" .$cover->file_name;
						$userData["cover"]  = [
							"url" => URL::route("image", [ "path" => $path ]),
							"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
							"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ]),
							"cover" => URL::route("image", [ "path" => $path, "w" => 1200, "h" => 280, "fit" => "crop" ]),
						];
					}
					return [
						"user" => $userData
					];
				});
				$authData["permissions"] = $user->permissions->pluck('name')->mapWithKeys(fn($item) => [$item => Str::title($item)]);
				$authData["role"] = $user->roles->first()->name;
			}

			return array_merge(parent::share($request), [
				'auth' => $authData,
				'ziggy' => function () use ($request) {
					return array_merge((new Ziggy)->toArray(), [
							'location' => $request->url(),
					]);
				},
				'flash' => [
					'message' => fn () => $request->session()->get('message'),
					'type' => fn () => $request->session()->get('type'),
					'data' => fn () => $request->session()->get('data'),
				],
			]);
    }
}
