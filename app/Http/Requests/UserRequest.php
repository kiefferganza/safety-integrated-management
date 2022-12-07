<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		$user_rule = Rule::unique('users')->where("deleted", 0);

		return [
			"firstname" => "string|required",
			"lastname" => "string|required",
			"username" => [
				"required",
				"string",
				$user_rule->ignore($this->user)
			],
			"email" => [
				"required",
				"string",
				$user_rule->ignore($this->user)
			],
		];
	}
}
