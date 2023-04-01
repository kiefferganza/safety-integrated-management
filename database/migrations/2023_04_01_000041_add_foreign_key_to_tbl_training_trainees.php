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
			Schema::table('tbl_training_trainees', function (Blueprint $table) {
				$table->foreign('training_id')->references('training_id')->on('tbl_trainings')->cascadeOnDelete();
				$table->index('training_id');
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
        Schema::table('tbl_trainings_files', function (Blueprint $table) {
            //
        });
    }
};
