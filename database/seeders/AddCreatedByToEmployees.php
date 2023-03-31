<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddCreatedByToEmployees extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		DB::table('tbl_employees')->where('is_deleted', 0)->update(["created_by" => 1]);
		// Employee::where('deleted', 0)->update(["created_by", 1]);
	}
}
