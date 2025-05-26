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
        Schema::create('carbon_copies', function (Blueprint $table) {
            $table->id();
			$table->morphs('model');
			$table->string('email');

			$table->integer('user_id')->nullable();

			$table->unsignedInteger('emp_id')->nullable();

			$table->enum('type', ['default', 'blind'])->default('default');
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
        Schema::dropIfExists('carbon_copies');
    }
};
