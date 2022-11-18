import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { forwardRef } from 'react';
// @mui
import { Link as MuiLink, CardActionArea } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import Image from '@/Components/image';
//
import { ListItem } from './styles';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export const NavItem = forwardRef(({ item, open, isOffset, active, subItem, isExternalLink, ...other }, ref) => {
	const { title, path, children } = item;

	const renderContent = (
		<ListItem ref={ref} disableRipple isOffset={isOffset} subItem={subItem} active={active} open={open} {...other}>
			{title}

			{!!children && (
				<Iconify width={16} icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} sx={{ ml: 1 }} />
			)}
		</ListItem>
	);

	// ExternalLink
	if (isExternalLink) {
		return (
			<MuiLink href={path} target="_blank" rel="noopener" underline="none">
				{renderContent}
			</MuiLink>
		);
	}

	// Has child
	if (children) {
		return renderContent;
	}

	// Default
	return (
		<MuiLink href={path} component={Link} preserveScroll underline="none">
			{renderContent}
		</MuiLink>
	);
});

NavItem.propTypes = {
	open: PropTypes.bool,
	item: PropTypes.object,
	active: PropTypes.bool,
	subItem: PropTypes.bool,
	isOffset: PropTypes.bool,
	isExternalLink: PropTypes.bool,
};

// ----------------------------------------------------------------------

NavItemDashboard.propTypes = {
	item: PropTypes.object,
	sx: PropTypes.object,
};

export function NavItemDashboard ({ item, sx, ...other }) {
	return (
		<MuiLink href={item.path} component={Link} preserveScroll {...other}>
			<CardActionArea
				sx={{
					py: 5,
					px: 10,
					borderRadius: 1,
					color: 'text.disabled',
					bgcolor: 'background.neutral',
					...sx,
				}}
			>
				<m.div
					whileTap="tap"
					whileHover="hover"
					variants={{
						hover: { scale: 1.02 },
						tap: { scale: 0.98 },
					}}
				>
					<Image alt="illustration_dashboard" src="/storage/assets/illustrations/illustration_dashboard.png" />
				</m.div>
			</CardActionArea>
		</MuiLink>
	);
}
