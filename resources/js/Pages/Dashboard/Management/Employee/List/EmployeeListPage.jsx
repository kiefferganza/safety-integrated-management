
import { useEffect, useMemo, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
	Tab,
	Tabs,
	Card,
	Table,
	Stack,
	Button,
	Tooltip,
	Divider,
	TableBody,
	Container,
	IconButton,
	TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import ConfirmDialog from '@/Components/confirm-dialog';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import {
	useTable,
	getComparator,
	emptyRows,
	TableNoData,
	TableEmptyRows,
	TableHeadCustom,
	TableSelectedAction,
	TablePaginationCustom,
} from '@/Components/table';
// sections
import EmployeeAnalytic from '@/sections/@dashboard/employee/EmployeeAnalytic';
import { EmployeeTableRow, EmployeeTableToolbar } from '@/sections/@dashboard/employee/list';
import { Head, Link } from '@inertiajs/inertia-react';
import { getFullName } from '@/utils/formatName';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';
import EmployeeAssignment from '../EmployeeAssignment';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'name', label: 'Name', align: 'left' },
	{ id: 'date_created', label: 'Create', align: 'left' },
	{ id: 'position', label: 'Position', align: 'left' },
	{ id: 'department', label: 'Department', align: 'left' },
	// { id: 'nationality', label: 'Nationality', align: 'left' },
	{ id: 'country', label: 'Country', align: 'left' },
	{ id: 'phone_no', label: 'Phone No.', align: 'left' },
	{ id: 'is_active', label: 'Status', align: 'left' },
	{ id: '' },
];

// ----------------------------------------------------------------------

