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
        Schema::table('training_external_status', function (Blueprint $table) {
			// $table->string('status', 16)->default('for_review');
			$table->string('review_status')->nullable()->default(null)->change();
			$table->string('approval_status')->nullable()->default('pending')->change();
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
