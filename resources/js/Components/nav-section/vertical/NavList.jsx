import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Collapse } from '@mui/material';
// hooks
import useActiveLink from '@/hooks/useActiveLink';
//
import NavItem from './NavItem';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

NavList.propTypes = {
	data: PropTypes.object,
	depth: PropTypes.number,
	hasChild: PropTypes.bool,
};

export default function NavList ({ data, depth, hasChild }) {
	const { can } = usePage().props;
	const { active, isExternalLink } = useActiveLink(data.path, true, hasChild, data?.childList);

	const [open, setOpen] = useState(active);

	const handleToggle = () => {
		setOpen(!open);
	};

	if (data.gate && !can[data.gate]) {
		return null;
	}

	return (
		<>
			<NavItem
				item={data}
				depth={depth}
				open={open}
				active={active}
				isExternalLink={isExternalLink}
				onClick={handleToggle}
			/>

			{hasChild && (
				<Collapse in={open} unmountOnExit>
					<NavSubList data={data.children} depth={depth} />
				</Collapse>
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
	const { can } = usePage().props;
	if (data.gate && !can[data.gate]) {
		return null;
	}

	return (
		<>
			{data.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={depth + 1} hasChild={!!list.children} />
			))}
		</>
	);
}
