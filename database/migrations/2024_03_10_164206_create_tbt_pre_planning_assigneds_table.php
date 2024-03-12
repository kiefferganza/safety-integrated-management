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
        Schema::create('tbt_pre_planning_assigneds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("preplanning");
            $table->foreign("preplanning")->references("id")->on("tbt_pre_plannings");
            $table->unsignedInteger('emp_id');
			$table->foreign('emp_id')->references('employee_id')->on('tbl_employees');
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
        Schema::dropIfExists('tbt_pre_planning_assigneds');
    }
};
