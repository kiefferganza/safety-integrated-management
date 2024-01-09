import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Button, TableRow, Checkbox, MenuItem, TableCell, IconButton, Divider, Stack } from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { Link, usePage } from '@inertiajs/inertia-react';
import { TrainingThirdPartySubRow } from './TrainingThirdPartySubRow';
import { getStatusColor } from '@/utils/formatStatuses';
import { sentenceCase } from 'change-case';
import PpeFileList from '../../ppe/portal/PpeFileList';

// ----------------------------------------------------------------------

TrainingThirdPartyRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onSelectRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	url: PropTypes.string
};

export default function TrainingThirdPartyRow ({ row, selected, onSelectRow, onDeleteRow, canEdit, canDelete }) {
	const { training_id, cms, course, title, trainees_count, training_date, date_expired, status, completed, external_details, external_status } = row;
	const { auth: { user } } = usePage().props;

	const [openCollapse, setOpenCollapse] = useState(false);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openPopover, setOpenPopover] = useState(null);

	const [openFileList, setOpenFileList] = useState(false);

	const handleOpenFileList = () => {
		handleClosePopover();
		setOpenFileList(true);
	}

	const handleCloseFileList = () => {
		setOpenFileList(false);
	}

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleTriggerCollapse = () => {
		setOpenCollapse((currState) => !currState);
	}
  console.log(canEdit);
	return (
		<>
			<TableRow hover selected={selected}>
				<TableCell padding="checkbox">
					<Checkbox checked={selected} onClick={onSelectRow} />
				</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}>{cms}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{course?.course_name || title || ""}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }} align="center">{trainees_count}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{fDate(training_date)}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>{fDate(date_expired)}</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }}>
					<Label
						variant="soft"
						color={completed ? "success" : "warning"}
					>
						{completed ? "Complete" : "Incomplete"}
					</Label>
				</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }} align="center">
					<Label
						variant="soft"
						color={status.color}
					>
						{status.text}
					</Label>
				</TableCell>

				<TableCell onClick={handleTriggerCollapse} sx={{ whiteSpace: "nowrap" }} align="center">
					<Label
						variant="filled"
						color={getStatusColor(external_status.status)}
						sx={{ textTransform: "capitalize" }}
					>
						{sentenceCase(external_status.status)}
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

			<TrainingThirdPartySubRow participants={trainees_count} external_details={external_details} external_status={external_status} open={openCollapse} />

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
				<MenuItem
					component={Link}
					href={route('training.management.external.external_action', training_id)}
					disabled={(user.emp_id !== external_details.requested_by)}
				>
					<Iconify icon="eva:edit-fill" />
					Action
				</MenuItem>
				<MenuItem
					component={Link}
					href={route('training.management.external.external_review', training_id)}
					preserveScroll
					onClick={handleClosePopover}
					disabled={user.emp_id !== external_details.reviewed_by}
				>
					<Iconify width={16} icon="fontisto:preview" />
					Review
				</MenuItem>
				<MenuItem
					component={Link}
					href={route('training.management.external.external_approve', training_id)}
					preserveScroll
					onClick={handleClosePopover}
					disabled={user.emp_id !== external_details.approved_by}
				>
					<Iconify icon="pajamas:review-checkmark" />
					Verify
				</MenuItem>
				<Divider sx={{ borderStyle: 'dashed' }} />
				<MenuItem
					onClick={handleOpenFileList}
				>
					<Iconify icon="heroicons:document-magnifying-glass-20-solid" />
					View Files
				</MenuItem>
				<MenuItem
					component={Link}
					href={`/dashboard/training/third-party/${row.id}`}
				>
					<Iconify icon="eva:eye-fill" />
					View
				</MenuItem>
				{canEdit && (
					<MenuItem
						component={Link}
						href={`/dashboard/training/${row.id}/edit`}
					>
						<Iconify icon="eva:edit-fill" />
						Edit
					</MenuItem>

				)}

				{canDelete && (
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

			<PpeFileList
				open={openFileList}
				onClose={handleCloseFileList}
				files={external_status?.media || []}
				title={`${cms} File List`}
			/>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={onDeleteRow}>
						Delete
					</Button>
				}
			/>
		</>
	);
}
