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
        Schema::create('store_report_comments', function (Blueprint $table) {
            $table->id();
			$table->integer("store_report_id");
			$table->unsignedInteger('reviewer_id');
			$table->string("comment")->nullable();
			$table->text("comment_page_section")->nullable();
			$table->tinyInteger("comment_code")->nullable();
			$table->string("reply")->nullable();
			$table->string("reply_code")->nullable();
			$table->enum('unit', ['open', 'closed'])->default('open');
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
        Schema::dropIfExists('store_report_comments');
    }
};
