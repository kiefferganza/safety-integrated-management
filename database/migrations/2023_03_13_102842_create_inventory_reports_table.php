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
        Schema::create('inventory_reports', function (Blueprint $table) {
            $table->id();
						$table->unsignedBigInteger('submitted_id');
						$table->unsignedBigInteger('reviewer_id');
						$table->unsignedBigInteger('approval_id');
						$table->string('project_code');
						$table->string('originator');
						$table->string('discipline');
						$table->string('document_type');
						$table->string('document_zone')->nullable();
						$table->string('document_level')->nullable();
						$table->string('sequence_no');
						$table->integer('revision_no')->default(0);
						$table->string('contract_no');
						$table->string('location');
						$table->string('conducted_by');
						$table->date('inventory_date');
						$table->date('forecast_start_date');
						$table->date('forecast_end_date');
						$table->date('submitted_date');
						$table->text('remarks');
						$table->softDeletes();
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
        Schema::dropIfExists('inventory_reports');
    }
};
