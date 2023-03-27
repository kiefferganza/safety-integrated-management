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
        Schema::create('inventory_report_lists', function (Blueprint $table) {
            $table->id();
						$table->foreignId('inventory_report_id')->index()->constrained('inventory_reports')->onDelete('cascade');
						$table->unsignedBigInteger('inventory_id');
						$table->string('item');
						$table->string('img_src');
						$table->bigInteger('qty');
						$table->bigInteger('level');
						$table->bigInteger('price');
						$table->string('currency');
						$table->string('try');
						$table->bigInteger('inbound_total_qty');
						$table->bigInteger('outbound_total_qty');
						$table->bigInteger('max_order');
						$table->bigInteger('min_order');
						$table->string('status');
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
        Schema::dropIfExists('inventory_report_lists');
    }
};
