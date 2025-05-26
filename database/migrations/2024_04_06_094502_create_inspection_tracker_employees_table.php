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
            $table->unsignedInteger('emp_id');
            $table->unsignedInteger('verifier_id');
            $table->unsignedInteger('action_id');
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
