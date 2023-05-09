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
      Schema::create('training_cc', function (Blueprint $table) {
				$table->id();
				$table->integer('training_id');
				$table->foreign('training_id')->references('training_id')->on('tbl_trainings')->onDelete('cascade');
				$table->integer('employee_id')->unsigned();
				$table->foreign('employee_id')->references('employee_id')->on('tbl_employees')->onDelete('cascade');
				$table->timestamps();
			});

      Schema::create('training_custom_cc', function (Blueprint $table) {
				$table->id();
				$table->text('emails');
				$table->integer('training_id');
				$table->foreign('training_id')->references('training_id')->on('tbl_trainings')->onDelete('cascade');
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
      Schema::dropIfExists('training_cc');
      Schema::dropIfExists('training_custom_cc');
    }
};