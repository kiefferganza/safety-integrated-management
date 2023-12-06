<?php

namespace Database\Seeders;

use App\Models\CompanyModel;
use App\Models\Department;
use App\Models\Inspection;
use App\Models\InspectionReportList;
use App\Models\Position;
use App\Models\ToolboxTalkParticipant;
use App\Models\Training;
use App\Models\TrainingExternal;
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
		// InspectionReportList::doesnthave("report")->delete();
		// InspectionReportList::where("section_title", "Ø§Ù„ØªØ­ÙƒÙ… Ø¨Ø§Ù„Ù…Ø±ÙˆØ±")->delete();
		// ToolboxTalkParticipant::doesnthave("toolboxtalk")->delete();
		// TrainingExternal::doesnthave("training")->delete();
		// Training::doesnthave("external_status")->where("type", 3)->update(["is_deleted" => 1]);
		$duplicates = ToolboxTalkParticipant::select("tbtp_id")
			->groupBy('employee_id', 'tbt_id')
			->havingRaw('count(*) > 1')
			->get();
		foreach ($duplicates as $dup) {
			ToolboxTalkParticipant::where('tbtp_id', $dup->tbtp_id)->delete();
		}
	}
}