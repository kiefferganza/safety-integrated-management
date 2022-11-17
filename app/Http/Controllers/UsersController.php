<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        $userslist = DB::table('users')->select(DB::raw("users.user_id,
        tbl_employees.firstname,
        tbl_employees.lastname,
        tbl_employees.email,
        users.user_type,
        users.status,
        tbl_employees.lastname,
        tbl_employees.firstname,
        users.emp_id,
        tbl_employees.img_src"))
            ->join("tbl_employees", "users.emp_id", "tbl_employees.employee_id")
            ->where([
                ["users.subscriber_id", $user->subscriber_id],
                ["users.deleted", 0]
            ])->get();
        return Inertia::render('Users/User', ["users" => $userslist]);
    }
}
