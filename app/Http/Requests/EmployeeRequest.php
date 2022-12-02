<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
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
		// dd($this->employee);
		return [
			"firstname" => "string|required",
			"lastname" => "string|required",
			"sex" => "string|required",
			"phone_no" => "required",
			"company" => "required",
			"company_type" => "string|required",
			"position" => "required",
			"department" => "required",
			"nationality" => "required",
			"birth_date" => "required",
			"email" => [
				"required",
				"email",
				Rule::unique('tbl_employees')->where("is_deleted", 0)->ignore($this->employee)
			]
		];
	}
}
