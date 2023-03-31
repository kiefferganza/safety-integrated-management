<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateUserPermissions extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			User::where('user_type', 1)->where('deleted', 0)->get()->map(function($user) {
				$user->revokePermissionTo(["employee_create", "employee_delete"]);
			});
    }
}
