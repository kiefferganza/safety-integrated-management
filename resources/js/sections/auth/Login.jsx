// @mui
import { Link } from '@inertiajs/inertia-react';
import { Tooltip, Stack, Typography, Link as MuiLink, Box } from '@mui/material';
// hooks
// layouts
import LoginLayout from '../../layouts/login';
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

					<MuiLink component={Link} href="/register" variant="subtitle2">
						Create an account
					</MuiLink>
				</Stack>

				<Tooltip title="LEFT" placement="left">
					<Box
						component="img"
						src={`/storage/assets/icons/auth/ic_.png`}
						sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
					/>
				</Tooltip>
			</Stack>

			<AuthLoginForm />

			{/* <AuthWithSocial /> */}
		</LoginLayout>
	);
}
