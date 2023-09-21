<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
class UpdateDocument extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $documents = Document::where("is_deleted", 0)->where("folder_id", 11)->withWhereHas("employee")->orderBy('date_uploaded')->get();
		$seq = 0;
		foreach ($documents as $doc) {
			$form_number = sprintf("%s-%s-%s-%s", $doc->project_code, $doc->originator,$doc->discipline,$doc->document_type);
			if($doc->document_zone) {
				$form_number .= "-". $doc->document_zone;
			}
			if($doc->document_level) {
				$form_number .= "-". $doc->document_level;
			}

			$seq_number = sprintf("%06d", ((int)ltrim($seq, '0') + 1));

			$form_number .= "-" . $seq_number;
			$doc->sequence_no = $seq_number;
			$doc->rev = 0;
			$doc->form_number = STR::upper($form_number);
			$doc->save();
			$seq += 1;
		}
        // $documents = Document::where("is_deleted", 0)->get();
		// foreach ($documents as $doc) {
		// 	if($doc->folder_id === 12) {
		// 		$doc->rev = 0;
		// 	}
		// 	$doc->approval_status = $doc->status;
		// 	$doc->save();
		// }


		// $documentWithApproval = Document::withWhereHas('external_approver')->get();
		// foreach ($documentWithApproval as $docApp) {
		// 	$docApp->status = "0";
		// 	$docApp->save();
		// }

		
		// $documentWoApprover = Document::where('approval_id', null)->with("reviewer_employees")->whereDoesntHave("external_approver")->get();
		// foreach ($documentWoApprover as $docRev) {
		// 	$isAlreadyReviewed = $docRev->reviewer_employees->every(function($item) {
		// 		return $item->pivot->review_status !== "0";
		// 	});
		// 	if($isAlreadyReviewed) {
		// 		$lastRev = $docRev->reviewer_employees->last();
		// 		$docRev->status = $lastRev->pivot->review_status;
		// 		$docRev->save();
		// 	}
		// }
    }
}
