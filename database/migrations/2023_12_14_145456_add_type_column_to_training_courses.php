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
        Schema::table('training_courses', function (Blueprint $table) {
            $table->string("type")->nullable()->after("course_name");
            $table->year("last_used")->nullable()->after("sub_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('training_courses', function (Blueprint $table) {
            $table->dropColumn("type");
            $table->dropColumn("last_used");
        });
    }
};
