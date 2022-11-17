// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link as MuiLink, Typography } from '@mui/material';
// components
import { CustomAvatar } from '@/components/custom-avatar';
import { Link, usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2, 2.5),
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount () {
	const { auth: { user } } = usePage().props;

	return (
		<MuiLink href="/user/account" component={Link} underline="none" color="inherit">
			<StyledRoot>
				<CustomAvatar src={`/storage/media/photos/employee/${(user?.employee.img_src || user?.profile_pic)}`} alt={`${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`} />

				<Box sx={{ ml: 2, minWidth: 0 }}>
					<Typography variant="subtitle2" noWrap>
						{`${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`}
					</Typography>

					<Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
						{user?.employee?.position?.position}
					</Typography>
				</Box>
			</StyledRoot>
		</MuiLink>
	);
}
