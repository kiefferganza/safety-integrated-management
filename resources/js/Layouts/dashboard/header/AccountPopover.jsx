import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// components
import { CustomAvatar } from '@/components/custom-avatar';
import { useSnackbar } from '@/components/snackbar';
import MenuPopover from '@/components/menu-popover';
import { IconButtonAnimate } from '@/components/animate';
import { Link, usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const OPTIONS = [
	{
		label: 'Home',
		linkTo: '/',
	},
	{
		label: 'Profile',
		linkTo: "/profile"
	},
	{
		label: 'Settings',
		linkTo: "/settings"
	},
];

// ----------------------------------------------------------------------

export default function AccountPopover () {
	const { auth: { user } } = usePage().props;

	const { enqueueSnackbar } = useSnackbar();

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleLogout = async () => {
		try {
			handleClosePopover();
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Unable to logout!', { variant: 'error' });
		}
	};

	const handleClickItem = (path) => {
		handleClosePopover();
		navigate(path);
	};

	return (
		<>
			<IconButtonAnimate
				onClick={handleOpenPopover}
				sx={{
					p: 0,
					...(openPopover && {
						'&:before': {
							zIndex: 1,
							content: "''",
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							position: 'absolute',
							bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
						},
					}),
				}}
			>
				<CustomAvatar src={`/storage/media/photos/employee/${(user?.employee.img_src || user?.profile_pic)}`} alt={`${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`} />
			</IconButtonAnimate>

			<MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
				<Box sx={{ my: 1.5, px: 2.5 }}>
					<Typography variant="subtitle2" noWrap>
						{`${user?.firstname || user?.employee?.firstname} ${user?.lastname || user?.employee?.lastname}`}
					</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
						{user?.email}
					</Typography>
				</Box>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack sx={{ p: 1 }}>
					{OPTIONS.map((option) => (
						<MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
							{option.label}
						</MenuItem>
					))}
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<MenuItem component={Link} href="/logout" method="POST" sx={{ m: 1 }}>
					Logout
				</MenuItem>
			</MenuPopover>
		</>
	);
}
