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
        // Schema::table('tbl_documents', function (Blueprint $table) {
		// 	$table->text("form_number")->nullable()->default(null);
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_documents', function (Blueprint $table) {
            $table->dropForeign("folder_id");
        });
    }
};