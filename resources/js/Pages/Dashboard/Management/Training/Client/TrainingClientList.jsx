
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
import { Head, Link } from '@inertiajs/inertia-react';
import { getTrainingStatus } from '@/utils/formatDates';
import { TrainingTableRow, TrainingTableToolbar } from '@/sections/@dashboard/training/list';
import TrainingAnalitic from '@/sections/@dashboard/training/TrainingAnalitic';
import { fTimestamp } from '@/utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'cms', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: 'left' },
	{ id: 'traninees_count', label: 'No. of Participants', align: 'center' },
	{ id: 'trainer', label: 'Conducted By', align: 'left' },
	{ id: 'training_date', label: 'Training Date', align: 'left' },
	{ id: 'date_expired', label: 'Expiration', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center' },
	{ id: '' },
];

const STATUS_OPTIONS = [
	{ value: 'all', label: 'All' },
	{ value: 'Valid', label: 'Valid' },
	{ value: 'Soon to Expire', label: 'Soon to Expire' },
	{ value: 'Expired', label: 'Expired' },
];

// ----------------------------------------------------------------------

export default function TrainingClientList ({ trainings }) {
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

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);

	useEffect(() => {
		if (trainings && trainings?.length > 0) {
			setTableData(trainings.map(training => ({
				id: training.training_id,
				cms: training?.project_code ? `${training?.project_code}-${training?.originator}-${training?.discipline}-${training?.document_type}-${training?.document_zone ? training?.document_zone + "-" : ""}${training?.document_level ? training?.document_level + "-" : ""}${training?.sequence_no}` : "N/A",
				title: training.title,
				traninees_count: trainings?.traninees?.length || 0,
				traninees: training.traninees,
				trainer: training.trainer,
				training_hrs: training.training_hrs,
				training_date: training.training_date,
				date_expired: training.date_expired,
				status: getTrainingStatus(training.date_expired)
			})));
		}
	}, [trainings]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterStartDate,
		filterEndDate
	});

	const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterStatus !== 'all' || !!filterStartDate || !!filterEndDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus);

	const getLengthByStatus = (status) => tableData.filter((item) => item.status.text === status);

	const getPercentByStatus = (status) => (getLengthByStatus(status).length / tableData.length) * 100;

	const getTotalHours = (trainings_arr) => trainings_arr.reduce((acc, curr) => acc += curr.training_hrs, 0);

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: tableData.length },
		{ value: 'Valid', label: 'Valid', color: 'success', count: getLengthByStatus('Valid').length },
		{ value: 'Soon to Expire', label: 'Soon to Expire', color: 'warning', count: getLengthByStatus('Soon to Expire').length },
		{ value: 'Expired', label: 'Expired', color: 'error', count: getLengthByStatus('Expired').length }
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

	const handleFilterStatusTabs = (event, newValue) => {
		setPage(0);
		setFilterStatus(newValue);
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
		const deleteRow = tableData.filter((row) => row.id !== id);
		setSelected([]);
		setTableData(deleteRow);

		if (page > 0) {
			if (dataInPage.length < 2) {
				setPage(page - 1);
			}
		}
	};

	const handleDeleteRows = (selected) => {
		const deleteRows = tableData.filter((row) => !selected.includes(row.id));
		setSelected([]);
		setTableData(deleteRows);

		if (page > 0) {
			if (selected.length === dataInPage.length) {
				setPage(page - 1);
			} else if (selected.length === dataFiltered.length) {
				setPage(0);
			} else if (selected.length > dataInPage.length) {
				const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
				setPage(newPage);
			}
		}
	};

	const handleEditRow = (id) => {
		// navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
	};

	const handleViewRow = (id) => {
		// navigate(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
	};

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus('all');
		setFilterStartDate(null);
		setFilterEndDate(null);
	};

	return (
		<>
			<Head>
				<title> Training: Client List</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Client List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Client',
							href: PATH_DASHBOARD.training.root,
						},
						{ name: 'List' },
					]}
					action={
						<Button
							href={PATH_DASHBOARD.training.new}
							component={Link}
							preserveScroll
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New Training
						</Button>
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
								total={tableData.length}
								hours={getTotalHours(trainings)}
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
						value={filterStatus}
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
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							numSelected={selected.length}
							rowCount={tableData.length}
							onSelectAllRows={(checked) =>
								onSelectAllRows(
									checked,
									tableData.map((row) => row.id)
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
									rowCount={tableData.length}
									numSelected={selected.length}
									onSort={onSort}
									onSelectAllRows={(checked) =>
										onSelectAllRows(
											checked,
											tableData.map((row) => row.id)
										)
									}
								/>

								<TableBody>
									{dataFiltered
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) =>
											row ? (
												<TrainingTableRow
													key={row.id}
													row={row}
													selected={selected.includes(row.id)}
													onSelectRow={() => onSelectRow(row.id)}
													onDeleteRow={() => handleDeleteRow(row.id)}
													onEditRow={() => handleEditRow(row.name)}
													onViewRow={() => handleViewRow(row.name)}
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

function applyFilter ({ inputData, comparator, filterName, filterStatus, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((training) => training.cms.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterStatus !== 'all') {
		inputData = inputData.filter((training) => filterStatus.trim().toLowerCase() == training.status.text.trim().toLowerCase());
	}

	if (filterStartDate && !filterEndDate) {
		inputData = inputData.filter((training) => fTimestamp(training.training_date) >= fTimestamp(filterStartDate));
	}

	if (!filterStartDate && filterEndDate) {
		inputData = inputData.filter((training) => fTimestamp(training.date_expired) <= fTimestamp(filterEndDate));
	}

	if (filterStartDate && filterEndDate) {
		inputData = inputData.filter(
			(training) =>
				fTimestamp(training.training_date) >= fTimestamp(filterStartDate) &&
				fTimestamp(training.date_expired) <= fTimestamp(filterEndDate)
		);
	}


	return inputData;
}
