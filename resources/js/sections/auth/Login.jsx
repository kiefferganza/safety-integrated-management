// @mui
import { Link } from '@inertiajs/inertia-react';
import { Stack, Typography, Link as MuiLink, Box } from '@mui/material';
import Image from '@/Components/image';
// layouts
import LoginLayout from '@/Layouts/login/LoginLayout';
//
import AuthLoginForm from './AuthLoginForm';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login () {

	return (
		<LoginLayout>
			<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
				<Image
					disabledEffect
					visibleByDefault
					alt="Fiafi"
					src={'/storage/assets/Fiafi-logo.png'}
					sx={{ maxWidth: 140, "& img": { height: "auto" } }}
				/>
			</Box>
			<Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
				<Typography variant="h4">Sign in to IMS</Typography>

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
