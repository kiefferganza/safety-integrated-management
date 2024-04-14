<?php

namespace App\Http\Controllers\HSE;

use App\Http\Controllers\Controller;
use App\Models\InspectionTracker;
use App\Models\InspectionTrackerEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InspectionTrackerController extends Controller
{
    public function index()
    {
        return Inertia::render("Dashboard/Management/Inspection/Tracker/index");
    }

    public function store(Request $request) {
        $request->validate([
            "employees" => ["required", "array", "min:1"],
            "dateAssigned" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"]
        ]);

        $user = auth()->user();
        $inspectionTracker = new InspectionTracker();
        $inspectionTracker->project_code = $request->project_code;
        $inspectionTracker->document_type = $request->document_type;
        $inspectionTracker->discipline = $request->discipline;
        $inspectionTracker->originator = $request->originator;
        $inspectionTracker->created_by = $user->id;
        $inspectionTracker->emp_id = $user->emp_id;
        $inspectionTracker->date_assigned = $request->dateAssigned;

        if ($inspectionTracker->save())
        {
            $inspectionTracker->trackerEmployees()->createMany($request->employees);
        }
        else
        {
            return redirect()->back()
                ->with("message", "Something went wrong!")
                ->with("type", "error");
        }

        return redirect()->back()
            ->with("message", "Save successfully")
            ->with("type", "success");
    }



    public function update(Request $request, InspectionTracker $inspectionTracker) {
        $request->validate([
            "employees" => ["required", "array", "min:1"],
            "dateAssigned" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"], 
        ]);
        $inspectionTracker->date_assigned = $request->dateAssigned;
        $inspectionTracker->project_code = $request->project_code;
        $inspectionTracker->document_type = $request->document_type;
        $inspectionTracker->discipline = $request->discipline;
        $inspectionTracker->originator = $request->originator;

        if($inspectionTracker->isDirty()) {
            $inspectionTracker->save();
        }

        InspectionTrackerEmployee::where("tracker", $inspectionTracker->id)->delete();
        $inspectionTracker->trackerEmployees()->createMany($request->employees);
        return redirect()->back()
            ->with("message", "Save successfully")
            ->with("type", "success");
    }


    public function destroy(Request $request) {
        $request->validate([
            "ids" => ["required", "array", "min:1"]
        ]);

        InspectionTracker::whereIn("id", $request->ids)->update(["deleted_at" => now()]);

        return redirect()->back()
        ->with("message", "Delete successfully")
        ->with("type", "success");
    }
}
