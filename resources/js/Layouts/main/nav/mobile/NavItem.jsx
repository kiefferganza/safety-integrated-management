import PropTypes from 'prop-types';
// @mui
import { Link as MuiLink, ListItemText, ListItemIcon } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
//
import { ListItem } from './styles';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	isExternalLink: PropTypes.bool,
};

export default function NavItem ({ item, open, active, isExternalLink, ...other }) {
	const { title, path, icon, children } = item;

	const renderContent = (
		<ListItem active={active} {...other}>
			<ListItemIcon> {icon} </ListItemIcon>

			<ListItemText disableTypography primary={title} />

			{!!children && (
				<Iconify width={16} icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} sx={{ ml: 1 }} />
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
}
