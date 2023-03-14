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
        Schema::create('tbt_statistic_months', function (Blueprint $table) {
            $table->id();
						$table->foreignId('tbt_statistic_id')->constrained('tbt_statistics')->onDelete('cascade');
						$table->smallInteger('month_code');
						$table->string('month');
						$table->float('manpower');
						$table->float('manhours');
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
        Schema::dropIfExists('tbt_statistic_months');
    }
};
