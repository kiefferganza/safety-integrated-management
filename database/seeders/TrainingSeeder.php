<?php

namespace Database\Seeders;

use App\Models\Training;
use App\Models\TrainingTrainees;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrainingSeeder extends Seeder
{
	use WithoutModelEvents;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		// $inHouse = Training::where([["is_deleted", false], ["type", 1]])->select('training_id', 'sequence_no')->orderBy('date_created')->get();
		// $inHouseSeq = 1;
		// foreach ($inHouse as $inHouse) {
		// 	$inHouse->timestamps = false;
		// 	$inHouse->sequence_no = str_pad((string)$inHouseSeq, 6, '0', STR_PAD_LEFT);;
		// 	$inHouse->update();
		// 	$inHouseSeq += 1;
		// }

		// $clients = Training::where([["is_deleted", false], ["type", 2]])->select('training_id', 'sequence_no')->orderBy('date_created')->get();
		// $clientSeq = 1;
		// foreach ($clients as $client) {
		// 	// $client->timestamps = false;
		// 	$client->sequence_no = str_pad((string)$clientSeq, 6, '0', STR_PAD_LEFT);;
		// 	$client->update();
		// 	$clientSeq += 1;
		// }

		// $externals = Training::where([["is_deleted", false], ["type", 3]])->select('training_id', 'sequence_no')->orderBy('date_created')->get();
		// $externalSeq = 1;
		// foreach ($externals as $external) {
		// 	// $external->timestamps = false;
		// 	$external->sequence_no = str_pad((string)$externalSeq, 6, '0', STR_PAD_LEFT);;
		// 	$external->update();
		// 	$externalSeq += 1;
		// }

		// $inductions = Training::where([["is_deleted", false], ["type", 4]])->select('training_id', 'sequence_no')->orderBy('date_created')->get();
		// $inductionSeq = 1;
		// foreach ($inductions as $induction) {
		// 	// $induction->timestamps = false;
		// 	$induction->sequence_no = str_pad((string)$inductionSeq, 6, '0', STR_PAD_LEFT);;
		// 	$induction->update();
		// 	$inductionSeq += 1;
		// }
		// Training::where('is_deleted', true)->delete();
		// $externals = Training::where([["is_deleted", false], ["type", 3]])->with('external_comments')->get();
		// foreach ($externals as $external) {
		// 	$external->revision_no = $external->external_comments->count();
		// 	$external->save();
		// }
		// TrainingTrainees::doesntHave('training')->delete();
		// dd(Training::has('course')->get());
		Training::where('title', 'Safety Fundation')->update(['title' => 'Safety Foundation']);
		Training::where('title', 'DDT')->update(['title' => 'DDT Training']);
		Training::where('title', 'Working at Heights')->update(['title' => 'Working at Height']);
		Training::where('title', 'Confined Space L-3')->update(['title' => 'CS level 3']);
		Training::where('title', 'Confined Space Entry & Rescue L3')->update(['title' => 'CS Entry & Rescue Level 3']);
    }
}
