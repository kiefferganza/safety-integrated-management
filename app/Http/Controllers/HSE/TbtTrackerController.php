<?php

namespace App\Http\Controllers\HSE;

use App\Http\Controllers\Controller;
use App\Models\TbtTracker;
use App\Models\TbtTrackerEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TbtTrackerController extends Controller
{
    public function tracker()
    {
        return Inertia::render("Dashboard/Management/ToolboxTalk/Preplanning/Register/index");
    }


    public function assignEmployee(Request $request)
    {
        $request->validate([
            "employees" => ["required", "array", "min:1"],
            "dateAssigned" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"]
        ]);

        $user = auth()->user();
        $tbtTracker = new TbtTracker();
        $tbtTracker->project_code = $request->project_code;
        $tbtTracker->document_type = $request->document_type;
        $tbtTracker->discipline = $request->discipline;
        $tbtTracker->originator = $request->originator;
        $tbtTracker->created_by = $user->id;
        $tbtTracker->emp_id = $user->emp_id;
        $tbtTracker->date_assigned = $request->dateAssigned;

        if ($tbtTracker->save())
        {
            $tbtTracker->trackerEmployees()->createMany($request->employees);
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


    /**
     * Edit Tracker
     */
    public function editAssignedEmployee(Request $request, TbtTracker $tbtTracker) {
        $request->validate([
            "employees" => ["required", "array", "min:1"],
            "dateAssigned" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"],
        ]);
        $tbtTracker->date_assigned = $request->dateAssigned;
        $tbtTracker->project_code = $request->project_code;
        $tbtTracker->document_type = $request->document_type;
        $tbtTracker->discipline = $request->discipline;
        $tbtTracker->originator = $request->originator;

        if($tbtTracker->isDirty()) {
            $tbtTracker->save();
        }

        TbtTrackerEmployee::where("tracker", $tbtTracker->id)->delete();
        $tbtTracker->trackerEmployees()->createMany($request->employees);
        return redirect()->back()
            ->with("message", "Save successfully")
            ->with("type", "success");
    }


    /**
     * Delete Tracker
     */
    public function deleteAssignEmployee(Request $request) {
        $request->validate([
            "ids" => ["required", "array", "min:1"]
        ]);
        TbtTracker::whereIn("id", $request->ids)->delete();

        return redirect()->back()
            ->with("message", "Delete successfully")
            ->with("type", "success");
    }
}
