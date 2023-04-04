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
		Schema::table('tbl_employees', function (Blueprint $table) {
			$table->string("raw_position")->nullable();
			$table->string("raw_department")->nullable();
			$table->string("raw_company")->nullable();
			$table->index("sub_id");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('tbl_employees', function (Blueprint $table) {
				//
		});
	}
};
