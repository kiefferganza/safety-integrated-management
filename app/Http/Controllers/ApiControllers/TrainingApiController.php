<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Training;
use App\Models\TrainingCourses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class TrainingApiController extends Controller
{
	public function inhouseMatrix(Request $request)
	{
		$user = auth()->user();
		$from = $request->from;
		$to = $request->to;
		if (!$from || !$to)
		{
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
			->with('participated_trainings', function ($q) use ($from, $to)
			{
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

		foreach ($employees as $employee)
		{
			$employeeFullName = $employee->fullname;
			$employeePosition = trim($employee->position);
			$employeeId = $employee->employee_id;
			foreach ($employee->participated_trainings as $parTraining)
			{
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

				$employeeData = $existingYear->first(function ($val) use ($employeeId)
				{
					return $val['employee_id'] === $employeeId;
				});

				if (!$employeeData)
				{
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
				if ($title)
				{
					$foundCourse = $courses->first(function ($course) use ($title)
					{
						return strtolower(trim($course->course_name)) === strtolower(trim($title));
					});
					if ($foundCourse)
					{
						$course = $foundCourse->course_name;
					}
					else
					{
						$course = $title;
					}
				}


				if ($course !== '')
				{
					$existingYear->transform(function ($val) use ($employeeId, $parTraining, $course, $employeePosition)
					{
						if ($val['employee_id'] === $employeeId && !$val['data']->contains('courseName', $course))
						{
							$isCompleted = $parTraining->status === 'completed';
							$parTraining->expired = false;
							$val['data']->push([
								...$parTraining->toArray(),
								'courseName' => $course,
								'isCompleted' => $isCompleted,
								'position' => $employeePosition,
							]);
							if ($isCompleted)
							{
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

		$years->transform(function ($year)
		{
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

	public function externalMatrix(Request $request)
	{
		$user = auth()->user();

		$from = $request->from;
		$to = $request->to;
		if (!$from || !$to)
		{
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
			->with('participated_trainings', function ($q) use ($from, $to)
			{
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
						'tbl_trainings_files',
						function ($joinQuery)
						{
							return $joinQuery->on('tbl_trainings_files.training_id', '=', 'tbl_training_trainees.training_id')
								->on('tbl_trainings_files.emp_id', '=', 'tbl_training_trainees.employee_id');
						}
					);
			})
			->leftJoin('tbl_position', 'tbl_position.position_id', 'tbl_employees.position')
			->get();

		$years = collect([]);

		$titles = $courses->pluck('course_name')->toArray();
		$storage = Storage::disk("public");

		foreach ($employees as $employee)
		{
			$employeeFullName = $employee->fullname;
			$employeePosition = trim($employee->position);
			$employeeId = $employee->employee_id;
			foreach ($employee->participated_trainings as $parTraining)
			{
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

				$employeeData = $existingYear->first(function ($val) use ($employeeId)
				{
					return $val['employee_id'] === $employeeId;
				});

				if (!$employeeData)
				{
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
				if ($title)
				{
					$foundCourse = $courses->first(function ($course) use ($title)
					{
						return strtolower(trim($course->course_name)) === strtolower(trim($title));
					});
					if ($foundCourse)
					{
						$course = $foundCourse->course_name;
					}
					else
					{
						$course = $title;
					}
				}


				if ($course !== '')
				{
					$existingYear->transform(function ($val) use ($employeeId, $parTraining, $storage, $course, $employeePosition)
					{
						if ($val['employee_id'] === $employeeId && !$val['data']->contains('courseName', $course))
						{
							$isCompleted = $parTraining->src ? $storage->exists("media/training/" . $parTraining->src) : false;
							$expiredDate = Carbon::parse($parTraining->date_expired);
							$parTraining->expired = false;
							if (now() >= $expiredDate)
							{
								$parTraining->expired = true;
							}
							$val['data']->push([
								...$parTraining->toArray(),
								'courseName' => $course,
								'isCompleted' => $isCompleted,
								'position' => $employeePosition,
							]);
							if ($isCompleted)
							{
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

		$years->transform(function ($year)
		{
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

	public function tracker()
	{
		$user = auth()->user();
		$today = Carbon::now();
		$lastWeekStart = $today->subWeek(1);
		$thirdPartyTrainings = TrainingCourses::select("id", "course_name", "acronym")->where("sub_id", $user->subscriber_id)->whereNotNull("acronym")->whereNull("type")->get();
		$internalTraining = TrainingCourses::select("id", "course_name", "acronym")->where("sub_id", $user->subscriber_id)->whereNotNull("acronym")->where("type", "in-house")->get();

		$employees = Employee::select(DB::raw("
		tbl_employees.user_id,
		tbl_employees.employee_id,
		tbl_employees.firstname,
		tbl_employees.middlename,
		tbl_employees.lastname,
		tbl_employees.email,
		tbl_employees.phone_no,
		tbl_employees.img_src,
		tbl_employees.date_created,
		tbl_position.position,
		tbl_department.department,
		tbl_employees.is_deleted,
		tbl_employees.is_active,
		tbl_employees.country,
		tbl_company.company_name"))
			->leftJoin("tbl_department", "tbl_employees.department", "tbl_department.department_id")
			->leftJoin("tbl_position", "tbl_position.position_id", "tbl_employees.position")
			->leftJoin("tbl_company", "tbl_employees.company", "tbl_company.company_id")
			->with([
				"participated_trainings" => fn($q) =>
				$q->select("title", "type", "date_expired", "tbl_training_trainees.employee_id", "tbl_training_trainees.training_id")->join("tbl_trainings", "tbl_trainings.training_id", "tbl_training_trainees.training_id")->where("tbl_trainings.is_deleted", 0)->orderBy("date_created", "desc"),
			])
			// ->join("tbl_nationalities", "tbl_employees.nationality", "tbl_nationalities.id")
			->where([
				["tbl_employees.sub_id", $user->subscriber_id],
				["tbl_employees.is_deleted", 0]
			])
			->get()
			->transform(function ($employee) use ($today, $lastWeekStart, $thirdPartyTrainings, $internalTraining)
			{
				/**
				 * @var App\Models\Employee $employee
				 */
				$employee->id = $employee->employee_id;
				$employee->status = $employee->is_active === 0 ? "active" : "inactive";
				$employee->profile = null;
				$profile = $employee->profile();
				if ($profile)
				{
					$path = "user/" . md5($profile->id . config('app.key')) . "/" . $profile->file_name;
					$employee->profile = [
						"url" => URL::route("image", ["path" => $path]),
						"thumbnail" => URL::route("image", ["path" => $path, "w" => 40, "h" => 40, "fit" => "crop"]),
						"small" => URL::route("image", ["path" => $path, "w" => 128, "h" => 128, "fit" => "crop"])
					];
				}

				$totalTrainings = 0;
				$trainings = [
					"internal" => [
						"SN" => 0,
						"E" => 0,
						"TT" => 0
					],
					"external" => [
						"SN" => 0,
						"E" => 0,
						"TT" => 0
					]
				];
				$internal = $internalTraining->mapWithKeys(function ($t)
				{
					return [$t->acronym => [
						"name" => $t->course_name,
						"acronym" => $t->acronym,
						"expired" => false,
						"sn" => false,
						"active" => false,
					]];
				})->toArray();
				$thirdParty = $thirdPartyTrainings->mapWithKeys(function ($t)
				{
					return [$t->acronym => [
						"name" => $t->course_name,
						"acronym" => $t->acronym,
						"expired" => false,
						"sn" => false,
						"active" => false,
					]];
				})->toArray();

				if (count($employee->participated_trainings))
				{
					foreach ($employee->participated_trainings as $t)
					{
						if ($t->type === 3 || $t->type === 2)
						{
							$foundTraining = $thirdPartyTrainings->first(function ($th) use ($t)
							{
								return $th->course_name === trim($t->title);
							});
							if ($foundTraining)
							{
								$date = Carbon::parse($t->date_expired);
								if ($date->between($lastWeekStart, $today))
								{
									$thirdParty[$foundTraining->acronym]["sn"] = true;
									$trainings["external"]["TT"] += 1;
									$trainings["external"]["SN"] += 1;
								}
								else if ($date->isPast($today))
								{
									$thirdParty[$foundTraining->acronym]["expired"] = true;
									$trainings["external"]["TT"] += 1;
									$trainings["external"]["E"] += 1;
								}
								else
								{
									$thirdParty[$foundTraining->acronym]["active"] = true;
									$trainings["external"]["TT"] += 1;
								}
								$totalTrainings += 1;
							}
						}
						if ($t->type === 1)
						{
							$foundTraining = $internalTraining->first(function ($th) use ($t)
							{
								return $th->course_name === trim($t->title);
							});
							if ($foundTraining)
							{
								$date = Carbon::parse($t->date_expired);
								if ($date->between($lastWeekStart, $today))
								{
									$internal[$foundTraining->acronym]["sn"] = true;
									$trainings["internal"]["TT"] += 1;
									$trainings["internal"]["SN"] += 1;
								}
								else if ($date->isPast($today))
								{
									$internal[$foundTraining->acronym]["expired"] = true;
									$trainings["internal"]["TT"] += 1;
									$trainings["internal"]["E"] += 1;
								}
								else
								{
									$internal[$foundTraining->acronym]["active"] = true;
									$trainings["internal"]["TT"] += 1;
								}
								$totalTrainings += 1;
							}
						}
					}
				}
				$employee->totalTrainings = $totalTrainings;
				$employee->trainings = $trainings;
				$employee->thirdPartyTrainings = $thirdParty;
				$employee->internalTrainings = $internal;

				return $employee;
		});

		return response()->json(compact("employees"));
	}
}
