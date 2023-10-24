<?php

namespace App\Notifications;

use App\Enums\TrainingTypeNotificationEnums;
use App\Models\Training;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class NewTrainingNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Training $training, public TrainingTypeNotificationEnums $type)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
		$user = auth()->user();
		$userName = $user->firstname . ' ' . $user->lastname;

		$profile = $user->getFirstMedia("profile", ["primary" => true]);
		if($profile) {
			$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
			$profile = [
				"url" => URL::route("image", [ "path" => $path ]),
				"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
				"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
			];
		}

		$training = $this->training;
		$form_number = sprintf("%s-%s-%s-%s", $training->project_code, $training->originator, $training->discipline, $training->document_type);
		if($training->document_zone) {
			$form_number .= "-".$training->document_zone;
		}
		if($training->document_level) {
			$form_number .= "-".$training->document_level;
		}
		$form_number .= "-" .$training->sequence_no;
		$moduleType = match ($training->type) {
			1 => [
				'name' => 'In House',
				'slug' => 'training.management.in_house.show'
			],
			2 => [
				'name' => 'Client',
				'slug' => 'training.management.client.show'
			],
			3 => [
				'name' => 'Third Party',
				'slug' => 'training.management.external.show'
			],
			4 => [
				'name' => 'Induction',
				'slug' => 'training.management.induction.show'
			],
			default => [
				'name' => 'Client',
				'slug' => 'training.management.client.show'
			]
		};

		$messageAndRoutes = match ($this->type) {
			TrainingTypeNotificationEnums::APPROVER => [
				'title' => 'added you as a approver',
				'routeName' => 'training.management.external.external_approve'
			],
			TrainingTypeNotificationEnums::REVIEWER => [
				'title' => 'added you as a reviewer',
				'routeName' => 'training.management.external.external_review'
			],
			TrainingTypeNotificationEnums::PARTICIPANT => [
				'title' => 'added you as a training participant',
				'routeName' => $moduleType['slug']
			],
			default => [
				'title' => 'None',
				'routeName' => null
			]
		};

        return [
			'params' => $training->training_id,
			'category' => 'Training - '. $moduleType['name'],
			'message' => '<p>CMS: <strong>'. strtoupper($form_number). '</strong></p>',
			'creator' => [
				'user_id' => $user->user_id,
				'name' => $userName,
				'profile' => $profile
			],
			...$messageAndRoutes
        ];
    }
}