<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AddFormNumberToDocuments extends Seeder
{
	use WithoutModelEvents;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $documents = Document::all();

		foreach ($documents as $doc) {
			$form_number = sprintf("%s-%s-%s-%s", $doc->project_code, $doc->originator,$doc->discipline,$doc->document_type);
			if($doc->document_zone) {
				$form_number .= "-". $doc->document_zone;
			}
			if($doc->document_level) {
				$form_number .= "-". $doc->document_level;
			}
			$form_number .= "-" . $doc->sequence_no;
			$doc->form_number = STR::upper($form_number);
			// dd($doc->save());
			dump($doc->form_number . " : ". $doc->save());
			$doc->save();
		}
    }
}