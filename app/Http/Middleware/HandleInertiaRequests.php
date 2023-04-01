<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
			$user = Auth::user();

			$authData = null;

			if($user) {
				$permissions = array();
				// foreach ($user->permissions->pluck('name') as $permission) {
				// 	$permissionArr = explode("_",$permission);
				// 	$permissionDetail = end($permissionArr);
				// 	array_pop($permissionArr);
				// 	$permissionTitle = Str::title(join(" ", $permissionArr));
				// 	$permissions[$permissionTitle][$permission] = Str::title(Str::replace("-", " ",Str::kebab($permissionDetail)));
				// }
				foreach ($user->permissions->pluck('name') as $permission) {
					$permissions[$permission] = Str::title($permission);
				}
				$authData = [
					"user" => $user->load([
						"employee" => function($query) {
							$query->leftJoin("tbl_company", "tbl_employees.company", "tbl_company.company_id")
							->leftJoin("tbl_department", "tbl_employees.department", "tbl_department.department_id")
							->leftJoin("tbl_position", "tbl_employees.position", "tbl_position.position_id");
						},
						// "social_accounts"
					]),
					"permissions" => $permissions,
					"role" => $user->roles->pluck('name')[0]
				];
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
