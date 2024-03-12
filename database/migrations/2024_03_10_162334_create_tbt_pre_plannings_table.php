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
        Schema::create('tbt_pre_plannings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('created_by');
			$table->foreign('created_by')->references('employee_id')->on('tbl_employees');
            $table->date("date_issued");
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
        Schema::dropIfExists('tbt_pre_plannings');
    }
};
