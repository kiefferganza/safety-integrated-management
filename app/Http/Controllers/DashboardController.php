<?php

namespace App\Http\Controllers;

use App\Models\Images;
use App\Models\TbtStatistic;
use App\Models\Training;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $sliderImages = Images::where("type", "slider")->get()->transform(function ($img) {
            $image = $img->getFirstMedia("slider");
            $img->url = $image->getFullUrl();
            $img->name = $image->name;
            return $img;
        });

        return Inertia::render("Dashboard/General/HSEDashboard/index", [
            "trainings" => Training::select("type", "training_hrs", "training_date")->where("is_deleted", 0)->withCount("training_files")->get(),
            "tbtStatistics" => TbtStatistic::select("id", "year")->with("months:id,tbt_statistic_id,manhours,manpower,month_code")->get(),
            "sliderImages" => $sliderImages
        ]);
    }
}
