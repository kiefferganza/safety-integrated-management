<?php

namespace Database\Seeders;

use App\Models\Training;
use App\Models\TrainingExternal;
use App\Models\TrainingExternalStatus;
use Illuminate\Database\Seeder;

class TrainingExternalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			Training::where("is_deleted", 1)->delete();
			Training::where("type", 3)->get()->map(function($training) {
				TrainingExternalStatus::create(["training_id" => $training->training_id]);
				return $training;
			});
    }
}