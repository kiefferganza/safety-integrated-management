<?php

namespace Database\Seeders;

use App\Models\Inspection;
use App\Models\InspectionReportList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InspectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		// Delete empty ref
		InspectionReportList::where("ref_num", ">", 34)->where("ref_score", null)->delete();
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", null)->delete();

		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "المخاطر الصحية")->update(["section_title" => "Health hazard"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "موقف سيارات")->update(["section_title" => "Parking"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "مراقبة الغاز")->update(["section_title" => "Gas monitoring"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "قضية بيئية")->update(["section_title" => "Environmental issue"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "خدمات")->update(["section_title" => "Utilities"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "جمع/التخلص من النفايات")->update(["section_title" => "Waste collection/disposal"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "السيطرة على الموقع")->update(["section_title" => "Site control"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "الخوزقة")->update(["section_title" => "Impalement"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "التدخين")->update(["section_title" => "Smoking"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "الأجزاء الدوارة")->update(["section_title" => "Rotating Parts"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "إنسكاب النفط")->update(["section_title" => "Oil spillage"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "إشراف")->update(["section_title" => "Supervision"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "إجراءات الطوارئ")->update(["section_title" => "Emergency procedures"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "أدوات يدوية")->update(["section_title" => "Handtools"]);
		InspectionReportList::where("ref_num", ">", 34)->where("section_title", "التحكم بالمرور")->update(["section_title" => "Traffic control"]);

		$inspections = Inspection::select("inspection_id", "form_number", "sequence_no")->get();

		$sequence = 1;
		foreach ($inspections as $inspection) {
			$sequence_no = str_pad($sequence, 6, '0', STR_PAD_LEFT);
			$inspection->sequence_no = $sequence_no;
			$form_number = explode("-", $inspection->form_number);
			array_pop($form_number);
			$form_number[] = $sequence_no;
			$inspection->form_number = implode("-", $form_number);
			$inspection->update();
			$sequence += 1;
		}
		
		// $inspections = Inspection::select("inspection_id", "form_number", "sequence_no")->get();
		// foreach ($inspections as $inspection) {
		// 	$array = explode("-", $inspection->form_number);
		// 	array_pop($array);
		// 	$array[] = $inspection->sequence_no;
		// 	$updatedString = implode("-", $array);
		// 	$inspection->form_number = $updatedString;
		// 	Inspection::find($inspection->inspection_id)->update(["form_number" => $updatedString]);
		// }
    }
}
