import { Link } from '@inertiajs/inertia-react';
// @mui
import { Stack, Typography, Link as MuiLink } from '@mui/material';
// layouts
import LoginLayout from '@/layout/login';
//
// import AuthWithSocial from './AuthWithSocial';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register () {
	return (
		<LoginLayout title="Manage the job more effectively with Minimal">
			<Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
				<Typography variant="h4">Get started absolutely free.</Typography>

				<Stack direction="row" spacing={0.5}>
					<Typography variant="body2"> Already have an account? </Typography>

					<MuiLink href="/login" component={Link} variant="subtitle2">
						Sign in
					</MuiLink>
				</Stack>
			</Stack>

			<AuthRegisterForm />

			<Typography
				component="div"
				sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
			>
				{'By signing up, I agree to '}
				<MuiLink underline="always" color="text.primary">
					Terms of Service
				</MuiLink>
				{' and '}
				<MuiLink underline="always" color="text.primary">
					Privacy Policy
				</MuiLink>
				.
			</Typography>

			{/* <AuthWithSocial /> */}
		</LoginLayout>
	);
}
