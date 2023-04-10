<?php

namespace Database\Seeders;

use App\Models\CompanyModel;
use App\Models\Department;
use App\Models\Inspection;
use App\Models\InspectionReportList;
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
		// Position::where("is_deleted", 1)->delete();
		// CompanyModel::where("is_deleted", 1)->delete();
		// Department::where("is_deleted", 1)->delete();
		InspectionReportList::doesnthave("report")->delete();
		InspectionReportList::where("section_title", "Ø§Ù„ØªØ­ÙƒÙ… Ø¨Ø§Ù„Ù…Ø±ÙˆØ±")->delete();
	}
}
