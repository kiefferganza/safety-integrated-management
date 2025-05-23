import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Masonry } from '@mui/lab';
import { Link as MuiLink, Paper, Typography, Divider, Stack } from '@mui/material';
// components
import Iconify from '../iconify';
//
import MenuHotProducts from './MenuHotProducts';
import MegaMenuCarousel from './MenuCarousel';
import { Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const ITEM_SPACING = 4;
const PARENT_ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

MegaMenuDesktopHorizon.propTypes = {
	data: PropTypes.array,
};

export default function MegaMenuDesktopHorizon ({ data, ...other }) {
	return (
		<Stack direction="row" spacing={ITEM_SPACING} {...other}>
			{data.map((parent) => (
				<MegaMenuItem key={parent.title} parent={parent} />
			))}
		</Stack>
	);
}

// ----------------------------------------------------------------------

MegaMenuItem.propTypes = {
	parent: PropTypes.object,
};

function MegaMenuItem ({ parent }) {
	const { title, path, more, products, tags, children } = parent;

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	if (children) {
		return (
			<>
				<ParentItem onMouseEnter={handleOpen} onMouseLeave={handleClose} path={path} title={title} open={open} hasSub />

				{open && (
					<Paper
						onMouseEnter={handleOpen}
						onMouseLeave={handleClose}
						sx={{
							p: 3,
							width: '100%',
							position: 'absolute',
							borderRadius: 2,
							top: PARENT_ITEM_HEIGHT,
							left: -ITEM_SPACING * 8,
							zIndex: (theme) => theme.zIndex.modal,
							boxShadow: (theme) => theme.customShadows.z20,
						}}
					>
						<Masonry columns={3} spacing={2}>
							{children.map((list) => (
								<Stack key={list.subheader} spacing={1.25} sx={{ mb: 2.5 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightBold' }} noWrap>
										{list.subheader}
									</Typography>

									{list.items.map((link) => (
										<MuiLink
											key={link.title}
											noWrap
											underline="none"
											component={Link} preserveScroll
											href={link.path}
											sx={{
												fontSize: 13,
												typography: 'body2',
												color: 'text.primary',
												transition: (theme) => theme.transitions.create('all'),
												'&:hover': { color: 'primary.main' },
											}}
										>
											{link.title}
										</MuiLink>
									))}
								</Stack>
							))}
						</Masonry>

						{!!more && !!tags && !!products && (
							<Stack spacing={3}>
								<MuiLink
									href={more?.path}
									component={Link} preserveScroll
									sx={{ typography: 'body2', display: 'inline-flex', fontSize: 13 }}
								>
									{more?.title}
								</MuiLink>

								<Divider />

								<MegaMenuCarousel products={products} numberShow={8} />

								<Divider />

								<MenuHotProducts tags={tags} />
							</Stack>
						)}
					</Paper>
				)}
			</>
		);
	}

	return <ParentItem path={path} title={title} />;
}

// ----------------------------------------------------------------------

ParentItem.propTypes = {
	open: PropTypes.bool,
	hasSub: PropTypes.bool,
	path: PropTypes.string,
	title: PropTypes.string,
};

function ParentItem ({ title, path = '', open, hasSub, ...other }) {
	const activeStyle = {
		color: 'primary.main',
	};

	return (
		<MuiLink
			href={path}
			component={Link} preserveScroll
			underline="none"
			color="inherit"
			variant="subtitle2"
			sx={{
				display: 'flex',
				cursor: 'pointer',
				alignItems: 'center',
				textTransform: 'capitalize',
				height: PARENT_ITEM_HEIGHT,
				lineHeight: `${PARENT_ITEM_HEIGHT}px`,
				transition: (theme) => theme.transitions.create('all'),
				'&:hover': activeStyle,
				...(open && activeStyle),
			}}
			{...other}
		>
			{title}

			{hasSub && <Iconify icon="eva:chevron-down-fill" sx={{ ml: 1 }} />}
		</MuiLink>
	);
}
