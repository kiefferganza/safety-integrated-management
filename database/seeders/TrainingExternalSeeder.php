<?php

namespace Database\Seeders;

use App\Models\Training;
use App\Models\TrainingExternal;
use App\Models\TrainingExternalStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrainingExternalSeeder extends Seeder
{
	use WithoutModelEvents;
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			// Training::where("is_deleted", 1)->delete();
			// Training::where("type", 3)->get()->map(function($training) {
			// 	TrainingExternalStatus::create(["training_id" => $training->training_id]);
			// 	return $training;
			// });
			TrainingExternalStatus::where('training_id', '!=', null)->update([
				'review_status' => NULL,
				'approval_status' => 'pending'
			]);
			// foreach ($statuses as $status) {
			// 	$status->reviewer_status = NULL;
			// 	$status->approval_status = 'pending';
			// 	$status->save();
			// }
    }
}