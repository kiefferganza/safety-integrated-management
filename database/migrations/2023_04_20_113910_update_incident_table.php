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
			Schema::drop('incident_types');

			Schema::create('incident_types', function (Blueprint $table) {
				$table->id();
				$table->string("name")->index();
				$table->string("type")->default("incident");
				$table->string("description")->nullable();
				$table->timestamps();
				$table->softDeletes();
			});

			Schema::create('incident_details', function (Blueprint $table) {
				$table->id();
				$table->foreignId('incident_id')->index()->constrained('incidents')->onDelete('cascade');
				$table->string("dr_name")->nullable();
				$table->string("dr_phone")->nullable();
				$table->string("workday")->nullable();
				$table->string("unsafe_workplace")->nullable();
				$table->text("unsafe_workplace_reason")->nullable();
				$table->text("unsafe_workplace_other")->nullable();
				$table->string("unsafe_act")->nullable();
				$table->text("unsafe_act_reason")->nullable();
				$table->text("unsafe_act_other")->nullable();
				$table->text("prevention")->nullable();
				$table->text("witnesses")->nullable();
				$table->text("similar_incident")->default("No")->nullable();
				$table->text("step_by_step")->nullable();
			});

      Schema::table('incidents', function (Blueprint $table) {
				$table->dropColumn("site");
				$table->dropColumn("findings");
				$table->dropColumn("first_aid");
				$table->dropColumn("first_aider_id");
				$table->dropColumn("engineer_id");
				$table->dropColumn("lti");

				$table->unsignedBigInteger("supervisor_id");
				$table->dateTime("incident_date")->change();
				$table->integer("day_loss")->default(0)->nullable();
				$table->text("root_cause_other")->nullable();
				$table->text("mechanism_other")->nullable();
				$table->text("nature_other")->nullable();
			});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
