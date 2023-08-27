<?php

namespace App\Listeners;

use App\Enums\TrainingTypeNotificationEnums;
use App\Events\NewTrainingEvent;
use App\Models\Employee;
use App\Models\Training;
use App\Models\User;
use App\Notifications\NewTrainingNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewTrainingListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\NewTrainingEvent  $event
     * @return void
     */
    public function handle(NewTrainingEvent $event)
    {
		/** @var Training $training */
		$training = $event->training;
		
		foreach ($training->trainees as $trainee) {
			/** @var Employee $trainee */
			$userTrainee = $trainee->user()->first();
			if($userTrainee) {
				$userTrainee?->notify(new NewTrainingNotification($training, TrainingTypeNotificationEnums::PARTICIPANT));
			}
		}

		if($training->type === 3) {
			$approver = $training->external_details->approved_by;
			$reviewer = $training->external_details->reviewed_by;
			if($approver) {
				$approverUser = User::where('emp_id', $approver)->first();
				$approverUser?->notify(new NewTrainingNotification($training, TrainingTypeNotificationEnums::APPROVER));
			}
			if($reviewer) {
				$reviewerUser = User::where('emp_id', $reviewer)->first();
				$reviewerUser?->notify(new NewTrainingNotification($training, TrainingTypeNotificationEnums::REVIEWER));
			}
		}
    }
}
