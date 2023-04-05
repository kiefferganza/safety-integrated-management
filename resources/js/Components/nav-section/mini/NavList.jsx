import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
// hooks
import useActiveLink from '@/hooks/useActiveLink';
//
import { StyledPopover } from './styles';
import NavItem from './NavItem';
import { usePage } from '@inertiajs/inertia-react';
import usePermission from '@/hooks/usePermission';

// ----------------------------------------------------------------------

NavList.propTypes = {
	data: PropTypes.object,
	depth: PropTypes.number,
	hasChild: PropTypes.bool,
};

export default function NavList ({ data, depth, hasChild }) {
	const [hasPermission] = usePermission();
	const navRef = useRef(null);

	const { active, isExternalLink } = useActiveLink(data.routeNames);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = '';
		} else {
			document.body.style.overflow = '';
		}
	}, [open]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	if (data.gate && !hasPermission(data.gate)) {
		return null;
	}


	return (
		<>
			<NavItem
				ref={navRef}
				item={data}
				depth={depth}
				open={open}
				active={active}
				isExternalLink={isExternalLink}
				onMouseEnter={handleOpen}
				onMouseLeave={handleClose}
			/>

			{hasChild && (
				<StyledPopover
					open={open}
					anchorEl={navRef.current}
					anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
					transformOrigin={{ vertical: 'center', horizontal: 'left' }}
					PaperProps={{
						onMouseEnter: handleOpen,
						onMouseLeave: handleClose,
					}}
				>
					<NavSubList data={data.children} depth={depth} />
				</StyledPopover>
			)}
		</>
	);
}

// ----------------------------------------------------------------------

NavSubList.propTypes = {
	data: PropTypes.array,
	depth: PropTypes.number,
};

function NavSubList ({ data, depth }) {
	return (
		<>
			{data.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={depth + 1} hasChild={!!list.children} />
			))}
		</>
	);
}
