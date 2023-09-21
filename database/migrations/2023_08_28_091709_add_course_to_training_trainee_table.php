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
        Schema::table('tbl_toolbox_talks_participants', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable()->references('id')->on('training_courses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_toolbox_talks_participants', function (Blueprint $table) {
            //
        });
    }
};
