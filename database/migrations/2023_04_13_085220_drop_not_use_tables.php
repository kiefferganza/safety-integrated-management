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
		Schema::dropIfExists('tbl_body_parts_injured');
		Schema::dropIfExists('tbl_body_parts');
		Schema::dropIfExists('tbl_indicators');
		Schema::dropIfExists('tbl_severity');
		Schema::dropIfExists('tbl_root_causes');
		Schema::dropIfExists('tbl_nature');
		Schema::dropIfExists('tbl_mechanisms');
		Schema::dropIfExists('tbl_incident');
		Schema::dropIfExists('tbl_first_aid');
		Schema::dropIfExists('tbl_fa_equipment');
		Schema::dropIfExists('tbl_equipment');
		Schema::dropIfExists('tbl_email');
		Schema::dropIfExists('tbl_modules');
		Schema::dropIfExists('tbl_custom_layout');
		Schema::dropIfExists('tbl_attendanc_atterndances');
		Schema::dropIfExists('tbl_attendance');
		Schema::dropIfExists('tbl_admin');
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}
};
