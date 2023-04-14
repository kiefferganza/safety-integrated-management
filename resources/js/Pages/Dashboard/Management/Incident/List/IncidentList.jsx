
import { useState } from 'react';
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
import { Link } from '@inertiajs/inertia-react';
import { IncidentTableRow, IncidentTableToolbar } from '@/sections/@dashboard/incident/list';
import { Inertia } from '@inertiajs/inertia';
import IncidentAnalytic from '@/sections/@dashboard/incident/IncidentAnalytic';
import { fTimestamp } from '@/utils/formatTime';
import { useSwal } from '@/hooks/useSwal';
import usePermission from '@/hooks/usePermission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'injured', label: 'Injured', align: 'left' },
	{ id: 'site', label: 'Site', align: 'center' },
	{ id: 'location', label: 'Location', align: 'center' },
	{ id: 'engineer', label: 'Engineer', align: 'left' },
	{ id: 'firstAider', label: 'firstAider', align: 'left' },
	{ id: 'incident_date', label: 'Date Occured', align: 'left' },
	{ id: 'lti', label: 'LTI', align: 'left' },
	{ id: 'severity', label: 'Severity', align: 'left' },
	{ id: '' },
];

// ----------------------------------------------------------------------

export default function IncidentList ({ incidents = [], types }) {
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
		defaultOrderBy: 'incident_date',
	});

	const theme = useTheme();

	const { themeStretch } = useSettingsContext();

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState('all');

	const [filterCause, setFilterCause] = useState([]);

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);


	const dataFiltered = applyFilter({
		inputData: incidents,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterCause,
		filterStartDate,
		filterEndDate,
	});


	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterStatus !== 'all' || !!filterCause.length || !!filterStartDate || !!filterEndDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus) || (!dataFiltered.length && !!filterCause.length);

	const getSeverityLength = (severity) => incidents.filter(incident => incident.severity === severity).length;

	const getPercentBySeverity = (severity) => (getSeverityLength(severity) / dataFiltered.length) * 100;

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: incidents.length },
		{ value: 'Minor', label: 'Minor', color: 'success', count: getSeverityLength("Minor") },
		{ value: 'Significant', label: 'Significant', color: 'info', count: getSeverityLength("Significant") },
		{ value: 'Major', label: 'Major', color: 'warning', count: getSeverityLength("Major") },
		{ value: 'Fatality', label: 'Fatality', color: 'warning', count: getSeverityLength("Fatality") },
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

	const handleFilterCause = (event) => {
		setPage(0);
		setFilterCause(event.target.value);
	};

	const handleFilterStatusTabs = (_event, newValue) => {
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
		Inertia.post(route('incident.management.destroy'), { ids: [id] }, {
			preserveState: true,
			preserveScroll: true,
			onStart () {
				setOpenConfirm(false);
				load("Deleting incident", "please wait...");
			},
			onFinish () {
				setSelected([]);
				stop();
			}
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('incident.management.destroy'), { ids: selected }, {
			preserveState: true,
			preserveScroll: true,
			onStart () {
				setOpenConfirm(false);
				load("Deleting incident", "please wait...");
			},
			onFinish () {
				setSelected([]);
				stop();
			}
		});
	};


	const handleResetFilter = () => {
		setFilterName('');
		setFilterCause([]);
		setFilterStatus('all');
		setFilterStartDate(null);
		setFilterEndDate(null);
	};

	const canCreate = hasPermission("incident_create");
	const canEdit = hasPermission("incident_edit");
	const canDelete = hasPermission("incident_delete");
	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Incident List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{ name: 'List' },
					]}
					action={
						canCreate && (
							<Button
								href={route("incident.management.create")}
								component={Link}
								preserveScroll
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New Incident
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
							<IncidentAnalytic
								title="Total"
								total={dataFiltered.length}
								percent={100}
								icon="ph:person-arms-spread-fill"
								color={theme.palette.info.main}
							/>
							<IncidentAnalytic
								title="Minor"
								total={getSeverityLength("Minor")}
								percent={getPercentBySeverity("Minor")}
								icon="ph:person-arms-spread-fill"
								color={theme.palette.success.main}
							/>
							<IncidentAnalytic
								title="Significant"
								total={getSeverityLength("Significant")}
								percent={getPercentBySeverity("Significant")}
								icon="ph:person-arms-spread-fill"
								color={theme.palette.info.main}
							/>
							<IncidentAnalytic
								title="Major"
								total={getSeverityLength("Major")}
								percent={getPercentBySeverity("Major")}
								icon="ph:person-arms-spread-fill"
								color={theme.palette.warning.main}
							/>
							<IncidentAnalytic
								title="Fatality"
								total={getSeverityLength("Fatality")}
								percent={getPercentBySeverity("Fatality")}
								icon="ph:person-arms-spread-fill"
								color={theme.palette.error.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Tabs
						value={filterStatus}
						onChange={(handleFilterStatusTabs)}
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
					<IncidentTableToolbar
						types={types}
						filterName={filterName}
						filterCause={filterCause}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onFilterName={handleFilterName}
						onFilterCause={handleFilterCause}
						isFiltered={isFiltered}
						onFilterStartDate={handleFilterStartDate}
						onFilterEndDate={handleFilterEndDate}
						onResetFilter={handleResetFilter}
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
									sx={{ whiteSpace: "nowrap" }}
								/>

								<TableBody>
									{dataFiltered
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) =>
											row ? (
												<IncidentTableRow
													key={row.id}
													row={row}
													selected={selected.includes(row.id)}
													onSelectRow={() => onSelectRow(row.id)}
													onDeleteRow={() => handleDeleteRow(row.id)}
													canEdit={canEdit}
													canDelete={canDelete}
												/>
											) : (
												!isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
											)
										)}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, incidents.length)} />

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

function applyFilter ({ inputData, comparator, filterName, filterStatus, filterCause, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((incident) =>
			incident.form_number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			incident.location.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			incident.site.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterStatus !== 'all') {
		inputData = inputData.filter(incident => incident.severity === filterStatus);
	}

	if (filterCause.length !== 0) {
		inputData = inputData.filter(incident => filterCause.includes(incident.root_cause));
	}

	if (filterStartDate && !filterEndDate) {
		inputData = inputData.filter((incident) => fTimestamp(incident.incident_date) >= filterStartDate.setHours(0, 0, 0, 0));
	}

	if (!filterStartDate && filterEndDate) {
		inputData = inputData.filter((incident) => fTimestamp(incident.date_expired) <= filterEndDate.setHours(0, 0, 0, 0));
	}

	if (filterStartDate && filterEndDate) {
		inputData = inputData.filter(
			(incident) =>
				fTimestamp(incident.incident_date) >= filterStartDate.setHours(0, 0, 0, 0) &&
				fTimestamp(incident.incident_date) <= filterEndDate.setHours(0, 0, 0, 0)
		);
	}


	return inputData;
}
