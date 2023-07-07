<?php

namespace App\Http\Controllers\Operation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Management/Operation/Store/index', [
		]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Management/Operation/Store/Create/index');
    }


    public function store(Request $request)
    {
        //
    }


    public function show($id)
    {
        //
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }

	// REPORT
	public function report() {

	}

	
	public function createReport() {

	}

	
	public function storeReport() {

	}

	
}
