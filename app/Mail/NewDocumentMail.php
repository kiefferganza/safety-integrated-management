<?php

namespace App\Mail;

use App\Models\Document;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Markdown;

class NewDocumentMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

	public string $company;
	public string $logo;
	public string $url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(public Document $document, public array $data, public string $folder_name = "", public string|null $date = null) {
		$this->company = "Fiafi Group";
		$this->logo = '/assets/logo.png';
		$this->url = route('files.management.show', [
			'folder' => $document->folder_id,
			'document' => $document->form_number,
		]);
	}


    public function renderEmailContent(): string
    {
        // Render the email content
        $emailContent = $this->render();

        // Use DOMDocument to extract the content of the <table> tag
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true); // Suppress HTML parsing errors
        $dom->loadHTML($emailContent);
        libxml_use_internal_errors(false);

        $table = $dom->getElementsByTagName('table')->item(0); // Assuming the first table
        $tableContent = $dom->saveHTML($table);
        return Markdown::parse($tableContent)->__toString();
    }

	/**
     * Build the message.
     *
     * @return $this
	*/
    public function build()
    {
		return $this->markdown('emails.document.new-document');
    }
}
