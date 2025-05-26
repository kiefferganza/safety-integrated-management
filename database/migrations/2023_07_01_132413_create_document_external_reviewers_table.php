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
        Schema::create('document_external_reviewers', function (Blueprint $table) {
            $table->id();
			$table->integer('document_id');
			$table->string('firstname')->nullable();
			$table->string('lastname')->nullable();
			$table->string('src')->nullable();
			$table->string('status')->default('0');
			$table->string('remarks')->nullable();
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
        Schema::dropIfExists('document_external_reviewers');
    }
};
