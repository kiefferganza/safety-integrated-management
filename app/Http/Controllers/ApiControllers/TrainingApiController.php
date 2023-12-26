<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Training;
use App\Models\TrainingCourses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TrainingApiController extends Controller
{
  public function inhouseMatrix(Request $request) {
    $user = auth()->user();
    $from = $request->from;
    $to = $request->to;
    if(!$from || !$to) {
      $currentYear = Carbon::now()->year;
      $from = Carbon::create($currentYear, 1, 1);
      $to = Carbon::create($currentYear, 12, 31);
    }


    $yearList = Training::selectRaw('EXTRACT(YEAR FROM training_date) AS year')
    ->where("type", 1)
    ->distinct()
    ->orderBy('year', 'desc')
    ->get()
    ->pluck('year');

    $courses = TrainingCourses::select('id', 'course_name')->where('type', 'in-house')->get();

    $employees = Employee::where('sub_id', $user->subscriber_id)->where('tbl_employees.is_deleted', 0)
    ->select('employee_id', 'firstname', 'lastname', 'tbl_position.position')
    ->has('participated_trainings')
    ->with('participated_trainings', function($q) use($from, $to) {
      return $q->select([
          'trainee_id', 
          'tbl_training_trainees.training_id', 
          'tbl_training_trainees.employee_id',
          'tbl_trainings.training_date', 
          'tbl_trainings.date_expired', 
          'tbl_trainings.title', 
          'tbl_trainings.training_hrs',
          'tbl_trainings.type',
          'tbl_trainings.status',
        ])
        ->where('tbl_trainings.is_deleted', 0)
        ->where('tbl_trainings.type', 1)
        ->whereBetween('training_date', [$from, $to])
        ->join('tbl_trainings', 'tbl_trainings.training_id', 'tbl_training_trainees.training_id');
    })
    ->leftJoin('tbl_position', 'tbl_position.position_id', 'tbl_employees.position')
    ->get();

    $years = collect([]);

    $titles = $courses->pluck('course_name')->toArray();

    foreach ($employees as $employee) {
      $employeeFullName = $employee->fullname;
      $employeePosition = trim($employee->position);
      $employeeId = $employee->employee_id;
      foreach ($employee->participated_trainings as $parTraining) {
        $year = Carbon::parse($parTraining->training_date)->year;
        $existingYear = $years->get($year, collect([
          [
            'employee_id' => $employeeId,
            'fullName' => $employeeFullName,
            'position' => $employeePosition,
            'completed_count' => 0,
            'total_hrs' => 0,
            'data' => collect([])
          ]
        ]));

        $employeeData = $existingYear->first(function ($val) use ($employeeId) {
          return $val['employee_id'] === $employeeId;
        });

        if(!$employeeData) {
          $existingYear->push([
            'employee_id' => $employeeId,
            'fullName' => $employeeFullName,
            'position' => $employeePosition,
            'completed_count' => 0,
            'total_hrs' => 0,
            'data' => collect([])
          ]);
        }
        
        $years->put($year, $existingYear);
        
        $course = '';
        $title = $parTraining->title;
        if($title) {
          $foundCourse = $courses->first(function ($course) use ($title) {
            return strtolower(trim($course->course_name)) === strtolower(trim($title));
          });
          if($foundCourse) {
            $course = $foundCourse->course_name;
          }else {
            $course = $title;
          }
        }
        
        
        if($course !== '') {
          $existingYear->transform(function($val) use($employeeId, $parTraining, $course, $employeePosition) {
            if($val['employee_id'] === $employeeId && !$val['data']->contains('courseName', $course)) {
              $isCompleted = $parTraining->status === 'completed';
              $parTraining->expired = false;
              $val['data']->push([
                ...$parTraining->toArray(),
                'courseName' => $course,
                'isCompleted' => $isCompleted,
                'position' => $employeePosition,
              ]);
              if($isCompleted) {
                $val['completed_count'] += 1;
              }
              $val['total_hrs'] += $parTraining->training_hrs;
            }
            return $val;
          });
          $years->put($year, $existingYear);
        }
      }
    }

    $years->transform(function($year) {
      return $year->sortBy('fullName')->values();
    });
    

    return response()->json([
      'courses' => $courses,
			'years' => $years,
			'titles' => $titles,
			'yearList' => $yearList,
			'from' => $from,
			'to' => $to
    ]);
  }

  public function externalMatrix(Request $request) {
    $user = auth()->user();

		$from = $request->from;
		$to = $request->to;
		if(!$from || !$to) {
			$currentYear = Carbon::now()->year;
			$from = Carbon::create($currentYear, 1, 1);
			$to = Carbon::create($currentYear, 12, 31);
		}


		$yearList = Training::selectRaw('EXTRACT(YEAR FROM training_date) AS year')
		->distinct()
		->orderBy('year', 'desc')
		->get()
		->pluck('year');

		$courses = TrainingCourses::select('id', 'course_name')->where('type', '!=', 'in-house')->orWhere('type', null)->get();

		$employees = Employee::where('sub_id', $user->subscriber_id)->where('tbl_employees.is_deleted', 0)
		->select('employee_id', 'firstname', 'lastname', 'tbl_position.position')
		->has('participated_trainings')
		->with('participated_trainings', function($q) use($from, $to) {
			return $q->select([
					'trainee_id', 
					'tbl_training_trainees.training_id', 
					'tbl_training_trainees.employee_id', 
					'tbl_trainings_files.src', 
					'tbl_trainings.training_date', 
					'tbl_trainings.date_expired', 
					'tbl_trainings.title', 
					'tbl_trainings.training_hrs',
          'tbl_trainings.type'
				])
				->where('tbl_trainings.is_deleted', 0)
        ->where('tbl_trainings.type', '!=', 1)
				->whereBetween('training_date', [$from, $to])
				->join('tbl_trainings', 'tbl_trainings.training_id', 'tbl_training_trainees.training_id')
				->leftJoin(
					'tbl_trainings_files', function($joinQuery) {
						return $joinQuery->on('tbl_trainings_files.training_id', '=', 'tbl_training_trainees.training_id')
						->on('tbl_trainings_files.emp_id', '=', 'tbl_training_trainees.employee_id');
				});
		})
		->leftJoin('tbl_position', 'tbl_position.position_id', 'tbl_employees.position')
		->get();

		$years = collect([]);
		
		$titles = $courses->pluck('course_name')->toArray();
		$storage = Storage::disk("public");

		foreach ($employees as $employee) {
			$employeeFullName = $employee->fullname;
			$employeePosition = trim($employee->position);
			$employeeId = $employee->employee_id;
			foreach ($employee->participated_trainings as $parTraining) {
				$year = Carbon::parse($parTraining->training_date)->year;
				$existingYear = $years->get($year, collect([
					[
						'employee_id' => $employeeId,
						'fullName' => $employeeFullName,
						'position' => $employeePosition,
						'completed_count' => 0,
						'total_hrs' => 0,
						'data' => collect([])
					]
				]));

				$employeeData = $existingYear->first(function ($val) use ($employeeId) {
					return $val['employee_id'] === $employeeId;
				});

				if(!$employeeData) {
					$existingYear->push([
						'employee_id' => $employeeId,
						'fullName' => $employeeFullName,
						'position' => $employeePosition,
						'completed_count' => 0,
						'total_hrs' => 0,
						'data' => collect([])
					]);
				}
				
				$years->put($year, $existingYear);
				
				$course = '';
				$title = $parTraining->title;
				if($title) {
					$foundCourse = $courses->first(function ($course) use ($title) {
						return strtolower(trim($course->course_name)) === strtolower(trim($title));
					});
					if($foundCourse) {
						$course = $foundCourse->course_name;
					}else {
						$course = $title;
					}
				}
				
				
				if($course !== '') {
					$existingYear->transform(function($val) use($employeeId, $parTraining, $storage, $course, $employeePosition) {
						if($val['employee_id'] === $employeeId && !$val['data']->contains('courseName', $course)) {
							$isCompleted = $parTraining->src ? $storage->exists("media/training/". $parTraining->src) : false;
							$expiredDate = Carbon::parse($parTraining->date_expired);
							$parTraining->expired = false;
							if(now() >= $expiredDate) {
								$parTraining->expired = true;
							}
							$val['data']->push([
								...$parTraining->toArray(),
								'courseName' => $course,
								'isCompleted' => $isCompleted,
								'position' => $employeePosition,
							]);
							if($isCompleted) {
								$val['completed_count'] += 1;
							}
							$val['total_hrs'] += $parTraining->training_hrs;
						}
						return $val;
					});
					$years->put($year, $existingYear);
				}
			}
		}
    
		$years->transform(function($year) {
			return $year->sortBy('fullName')->values();
		});

    return response()->json([
      'courses' => $courses,
			'years' => $years,
			'titles' => $titles,
			'yearList' => $yearList,
			'from' => $from,
			'to' => $to
    ]);
  }
}