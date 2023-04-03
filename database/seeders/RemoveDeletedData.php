<?php

namespace Database\Seeders;

use App\Models\CompanyModel;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RemoveDeletedData extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Position::where("is_deleted", 0)->delete();
		CompanyModel::where("is_deleted", 0)->delete();
		Department::where("is_deleted", 0)->delete();
	}
}
