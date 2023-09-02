
import { useState, useEffect } from 'react';
// @mui
import { Card, Table, Button, Tooltip, TableBody, Container, IconButton, TableContainer, Stack, Tabs, Tab, Divider, useTheme } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import {
	useTable,
	getComparator,
	emptyRows,
	TableNoData,
	TableSkeleton,
	TableEmptyRows,
	TableHeadCustom,
	TableSelectedAction,
	TablePaginationCustom,
} from '@/Components/table';
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import ConfirmDialog from '@/Components/confirm-dialog';
// sections
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { getTrainingStatus } from '@/utils/formatDates';
import { TrainingThirdPartyRow, TrainingTableToolbar } from '@/sections/@dashboard/training/list';
import TrainingAnalitic from '@/sections/@dashboard/training/TrainingAnalitic';
import { fTimestamp } from '@/utils/formatTime';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import usePermission from '@/hooks/usePermission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'cms', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: 'left' },
	{ id: 'traninees_count', label: 'Participants', align: 'center' },
	{ id: 'training_date', label: 'Training', align: 'left' },
	{ id: 'date_expired', label: 'Expiration', align: 'left' },
	{ id: 'certificate', label: 'Certificate', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center' },
	{ id: 'actionStatus', label: 'Action Status', align: 'center' },
	{ id: '' },
];

const STATUS_OPTIONS = [
	{ value: 'all', label: 'All' },
	{ value: 'requested_by', label: 'Request' },
	{ value: 'reviewed_by', label: 'Review' },
	{ value: 'approved_by', label: 'Approve' }
];

// ----------------------------------------------------------------------

