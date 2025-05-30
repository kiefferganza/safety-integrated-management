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
		Schema::create('training_external_comment', function (Blueprint $table) {
			$table->id();
			$table->integer("training_id");
			$table->integer("reviewer_id")->unsigned();
			$table->text("comment")->nullable();
			$table->text("comment_page_section")->nullable();
			$table->tinyInteger("comment_code")->nullable();
			$table->text("reply")->nullable();
			$table->string("reply_code")->nullable();
			$table->string("status")->default("open");
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
		Schema::dropIfExists('training_external_comment');
	}
};