export default function EmployeeListPage ({ employees, unassignedUsers, canWrite }) {
	const theme = useTheme();

	const { themeStretch } = useSettingsContext();
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
	} = useTable();

	const [openAssign, setOpenAssign] = useState(false);
	const [empAssignData, setEmpAssignData] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState('all');

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [filterDepartment, setFilterDepartment] = useState('all');

	const [filterPosition, setFilterPosition] = useState('all');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterDepartment,
		filterPosition,
		filterStatus,
		filterStartDate,
		filterEndDate,
	});

	useEffect(() => {
		const data = employees?.map(employee => ({
			...employee,
			id: employee.employee_id,
			name: getFullName(employee),
			status: employee.is_active === 0 ? "active" : "inactive",
			phone_no: employee.phone_no == 0 ? "N/A" : employee.phone_no
		}));
		setTableData(data || []);
	}, [employees]);

	const denseHeight = dense ? 56 : 76;

	const isFiltered =
		filterStatus !== 'all' || filterName !== '' || filterDepartment !== 'all' || filterPosition !== 'all' || !!filterStartDate;

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterStatus) ||
		(!dataFiltered.length && !!filterDepartment) ||
		(!dataFiltered.length && !!filterPosition) ||
		(!dataFiltered.length && !!filterEndDate) ||
		(!dataFiltered.length && !!filterStartDate);

	const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

	const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

	const getUnassignedEmployeeLength = () => tableData.filter((item) => !item.user_id).length;

	const getPercentUnassignedEmployee = () => (getUnassignedEmployeeLength() / tableData.length) * 100;

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: tableData.length },
		{ value: 'active', label: 'Active', color: 'success', count: getLengthByStatus('active') },
		{ value: 'inactive', label: 'Inactive', color: 'warning', count: getLengthByStatus('inactive') },
		{ value: 'unassigned', label: 'Unassigned', color: 'error', count: getUnassignedEmployeeLength() }
	];

	const OPTIONS = useMemo(() => ({
		departments: ['all', ...new Set(employees.map(emp => emp.department))],
		positions: ['all', ...new Set(employees.map(emp => emp.position))]
	}), [employees]);

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterStatus = (event, newValue) => {
		setPage(0);
		setFilterStatus(newValue);
	};

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterDepartment = (event) => {
		setPage(0);
		setFilterDepartment(event.target.value);
	};

	const handleFilterPosition = (event) => {
		setPage(0);
		setFilterPosition(event.target.value);
	};

	const handleDeleteRow = (id) => {
		Inertia.delete(`/dashboard/employee/${id}/delete`, {
			onStart: () => {
				load("Deleting company", "Please wait...");
			},
			onFinish: stop,
			preserveScroll: true
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('management.employee.delete-multiple'), { ids: selected }, {
			onStart: () => {
				load(`Deleting ${selected.length} companies`, "Please wait...");
			},
			onFinish: () => {
				setSelected([]);
				setPage(0);
				stop();
			},
			preserveScroll: true
		});
	};

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus('all');
		setFilterDepartment('all');
		setFilterPosition('all');
		setFilterEndDate(null);
		setFilterStartDate(null);
	};

	const handleOpenAssignment = (emp) => {
		setEmpAssignData(emp);
		setOpenAssign(true);
	}

	const handleCloseAssignment = () => {
		setEmpAssignData(null);
		setOpenAssign(false);
	}

	return (
		<>
			<Head>
				<title>Employee: List</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Employee List"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Employee',
							href: PATH_DASHBOARD.general.employee,
						},
						{
							name: 'List',
						},
					]}
					action={
						canWrite ? (
							<Button
								href={PATH_DASHBOARD.employee.new}
								component={Link}
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New Employee
							</Button>
						) : null
					}
				/>

				<Card sx={{ mb: 5 }}>
					<Scrollbar>
						<Stack
							direction="row"
							divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
							sx={{ py: 2 }}
						>
							<EmployeeAnalytic
								title="Total"
								total={tableData.length}
								percent={100}
								icon="material-symbols:supervisor-account"
								color={theme.palette.info.main}
							/>

							<EmployeeAnalytic
								title="Active"
								total={getLengthByStatus('active')}
								percent={getPercentByStatus('active')}
								icon="mdi:account-badge"
								color={theme.palette.success.main}
							/>

							<EmployeeAnalytic
								title="Inactive"
								total={getLengthByStatus('inactive')}
								percent={getPercentByStatus('inactive')}
								icon="mdi:account-clock"
								color={theme.palette.warning.main}
							/>

							<EmployeeAnalytic
								title="Unassigned"
								total={getUnassignedEmployeeLength()}
								percent={getPercentUnassignedEmployee()}
								icon="mdi:account-cancel"
								color={theme.palette.error.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Tabs
						value={filterStatus}
						onChange={handleFilterStatus}
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

					<EmployeeTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						filterDepartment={filterDepartment}
						filterPosition={filterPosition}
						filterEndDate={filterEndDate}
						onFilterName={handleFilterName}
						optionsDepartments={OPTIONS.departments}
						optionsPositions={OPTIONS.positions}
						filterStartDate={filterStartDate}
						onResetFilter={handleResetFilter}
						onFilterDepartment={handleFilterDepartment}
						onFilterPosition={handleFilterPosition}
						onFilterStartDate={(newValue) => {
							setFilterStartDate(newValue);
						}}
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
								<Stack direction="row">
									<Tooltip title="Print">
										<IconButton color="primary">
											<Iconify icon="eva:printer-fill" />
										</IconButton>
									</Tooltip>

									<Tooltip title="Delete">
										<IconButton color="primary" onClick={handleOpenConfirm}>
											<Iconify icon="eva:trash-2-outline" />
										</IconButton>
									</Tooltip>
								</Stack>
							}
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<EmployeeTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
											onAssign={handleOpenAssignment}
											canWrite={canWrite}
										/>
									))}

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

			<EmployeeAssignment
				open={openAssign}
				onClose={handleCloseAssignment}
				employee={empAssignData}
				unassignedUsers={unassignedUsers}
			/>

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

function applyFilter ({
	inputData,
	comparator,
	filterName,
	filterStatus,
	filterDepartment,
	filterPosition,
	filterStartDate,
}) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter(
			(employee) => employee.name.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterStatus !== 'all') {
		if (filterStatus === 'unassigned') {
			inputData = inputData.filter((employee) => !employee.user_id);
		} else {
			inputData = inputData.filter((employee) => employee.status === filterStatus);
		}
	}

	if (filterDepartment !== 'all') {
		console.log(inputData);
		inputData = inputData.filter((employee) => employee.department === filterDepartment);
	}

	if (filterPosition !== 'all') {
		inputData = inputData.filter((employee) => employee.position === filterPosition);
	}

	if (filterStartDate) {
		const filterDate = fDate(filterStartDate);
		inputData = inputData.filter(emp => fDate(emp.date_created) === filterDate);
	}

	return inputData;
}
