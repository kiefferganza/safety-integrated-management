import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { Box, Tooltip, ListItemText, Link as MuiLink } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// auth
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
//
import Iconify from '../../iconify';
import { StyledItem, StyledIcon } from './styles';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const NavItem = forwardRef(({ item, depth, open, active, isExternalLink, ...other }, ref) => {
	const { translate } = useLocales();

	const { title, path, icon, info, children, disabled, caption, roles } = item;

	const subItem = depth !== 1;

	const renderContent = (
		<StyledItem
			ref={ref}
			open={open}
			depth={depth}
			active={active}
			disabled={disabled}
			{...other}
		>
			{icon && <StyledIcon>{icon}</StyledIcon>}

			<ListItemText
				primary={translate(title)}
				primaryTypographyProps={{
					noWrap: true,
					component: 'span',
					variant: active ? 'subtitle2' : 'body2',
				}}
			/>

			{info && (
				<Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
					{info}
				</Box>
			)}

			{caption && (
				<Tooltip title={translate(caption)} arrow>
					<Box component="span" sx={{ ml: 0.5, lineHeight: 0 }}>
						<Iconify icon="eva:info-outline" width={16} />
					</Box>
				</Tooltip>
			)}

			{!!children && (
				<Iconify
					icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'}
					width={16}
					sx={{ ml: 0.5, flexShrink: 0 }}
				/>
			)}
		</StyledItem>
	);

	const renderItem = () => {
		// ExternalLink
		if (isExternalLink)
			return (
				<MuiLink href={path} target="_blank" rel="noopener" underline="none">
					{renderContent}
				</MuiLink>
			);

		// Default
		return (
			<MuiLink href={disabled ? "#" : path} component={Link} preserveScroll underline="none">
				{renderContent}
			</MuiLink>
		);
	};

	return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>;
});

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	depth: PropTypes.number,
	isExternalLink: PropTypes.bool,
};

export default NavItem;
