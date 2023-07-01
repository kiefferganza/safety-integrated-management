<?php

namespace App\Http\Middleware;

use App\Models\ShareableLink;
use Closure;
use Illuminate\Http\Request;

class ShareableLinkMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Retrieve the token from the query parameter
		$token = $request->query('token');

		// Retrieve the shareable link from the database or throw a ModelNotFoundException
		$shareableLink = ShareableLink::where('token', $token)->where('expiration_date', '>=', now())->firstOrFail();

		// Link is valid, pass the $shareableLink to the route
		$request->merge(['shareableLink' => $shareableLink]);

		return $next($request);
    }
}
