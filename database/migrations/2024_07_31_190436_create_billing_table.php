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
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
			$table->foreign('user_id')->references('id')->on('users');
            $table->string("stripe_customer_id");
            $table->string("stripe_subscription_id");
            $table->string("name")->nullable();
            $table->string("email")->nullable();
            $table->integer("sub_id");
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
        Schema::dropIfExists('billings');
    }
};
