<?php

namespace Database\Seeders;

use App\Models\InspectionReportList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateWrongData extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      InspectionReportList::where("section_title", "STARRT Cards completed for all task taking place?")->update(["section_title" => "START Cards completed for all task taking place?"]);
      InspectionReportList::where("section_title", "Mobile Plant/ Equipmentâ€™s")->update(["section_title" => "Mobile Plant/ Equipment's"]);
      InspectionReportList::where("section_title", "Tidiness/Housekeeping &Storage of Materials ")->update(["section_title" => "Tidiness/Housekeeping &Storage of Materials"]);
    }
}
