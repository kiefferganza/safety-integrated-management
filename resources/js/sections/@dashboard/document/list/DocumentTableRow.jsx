import PropTypes from 'prop-types';
import { useState } from 'react';
import { InertiaLink, Link, usePage, } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';
// @mui
const {
	Stack,
	Button,
	Divider,
	Checkbox,
	TableRow,
	MenuItem,
	TableCell,
	IconButton
} = await import('@mui/material');
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import { CopyUrlDialog } from '@/Components/dialogs';
import axiosInstance from '@/utils/axios';
import ShareDialog from '../portal/ShareDialog';
import { LinkList } from '../portal/LinkList';
const { DocumentTableSubRow } = await import('./DocumentTableSubRow');
const { DocumentFileList } = await import('../portal/DocumentFileList');
const { ConfirmDialog } = await import('@/Components/confirm-dialog/ConfirmDialog');

// ----------------------------------------------------------------------

DocumentTableRow.propTypes = {
	row: PropTypes.object,
	folder: PropTypes.object,
	selected: PropTypes.bool,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function DocumentTableRow ({ row, selected, onSelectRow, onDeleteRow, folder, canView, load }) {
	const { auth: { user } } = usePage().props;
	const [openCollapse, setOpenCollapse] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const [openFileList, setOpenFileList] = useState(false);
	const [openCopyURL, setOpenCopyURL] = useState(false);
	const [openLinkList, setOpenLinkList] = useState(false);

	// Shareable
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [position, setPosition] = useState('');
	// 

	const [openShare, setOpenShare] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const [generatedUrl, setGeneratedUrl] = useState("");

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenFileList = () => {
		handleClosePopover();
		setOpenFileList(true);
	}

	const handleCloseFileList = () => {
		setOpenFileList(false);
	}

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleTriggerCollapse = () => {
		setOpenCollapse((currState) => !currState);
	}

	const handleOpenLinkList = () => {
		setOpenPopover(null);
		setOpenLinkList(true);
	}

	const handleOpenShare = () => {
		setOpenPopover(null);
		setOpenShare(true);
	}

	const handleCloseShare = () => {
		setOpenShare(false);
	}

	const handleGenerateShareLink = () => {
		if (firstname && lastname) {
			handleCloseShare();
			handleOpenCopy();
		}
	}

	const handleOpenCopy = async () => {
		load(true);

		try {
			const urlRoute = route('api.folder.generate-url', { document: row.document_id });
			const { data } = await axiosInstance.post(urlRoute, {
				firstname,
				lastname,
				position
			});
			setGeneratedUrl(data.shareableLink);
			load(false);
			setOpenCopyURL(true);
		} catch (error) {
			load(false);
			console.log(error);
		}
	};

	const handleCloseCopy = () => {
		setOpenCopyURL(false);
		setGeneratedUrl("");
		window.location.reload();
	}


	const canDeleteAndCanEdit = user?.employee.employee_id === row.employee.employee_id;
	return (
		<>
			<TableRow hover selected={selected} sx={{ width: 1 }}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'uppercase', whiteSpace: "nowrap" }}>{row.form_number}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'capitalize', whiteSpace: "nowrap" }}>{row.title}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ textTransform: 'capitalize', whiteSpace: "nowrap" }}>{row.description || "N/A"}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="center" sx={{ whiteSpace: "nowrap" }}>{row.rev || 0}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ whiteSpace: "nowrap" }}>{row.employee.fullname}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="left" sx={{ whiteSpace: "nowrap" }}>{fDate(row.date_uploaded)}</TableCell>

				<TableCell onClick={handleTriggerCollapse} align="center">
					<Label
						variant="soft"
						color={row.docStatus.statusClass}
						sx={{ textTransform: "none" }}
					>
						{row.docStatus.statusText}
					</Label>
				</TableCell>

				<TableCell align="right">
					<Stack flexDirection="row">
						<IconButton
							aria-label="expand row"
							color={openCollapse ? 'inherit' : 'default'}
							onClick={handleTriggerCollapse}
						>
							<Iconify icon={openCollapse ? "material-symbols:keyboard-arrow-up" : "material-symbols:keyboard-arrow-down"} />
						</IconButton>
						<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
							<Iconify icon="eva:more-vertical-fill" />
						</IconButton>
					</Stack>
				</TableCell>
			</TableRow>
			<DocumentTableSubRow row={row} open={openCollapse} />
			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
				{canView && (
					<MenuItem
						component={Link}
						href={PATH_DASHBOARD.fileManager.viewDocument(folder.folder_id, row.form_number)}
						onClick={handleClosePopover}
					>
						<Iconify icon="eva:eye-fill" />
						View
					</MenuItem>
				)}
				<MenuItem
					onClick={handleOpenFileList}
				>
					<Iconify icon="heroicons:document-magnifying-glass-20-solid" />
					View Files
				</MenuItem>

				{canDeleteAndCanEdit && (
					<MenuItem onClick={handleClosePopover} component={InertiaLink} href={route('files.management.document.edit', { folder: folder.folder_id, document: row.form_number })}>
						<Iconify icon="eva:edit-fill" />
						Edit
					</MenuItem>
				)}

				<Divider sx={{ borderStyle: 'dashed' }} />

				{row?.shareable_link?.length > 0 ? (
					<MenuItem onClick={handleOpenLinkList}>
						<Iconify icon="material-symbols:link" />
						External Links
					</MenuItem>
				) : (
					<MenuItem onClick={handleOpenShare}>
						<Iconify icon="material-symbols:share" />
						Share
					</MenuItem>
				)}


				{canDeleteAndCanEdit && (
					<>
						<Divider sx={{ borderStyle: 'dashed' }} />

						<MenuItem
							onClick={() => {
								handleOpenConfirm();
								handleClosePopover();
							}}
							sx={{ color: 'error.main' }}
						>
							<Iconify icon="eva:trash-2-outline" />
							Delete
						</MenuItem>
					</>
				)}

			</MenuPopover>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={() => {
						onDeleteRow();
						handleCloseConfirm();
					}}>
						Delete
					</Button>
				}
			/>

			<DocumentFileList
				open={openFileList}
				onClose={handleCloseFileList}
				document={row}
				title={`${row.form_number} File List`}
			/>

			<ShareDialog
				open={openShare}
				onClose={handleCloseShare}
				setFirstname={setFirstname}
				setLastname={setLastname}
				setPosition={setPosition}
				status={row.docStatus}
				formNumber={row.form_number}
				action={
					<Button
						disabled={!firstname || !lastname}
						variant="contained"
						color="primary"
						onClick={handleGenerateShareLink}
					>
						Generate Link
					</Button>
				}
			/>

			<CopyUrlDialog
				open={openCopyURL}
				onClose={handleCloseCopy}
				value={generatedUrl}
			/>

			<LinkList
				open={openLinkList}
				onClose={() => setOpenLinkList(false)}
				shareable_link={row.shareable_link}
				external_approver={row.external_approver}
			/>

		</>
	);
}
