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
        Schema::create('mails', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_id');

			$table->integer('user_id')->nullable();
			$table->foreign('user_id')->references('user_id')->on('users');

			$table->string('from')->nullable();
			$table->text('to')->nullable();
			$table->string('subject')->nullable();
			$table->longText('content')->nullable();
			$table->json('properties')->nullable();
			$table->enum('status', ['drafted', 'sent', 'trashed', 'spam'])->default('drafted');
			$table->enum('type', ['default', 'notification', 'promotion'])->default('default');
			$table->boolean('is_read')->default(false);
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
        Schema::dropIfExists('mails');
    }
};
