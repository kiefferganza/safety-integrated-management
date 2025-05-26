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
        Schema::create('document_external_comments', function (Blueprint $table) {
            $table->id();
			$table->integer('document_id');
			$table->unsignedBigInteger('approver');
			$table->string("comment")->nullable();
			$table->text("comment_page_section")->nullable();
			$table->tinyInteger("comment_code")->nullable();
			$table->string("reply")->nullable();
			$table->string("reply_code")->nullable();
			$table->smallInteger("status")->default(0);
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
        Schema::dropIfExists('external_comments');
    }
};
