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
        Schema::create('tbt_tracker_employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("tracker");
            $table->foreign("tracker")->references("id")->on("tbt_trackers")->cascadeOnDelete();
            $table->unsignedInteger('emp_id');
			$table->foreign('emp_id')->references('employee_id')->on('tbl_employees');
            $table->string("witness");
            $table->string("location");
            $table->string("exact_location");
            $table->enum("tbt_type", ["1", "2", "3", "4", "5"]);
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
        Schema::dropIfExists('tbt_tracker_employees');
    }
};
