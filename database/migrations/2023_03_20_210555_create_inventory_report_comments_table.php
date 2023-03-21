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
        Schema::create('inventory_report_comments', function (Blueprint $table) {
            $table->id();
						$table->foreignId("inventory_report_id")->index()->constrained("inventory_reports")->onDelete("cascade");
						$table->unsignedBigInteger("reviewer_id");
						$table->string("comment")->nullable();
						$table->string("comment_page_section")->nullable();
						$table->string("comment_code")->nullable();
						$table->string("reply")->nullable();
						$table->string("reply_code")->nullable();
						$table->string("status")->default("open");
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
        Schema::dropIfExists('inventory_report_comments');
    }
};
