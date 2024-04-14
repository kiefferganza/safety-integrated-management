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
        Schema::create('inspection_tracker_employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("tracker");
            $table->foreign("tracker")->references("id")->on("inspection_trackers")->cascadeOnDelete();
            $table->unsignedInteger('emp_id');
			$table->foreign('emp_id')->references('employee_id')->on('tbl_employees');
            $table->unsignedInteger('verifier_id');
            $table->foreign("verifier_id")->references('employee_id')->on('tbl_employees');
            $table->unsignedInteger('action_id');
            $table->foreign("action_id")->references('employee_id')->on('tbl_employees');
            $table->string("location");
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
        Schema::dropIfExists('inspection_tracker_employees');
    }
};
