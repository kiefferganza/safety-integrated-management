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
        Schema::create('store_reports', function (Blueprint $table) {
			$table->id();
			$table->uuid('uuid')->unique();
			$table->unsignedInteger('submitted_id');

			$table->unsignedInteger('reviewer_id');
			
			$table->unsignedInteger('approver_id');

			$table->string('project_code');
			$table->string('originator');
			$table->string('discipline');
			$table->string('document_type');
			$table->string('document_zone')->nullable();
			$table->string('document_level')->nullable();
			$table->string('sequence_no');
			$table->text('form_number');
			$table->integer('revision_no')->default(0);
			$table->string('contract_no');
			$table->string('location');
			$table->string('conducted_by');
			$table->date('budget_forcast_date');
			$table->date('inventory_start_date');
			$table->date('inventory_end_date');
			$table->date('submitted_date');
			$table->text('remarks')->nullable();
			$table->integer('subscriber_id');
			$table->string("status")->default("for_review");
			$table->string("reviewer_status")->nullable();
			$table->string("reviewer_remarks")->nullable();
			$table->string("approver_status")->default("pending")->nullable();
			$table->string("approver_remarks")->nullable();
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
        Schema::dropIfExists('store_reports');
    }
};
