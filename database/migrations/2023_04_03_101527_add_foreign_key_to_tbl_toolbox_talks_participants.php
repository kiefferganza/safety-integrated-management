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
			Schema::table('tbl_toolbox_talks_participants', function (Blueprint $table) {
				$table->foreign('tbt_id')->references('tbt_id')->on('tbl_toolbox_talks')->cascadeOnDelete();
				$table->index(['employee_id', 'tbt_id']);
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
        Schema::table('tbl_toolbox_talks_participants', function (Blueprint $table) {
            //
        });
    }
};
