<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Employee;
use App\Models\Images;
// use App\Models\Follower;
use App\Models\SocialAccount;
use App\Models\TrainingType;
use App\Models\User;
use App\Services\RolesAndPermissionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{

	public function index()
	{
		$user = auth()->user();

		$userslist = User::select(DB::raw("users.user_id, users.username, tbl_employees.firstname, tbl_employees.lastname, tbl_employees.email, users.user_type, users.status, users.date_created, tbl_employees.lastname, tbl_employees.firstname, users.emp_id"))
		->with("social_accounts")
		->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
		->where([
				["users.subscriber_id", $user->subscriber_id],
				["users.deleted", 0]
		])
		->get()
		->transform(function ($user) {
			$profile = $user->getFirstMedia("profile", ["primary" => true]);
			if($profile) {
				$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
				$user->profile = [
					"url" => URL::route("image", [ "path" => $path ]),
					"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
					"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
				];
				return $user;
			}
			$user->profile = null;
			return $user;
		});

		return Inertia::render("Dashboard/Management/User/List/index", ["users" => $userslist]);
	}


	public function create() {
		$employees = Employee::where([
			["is_deleted", 0],
			["user_id", null]
		])->get();
		return Inertia::render("Dashboard/Management/User/Create/index", ["employees" => $employees]);
	}
	

	public function store(UserRequest $request) {
		$request->validate([
			"password" => "required|min:6|confirmed",
			"firstname" => "string|required",
			"lastname" => "string|required",
			"user_type" => "integer|required",
			"emp_id" => "integer|required",
			"username" => [
				"required",
				"string",
				Rule::unique('users')->where("deleted", 0)
			],
		]);
		
		$user = new User();
		$user->username = $request->username;
		$user->firstname = $request->firstname;
		$user->lastname = $request->lastname;
		$user->email = $request->email;
		$user->user_type = $request->user_type;
		$user->subscriber_id = auth()->user()->user_id;
		$user->status = 1;
		$user->deleted = 0;
		$user->date_updated = Carbon::now();
		$user->password = Hash::make($request->password);
		$user->emp_id = $request->emp_id;

		$requestRole = $request->user_type === 1 ? "User" : "Admin";
		$userPermissions = [
			'user_edit',
			'user_show',

			'employee_edit',
			'employee_show',

			'training_create',
			'training_edit',
			'training_delete',
			'training_show',

			'inspection_create',
			'inspection_edit',
			'inspection_delete',
			'inspection_show',

			'talk_toolbox_create',
			'talk_toolbox_edit',
			'talk_toolbox_delete',
			'talk_toolbox_show',

			'folder_show',
			
			'file_create',
			'file_edit',
			'file_delete',
			'file_show',

			'inventory_create',
			'inventory_edit',
			'inventory_delete',
			'inventory_show',

			'stock_addOrRemove',
			'stock_show',
		];
		$user->assignRole($requestRole);
		$user->syncPermissions($userPermissions);

		if($request->hasFile('profile_pic')){
			$user
			->addMediaFromRequest("profile_pic")
			->withCustomProperties(['primary' => true])
			->toMediaCollection("profile");
		}

		$user->save();

		$emp = Employee::find($request->emp_id);

		if($emp && $user) {
			$emp->user_id = $user->user_id;
			$emp->email = $user->email;
			$emp->save();
		}

		return redirect()->back()
			->with('message', 'User added successfully')
			->with('type', 'success');
	}


	public function profile() {
		$user = auth()->user();

		$employee = Employee::where("employee_id", $user->emp_id)->with([
			"participated_trainings" => fn ($q) =>
					$q->select("title", "type", "date_expired", "training_date", "training_hrs", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id")->where("tbl_trainings.is_deleted", 0),
			"company" => fn ($query) =>
				$query->select("company_id", "company_name")->where("is_deleted", 0),
			"position" => fn ($query) => 
				$query->select("position_id", "position")->where("is_deleted", 0),
			"department" => fn ($query) => 
				$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]]),
		])->first();

		// $employee->profiles = $user->getMedia('profile')->transform(function($profile) {});

		return Inertia::render("Dashboard/Management/User/index", [
			"employee" => $employee,
			"trainingTypes" => TrainingType::get()
		]);
	}


	public function show(User $user) {
		if(auth()->user()->user_id === $user->user_id) {
			return redirect()->route('management.user.profile');
		}

		$users =  $user->load([
			"employee" => fn ($query) => 
				$query->with([
					"participated_trainings" => fn ($q) =>
						$q->select("title", "type", "date_expired", "training_date", "training_hrs", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id"),
					"company" => fn ($query) =>
						$query->select("company_id", "company_name")->where("is_deleted", 0),
					"position" => fn ($query) => 
						$query->select("position_id", "position")->where("is_deleted", 0),
					"department" => fn ($query) => 
						$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]])
				]),
				"createdEmployees" => fn($q) => $q->select("employee_id", "firstname", "lastname", "img_src", "email", "created_by", "is_active")
				// "social_accounts",
		]);
		$user->profile = null;
		$profile = $user->getFirstMedia("profile", ["primary" => true]);
		if($profile) {
			$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
			$user->profile = [
				"url" => URL::route("image", [ "path" => $path ]),
				"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
				"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
			];
		}

		$userRole = $user->roles->first()->name;

		return Inertia::render("Dashboard/Management/User/Profile/index", [
			"user" => $users,
			"trainingTypes" => TrainingType::get(),
			"permissions" => (New RolesAndPermissionService)->getAllPermissionByName($userRole, $user),
			"userRole" => $userRole
		]);
	}


	public function update(Request $request, User $user) {
		$validate = [
			"firstname" => "string|required",
			"lastname" => "string|required",
			"user_type" => "integer|required",
			"status" => "integer|required",
			"username" => [
				"required",
				"string",
				Rule::unique('users')->where("deleted", 0)->ignore($user)
			],
		];
		if($request->password) {
			$validate["password"] = "required|min:6|confirmed";
		}
		$request->validate($validate);

		$role = $user->roles->first()->name;;
		$requestRole = $request->user_type === 1 ? "User" : "Admin";
		if($requestRole !== $role) {
			$user->roles()->detach();
			$user->assignRole($requestRole);
		}
		$user->firstname = $request->firstname;
		$user->lastname = $request->lastname;
		$user->username = $request->username;
		$user->email = $request->email;
		$user->user_type = $request->user_type;
		$user->status = $request->status;

		if($request->password) {
			$user->password = Hash::make($request->password);
		}

		if($request->hasFile("profile_pic")){
			$prevProfile = $user->getFirstMedia("profile", ["primary" => true]);
			if($prevProfile) {
				$prevProfile->setCustomProperty("primary", false);
				$prevProfile->save();
			}
			$user
			->addMediaFromRequest("profile_pic")
			->withCustomProperties(['primary' => true])
			->toMediaCollection("profile");
		}

		$user->save();

		if($request->about && $user->emp_id) {
			Employee::find($user->emp_id)->update(["about" => $request->about]);
		}

		$url = url()->previous();
		$route = app('router')->getRoutes($url)->match(app('request')->create($url))->getName();

		if($route === "management.user.settings") {
			return redirect()->back()
			->with("message", "User updated successfully!")
			->with("type", "success");
		}
		
		return redirect()->route("management.user.edit", $user->username)
		->with("message", "User updated successfully!")
		->with("type", "success");
	}


	public function edit_user(User $user) {
		$user->employee = $user->employee;
		return Inertia::render("Dashboard/Management/User/Edit/index", ["user" => $user]);
	}


	public function cards()
	{

			$users = User::select("user_id", "user_type", "status", "firstname", "lastname", "date_created", "emp_id")
			->where("deleted", 0)
			->with([
				"employee" => fn($query) => $query->withCount("trainings"),
				// "social_accounts"
			])->get()
			->transform(function ($user) {
				$profile = $user->getFirstMedia("profile", ["primary" => true]);
				if($profile) {
					$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
					$user->profile = [
						"thumbnailLarge" => URL::route("image", [ "path" => $path, "w" => 64, "h" => 64, "fit" => "crop" ])
					];
					return $user;
				}
				$user->profile = null;
				return $user;
			});
		return Inertia::render("Dashboard/Management/User/Cards/index", ["users" => $users]);
	}


	public function update_socials(Request $request) {
		$user = auth()->user();

		if($request->facebook) {
			SocialAccount::firstOrCreate(
				[ "user_id" => $user->user_id, "type" => "facebook" ],
				[ "social_link" => $request->facebook ]
			);
		}

		if($request->instagram) {
			SocialAccount::firstOrCreate(
				[ "user_id" => $user->user_id, "type" => "instagram" ],
				[ "social_link" => $request->instagram ]
			);
		}

		if($request->linkedin) {
			SocialAccount::firstOrCreate(
				[ "user_id" => $user->user_id, "type" => "linkedin" ],
				[ "social_link" => $request->linkedin ]
			);
		}

		if($request->twitter) {
			SocialAccount::firstOrCreate(
				[ "user_id" => $user->user_id, "type" => "twitter" ],
				[ "social_link" => $request->twitter ]
			);
		}

		return redirect()->back()
		->with("message", "User social accounts updated successfully!")
		->with("type", "success");
	}


	// public function followUser($user_id) {
	// 	$user = auth()->user();
	// 	Follower::firstOrCreate([
	// 		"user_id" => $user->user_id,
	// 		"following_id" => $user_id,
	// 	]);
	// 	return redirect()->back();
	// }


	public function change_password(Request $request) {
		$request->validate([
			"oldPassword" => "required",
			"newPassword" => "required|min:6|confirmed",
		]);

		$user = auth()->user();

		if(Hash::check($request->oldPassword, $user->password)) {
			$user->password = Hash::make($request->newPassword);
			$user->save();

			return redirect()->back()
			->with("message", "Password updated successfully!")
			->with("type", "success");
		}
		
		return redirect()->back()->withErrors(["oldPassword" => "Incorrect password please try again"]);
	}


	public function settings() {
		$images = auth()->user()->can("image_upload_slider") ?
			Images::where("type", "slider")->get()->transform(function ($img) {
				$image = $img->getFirstMedia("slider");
				$path = "images/" . md5($image->id . config('app.key')). "/" .$image->file_name;
				$img->image = [
					"name" => $image->name,
					"url" => URL::route("image", [ "path" => $path, "w" => 400, "h" => 400 ]),
					"urlBig" => URL::route("image", [ "path" => $path, "w" => 1280 , "h" => 720, "fit" => "crop" ])
				];
				return $img;
			}) : [];
		return Inertia::render("Dashboard/Management/User/Account/index", [
			"images" => $images
		]);
	}



	public function activate(User $user) {
		if($user->status === 1) {
			abort(500);
		}
		$user->status = 1;
		$user->save();
		
		return redirect()->back()
		->with("message", "User". $user->fullname ." activated successfully!")
		->with("type", "success");
	}

	public function deactivate(User $user) {
		if($user->status === 0) {
			abort(500);
		}

		$user->status = 0;
		$user->save();

		return redirect()->back()
		->with("message", "User". $user->fullname ." deactivated successfully!")
		->with("type", "success");
	}


}