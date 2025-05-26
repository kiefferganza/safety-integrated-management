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
			// Schema::table('tbl_employees', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("employee_id")->change();
			// 	$table->index("employee_id");
			// });

			// Schema::create('tbl_toolbox_talks', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("tbt_id")->change();
			// });

			// Schema::create('tbl_toolbox_talks_participants', function (Blueprint $table) {
			// 	$table->unsignedBigInteger("tbtp_id")->change();
			// 	$table->unsignedBigInteger("tbt_id")->nullable()->change();
			// 	$table->foreign("tbt_id")->references('tbt_id')->on('tbl_toolbox_talks')->onDelete('cascade');
			// });
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
