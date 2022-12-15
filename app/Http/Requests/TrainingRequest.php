<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrainingRequest extends FormRequest
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
		return [
			"sequence_no" => "string|required",
			"originator" => "string|required",
			"project_code" => "string|required",
			"discipline" => "string|required",
			"document_type" => "string|required",
			"title" => "string|required",
			"location" => "string|required",
			"contract_no" => "string|required",
			"trainer" => "string|required",
			"date_expired" => "string|required",
			"training_hrs" => "string|required",
			"type" => "string|required",
			"training_center" => "required_if:type,==,3",
			"reviewed_by" => "required_if:type,==,3",
			"approved_by" => "required_if:type,==,3",
			"currency" => "required_if:type,==,3",
			"course_price" => "required_if:type,==,3",
		];
	}
}
