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
    public function registerList()
    {
        return Inertia::render("Dashboard/Management/ToolboxTalk/Preplanning/Register/index");
    }


    public function assignEmployee(Request $request)
    {
        $request->validate([
            "employees" => ["required", "array", "min:1"]
        ]);

        $user = auth()->user();
        $preplanning = new TbtPrePlanning();
        $preplanning->created_by = $user->user_id;
        $preplanning->date_issued = Carbon::tomorrow();

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
            "employees" => ["required", "array", "min:1"]
        ]);
        
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
