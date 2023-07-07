<?php

namespace App\Http\Controllers\Operation;

use App\Http\Controllers\Controller;
use App\Models\Operation\Store\Store;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
		$user = auth()->user();

		$stores = Store::where('subscriber_id', $user->subscriber_id)
			->with('history')
			->get()
			->map(function(Store $store) {
				$thumbnail = $store->getFirstMediaUrl('images', 'thumbnail') ?? '/storage/assets/placeholder.svg';
				return $store->setAttribute('thumbnail', $thumbnail);
			});
        return Inertia::render('Dashboard/Management/Operation/Store/index', compact('stores'));
    }

    public function create()
    {
        return Inertia::render('Dashboard/Management/Operation/Store/Create/index');
    }
	
	
    public function store(Request $request)
    {
		$user = auth()->user();
		$request->validate([
            'name' => ['required', Rule::unique(Store::class)],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'currency' => ['required', 'string'],
            'unit' => ['required', Rule::in(['Box', 'Meter', 'Pcs.', 'Kgs', 'Grams'])],
            'qty' => ['required', 'numeric'],
            'min_qty' => ['required', 'numeric'],
			'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:3072'],
        ]);

		$store = Store::create(array_merge($request->except('images'), [
			'user_id' => $user->user_id,
			'employee_id' => $user->emp_id,
			'subscriber_id' => $user->subscriber_id
		]));

        if ($request->hasFile('images')) {
            $store->storeImages($request->file('images'));
        }


		return redirect()->back()
		->with("message", "Product created in store successfully!")
		->with("type", "success");
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
