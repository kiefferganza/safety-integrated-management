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
        Schema::create('inspection_trackers', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('created_by');
            $table->unsignedInteger('emp_id');
            $table->string("project_code");
            $table->string("originator");
            $table->string("discipline");
            $table->string("document_type");
            $table->string("sequence_no");
            $table->date("date_assigned");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inspection_trackers');
    }
};
