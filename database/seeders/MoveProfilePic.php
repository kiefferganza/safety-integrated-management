<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class MoveProfilePic extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		User::with("employee")->get()->map(function($user) {
			$storage = Storage::disk("public");
			$path = 'media/photos/employee/';
			if($storage->exists($path . $user->profile_pic) && $user->profile_pic) {
				$user->addMedia($storage->path($path . $user->profile_pic))->withCustomProperties(['primary' => true])->toMediaCollection("profile");
			}else if($storage->exists($path . $user->employee->img_src) && $user->employee->img_src) {
				$user->addMedia($storage->path($path . $user->employee->img_src))->withCustomProperties(['primary' => true])->toMediaCollection("profile");
			}
		});
	}
}
