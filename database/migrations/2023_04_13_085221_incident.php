<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('incident_types', function (Blueprint $table) {
			$table->id();
			$table->string("name")->index();
			$table->string("type")->default("incident");
			$table->string("description")->nullable();
			$table->timestamps();
			$table->softDeletes();
		});

		Schema::create('incidents', function (Blueprint $table) {
			$table->id();
			$table->uuid('uuid')->unique();
			$table->string("form_number");
			$table->string("sequence_no");
			$table->string("project_code");
			$table->string("originator");
			$table->string("discipline");
			$table->string("document_type");
			$table->string("document_zone")->nullable();
			$table->string("document_level")->nullable();
			$table->unsignedBigInteger("employee_id");
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("first_aider_id");
			$table->unsignedBigInteger("injured_id");
			$table->unsignedBigInteger("engineer_id");
			$table->string("location");
			$table->string("site");
			$table->string("incident");
			$table->string("nature");
			$table->string("indicator");
			$table->string("mechanism");
			$table->string("severity");
			$table->string("root_cause");
			$table->string("equipment");
			$table->string("body_part");
			$table->integer("lti")->nullable();
			$table->text("first_aid")->nullable();
			$table->text("findings")->nullable();
			$table->text("remarks")->nullable();
			$table->integer("revision_no")->default(0);
			$table->date("incident_date")->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		
	}
};
