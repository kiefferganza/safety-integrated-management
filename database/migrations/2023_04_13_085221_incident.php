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
			$table->string("sequence_no");
			$table->string("project_code");
			$table->string("originator");
			$table->string("discipline");
			$table->string("document_type");
			$table->string("document_zone")->nullable();
			$table->string("document_level")->nullable();
			$table->string("first_aider_id");
			$table->string("injured_id");
			$table->string("engineer_id");
			$table->string("location");
			$table->string("site");
			$table->string("incident");
			$table->string("nature");
			$table->string("indicator");
			$table->string("mechanisms");
			$table->string("severity");
			$table->string("root_cause");
			$table->string("equipment_involved");
			$table->string("body_part");
			$table->integer("lti")->nullable();
			$table->text("first_aid")->nullable();
			$table->text("findings")->nullable();
			$table->text("remarks")->nullable();
			$table->string("revision_no");
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
