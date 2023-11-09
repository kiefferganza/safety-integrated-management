<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Training;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
	public function sliderImages() {
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getSliderImages());
	}


	public function toolboxtalks(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json($dashboardService->getTbtByDate($from, $to));
	}

	public function tbtStatistics(Request $request) {
		$dashboardService = new DashboardService;
		$from = new Carbon($request->from);
		$to = (new Carbon($request->to))->endOfDay();

		return response()->json($dashboardService->getTbtStatisticByDate($from, $to));
	}

	public function trainings() {
		$currentDate = Carbon::now();
		$incompleteTrainings = [];

		$trainings = Training::select("training_id", "type", "training_hrs", "training_date", "training_hrs", "type")
		->where("is_deleted", 0)
		->with([
			"trainees" => fn($q) => $q->select("tbl_employees.employee_id"),
			"training_files" => fn($q) => $q->select("emp_id", "tbl_trainings_files.training_id", "src")
		])
		->get();

		$completedTrainings = $trainings->filter(function(Training $training) {
			if($training->training_files->count() === 0 || $training->training_files->count() !== $training->trainees->count()) return false;
			$trainees = $training->trainees;
			return $training->training_files->every(function($file) use($trainees) {
				$exist = Storage::disk("public")->exists("media/training/" . $file->src);
				if(!$exist) return false;
				$empId = $file->emp_id;
				return $trainees->every(function($trainee) use($empId) {
					return $trainee->employee_id === $empId;
				});
			});
		});

		foreach ($trainings as $training) {
			if (!$completedTrainings->contains($training)) {
				$incompleteTrainings[] = $training;
			}
		}

		$trainingsMonth = $completedTrainings->filter(function($training) use($currentDate) {
			$targetDate = Carbon::parse($training->training_date);
			return $targetDate->month == $currentDate->month && $targetDate->year == $currentDate->year;
		});

		$inductions = $trainings->filter(fn($tr) => $tr->type === 4);
		$inductionsMonth = $inductions->filter(function($training) use($currentDate) {
			$targetDate = Carbon::parse($training->training_date);
			return $targetDate->month == $currentDate->month && $targetDate->year == $currentDate->year;
		});

		return response()->json([
			"completedTrainings" => $completedTrainings->flatten(),
			"incompleteTrainings" => $incompleteTrainings,
			"inductions" => $inductions,
			"totalHrsCompleted" => $completedTrainings->sum("training_hrs"),
			"totalHrsMonthCompleted" => $trainingsMonth->sum("training_hrs"),
			"totalInductionCompleted" => $inductions->count(),
			"totalInductionMonthCompleted" => $inductionsMonth->count(),
		]);
	}

	public function trainingsByYear($year) {
		$trainings = Training::select("training_id", "type", "training_hrs", "training_date", "training_hrs", "type")
		->where("is_deleted", 0)
		->whereYear("training_date", $year)
		->with([
			"trainees" => fn($q) => $q->select("tbl_employees.employee_id"),
			"training_files" => fn($q) => $q->select("emp_id", "tbl_trainings_files.training_id", "src")
		])
		->get();
		$initialData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

		$completedTrainings = [
			"name" => "Training Hours Completed",
			"data" => $initialData
		];

		$inductions = [
			"name" => "Induction Completed",
			"data" => $initialData
		];

		$notCompletedTrainings = [
			"name" => "Training Hours Not Completed",
			"data" => $initialData
		];

		foreach ($trainings as $training) {
			$month = Carbon::parse($training->training_date)->month;
			if($training->training_files->count() === 0 || $training->training_files->count() !== $training->trainees->count()) {
				if($training->type !== 4) {
					$notCompletedTrainings['data'][$month - 1] += $training->training_hrs;
				}else {
					$inductions['data'][$month - 1] += $training->training_hrs;
				}
			}else {
				$trainees = $training->trainees;
				$isValidAndCompleted = $training->training_files->every(function($file) use($trainees) {
					$exist = Storage::disk("public")->exists("media/training/" . $file->src);
					if(!$exist) return false;
					$empId = $file->emp_id;
					return $trainees->every(function($trainee) use($empId) {
						return $trainee->employee_id === $empId;
					});
				});
				if($isValidAndCompleted) {
					if($training->type !== 4) {
						$completedTrainings['data'][$month - 1] += $training->training_hrs;
					}else {
						$inductions['data'][$month - 1] += $training->training_hrs;
					}
				}else {
					$notCompletedTrainings['data'][$month - 1] += $training->training_hrs;
				}
			}
		}
		
		return response()->json([
			"notCompletedTrainings" => $notCompletedTrainings,
			"completedTrainings" => $completedTrainings,
			"inductions" => $inductions,
		]);
	}

	public function inspections(Request $request) {
		$dashboardService = new DashboardService;

		return response()->json($dashboardService->getInspectionByDate($request->year));
	}

	public function incidents() {
		$dashboardService = new DashboardService;
		return response()->json($dashboardService->getIncidents());
	}

}
