<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Employee;
// use App\Models\Follower;
use App\Models\SocialAccount;
use App\Models\TrainingType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{

	public function index()
	{
			$user = Auth::user();

			$userslist = User::select(DB::raw("users.user_id, tbl_employees.firstname, tbl_employees.lastname, tbl_employees.email, users.user_type, users.status, users.date_created, tbl_employees.lastname, tbl_employees.firstname, users.emp_id, tbl_employees.img_src"))
			->with("social_accounts")
			->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
			->where([
					["users.subscriber_id", $user->subscriber_id],
					["users.deleted", 0]
			])->get();

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
		$request->validate(["password" => "required|min:6|confirmed"]);

		$user = new User();
		$user->username = $request->username;
		$user->firstname = $request->firstname;
		$user->lastname = $request->lastname;
		$user->email = $request->email;
		$user->user_type = $request->user_type;
		// $user->about = $request->about;
		$user->subscriber_id = Auth::user()->user_id;
		$user->status = 1;
		$user->deleted = 0;
		$user->date_updated = Carbon::now();
		$user->password = Hash::make($request->password);
		$user->emp_id = $request->emp_id;

		if($request->hasFile('profile_pic')){
			$file = $request->file("profile_pic")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("profile_pic")->storeAs('media/photos/employee/', $file_name, 'public');

			$user->profile_pic = $file_name;

		}else if($request->profile_pic) {
			$profile_pic = explode("/employee/", $request->profile_pic)[1];
			if(Storage::exists("public/media/photos/employee/" . $profile_pic)) {
				$user->profile_pic = $profile_pic;
			}
		}

		$user->save();

		$emp = Employee::find($request->emp_id);

		if($emp) {
			$emp->user_id = $user->user_id;
			$emp->email = $user->email;
		}

		return redirect()->back()
			->with('message', 'User added successfully')
			->with('type', 'success');
	}


	public function profile() {
		$user = Auth::user();
		
		$employee = Employee::where("employee_id", $user->emp_id)->with([
			"participated_trainings" => fn ($q) =>
					$q->select("title", "type", "date_expired", "training_date", "training_hrs", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id")->where("tbl_trainings.is_deleted", 0),
			"company" => fn ($query) =>
				$query->select("company_id", "company_name")->where("is_deleted", 0),
			"position" => fn ($query) => 
				$query->select("position_id", "position")->where("is_deleted", 0),
			"department" => fn ($query) => 
				$query->select("department_id","department")->where([["is_deleted", 0], ["sub_id", $user->subscriber_id]])
		])->first();

		return Inertia::render("Dashboard/Management/User/index", [
			"employee" => $employee,
			"trainingTypes" => TrainingType::get()
		]);
	}


	public function show(User $user) {
		if(Auth::user()->user_id === $user->user_id) {
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
			"social_accounts"
		]);

		return Inertia::render("Dashboard/Management/User/Profile/index", [
			"user" => $users,
			"trainingTypes" => TrainingType::get()
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

		$user->firstname = $request->firstname;
		$user->lastname = $request->lastname;
		$user->username = $request->username;
		$user->email = $request->email;
		// $user->about = $request->about;
		$user->user_type = $request->user_type;
		$user->status = $request->status;

		if($request->password) {
			$user->password = Hash::make($request->password);
		}

		if($request->hasFile('profile_pic')){
			$file = $request->file("profile_pic")->getClientOriginalName();
			$extension = pathinfo($file, PATHINFO_EXTENSION);
			$file_name = pathinfo($file, PATHINFO_FILENAME). "-" . time(). "." . $extension;
			$request->file("profile_pic")->storeAs('media/photos/employee/', $file_name, 'public');

			$user->profile_pic = $file_name;

		}else if($request->profile_pic) {
			$profile_pic = explode("/employee/", $request->profile_pic)[1];
			if(Storage::exists("public/media/photos/employee/" . $profile_pic)) {
				$user->profile_pic = $profile_pic;
			}
		}

		$user->save();

		if($request->about && $user->emp_id) {
			Employee::find($user->emp_id)->update(["about" => $request->about]);
		}
		
		return redirect()->back()
		->with("message", "User updated successfully!")
		->with("type", "success");
	}


	public function destroy(Request $request) {
		
	}


	public function edit_user(User $user) {
		$user->employee = $user->employee()->first();
		return Inertia::render("Dashboard/Management/User/Edit/index", ["user" => $user]);
	}


	public function cards()
	{

			$users = User::select("user_id", "user_type", "status", "firstname", "lastname", "date_created", "emp_id")
			->where("deleted", 0)
			->with([
				"employee" => fn($query) => $query->withCount("trainings"),
				"social_accounts"
			])->get();
		return Inertia::render("Dashboard/Management/User/Cards/index", ["users" => $users]);
	}


	public function update_socials(Request $request) {
		$user = Auth::user();

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
	// 	$user = Auth::user();
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

		$user = Auth::user();

		if(Hash::check($request->oldPassword, $user->password)) {
			$user->password = Hash::make($request->newPassword);
			$user->save();

			return redirect()->back()
			->with("message", "Password updated successfully!")
			->with("type", "success");
		}
		
		return redirect()->back()->withErrors(["oldPassword" => "Incorrect password please try again"]);
	}


}
