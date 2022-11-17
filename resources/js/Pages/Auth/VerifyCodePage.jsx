// @mui
import { Link as MuiLink, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '@/routes/paths';
// components
import Iconify from '@/Components/iconify';
// sections
import AuthVerifyCodeForm from '../../sections/auth/AuthVerifyCodeForm';
// assets
import { EmailInboxIcon } from '../../assets/icons';
import { Head, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function VerifyCodePage () {
	return (
		<>
			<Head>
				<title> Verify Code</title>
			</Head>

			<EmailInboxIcon sx={{ mb: 5, height: 96 }} />

			<Typography variant="h3" paragraph>
				Please check your email!
			</Typography>

			<Typography sx={{ color: 'text.secondary', mb: 5 }}>
				We have emailed a 6-digit confirmation code to acb@domain, please enter the code in below
				box to verify your email.
			</Typography>

			<AuthVerifyCodeForm />

			<Typography variant="body2" sx={{ my: 3 }}>
				Don’t have a code? &nbsp;
				<Link variant="subtitle2">Resend code</Link>
			</Typography>

			<MuiLink
				to={PATH_AUTH.login}
				component={Link}
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
