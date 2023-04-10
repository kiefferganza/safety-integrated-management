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
        Schema::table('tbl_inspection_reports', function (Blueprint $table) {
					$table->unsignedBigInteger("inspection_id")->change();
        });

        Schema::table('tbl_inspection_reports_list', function (Blueprint $table) {
					$table->dropForeign("tbl_inspection_reports_list_inspection_id_foreign");
					$table->unsignedBigInteger("list_id")->change();
					$table->unsignedBigInteger('inspection_id')->index()->nullable()->change();
					$table->foreign('inspection_id')->references('inspection_id')->on('tbl_inspection_reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_inspection_reports_list', function (Blueprint $table) {
            //
        });
    }
};
