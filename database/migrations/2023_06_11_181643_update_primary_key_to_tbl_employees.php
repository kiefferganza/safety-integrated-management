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
		// Schema::table('training_external_comment', function (Blueprint $table) {
		// 	$table->unsignedInteger("reviewer_id")->change();
        //     $table->dropForeign("training_external_comment_reviewer_id_foreign");
        // });
        // Schema::table('tbl_employees', function (Blueprint $table) {
        //     $table->increments("employee_id")->change();
        // });
		// Schema::table('training_external_comment', function (Blueprint $table) {
		// 	$table->foreign('reviewer_id')->references('employee_id')->on('tbl_employees')->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('tbl_employees', function (Blueprint $table) {
        //     //
        // });
    }
};