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
				Schema::disableForeignKeyConstraints();
        Schema::table('tbl_inspection_reports_list', function (Blueprint $table) {
            $table->foreign('inspection_id')->references('inspection_id')->on('tbl_inspection_reports')->cascadeOnDelete();
        });
				Schema::enableForeignKeyConstraints();
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
