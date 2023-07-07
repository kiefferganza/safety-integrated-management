import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { useSwal } from '@/hooks/useSwal';
// @mui
const { Card, Table, Button, Tooltip, TableBody, Container, IconButton, TableContainer, Stack, Divider, useTheme, Tabs, Tab } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
import { Inertia } from '@inertiajs/inertia';
// utils
import { fTimestamp } from '@/utils/formatTime';
// components
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
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import ConfirmDialog from '@/Components/confirm-dialog';
import Label from '@/Components/label';
// sections
import { StoreTableRow, StoreTableToolbar } from '@/sections/@dashboard/operation/store/list';
import { getInventoryStatus } from '@/utils/formatStatuses';
// import usePermission from '@/hooks/usePermission';
const { StoreAnalytic } = await import('@/sections/@dashboard/operation/store/StoreAnalytic');

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'item', label: 'Product', align: 'left' },
	{ id: 'qty', label: 'Qty/Min', align: 'left' },
	{ id: 'unit', label: 'Unit', align: 'left' },
	{ id: 'price', label: 'Price', align: 'left' },
	{ id: 'created_at', label: 'Date Created', align: 'left' },
	{ id: 'updated_at', label: 'Date Updated', align: 'left' },
	{ id: 'status', label: 'Status', align: 'left', width: 180 },
	{ id: '' },
];

const STATUS_OPTIONS = [
	{ value: 'in_stock', label: 'In stock' },
	{ value: 'need_reorder', label: 'Need Reorder' },
	{ value: 'low_stock', label: 'Low stock' },
	{ value: 'out_of_stock', label: 'Out of stock' },
];

// ----------------------------------------------------------------------

export default function StoreListPage ({ stores }) {
	// const [hasPermission] = usePermission();
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
		defaultOrderBy: 'date_created',
		defaultOrder: 'desc'
	});

	const theme = useTheme();
	const { themeStretch } = useSettingsContext();

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState([]);

	const [filterByStatus, setFilterByStatus] = useState("all");

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);

	useEffect(() => {
		if (stores?.length) {
			setTableData(stores.map((inv) => ({
				...inv,
				status: getInventoryStatus(inv.qty, inv.min_qty)
			})));
		}
	}, [stores]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterByStatus,
		filterName,
		filterStatus,
		filterStartDate,
		filterEndDate
	});

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterByStatus !== "all" || filterStartDate !== null || filterEndDate !== null || filterName !== '' || !!filterStatus.length;

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

	const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

	const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: tableData.length },
		{ value: 'in_stock', label: 'In Stock', color: 'success', count: getLengthByStatus('in_stock') },
		{ value: 'need_reorder', label: 'Need Reorder', color: 'info', count: getLengthByStatus('need_reorder') },
		{ value: 'low_stock', label: 'Low Stock', color: 'warning', count: getLengthByStatus('low_stock') },
		{ value: 'out_of_stock', label: 'Out Of Stock', color: 'error', count: getLengthByStatus('out_of_stock') }
	];


	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterByStatus = (_e, newValue) => {
		setPage(0);
		setFilterByStatus(newValue);
	}

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterStatus = (event) => {
		setPage(0);
		setFilterStatus(event.target.value);
	};

	const handleDeleteRow = (id) => {
		Inertia.delete(route('store.management.destroy'), { ids: [id] }, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				load("Deleting item", "please wait...")
			},
			onFinish () {
				setPage(0);
				stop();
			}
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.delete(route('store.management.destroy'), { ids: selected }, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				load("Deleting item", "please wait...")
			},
			onFinish () {
				setPage(0);
				setSelected([]);
				stop();
			}
		});
	};

	const handleResetFilter = () => {
		setFilterByStatus("all");
		setFilterName('');
		setFilterStatus([]);
		setFilterStartDate(null);
		setFilterEndDate(null);
	};

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Product List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Store',
							href: PATH_DASHBOARD.store.root,
						},
						{ name: 'List' },
					]}
					action={
						(
							<Button
								href={PATH_DASHBOARD.store.create}
								component={Link}
								preserveScroll
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New Product
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
							<StoreAnalytic
								title="Total"
								total={tableData.length}
								percent={100}
								icon="ri:luggage-cart-line"
								color={theme.palette.info.main}
							/>

							<StoreAnalytic
								title="In Stock"
								total={getLengthByStatus("in_stock")}
								percent={getPercentByStatus("in_stock")}
								icon="bi:cart-check"
								color={theme.palette.success.main}
							/>

							<StoreAnalytic
								title="Need Reorder"
								total={getLengthByStatus("need_reorder")}
								percent={getPercentByStatus("need_reorder")}
								icon="bi:cart3"
								color={theme.palette.info.main}
							/>

							<StoreAnalytic
								title="Low Stock"
								total={getLengthByStatus("low_stock")}
								percent={getPercentByStatus("low_stock")}
								icon="bi:cart-dash"
								color={theme.palette.warning.main}
							/>

							<StoreAnalytic
								title="Out Of Stock"
								total={getLengthByStatus("out_of_stock")}
								percent={getPercentByStatus("out_of_stock")}
								icon="carbon:shopping-cart-clear"
								color={theme.palette.error.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Tabs
						value={filterByStatus}
						onChange={handleFilterByStatus}
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

					<StoreTableToolbar
						filterName={filterName}
						filterStatus={filterStatus}
						onFilterName={handleFilterName}
						onFilterStatus={handleFilterStatus}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onFilterStartDate={(newValue) => {
							if (filterEndDate) {
								setFilterEndDate(null);
							}
							setFilterStartDate(newValue);
						}}
						onFilterEndDate={(newValue) => {
							setFilterEndDate(newValue);
						}}
						statusOptions={STATUS_OPTIONS}
						isFiltered={isFiltered}
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
									tableData.map((row) => row.inventory_id)
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
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) =>
											<StoreTableRow
												key={row.id}
												row={row}
												selected={selected.includes(row.id)}
												onSelectRow={() => onSelectRow(row.id)}
												onDeleteRow={() => handleDeleteRow(row.id)}
											/>
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

function applyFilter ({ inputData, comparator, filterByStatus, filterName, filterStatus, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterByStatus !== 'all') {
		inputData = inputData.filter((product) => product.status === filterByStatus);
	}

	if (filterName) {
		inputData = inputData.filter((product) => product.item.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterStatus.length) {
		inputData = inputData.filter((product) => filterStatus.includes(product.status));
	}

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(product => fTimestamp(new Date(product.date_updated)) >= startDateTimestamp);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(
			(product) =>
				fTimestamp(product.date_updated) >= startDateTimestamp &&
				fTimestamp(product.date_updated) <= endDateTimestamp
		);
	}

	return inputData;
}
