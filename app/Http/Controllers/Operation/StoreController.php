<?php

namespace App\Http\Controllers\Operation;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Operation\Store\Store;
use App\Models\Operation\Store\StoreHistory;
use App\Services\MediaLibrary\MediaService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StoreController extends Controller
{
    public function index()
    {
		$user = auth()->user();

		$stores = Store::where('subscriber_id', $user->subscriber_id)
			->with('history')
			->get()
			->map(function(Store $store) {
				$thumbnail = $store->getFirstMediaUrl('images', 'thumbnail');
				if(!$thumbnail) {
					$thumbnail = '/storage/assets/placeholder.svg';
				}
				return $store->setAttribute('thumbnail', $thumbnail);
			});

		$employee = Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
			->where("is_deleted", 0)
			->where("is_active", 0)
			->where("sub_id", auth()->user()->subscriber_id)
			->get();
        return Inertia::render('Dashboard/Operation/Store/index', compact('stores', 'employee'));
    }

    public function create()
    {
        return Inertia::render('Dashboard/Operation/Store/Create/index');
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
			'user_id' => $user->id,
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


    public function show(Store $store)
    {
		$store = $store->load(
			'history.creator:employee_id,firstname,lastname'
		);
		$mediaService = new MediaService();
		$store->setAttribute('images', $mediaService->getAndTransformMedia($store, 'images'));

		$employee = Employee::select("employee_id", "firstname", "lastname", "sub_id", "user_id")
			->where("is_deleted", 0)
			->where("is_active", 0)
			->where("sub_id", auth()->user()->subscriber_id)
			->get();

		return Inertia::render('Dashboard/Operation/Store/Detail/index', compact('store', 'employee'));
    }


    public function edit(Store $store)
    {
		$store->images = $store->getMedia('images')->transform(function(Media $media) {
			return [
				'id' => $media->id,
				'thumbnail' => $media->getFullUrl('thumbnail')
			];
		});
		
        return Inertia::render('Dashboard/Operation/Store/Edit/index', compact('store'));
    }


    public function update(Request $request, Store $store)
    {
		// Retrieve all the request data
		$requestData = $request->except('images', 'removedImages');

		// Get the dirty fields from the request payload
		$dirtyFields = array_keys($requestData);
	
		// Loop through the dirty fields and update the corresponding model fields
		foreach ($dirtyFields as $field) {
			if ($request->has($field)) {
				$store->{$field} = $request->input($field);
			}
		}
	
		if ($request->hasFile('images')) {
            $store->storeImages($request->file('images'));
        }

        if($request->removedImages) {
			foreach ($request->removedImages as $imageId) {
				$store->deleteMedia($imageId);
			}
		}

		$isNameDirty = $store->isDirty('name');
		$store->save();

		if($isNameDirty) {
			return redirect()->route('operation.store.edit', $store->slug)
			->with("message", "Product created in store successfully!")
			->with("type", "success");
		}
		return redirect()->back()
		->with("message", "Product created in store successfully!")
		->with("type", "success");
    }


    public function destroy(Request $request)
    {
        $request->validate(["ids" => 'array|min:1']);

		$stores = Store::whereIn('id', $request->ids)->get();

		foreach ($stores as $store) {
			/** @var Store $store */
			$store->clearMediaCollection('images');
		}

		Store::whereIn("id", $request->ids)->delete();

		return redirect()->back()
		->with("message", count($request->ids) . " items deleted successfully!")
		->with("type", "success");
    }

	public function add_remove_stock(Store $store, Request $request)
	{
		$request->validate([
			"qty" => 'required|integer',
			"type" => 'required|string'
		]);

		$storeHistory = new StoreHistory();
		$storeHistory->store_id = $store->id;
		$storeHistory->prev_qty = $store->qty;
		$storeHistory->qty = $request->qty;

		if($request->type === "add") {
			$user = auth()->user();
			$newQty = $store->qty + $request->qty;

			
			$storeHistory->type = "add";
			$storeHistory->requested_by = (string)$user->emp_id;
			$storeHistory->location = NULL;

			$store->qty = $newQty;
		}else if($request->type === "remove" && ($request->employee_id !== null || $request->location !== null)) {
			$newQty = $store->qty - $request->qty;

			$storeHistory->type = "remove";
			$storeHistory->requested_by = $request->employee_id ? (string)$request->employee_id : null;
			$storeHistory->location = $request->location;

			$store->qty = $newQty;
		}else {
			abort(500);
		}

		$storeHistory->save();
		$store->save();


		return redirect()->back()
		->with("message", $request->type === "add" ? "Re-stocked successfully!" : "Unstocked successfully!")
		->with("type", "success");

	}

	// REPORT
	public function report() {

	}


	public function createReport() {

	}


	public function storeReport() {

	}


}
