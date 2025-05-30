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
			$table->integer('store_id');
			$table->enum('type', ['add', 'remove']);
			$table->unsignedInteger('qty');
			$table->unsignedInteger('prev_qty');
			$table->unsignedInteger('requested_by')->nullable();
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
