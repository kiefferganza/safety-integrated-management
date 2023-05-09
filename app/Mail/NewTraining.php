<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewTraining extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $subject = 'New Training Available';
    public $training;

    /**
     * Create a new message instance.
     *
     * @param  string  $training
     * @return void
     */
    public function __construct($training)
    {
        $this->training = $training;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.training.new-training');
    }
}