export default function TrainingThirdPartyList ({ trainings, url, type }) {
	const { auth: { user } } = usePage().props;
	const [hasPermission] = usePermission();
	const { load, stop } = useSwal();
	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		setPage,
		//
		selected,
		setSelected,
		onSelectRow,
		onSelectAllRows,
		//
		onSort,
		onChangeDense,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable({
		defaultOrderBy: 'createdAt',
	});

	const theme = useTheme();

	const { themeStretch } = useSettingsContext();

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState('all');

	const [filterStatusTab, setFilterStatusTab] = useState('all');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);


	const checkTrainingComplete = (trainees, files = []) => {
		return trainees.every((tr) => files.findIndex(f => f.emp_id === tr.employee_id) !== -1);
	}

	useEffect(() => {
		if (trainings && trainings?.length > 0) {
			setTableData(trainings.map(training => ({
				...training,
				id: training.training_id,
				cms: training?.project_code ? `${training?.project_code}-${training?.originator}-${training?.discipline}-${training?.document_type}-${training?.document_zone ? training?.document_zone + "-" : ""}${training?.document_level ? training?.document_level + "-" : ""}${training?.sequence_no}` : "N/A",
				status: getTrainingStatus(training.date_expired),
				completed: checkTrainingComplete(training.trainees, training.training_files)
			})));
		}
	}, [trainings]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterStatusTab,
		filterStartDate,
		filterEndDate,
		user
	});


	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterStatus !== 'all' || filterStatusTab !== 'all' || !!filterStartDate || !!filterEndDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

	const getLengthByStatus = (status) => dataFiltered.filter((item) => item.status.text === status);

	const getPercentByStatus = (status) => (getLengthByStatus(status).length / dataFiltered.length) * 100;

	const getLengthByStatusNotFiltered = (status) => tableData.filter((item) => item.status.text === status);

	const getTotalHours = (trainings_arr) => trainings_arr.reduce((acc, curr) => acc += curr.training_hrs, 0);

	const getCertificateLength = (bool) => tableData.filter(data => data.completed === bool).length;

	const relatedList = {
		requested_by: trainings.filter((training) => training.external_details.requested_by === user.emp_id).length,
		reviewed_by: trainings.filter((training) => training.external_details.reviewed_by === user.emp_id).length,
		approved_by: trainings.filter((training) => training.external_details.approved_by === user.emp_id).length
	};

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: dataFiltered.length },
		{ value: 'Valid', label: 'Valid', color: 'success', count: getLengthByStatusNotFiltered('Valid').length },
		{ value: 'Soon to Expire', label: 'Soon to Expire', color: 'warning', count: getLengthByStatusNotFiltered('Soon to Expire').length },
		{ value: 'Expired', label: 'Expired', color: 'error', count: getLengthByStatusNotFiltered('Expired').length },
		{ value: 'Completed', label: 'Completed', color: 'success', count: getCertificateLength(true) },
		{ value: 'Incomplete', label: 'Incomplete', color: 'warning', count: getCertificateLength(false) },
	];

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterStatus = (event) => {
		setPage(0);
		setFilterStatus(event.target.value);
	};

	const handleFilterStatusTabs = (_event, newValue) => {
		setPage(0);
		setFilterStatusTab(newValue);
	};

	const handleFilterStartDate = (newValue) => {
		setPage(0);
		setFilterStartDate(newValue);
	}

	const handleFilterEndDate = (newValue) => {
		setPage(0);
		setFilterEndDate(newValue);
	}

	const handleDeleteRow = (id) => {
		Inertia.post(route('training.management.destroy'), { ids: [id] }, {
			preserveState: true,
			preserveScroll: true,
			onStart () {
				setOpenConfirm(false);
				load("Deleting training", "please wait...");
			},
			onFinish () {
				setSelected([]);
				stop();
			}
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('training.management.destroy'), { ids: selected }, {
			preserveState: true,
			preserveScroll: true,
			onStart () {
				setOpenConfirm(false);
				load("Deleting training", "please wait...");
			},
			onFinish () {
				setSelected([]);
				stop();
			}
		});
	};


	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus('all');
		setFilterStatusTab('all');
		setFilterStartDate(null);
		setFilterEndDate(null);
	};

	const canCreate = hasPermission("training_create");
	const canEdit = hasPermission("training_edit");
	const canDelete = hasPermission("training_delete");
	return (
		<>
			<Head>
				<title>Third Party List</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Third Party List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: "Third Party",
							href: PATH_DASHBOARD.training.new(type),
						},
						{ name: 'List' },
					]}
					action={
						canCreate && (
							<Button
								href={PATH_DASHBOARD.training.new(type)}
								component={Link}
								preserveScroll
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New Training
							</Button>
						)
					}
				/>

				<Card sx={{ mb: 5 }}>
					<Scrollbar>
						<Stack
							direction="row"
							divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
							sx={{ py: 2 }}
						>
							<TrainingAnalitic
								title="Total"
								total={dataFiltered.length}
								hours={getTotalHours(dataFiltered)}
								percent={100}
								icon="material-symbols:supervisor-account"
								color={theme.palette.info.main}
							/>
							<TrainingAnalitic
								title="Valid"
								total={getLengthByStatus("Valid").length}
								hours={getTotalHours(getLengthByStatus("Valid"))}
								percent={getPercentByStatus("Valid")}
								icon="mdi:account-badge"
								color={theme.palette.success.main}
							/>
							<TrainingAnalitic
								title="Soon to Expire"
								total={getLengthByStatus("Soon to Expire").length}
								hours={getTotalHours(getLengthByStatus("Soon to Expire"))}
								percent={getPercentByStatus("Soon to Expire")}
								icon="mdi:account-clock"
								color={theme.palette.warning.main}
							/>
							<TrainingAnalitic
								title="Expired"
								total={getLengthByStatus("Expired").length}
								hours={getTotalHours(getLengthByStatus("Expired"))}
								percent={getPercentByStatus("Expired")}
								icon="mdi:account-cancel"
								color={theme.palette.error.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Tabs
						value={filterStatusTab}
						onChange={handleFilterStatusTabs}
						sx={{
							px: 2,
							bgcolor: 'background.neutral',
						}}
					>
						{TABS.map((tab) => (
							<Tab
								key={tab.value}
								value={tab.value}
								label={tab.label}
								icon={
									<Label color={tab.color} sx={{ mr: 1 }}>
										{tab.count}
									</Label>
								}
							/>
						))}
					</Tabs>

					<Divider />
					<TrainingTableToolbar
						filterName={filterName}
						filterStatus={filterStatus}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onFilterName={handleFilterName}
						onFilterStatus={handleFilterStatus}
						statusOptions={STATUS_OPTIONS}
						isFiltered={isFiltered}
						onFilterStartDate={handleFilterStartDate}
						onFilterEndDate={handleFilterEndDate}
						onResetFilter={handleResetFilter}
						statusLabel="Related To You"
						relatedList={relatedList}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							numSelected={selected.length}
							rowCount={dataFiltered.length}
							onSelectAllRows={(checked) =>
								onSelectAllRows(
									checked,
									dataFiltered.map((row) => row.id)
								)
							}
							action={
								<Tooltip title="Delete">
									<IconButton color="primary" onClick={handleOpenConfirm}>
										<Iconify icon="eva:trash-2-outline" />
									</IconButton>
								</Tooltip>
							}
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={dataFiltered.length}
									numSelected={selected.length}
									onSort={onSort}
									onSelectAllRows={(checked) =>
										onSelectAllRows(
											checked,
											dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id)
										)
									}
								/>

								<TableBody>
									{dataFiltered
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) =>
											row ? (
												<TrainingThirdPartyRow
													key={row.id}
													row={row}
													selected={selected.includes(row.id)}
													onSelectRow={() => onSelectRow(row.id)}
													onDeleteRow={() => handleDeleteRow(row.id)}
													url={url}
													canEdit={canEdit}
													canDelete={canDelete}
												/>
											) : (
												!isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
											)
										)}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

									<TableNoData isNotFound={isNotFound} />
								</TableBody>
							</Table>
						</Scrollbar>
					</TableContainer>

					<TablePaginationCustom
						count={dataFiltered.length}
						page={page}
						rowsPerPage={rowsPerPage}
						onPageChange={onChangePage}
						onRowsPerPageChange={onChangeRowsPerPage}
						//
						dense={dense}
						onChangeDense={onChangeDense}
					/>
				</Card>
			</Container>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content={
					<>
						Are you sure want to delete <strong> {selected.length} </strong> items?
					</>
				}
				action={
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							handleDeleteRows(selected);
							handleCloseConfirm();
						}}
					>
						Delete
					</Button>
				}
			/>
		</>
	);
}

