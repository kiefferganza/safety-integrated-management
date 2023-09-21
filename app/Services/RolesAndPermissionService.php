<?php

namespace App\Services;

use App\Models\User;

class RolesAndPermissionService {

	public $userPermission;

	public function __construct() {
		$this->userPermission = collect([
			"User" => [
				[
					'detail' => "View own and other user's profile.",
					'name' => 'View Profiles',
					'value' => 'user_show'
				]
			],
			"Employee" => [
				[
					'detail' => "Access in adding new employees",
					'name' => 'Add Employee',
					'value' => 'employee_create'
				],
				[
					'detail' => "Edit his own employee profile",
					'name' => 'Edit Employee',
					'value' => 'employee_edit'
				],
				[
					'detail' => "Access for editing existing employees in the system.",
					'name' => "Edit all employee",
					'value' => 'employee_access'
				],
				[
					'detail' => "Access in deleting existing employees in the system.",
					'name' => 'Delete Employee',
					'value' => 'employee_delete'
				],
				[
					'detail' => "Access for allowing to view employee list and profile.",
					'name' => "View Employee",
					'value' => 'employee_show'
				]
			],
			"Training" => [
				[
					'detail' => "Access for adding new training.",
					'name' => 'Add Training',
					'value' => 'training_create'
				],
				[
					'detail' => "Access for editing existing training.",
					'name' => 'Edit Training',
					'value' => 'training_edit'
				],
				[
					'detail' => "Access for deleting existing training.",
					'name' => 'Delete Training',
					'value' => 'training_delete'
				],
				[
					'detail' => "Access for viewing training and training list.",
					'name' => "View Training",
					'value' => 'training_show'
				]
			],
			"Inspection" => [
				[
					'detail' => "Access for adding new inspection.",
					'name' => 'Add Inspection',
					'value' => 'inspection_create'
				],
				[
					'detail' => "Access for editing inspection where they are associated with.",
					'name' => 'Edit Inspection',
					'value' => 'inspection_edit'
				],
				[
					'detail' => "Access for deleting submitted inspection.",
					'name' => 'Delete Inspection',
					'value' => 'inspection_delete'
				],
				[
					'detail' => "Access for viewing inspection and inspection list.",
					'name' => "View Inspection",
					'value' => 'inspection_show'
				]
			],
			"Toolbox Talk" => [
				[
					'detail' => "Access for adding new toolbox talks.",
					'name' => 'Add Toolbox Talks',
					'value' => 'talk_toolbox_create'
				],
				[
					'detail' => "Access for editing submitted toolbox talks.",
					'name' => 'Edit Toolbox Talks',
					'value' => 'talk_toolbox_edit'
				],
				[
					'detail' => "Access for deleting submitted toolbox talks.",
					'name' => 'Delete Toolbox Talks',
					'value' => 'talk_toolbox_delete'
				],
				[
					'detail' => "Access for viewing toolbox talks",
					'name' => "View Toolbox Talks",
					'value' => 'talk_toolbox_show'
				]
			],
			"Incident" => [
				[
					'detail' => "Access for submitting new incident.",
					'name' => 'Submit Incident',
					'value' => 'incident_create'
				],
				[
					'detail' => "Access for editing submitted incident.",
					'name' => 'Edit Incident',
					'value' => 'incident_edit'
				],
				[
					'detail' => "Access for deleting incident.",
					'name' => 'Delete Incident',
					'value' => 'incident_delete'
				],
				[
					'detail' => "Access for viewing toolbox talks list.",
					'name' => "View Incident",
					'value' => 'incident_show'
				],
				[
					'detail' => "Managing incident types on the module.",
					'name' => "Manage Incident Module",
					'value' => 'incident_access'
				]
			],
			"Folder" => [
				[
					'detail' => null,
					'name' => 'Add Folder',
					'value' => 'folder_create'
				],
				[
					'detail' => null,
					'name' => 'Edit Folder',
					'value' => 'folder_edit'
				],
				[
					'detail' => null,
					'name' => 'Delete Folder',
					'value' => 'folder_delete'
				],
				[
					'detail' => "Access for viewing folder's content.",
					'name' => "View Folder",
					'value' => 'folder_show'
				]
			],
			"Folder's Document" => [
				[
					'detail' => "Access for submitting new file on specific folder.",
					'name' => 'Add File',
					'value' => 'file_create'
				],
				[
					'detail' => "Access for editing submitted document.",
					'name' => 'Edit File',
					'value' => 'file_edit'
				],
				[
					'detail' => "Access for deleting submitted document.",
					'name' => 'Delete File',
					'value' => 'file_delete'
				],
				[
					'detail' => "Access for viewing documents.",
					'name' => "View File",
					'value' => 'file_show'
				]
			],
			"Inventory" => [
				[
					'detail' => "Access for adding new item/product.",
					'name' => 'Add Item',
					'value' => 'inventory_create'
				],
				[
					'detail' => "Access for editing item/product",
					'name' => 'Edit Item',
					'value' => 'inventory_edit'
				],
				[
					'detail' => "Access for deleting item/product",
					'name' => 'Delete Item',
					'value' => 'inventory_delete'
				],
				[
					'detail' => "Access for viewing item/product list.",
					'name' => "View Item",
					'value' => 'inventory_show'
				]
			],
			"Inventory Stocks" => [
				[
					'detail' => "Access for adding or removing stock.",
					'name' => 'Add/Remove Stock',
					'value' => 'stock_addOrRemove'
				],
				[
					'detail' => "Access for viewing item/product details.",
					'name' => 'View Stock',
					'value' => 'stock_show'
				],
			]
		]);
	}

	public function getAllPermissionByName($permisionName, User $user) {
		$permissions = null;
		switch ($permisionName) {
			case 'User':
				$permissions = $this->userPermission->map(function($permission) use($user) {
					foreach ($permission as $key => $value) {
						$permission[$key]["hasPermission"] = $user->hasPermissionTo($value["value"]);
					}
					return $permission;
				});
				break;
			default:
				# code...
				break;
		}
		return $permissions;
	}



}