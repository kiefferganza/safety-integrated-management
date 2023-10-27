@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
{{-- <img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo"> --}}
{{-- <span style="color: #00AB55">S</span>afety <span style="color: #00AB55">I</span>ntegrated <span style="color: #00AB55">M</span>anagement --}}
{{ $slot }}
</a>
</td>
</tr>
