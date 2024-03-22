<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as FacadesLog;

class Log extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tables = DB::select(DB::raw("SELECT tb1.CONSTRAINT_NAME, tb1.TABLE_NAME, tb1.COLUMN_NAME, tb1.REFERENCED_TABLE_NAME, tb1.REFERENCED_COLUMN_NAME, tb2.UPDATE_RULE, tb2.DELETE_RULE FROM INFORMATION_SCHEMA.`KEY_COLUMN_USAGE` AS tb1 INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS tb2 ON tb1.CONSTRAINT_NAME = tb2.CONSTRAINT_NAME WHERE TABLE_SCHEMA = 'sim' AND tb1.REFERENCED_COLUMN_NAME IS NOT NULL ORDER BY tb1.REFERENCED_TABLE_NAME"));

        foreach ($tables as $table) {
            FacadesLog::info("TABLE: {$table->TABLE_NAME}, CONSTRAINT_NAME: {$table->CONSTRAINT_NAME}, COLUMN_NAME: {$table->COLUMN_NAME}, REFERENCED_TABLE_NAME: {$table->REFERENCED_TABLE_NAME}, REFERENCED_COLUMN_NAME: {$table->REFERENCED_COLUMN_NAME}, UPDATE_RULE: {$table->UPDATE_RULE}, DELETE_RULE: {$table->DELETE_RULE}");
        }
    }
}
