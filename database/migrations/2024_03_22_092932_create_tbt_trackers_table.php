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
        Schema::create('tbt_trackers', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('created_by');
			$table->foreign('created_by')->references('id')->on('users');
            $table->unsignedInteger('emp_id');
            $table->foreign('emp_id')->references('employee_id')->on('tbl_employees');
            $table->string("project_code");
            $table->string("originator");
            $table->string("discipline");
            $table->string("document_type");
            $table->string("sequence_no");
            $table->date("date_assigned");
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
        Schema::dropIfExists('tbt_trackers');
    }
};
