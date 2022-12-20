<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Safety-Integrated-Management') }}</title>

				<meta name="robots" content="noindex, nofollow">
				<meta property="og:title" content="Safety Integrated Management System">
				<meta property="og:site_name" content="Safety Integrated Management System">

				<!-- ICONS -->
				<link rel="shortcut icon" href="{{ asset('assets/logo.png') }}">
				<link rel="icon" sizes="192x192" type="image/png" href="{{ asset('assets/favicons/favicon.png') }}">
				<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('assets/favicons/apple-touch-icon-180x180.png') }}">

        <!-- Using Google Font -->
				<link rel="preconnect" href="https://fonts.gstatic.com">
				<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
				<script>window.global = window;</script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <div id="modal-root"></div>
    </body>
</html>
