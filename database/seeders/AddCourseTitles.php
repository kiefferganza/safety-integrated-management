<?php

namespace Database\Seeders;

use App\Models\TrainingCourses;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddCourseTitles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		$courses = [
			[
				'course_name' => 'PA - HAZOP',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'DDT',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Fire Fighting',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'MEWP',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Fire Marshall',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Forklift',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Lifting Supervisor',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'AGT',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Basic First Aid',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Banks Man Slinger',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'CS entry & Rescue L3',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Confined Sapce L3 3',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Scaffolding',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Working At Heights',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
			[
				'course_name' => 'Safety Foundation',
				'user_id' => 1,
				'sub_id' => 1,
				'created_at' => now()
			],
		];
        TrainingCourses::insert($courses);
    }
}
