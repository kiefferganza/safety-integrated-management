// @mui
import { Link } from '@inertiajs/inertia-react';
import { Tooltip, Stack, Typography, Link as MuiLink, Box } from '@mui/material';
// hooks
// layouts
import LoginLayout from '@/Layouts/login/LoginLayout';
//
import AuthLoginForm from './AuthLoginForm';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login () {

	return (
		<LoginLayout>
			<Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
				<Typography variant="h4">Sign in to Minimal</Typography>

				<Stack direction="row" spacing={0.5}>
					<Typography variant="body2">New user?</Typography>

					<MuiLink component={Link} preserveScroll href="/register" variant="subtitle2">
						Create an account
					</MuiLink>
				</Stack>
			</Stack>

			<AuthLoginForm />

			{/* <AuthWithSocial /> */}
		</LoginLayout>
	);
}
