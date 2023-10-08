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
        Schema::create('document_project_details', function (Blueprint $table) {
            $table->id();
			$table->integer('sub_id');
			$table->enum('title', ['Project Code', 'Originator', 'Discipline', 'Type', 'Zone', 'Level']);
			$table->string('value');
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
        Schema::dropIfExists('document_project_details');
    }
};
