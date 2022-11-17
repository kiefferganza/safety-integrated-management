<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolboxTalkParticipant extends Model
{
    use HasFactory;

		protected $table = 'tbl_toolbox_talks_participants';

    protected $primaryKey = 'tbtp_id ';
}
