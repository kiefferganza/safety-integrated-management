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
        Schema::create('store_report_lists', function (Blueprint $table) {
            $table->id();
			$table->foreignId('store_report_id')->index()->constrained('store_reports')->onDelete('cascade');
			$table->string('name');
			$table->text("thumbnail")->nullable();
			$table->integer('qty');
			$table->integer('level');
			$table->decimal('price');
			$table->string('currency');
			$table->string('unit');
			$table->integer('order');
			$table->integer('total_add_qty');
			$table->integer('total_remove_qty');
			$table->string('old_status');
			$table->string('new_status');
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
        Schema::dropIfExists('store_report_lists');
    }
};
