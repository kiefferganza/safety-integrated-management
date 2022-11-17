<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalk extends Model
{
    use HasFactory;

		protected $table = 'tbl_toolbox_talks';

    protected $primaryKey = 'tbt_id ';
}
