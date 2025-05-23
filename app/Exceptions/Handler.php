<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
	/**
	 * A list of exception types with their corresponding custom log levels.
	 *
	 * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
	 */
	protected $levels = [
		//
	];

	/**
	 * A list of the exception types that are not reported.
	 *
	 * @var array<int, class-string<\Throwable>>
	 */
	protected $dontReport = [
		//
	];

	/**
	 * A list of the inputs that are never flashed to the session on validation exceptions.
	 *
	 * @var array<int, string>
	 */
	protected $dontFlash = [
		'current_password',
		'password',
		'password_confirmation',
	];

	/**
	 * Register the exception handling callbacks for the application.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->reportable(function (Throwable $e) {
				//
		});
	}

	public function render($request, Throwable $e) {
		$response = parent::render($request, $e);
		if (!app()->environment(['local', 'testing', 'development']) && in_array($response->status(), [500, 404, 403])) {
			switch ($response->status()) {
				case 500:
					$page = 'Page500';
					break;
				case 403:
					$page = 'Page403';
					break;
				default:
					$page = 'Page404';
					break;
			}
			return Inertia::render('Error/' .$page, ['status' => $response->status()])
					->toResponse($request)
					->setStatusCode($response->status());
		} elseif ($response->status() === 419) {
			return back()->with([
					'message' => 'The page expired, please try again.',
			]);
		}

		return $response;
	}
}
