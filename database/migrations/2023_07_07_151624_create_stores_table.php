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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
			$table->integer('user_id');
			$table->foreign('user_id')->references('user_id')->on('users');
			$table->integer('employee_id')->unsigned();
			$table->foreign('employee_id')->references('employee_id')->on('tbl_employees');
			$table->integer('subscriber_id');
			$table->string('slug')->unique('slug');
			$table->string('name')->unique();
			$table->text('description')->nullable();
			$table->decimal('price')->default(0);
			$table->string('currency', 16);
			$table->enum('unit', ['Box', 'Meter', 'Pcs.', 'Kgs', 'Grams'])->default('Pcs.');
			$table->integer('qty')->default(0);
			$table->integer('min_qty')->default(0);
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
        Schema::dropIfExists('stores');
    }
};
