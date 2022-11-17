import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { Tooltip, Link as MuiLink, ListItemText } from '@mui/material';
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

	const { title, path, icon, children, disabled, caption, roles } = item;

	const subItem = depth !== 1;

	const renderContent = (
		<StyledItem ref={ref} open={open} depth={depth} active={active} disabled={disabled} {...other}>
			{icon && <StyledIcon>{icon}</StyledIcon>}

			<ListItemText
				primary={translate(title)}
				primaryTypographyProps={{
					noWrap: true,
					sx: {
						width: 72,
						fontSize: 10,
						lineHeight: '16px',
						textAlign: 'center',
						...(active && {
							fontWeight: 'fontWeightMedium',
						}),
						...(subItem && {
							fontSize: 14,
							width: 'auto',
							textAlign: 'left',
						}),
					},
				}}
			/>

			{caption && (
				<Tooltip title={translate(caption)} arrow placement="right">
					<Iconify
						icon="eva:info-outline"
						width={16}
						sx={{
							top: 11,
							left: 6,
							position: 'absolute',
						}}
					/>
				</Tooltip>
			)}

			{!!children && (
				<Iconify
					width={16}
					icon="eva:chevron-right-fill"
					sx={{
						top: 11,
						right: 6,
						position: 'absolute',
					}}
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
			<MuiLink component={Link} to={path} underline="none">
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
