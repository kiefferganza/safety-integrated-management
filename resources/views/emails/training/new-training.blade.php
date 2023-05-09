@component('mail::message')
# New Training Available

Hello,

A new training course is now available on our Health, Safety, and Environment website:

{{ $training }}

Click the button below to go to the website and start the course now:

@component('mail::button', ['url' => 'https://example.com'])
Go to Website
@endcomponent

Thanks,
The HSE Team
@endcomponent
