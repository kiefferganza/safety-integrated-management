<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SetTimezone
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
        $timezoneName = $request->header('x-user-timezone');
		if($timezoneName) {
			$userIp = $request->ip();
        	$cacheKey = 'timezone_' . $userIp;
			if (Cache::has($cacheKey)) {
				$timezoneName = Cache::get($cacheKey);
			} else {
				Cache::put($cacheKey, $timezoneName, 1440); // Cache for 24 hours
			}
			config(['app.timezone' => $timezoneName]);
		}
        return $next($request);
    }
}
