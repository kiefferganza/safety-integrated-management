
// @mui
import { Link as MuiLink, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '@/routes/paths';
// components
import Iconify from '@/Components/iconify';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
// assets
import { PasswordIcon } from '../../assets/icons';
import { Head, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function ResetPasswordPage () {
	return (
		<>
			<Head>
				<title> Reset Password | Minimal UI</title>
			</Head>

			<PasswordIcon sx={{ mb: 5, height: 96 }} />

			<Typography variant="h3" paragraph>
				Forgot your password?
			</Typography>

			<Typography sx={{ color: 'text.secondary', mb: 5 }}>
				Please enter the email address associated with your account and We will email you a link to
				reset your password.
			</Typography>

			<AuthResetPasswordForm />

			<MuiLink
				href={PATH_AUTH.login}
				component={Link} preserveScroll
				color="inherit"
				variant="subtitle2"
				sx={{
					mt: 3,
					mx: 'auto',
					alignItems: 'center',
					display: 'inline-flex',
				}}
			>
				<Iconify icon="eva:chevron-left-fill" width={16} />
				Return to sign in
			</MuiLink>
		</>
	);
}
