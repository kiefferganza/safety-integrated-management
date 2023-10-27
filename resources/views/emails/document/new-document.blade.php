@component('mail::message')
<div style="text-align: center; margin-bottom: 8px;">
    <img src="{{ URL::route('image', ['path' => 'assets/company/logo.png', 'w' => 40, 'h' => 40, 'fit' => 'contain']) }}" alt="{{ $company }} Logo" />
</div>
<h1 style="text-align: center;">New Notification from {{ $company }}</h1>

@component('mail::subcopy')
@endcomponent


A new document, *"{{ trim($document->title) }}"*, created by {{ $document->employee->fullname }}{{ $folder_name ? ", has been submitted to the " . $folder_name : ""}}.

**Details:**
@if($folder_name)
- **Folder Name**: {{ $folder_name }}
@endif
- **Document Title**: {{ $document->title }}
- **Form Number**: {{ $document->form_number }}
- **Submitted By**: {{ $document->employee->fullname }}
@if($date)
- **Date Uploaded**: {{ $date }}
@endif

@if(count($data) > 0)
	@component('mail::table')
	|     Name      |    Position   | Type |
	|:------------- |:------------- |:-------- |
	@foreach ($data as $user)
	| {{ $user['name'] }}      | {{ $user['position'] }}      | {{ $user['type'] }}      |
	@endforeach
	@endcomponent
@endif

@component('mail::button', ['url' => $url, 'target' => '_blank'])
View Document
@endcomponent


Thanks,<br>
The Safety Team


@component('mail::subcopy')
If you're having trouble clicking the "View Document" button, copy and paste the URL below into your web browser: [{{config('app.url')}}]({{config('app.url')}})
@endcomponent

@endcomponent