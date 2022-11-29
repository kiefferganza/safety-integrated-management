import CompactLayout from '@/Layouts/compact/CompactLayout';
// @mui
import { Link as MuiLink, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '@/routes/paths';
// components
import Iconify from '@/Components/iconify';
import Image from '@/Components/image';
// sections
import AuthResetPasswordForm from '@/sections/auth/AuthResetPasswordForm';
// assets
import { PasswordIcon } from '@/assets/icons';
import { Head, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function ResetPasswordPage () {
	return (
		<CompactLayout>
			<Head>
				<title> Reset Password | Minimal UI</title>
			</Head>

			{/* <PasswordIcon sx={{ mb: 5, height: 96 }} /> */}
			<Image
				disabledEffect
				visibleByDefault
				alt="Fiafi"
				src={'/storage/assets/Fiafi-logo.png'}
				sx={{ maxWidth: 180, "& img": { height: "auto" }, margin: "auto", mb: 5 }}
			/>

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
				component={Link}
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
		</CompactLayout>
	);
}
