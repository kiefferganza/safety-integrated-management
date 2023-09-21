<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class PermissionController extends Controller
{

	public function updateUserPermission(User $user, Request $request) {
		$request->validate([
			"name" => ["string", "required"],
			"isAllowed" => ["boolean", "required"]
		]);
		
		if($request->isAllowed) {
			$user->givePermissionTo($request->name);
		}else {
			$user->revokePermissionTo($request->name);
		}

		return redirect()->back()
		->with("message", "User's permission updated successfully!")
		->with("type", "success");
	}
  


}