<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class ModuleBasicNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public string $title, public string $message, public string $category, public string $routeName, public null|array|int $params, public User $creator)
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
    public function toArray()
    {
        $creator = $this->creator;

		if(!trim($creator->firstname)) {
			$name = $creator->employee->fullname;
		}else {
			$name = $creator->firstname . ' ' . $creator->lastname;
		}

		$profile = $creator->getFirstMedia("profile", ["primary" => true]);
		if($profile) {
			$path = "user/" . md5($profile->id . config('app.key')). "/" .$profile->file_name;
			$profile = [
				"url" => URL::route("image", [ "path" => $path ]),
				"thumbnail" => URL::route("image", [ "path" => $path, "w" => 40, "h" => 40, "fit" => "crop" ]),
				"small" => URL::route("image", [ "path" => $path, "w" => 128, "h" => 128, "fit" => "crop" ])
			];
		}
		
        return [
			'params' => $this->params,
			'title' => $this->title,
			'category' => $this->category,
			'message' => $this->message,
			'routeName' => $this->routeName,
			'creator' => [
				'user_id' => $creator->user_id,
				'name' => $name,
				'profile' => $profile
			],
        ];
    }
}
