import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
	Box,
	Stack,
	Drawer,
	Button,
	Divider,
	Typography,
	IconButton,
} from '@mui/material';
// utils
import { fData } from '@/utils/formatNumber';
import { fDateTime } from '@/utils/formatTime';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import FileThumbnail, { fileFormat } from '@/Components/file-thumbnail';
//

// ----------------------------------------------------------------------

FileDetailsDrawer.propTypes = {
	open: PropTypes.bool,
	item: PropTypes.object,
	onClose: PropTypes.func,
	onDelete: PropTypes.func,
	onCopyLink: PropTypes.func,
};

export default function FileDetailsDrawer ({
	item,
	open,
	//
	onCopyLink,
	onClose,
	onDelete,
	...other
}) {
	const { name, size, url, type, dateCreated } = item;

	const [toggleProperties, setToggleProperties] = useState(true);

	const handleToggleProperties = () => {
		setToggleProperties(!toggleProperties);
	};

	return (
		<>
			<Drawer
				open={open}
				onClose={onClose}
				anchor="right"
				BackdropProps={{
					invisible: true,
				}}
				PaperProps={{
					sx: { width: 320 },
				}}
				{...other}
			>
				<Scrollbar sx={{ height: 1, "& .simplebar-content": { height: 1 } }}>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 2 }}>
						<Typography variant="h6"> Info </Typography>
						<IconButton>
							<Iconify icon="mdi:chevron-double-right" width={25} />
						</IconButton>
					</Stack>

					<Stack spacing={2.5} sx={{ p: 2.5, bgcolor: 'background.neutral', height: 1 }}>
						<FileThumbnail
							imageView
							file={type === 'folder' ? type : url}
							sx={{ width: 64, height: 64 }}
							imgSx={{ borderRadius: 1 }}
						/>

						<Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
							{name}
						</Typography>

						<Divider sx={{ borderStyle: 'dashed' }} />

						<Stack spacing={1.5}>
							<Panel label="Properties" toggle={toggleProperties} onToggle={handleToggleProperties} />

							{toggleProperties && (
								<>
									<Stack spacing={1.5}>
										<Row label="Size" value={fData(size)} />

										<Row label="Created" value={fDateTime(dateCreated)} />

										<Row label="Type" value={fileFormat(type)} />
									</Stack>
								</>
							)}
						</Stack>
					</Stack>
				</Scrollbar>

				<Box sx={{ p: 2.5 }}>
					<Button
						fullWidth
						variant="soft"
						color="error"
						size="large"
						startIcon={<Iconify icon="eva:trash-2-outline" />}
						onClick={onDelete}
					>
						Delete
					</Button>
				</Box>
			</Drawer>
		</>
	);
}

// ----------------------------------------------------------------------

Panel.propTypes = {
	toggle: PropTypes.bool,
	label: PropTypes.string,
	onToggle: PropTypes.func,
};

function Panel ({ label, toggle, onToggle, ...other }) {
	return (
		<Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
			<Typography variant="subtitle2"> {label} </Typography>

			<IconButton size="small" onClick={onToggle}>
				<Iconify icon={toggle ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
			</IconButton>
		</Stack>
	);
}

// ----------------------------------------------------------------------

Row.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string,
};

function Row ({ label, value = '' }) {
	return (
		<Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
			<Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
				{label}
			</Box>

			{value}
		</Stack>
	);
}
