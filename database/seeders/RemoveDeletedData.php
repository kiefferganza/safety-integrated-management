<?php

namespace Database\Seeders;

use App\Models\ToolboxTalkParticipant;
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

    ToolboxTalkParticipant::where('time', null)->delete();
		$duplicates = ToolboxTalkParticipant::select("tbtp_id")
			->groupBy('employee_id', 'tbt_id')
			->havingRaw('count(*) > 1')
			->get();
		foreach ($duplicates as $dup) {
			ToolboxTalkParticipant::find($dup->tbtp_id)->delete();
		}
	}
}