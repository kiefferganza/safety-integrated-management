// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link as MuiLink, Typography } from '@mui/material';
// components
import { CustomAvatar } from '@/Components/custom-avatar';
import { Link, usePage } from '@inertiajs/inertia-react';
import { getCurrentUserName } from '@/utils/formatName';

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
	console.log(user);
	return (
		<MuiLink href="/dashboard/user/account" component={Link} preserveScroll underline="none" color="inherit">
			<StyledRoot>
				<CustomAvatar src={`/storage/media/photos/employee/${(user?.employee.img_src || user?.profile_pic)}`} alt={getCurrentUserName(user)} />

				<Box sx={{ ml: 2, minWidth: 0 }}>
					<Typography variant="subtitle2" noWrap>
						{getCurrentUserName(user)}
					</Typography>

					<Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
						{user?.employee?.position || user?.position || ""}
					</Typography>
				</Box>
			</StyledRoot>
		</MuiLink>
	);
}
