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
			// Schema::disableForeignKeyConstraints();
			// Schema::table('tbl_employees', function (Blueprint $table) {
			// 	$table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
			// });
			// Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
			Schema::table('tbl_employees', function (Blueprint $table) {
				//
			});
    }
};
