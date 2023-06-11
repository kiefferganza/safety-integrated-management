import { paramCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
	Tab,
	Tabs,
	Card,
	Table,
	Button,
	Tooltip,
	Divider,
	TableBody,
	Container,
	IconButton,
	TableContainer,
	Stack,
	useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _userList } from '@/_mock/arrays';
// components
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
import { UserTableToolbar, UserTableRow } from '@/sections/@dashboard/user/list';
import { Link } from '@inertiajs/inertia-react';
import Label from '@/Components/label';
import { getCurrentUserName } from '@/utils/formatName';
import { fDate } from '@/utils/formatTime';
import EmployeeAnalytic from '@/sections/@dashboard/employee/EmployeeAnalytic';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
	'all',
	'admin',
	'user',
];

const TABLE_HEAD = [
	{ id: 'name', label: 'Name', align: 'left' },
	{ id: 'username', label: 'Username', align: 'left' },
	{ id: 'email', label: 'Email', align: 'left' },
	{ id: 'date_created', label: 'Date Created', align: 'left' },
	{ id: 'user_type', label: 'Type', align: 'left' },
	{ id: 'status', label: 'Status', align: 'left' },
	{ id: '' },
];

// ----------------------------------------------------------------------

export default function UserListPage ({ users }) {
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
		defaultOrderBy: "date_created",
		defaultOrder: "desc"
	});

	const { themeStretch } = useSettingsContext();
	const theme = useTheme();

	const [tableData, setTableData] = useState(() => users.map(user => ({ ...user, name: getCurrentUserName(user) })));

	const [openConfirm, setOpenConfirm] = useState(false);

	const [filterCreatedDate, setFilterCreatedDate] = useState(null);

	const [filterName, setFilterName] = useState('');

	const [filterRole, setFilterRole] = useState('all');

	const [filterStatus, setFilterStatus] = useState('all');

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterRole,
		filterStatus,
		filterCreatedDate
	});

	const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const denseHeight = dense ? 52 : 72;

	const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all' || filterCreatedDate !== null;

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterRole) ||
		(!dataFiltered.length && !!filterStatus) ||
		(!dataFiltered.length && !!filterCreatedDate);


	const getLengthByStatus = (status) => {
		if (status === 'active') {
			return dataFiltered.filter((item) => item.status === 1).length;
		} else {
			return dataFiltered.filter((item) => item.status !== 1).length;
		}
	}

	const getPercentByStatus = (status) => (getLengthByStatus(status) / dataFiltered.length) * 100;

	const STATUS_OPTIONS = [
		{ value: 'all', label: 'All', color: 'info', count: dataFiltered.length },
		{ value: 'active', label: 'Active', color: 'success', count: getLengthByStatus('active') },
		{ value: 'deactivated', label: 'Deactivated', color: 'error', count: getLengthByStatus('deactivated') }
	];

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

	const handleFilterType = (event) => {
		setPage(0);
		setFilterRole(event.target.value);
	};

	const handleFilterCreatedDate = (date) => {
		setPage(0);
		setFilterCreatedDate(fDate(date));
	}

	const handleDeleteRow = (id) => {
		const deleteRow = tableData.filter((row) => row.user_id !== id);
		setSelected([]);
		setTableData(deleteRow);

		if (page > 0) {
			if (dataInPage.length < 2) {
				setPage(page - 1);
			}
		}
	};

	const handleDeleteRows = (selected) => {
		const deleteRows = tableData.filter((row) => !selected.includes(row.user_id));
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

	const handleResetFilter = () => {
		setFilterName('');
		setFilterRole('all');
		setFilterStatus('all');
		setFilterCreatedDate(null);
	};

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Your Team"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{ name: 'User', href: PATH_DASHBOARD.user.root },
						{ name: 'List' },
					]}
					action={
						<Button
							href={PATH_DASHBOARD.user.new}
							component={Link} preserveScroll
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New User
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
							<EmployeeAnalytic
								title="Total"
								total={dataFiltered.length}
								percent={100}
								icon="material-symbols:supervisor-account"
								color={theme.palette.info.main}
								listTitle="user"
							/>

							<EmployeeAnalytic
								title="Activated"
								total={getLengthByStatus('active')}
								percent={getPercentByStatus('active')}
								icon="mdi:account-badge"
								color={theme.palette.success.main}
								listTitle="user"
							/>

							<EmployeeAnalytic
								title="Deactivated"
								total={getLengthByStatus('inactive')}
								percent={getPercentByStatus('inactive')}
								icon="mdi:account-cancel"
								color={theme.palette.error.main}
								listTitle="user"
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
						{STATUS_OPTIONS.map((tab) => (
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

					<UserTableToolbar
						isFiltered={isFiltered}
						filterName={filterName}
						filterRole={filterRole}
						filterCreatedDate={filterCreatedDate}
						optionsRole={ROLE_OPTIONS}
						onFilterName={handleFilterName}
						onFilterRole={handleFilterType}
						onResetFilter={handleResetFilter}
						onFilterCreatedDate={handleFilterCreatedDate}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							numSelected={selected.length}
							rowCount={dataFiltered.length}
							onSelectAllRows={(checked) =>
								onSelectAllRows(
									checked,
									dataFiltered.map((row) => row.user_id)
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
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
											dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.user_id)
										)
									}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<UserTableRow
											key={row.user_id}
											row={row}
											selected={selected.includes(row.user_id)}
											onSelectRow={() => onSelectRow(row.user_id)}
											onDeleteRow={() => handleDeleteRow(row.user_id)}
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

function applyFilter ({ inputData, comparator, filterName, filterStatus, filterRole, filterCreatedDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterStatus !== 'all') {
		if (filterStatus === 'active') {
			inputData = inputData.filter((user) => user.status === 1);
		} else {
			inputData = inputData.filter((user) => user.status !== 1);
		}
	}

	if (filterRole !== 'all') {
		if (filterRole === 'admin') {
			inputData = inputData.filter((user) => user.user_type === 0);
		} else if (filterRole === 'user') {
			inputData = inputData.filter((user) => user.user_type === 1);
		}
	}

	if (filterCreatedDate !== null) {
		inputData = inputData.filter((user) => fDate(user.date_created) === filterCreatedDate);
	}

	return inputData;
}
