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
			Schema::table('inventory_reports', function (Blueprint $table) {
				$table->uuid('uuid')->unique();
				$table->string("status")->default("for_review");
				$table->string("reviewer_status")->nullable();
				$table->string("reviewer_remarks")->nullable();
				$table->string("approval_status")->default("pending")->nullable();
				$table->string("approval_remarks")->nullable();
			});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
			Schema::table('inventory_reports', function (Blueprint $table) {
					//
			});
    }
};
