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
		Schema::create('training_external_status', function (Blueprint $table) {
			$table->id();
			$table->integer("training_id");
			$table->foreign('training_id')->references('training_id')->on('tbl_trainings')->onDelete('cascade');
			$table->string("review_status")->default("pending");
			$table->string("approval_status")->default("in_review");
			$table->text("review_remark")->nullable();
			$table->text("approval_remark")->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('training_external_status');
	}
};