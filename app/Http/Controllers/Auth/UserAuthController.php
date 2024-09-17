<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserAuthController extends Controller
{
  /**
     * Display the login view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
			if(Auth::check()) {
				return redirect()->route('dashboard');
			}
			
			return Inertia::render('Auth/LoginPage', [
					'canResetPassword' => Route::has('password.request'),
					'status' => session('status'),
			]);
    }

    public function store(Request $request)
    {
			$credentials = $request->all();
			
			if(filter_var($credentials['email'], FILTER_VALIDATE_EMAIL)) {
				$fields = ['email' => $credentials['email'], 'password' => $credentials['password'], 'deleted' => 0];
			} else {
				$fields = ['username' => $credentials['email'], 'password' => $credentials['password'], 'deleted' => 0];
			}

			// Auth::loginUsingId(68);
			// $request->session()->regenerate();
			// return redirect()->intended(RouteServiceProvider::DASHBOARD);

			if(Auth::attempt($fields)) {
				$request->session()->regenerate();
				// $user = auth()->user();
				// if($user) {
				// 	$billing = Billing::where("sub_id", $user->subscriber_id)->first();
				// 	$stripe = new \Stripe\StripeClient(env("STRIPE_SECRET_KEY"));
				// 	$priceId = env("STRIPE_PREMIUM_PRICE_ID");
				// 	if(!$billing) {
				// 		$userFullname = $user->firstname. " " .$user->lastname;
				// 		$customer = $stripe->customers->create([
				// 			"name" => "Fiafi Group",
				// 			"metadata" => [
				// 				"name" => $userFullname,
				// 				"userId" => $user->id,
				// 				"subscriber_id" => $user->subscriber_id
				// 			]
				// 		]);

				// 		$subscription = $stripe->subscriptions->create([
				// 			'customer' => $customer->id,
				// 			'items' => [[
				// 				'price' => $priceId,
				// 			]],
				// 			'payment_behavior' => 'default_incomplete',
				// 			'payment_settings' => ['save_default_payment_method' => 'on_subscription']
				// 		]);
				// 		$newBilling = new Billing();
				// 		$newBilling->user_id = $user->id;
				// 		$newBilling->sub_id = $user->subscriber_id;
				// 		$newBilling->stripe_customer_id = $customer->id;
				// 		$newBilling->stripe_subscription_id = $subscription->id;
				// 		$newBilling->save();
				// 	}else {
				// 		try {
				// 			$stripe->customers->retrieve($billing->stripe_customer_id);
				// 		} catch (\Throwable $th) {
				// 			$userFullname = $user->firstname. " " .$user->lastname;
				// 			$customer = $stripe->customers->create([
				// 				"name" => "Fiafi Group",
				// 				"metadata" => [
				// 					"name" => $userFullname,
				// 					"userId" => $user->id,
				// 					"subscriber_id" => $user->subscriber_id
				// 				]
				// 			]);

				// 			$subscription = $stripe->subscriptions->create([
				// 				'customer' => $customer->id,
				// 				'items' => [[
				// 					'price' => $priceId,
				// 				]],
				// 				'payment_behavior' => 'default_incomplete',
				// 				'payment_settings' => ['save_default_payment_method' => 'on_subscription']
				// 			]);
				// 			$billing->stripe_customer_id = $customer->id;
				// 			$billing->stripe_subscription_id = $subscription->id;
				// 			$billing->save();
				// 		}
				// 	}
				// }
				return redirect()->intended(RouteServiceProvider::DASHBOARD);
			}

			return back()->withErrors(['general' => 'Invalid credentials']);
    }

    public function destroy(Request $request)
    {
			Auth::guard('web')->logout();
			
			$request->session()->invalidate();
			
			$request->session()->regenerateToken();
			
      return redirect()->route('login');
    }
}
