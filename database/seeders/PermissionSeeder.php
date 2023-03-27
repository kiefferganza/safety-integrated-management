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
			//  app()[PermissionRegistrar::class]->forgetCachedPermissions();

			//  // create permissions
			//  $permissions = [
			// 	'user_management_access',
			// 	'permission_access',
			// 	'permission_create',
			// 	'permission_edit',
			// 	'permission_show',
			// 	'permission_delete',
			// 	'role_access',
			// 	'role_create',
			// 	'role_edit',
			// 	'role_show',
			// 	'role_delete',
			// 	'user_access',
			// 	'user_create',
			// 	'user_edit',
			// 	'user_show',
			// 	'user_delete',

			// 	'employee_create',
			// 	'employee_delete',
			// 	'employee_edit',

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
			// 	'file_create',
			// 	'file_edit',
			// 	'file_delete',
			// 	'file_show',

			// 	'item_inventory_create',
			// 	'item_inventory_edit',
			// 	'item_inventory_delete',
			// 	'item_inventory_show',

			// 	'stock_create',
			// 	'stock_edit',
			// 	'stock_delete',
			// 	'stock_show',
			//  ];

			// foreach ($permissions as $permission)   {
			// 	Permission::create([
			// 		'name' => $permission
			// 	]);
			// }
			
      // // gets all permissions via Gate::before rule; see AuthServiceProvider
			// Role::create(['name' => 'Super Admin']);

			// $role = Role::create(['name' => 'User']);

			// $userPermissions = [
			// 	'user_edit',
			// 	'employee_create',
			// 	'employee_delete',
			// 	'employee_edit',

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

			// 	'item_inventory_create',
			// 	'item_inventory_edit',
			// 	'item_inventory_delete',
			// 	'item_inventory_show',

			// 	'stock_create',
			// 	'stock_edit',
			// 	'stock_delete',
			// 	'stock_show',
			// ];

			// foreach ($userPermissions as $permission)   {
			// 	$role->givePermissionTo($permission);
			// }

			$defaultUserPermissions = [
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

				'file_create',
				'file_edit',
				'file_delete',
				'file_show',
			];

			User::where('user_type', 1)->where('deleted', 0)->get()->map(function($user){
				$user->assignRole("User");
			});


    }
}
