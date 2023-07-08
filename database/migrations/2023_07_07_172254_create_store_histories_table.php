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
        Schema::create('store_histories', function (Blueprint $table) {
            $table->id();
			$table->foreignId('store_id')->references('id')->on('stores')->cascadeOnDelete();
			$table->enum('type', ['add', 'remove']);
			$table->unsignedInteger('qty');
			$table->unsignedInteger('prev_qty');
			$table->unsignedInteger('requested_by')->nullable();
			$table->foreign('requested_by')->references('employee_id')->on('tbl_employees');
			$table->string('location')->nullable();
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
        Schema::dropIfExists('store_histories');
    }
};
