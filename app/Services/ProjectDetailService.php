<?php

namespace App\Services;

use App\Models\DocumentProjectDetail;
use App\Models\User;

class ProjectDetailService {


  public static function getProjectDetails(User $user) {
    return DocumentProjectDetail::where('sub_id', $user->subscriber_id)->get()->groupBy('title');
  }

}