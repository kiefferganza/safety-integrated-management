<?php

namespace App\Http\Controllers\ApiControllers;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function cancelSubscription() {
    
        return response()->json([]);
    }
}
