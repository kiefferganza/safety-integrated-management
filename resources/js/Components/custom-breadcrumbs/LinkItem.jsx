import PropTypes from 'prop-types';
// @mui
import { Box, Link as MuiLink } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

BreadcrumbsLink.propTypes = {
	activeLast: PropTypes.bool,
	disabled: PropTypes.bool,
	link: PropTypes.shape({
		href: PropTypes.string,
		icon: PropTypes.node,
		name: PropTypes.string,
	}),
};

export default function BreadcrumbsLink ({ link, activeLast, disabled }) {
	const { name, href, icon } = link;

	const styles = {
		display: 'inline-flex',
		alignItems: 'center',
		color: 'text.primary',
		...(disabled &&
			!activeLast && {
			cursor: 'default',
			pointerEvents: 'none',
			color: 'text.disabled',
		}),
	};

	const renderContent = (
		<>
			{icon && (
				<Box
					component="span"
					sx={{
						mr: 1,
						display: 'inherit',
						'& svg': { width: 20, height: 20 },
					}}
				>
					{icon}
				</Box>
			)}

			{name}
		</>
	);

	if (href) {
		return (
			<MuiLink href={href} component={Link} preserveScroll sx={styles}>
				{renderContent}
			</MuiLink>
		);
	}

	return <Box sx={styles}> {renderContent} </Box>;
}
