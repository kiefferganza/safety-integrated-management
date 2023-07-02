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
        Schema::create('shareable_links', function (Blueprint $table) {
            $table->id();
            $table->string('token')->unique();
			$table->string('url');
			$table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->unsignedBigInteger('sub_id');
			$table->json('custom_properties')->nullable();
            $table->timestamp('expiration_date');
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
        Schema::dropIfExists('shareable_links');
    }
};
