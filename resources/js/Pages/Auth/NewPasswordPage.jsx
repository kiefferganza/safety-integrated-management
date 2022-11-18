// @mui
import { Link as MuiLink, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '@/routes/paths';
// components
import Iconify from '@/Components/iconify';
// sections
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
// assets
import { SentIcon } from '../../assets/icons';
import { Head, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function NewPasswordPage () {
	return (
		<>
			<Head>
				<title> New Password</title>
			</Head>

			<SentIcon sx={{ mb: 5, height: 96 }} />

			<Typography variant="h3" paragraph>
				Request sent successfully!
			</Typography>

			<Typography sx={{ color: 'text.secondary', mb: 5 }}>
				We've sent a 6-digit confirmation email to your email.
				<br />
				Please enter the code in below box to verify your email.
			</Typography>

			<AuthNewPasswordForm />

			<Typography variant="body2" sx={{ my: 3 }}>
				Don’t have a code? &nbsp;
				<Link variant="subtitle2">Resend code</Link>
			</Typography>

			<MuiLink
				href={PATH_AUTH.login}
				component={Link} preserveScroll
				color="inherit"
				variant="subtitle2"
				sx={{
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
