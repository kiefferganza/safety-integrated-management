<?php

namespace Database\Seeders;

use App\Models\Images;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			for ($i=0; $i < 6; $i++) { 
				$path = 'public/assets/covers/card-cover-'. ($i + 1) .'.jpg';
				$file = Storage::path($path);
				if(Storage::exists($path)) {
					Images::create([
						"type" => "slider",
						"user_id" => 1
					])->addMedia($file)->toMediaCollection("slider");
				}
			}
    }
}
