<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function dropForiegnTables() {
        Schema::disableForeignKeyConstraints();
        /**
         * TABLE: carbon_copies,
         * CONSTRAINT_NAME: carbon_copies_user_id_foreign,
         */
        Schema::table("carbon_copies", function(Blueprint $table) {
            $table->dropForeign('carbon_copies_user_id_foreign');
            DB::select(DB::raw("DROP INDEX carbon_copies_user_id_foreign ON carbon_copies"));
        });

        /**
         * TABLE: stores,
         * CONSTRAINT_NAME: stores_user_id_foreign
         */
        Schema::table("stores", function(Blueprint $table) {
            $table->dropForeign('stores_user_id_foreign');
            DB::select(DB::raw("DROP INDEX stores_user_id_foreign ON stores"));
        });

        /**
         * TABLE: mails,
         * CONSTRAINT_NAME: mails_user_id_foreign
         */
        Schema::table("mails", function(Blueprint $table) {
            $table->dropForeign('mails_user_id_foreign');
            DB::select(DB::raw("DROP INDEX mails_user_id_foreign ON mails"));
        });

        /**
         * TABLE: tbl_employees,
         * CONSTRAINT_NAME: tbl_employees_user_id_foreign
         */
        Schema::table("tbl_employees", function(Blueprint $table) {
            $table->dropForeign('tbl_employees_user_id_foreign');
            DB::select(DB::raw("DROP INDEX tbl_employees_user_id_foreign ON tbl_employees"));
        });

        /**
         * TABLE: recipients,
         * CONSTRAINT_NAME: recipients_user_id_foreign
         */
        Schema::table("recipients", function(Blueprint $table) {
            $table->dropForeign('recipients_user_id_foreign');
            DB::select(DB::raw("DROP INDEX recipients_user_id_foreign ON recipients"));
        });
        Schema::enableForeignKeyConstraints();
    }


    public function setForeignTables() {
        Schema::table("carbon_copies", function(Blueprint $table) {
            $table->unsignedInteger("user_id")->change();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        
        Schema::table("stores", function(Blueprint $table) {
            $table->unsignedInteger("user_id")->change();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table("mails", function(Blueprint $table) {
            $table->unsignedInteger("user_id")->change();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        
        Schema::table("tbl_employees", function(Blueprint $table) {
            $table->unsignedInteger("user_id")->change();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table("recipients", function(Blueprint $table) {
            $table->unsignedInteger("user_id")->change();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // $this->dropForiegnTables();
        // Schema::table("users", function(Blueprint $table) {
        //     $table->renameColumn("user_id", "id");
        // });
        // Schema::table("users", function(Blueprint $table) {
        //     $table->unsignedInteger("id", true)->change();
        // });
        // $this->setForeignTables();
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
