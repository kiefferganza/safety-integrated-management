import PropTypes from 'prop-types';
// @mui
import { Box, Tooltip, Link as MuiLink, ListItemText } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// auth
import RoleBasedGuard from '../../../auth/RoleBasedGuard';
//
import Iconify from '../../iconify';
//
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	depth: PropTypes.number,
	isExternalLink: PropTypes.bool,
};

export default function NavItem ({ item, depth, open, active, isExternalLink, ...other }) {
	const { translate } = useLocales();

	const { title, path, icon, info, children, disabled, caption, roles } = item;

	const subItem = depth !== 1;

	const renderContent = (
		<StyledItem depth={depth} active={active} disabled={disabled} caption={!!caption} {...other}>
			{icon && <StyledIcon>{icon}</StyledIcon>}

			{subItem && (
				<StyledIcon>
					<StyledDotIcon active={active && subItem} />
				</StyledIcon>
			)}

			<ListItemText
				primary={translate(title)}
				secondary={
					caption && (
						<Tooltip title={translate(caption)} placement="top-start">
							<span>{translate(caption)}</span>
						</Tooltip>
					)
				}
				primaryTypographyProps={{
					noWrap: true,
					component: 'span',
					variant: active ? 'subtitle2' : 'body2',
				}}
				secondaryTypographyProps={{
					noWrap: true,
					variant: 'caption',
				}}
			/>

			{info && (
				<Box component="span" sx={{ lineHeight: 0 }}>
					{info}
				</Box>
			)}

			{!!children && (
				<Iconify
					width={16}
					icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
					sx={{ ml: 1, flexShrink: 0 }}
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

		// Has child
		if (children) {
			return renderContent;
		}

		// Default
		return (
			<MuiLink component={Link} preserveScroll href={path} underline="none">
				{renderContent}
			</MuiLink>
		);
	};

	return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>;
}