// ----------------------------------------------------------------------

function applyFilter ({ inputData, comparator, filterName, filterStatus, filterStatusTab, filterStartDate, filterEndDate, user }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((training) =>
			training.cms.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			(training?.course ? training.course?.course_name?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 : false) ||
			(training?.title ? training.title?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 : false)
		);
	}

	if (filterStatus !== 'all') {
		inputData = inputData.filter((training) => training.external_details[filterStatus] === user.emp_id);
	}

	if (filterStatusTab !== 'all') {
		if (filterStatusTab === "Completed" || filterStatusTab === "Incomplete") {
			inputData = inputData.filter((training) => training.completed === (filterStatusTab === "Completed"));
		} else {
			inputData = inputData.filter((training) => training.status.text === filterStatusTab);
		}
	}

	if (filterStartDate && !filterEndDate) {
		inputData = inputData.filter((training) => fTimestamp(training.training_date) >= filterStartDate.setHours(0, 0, 0, 0));
	}

	if (!filterStartDate && filterEndDate) {
		inputData = inputData.filter((training) => fTimestamp(training.date_expired) <= filterEndDate.setHours(0, 0, 0, 0));
	}

	if (filterStartDate && filterEndDate) {
		inputData = inputData.filter(
			(training) =>
				fTimestamp(training.training_date) >= filterStartDate.setHours(0, 0, 0, 0) &&
				fTimestamp(training.date_expired) <= filterEndDate.setHours(0, 0, 0, 0)
		);
	}


	return inputData;
}
