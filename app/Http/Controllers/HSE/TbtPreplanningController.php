<?php

namespace App\Http\Controllers\HSE;

use App\Http\Controllers\Controller;
use App\Models\TbtPrePlanning;
use App\Models\TbtPrePlanningAssigned;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TbtPreplanningController extends Controller
{
    public function tracker()
    {
        return Inertia::render("Dashboard/Management/ToolboxTalk/Preplanning/Register/index");
    }


    public function assignEmployee(Request $request)
    {
        $request->validate([
            "location" => ["required", "string"],
            "employees" => ["required", "array", "min:1"],
            "dateIssued" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"],
            "exact_location" => ["required", "string"],
        ]);

        $user = auth()->user();
        $preplanning = new TbtPrePlanning();
        $preplanning->project_code = $request->project_code;
        $preplanning->document_type = $request->document_type;
        $preplanning->discipline = $request->discipline;
        $preplanning->originator = $request->originator;
        $preplanning->exact_location = $request->exact_location;
        $preplanning->created_by = $user->user_id;
        $preplanning->location = $request->location;
        $preplanning->date_issued = $request->dateIssued;

        if ($preplanning->save())
        {
            $preplanning->assigned()->createMany($request->employees);
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

    public function editAssignedEmployee(Request $request, TbtPrePlanning $tbtPrePlanning) {
        $request->validate([
            "location" => ["required", "string"],
            "employees" => ["required", "array", "min:1"],
            "dateIssued" => ["required", "date", "date_format:Y-m-d"],
            "project_code" => ["required", "string"],
            "document_type" => ["required", "string"],
            "discipline" => ["required", "string"],
            "originator" => ["required", "string"],
            "exact_location" => ["required", "string"],
        ]);
        $tbtPrePlanning->date_issued = $request->dateIssued;
        $tbtPrePlanning->location = $request->location;
        $tbtPrePlanning->project_code = $request->project_code;
        $tbtPrePlanning->document_type = $request->document_type;
        $tbtPrePlanning->discipline = $request->discipline;
        $tbtPrePlanning->originator = $request->originator;
        $tbtPrePlanning->exact_location = $request->exact_location;

        if($tbtPrePlanning->isDirty()) {
            $tbtPrePlanning->save();
        }

        TbtPrePlanningAssigned::where("preplanning", $tbtPrePlanning->id)->delete();
        $tbtPrePlanning->assigned()->createMany($request->employees);
        return redirect()->back()
            ->with("message", "Save successfully")
            ->with("type", "success");
    }

    public function deleteAssignEmployee(Request $request) {
        $request->validate([
            "ids" => ["required", "array", "min:1"]
        ]);
        TbtPrePlanning::whereIn("id", $request->ids)->delete();

        return redirect()->back()
            ->with("message", "Delete successfully")
            ->with("type", "success");
    }
}
