import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// components
import { CustomAvatar } from '@/Components/custom-avatar';
import MenuPopover from '@/Components/menu-popover';
import { IconButtonAnimate } from '@/Components/animate';
import { Link, usePage } from '@inertiajs/inertia-react';
import { getCurrentUserImage, getCurrentUserName } from '@/utils/formatName';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

const OPTIONS = [
	{
		label: 'Home',
		linkTo: '/',
	},
	{
		label: 'Profile',
		linkTo: "/dashboard/user/profile"
	},
	{
		label: 'Settings',
		linkTo: "/dashboard/user/settings"
	},
];

// ----------------------------------------------------------------------

export default function AccountPopover () {
	const { auth: { user } } = usePage().props;

	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleClickItem = (path) => {
		handleClosePopover();
		Inertia.visit(path)
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
				<CustomAvatar src={user?.profile?.thumbnail || route("image", { path: "assets/images/default-profile.jpg", w: 128, h: 128, fit: "crop" })} alt={getCurrentUserName(user)} />
			</IconButtonAnimate>

			<MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
				<Box sx={{ my: 1.5, px: 2.5 }}>
					<Typography variant="subtitle2" noWrap>
						{getCurrentUserName(user)}
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

				<MenuItem component={Link} preserveScroll href="/logout" method="POST" sx={{ m: 1 }}>
					Logout
				</MenuItem>
			</MenuPopover>
		</>
	);
}
