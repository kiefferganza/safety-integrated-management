<?php

namespace App\Notifications;

use App\Enums\CommentTypeEnums;
use App\Models\Training;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class NewTrainingCommentNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Training $training, public CommentTypeEnums $type)
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
		$training = $this->training;
		$type = $this->type;
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
		$form_number = sprintf("%s-%s-%s-%s", $training->project_code, $training->originator, $training->discipline, $training->document_type);
		if($training->document_zone) {
			$form_number .= "-".$training->document_zone;
		}
		if($training->document_level) {
			$form_number .= "-".$training->document_level;
		}
		$form_number .= "-".$training->sequence_no;

		$messageAndTitleAndRoute = match ($type) {
			CommentTypeEnums::COMMENTED => [
				'message' => 'New Comment CMS: '. strtoupper($form_number),
				'title' => 'has posted a new comment',
				'routeName' => 'training.management.external.external_action',
			],
			CommentTypeEnums::REPLIED => [
				'message' => 'New Reply CMS: '. strtoupper($form_number),
				'title' => 'has replied to your comment',
				'routeName' => 'training.management.external.external_review',
			],
		};
		
        return [
			'params' => $training->training_id,
			'category' => 'Training',
			'creator' => [
				'user_id' => $user->user_id,
				'name' => $userName,
				'profile' => $profile
			],
			...$messageAndTitleAndRoute
        ];
    }
}
