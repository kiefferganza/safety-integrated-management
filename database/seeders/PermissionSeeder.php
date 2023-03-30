<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			 // Reset cached roles and permissions
			 app()[PermissionRegistrar::class]->forgetCachedPermissions();

			 // create permissions
			 $permissions = [
				'permission_access',
				'permission_create',
				'permission_edit',
				'permission_delete',

				'image_upload_slider',
				'image_upload_defaultCover',
				'image_upload_delete',

				'role_access',
				'role_create',
				'role_edit',
				'role_delete',

				'user_access',
				'user_create',
				'user_edit',
				'user_show',
				'user_delete',

				'employee_create',
				'employee_delete',
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

				'folder_create',
				'folder_edit',
				'folder_delete',
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

			foreach ($permissions as $permission)   {
				Permission::create([
					'name' => $permission
				]);
			}
			
      // gets all permissions via Gate::before rule; see AuthServiceProvider
			Role::create(['name' => 'Admin']);

			// $modPermissions = [
			// 	'permission_access',
			// 	'permission_create',
			// 	'permission_edit',
			// 	'permission_delete',

			// 	'image_upload_slider',
			// 	'image_upload_defaultCover',
			// 	'image_upload_delete',

			// 	'role_access',
			// 	'role_create',
			// 	'role_edit',
			// 	'role_delete',

			// 	'user_access',
			// 	'user_create',
			// 	'user_edit',
			// 	'user_show',
			// 	'user_delete',

			// 	'employee_create',
			// 	'employee_delete',
			// 	'employee_edit',
			// 	'employee_show',

			// 	'training_create',
			// 	'training_edit',
			// 	'training_delete',
			// 	'training_show',

			// 	'inspection_create',
			// 	'inspection_edit',
			// 	'inspection_delete',
			// 	'inspection_show',

			// 	'talk_toolbox_create',
			// 	'talk_toolbox_edit',
			// 	'talk_toolbox_delete',
			// 	'talk_toolbox_show',

			// 	'folder_create',
			// 	'folder_edit',
			// 	'folder_delete',
			// 	'folder_show',
				
			// 	'file_create',
			// 	'file_edit',
			// 	'file_delete',
			// 	'file_show',

			// 	'inventory_create',
			// 	'inventory_edit',
			// 	'inventory_delete',
			// 	'inventory_show',

			// 	'stock_addOrRemove',
			// 	'stock_show',
			// ];

			Role::create(['name' => 'Moderator']);

			// foreach ($modPermissions as $permission)   {
			// 	$modRole->givePermissionTo($permission);
			// }

			$admin = User::where('user_type', 0)->first();
			$admin->assignRole("Admin");

			Role::create(['name' => 'User']);

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

			// foreach ($userPermissions as $permission)   {
			// 	$roleUser->givePermissionTo($permission);
			// }

			User::where('user_type', 1)->where('deleted', 0)->get()->map(function($user) use($userPermissions){
				$user->givePermissionTo($userPermissions);
				$user->assignRole("User");
			});


    }
}
