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
			// Schema::table('tbl_toolbox_talks', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("tbt_id", true)->change();
			// });

			// Schema::table('tbl_toolbox_talks_participants', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("tbtp_id", true)->change();
			// 	$table->unsignedBigInteger("tbt_id")->nullable()->change();
			// 	$table->foreign("tbt_id")->references('tbt_id')->on('tbl_toolbox_talks')->onDelete('cascade');
			// });

			// Schema::table('tbl_inspection_reports', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("inspection_id", true)->change();
			// });

			// Schema::table('tbl_inspection_reports_list', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("list_id", true)->change();
			// 	$table->unsignedBigInteger('inspection_id')->index()->nullable()->change();
			// 	$table->foreign('inspection_id')->references('inspection_id')->on('tbl_inspection_reports')->onDelete('cascade');
			// });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
			Schema::table('tbt_toolbox_talks', function (Blueprint $table) {
					//
			});
    }
};
