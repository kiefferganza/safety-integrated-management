<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbl_employees', function (Blueprint $table) {
            $table->id('employee_id'); // Primary Key
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->unsignedBigInteger('position')->nullable();
            $table->unsignedBigInteger('department')->nullable();
            $table->unsignedBigInteger('nationality')->nullable();
            $table->unsignedBigInteger('company')->nullable();

            // If these are timestamps:
            $table->timestamp('date_created')->nullable();
            $table->timestamp('date_updated')->nullable();

            // If you want to enable automatic timestamps later:
            // $table->timestamps();

            // Foreign key constraints (optional, adjust as needed)
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            // $table->foreign('position')->references('position_id')->on('positions')->onDelete('set null');
            // $table->foreign('department')->references('department_id')->on('departments')->onDelete('set null');
            // $table->foreign('nationality')->references('id')->on('nationalities')->onDelete('set null');
            // $table->foreign('company')->references('company_id')->on('company_models')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_employees');
    }
};
