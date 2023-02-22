
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { Card, Table, Button, Tooltip, TableBody, Container, IconButton, TableContainer } from '@mui/material';
// redux
import { useDispatch, useSelector } from '@/redux/store';
import { getProducts } from '@/redux/slices/product';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
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
// sections
import { ProductTableRow, ProductTableToolbar } from '@/sections/@dashboard/e-commerce/list';
import { Head, Link } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'item', label: 'Product', align: 'left' },
	{ id: 'current_stock_qty', label: 'Qty/Min', align: 'left' },
	{ id: 'try', label: 'Unit', align: 'left' },
	{ id: 'item_price', label: 'Price', align: 'right' },
	{ id: 'date_created', label: 'Date Created', align: 'left' },
	{ id: 'date_updated', label: 'Date Updated', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center', width: 180 },
	{ id: '' },
];

const STATUS_OPTIONS = [
	{ value: 'in_stock', label: 'In stock' },
	{ value: 'low_stock', label: 'Low stock' },
	{ value: 'out_of_stock', label: 'Out of stock' },
];

// ----------------------------------------------------------------------

export default function PPEListPage ({ inventory }) {
	console.log({ inventory })
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

	const { themeStretch } = useSettingsContext();

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState([]);

	const [openConfirm, setOpenConfirm] = useState(false);

	useEffect(() => {
		if (inventory?.length) {
			setTableData(inventory.map((inv) => ({
				...inv,
				status: getStatus(inv.current_stock_qty, inv.min_qty)
			})));
		}
	}, [inventory]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
	});

	const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || !!filterStatus.length;

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

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

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus([]);
	};

	return (
		<>
			<Head>
				<title> PPE: Product List</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Product List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'PPE',
							// href: PATH_DASHBOARD.eCommerce.root,
						},
						{ name: 'List' },
					]}
					action={
						<Button
							// to={PATH_DASHBOARD.eCommerce.new}
							component={Link} preserveScroll
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New Product
						</Button>
					}
				/>

				<Card>
					<ProductTableToolbar
						filterName={filterName}
						filterStatus={filterStatus}
						onFilterName={handleFilterName}
						onFilterStatus={handleFilterStatus}
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
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) =>
											<ProductTableRow
												key={row.inventory_id}
												row={row}
												selected={selected.includes(row.inventory_id)}
												onSelectRow={() => onSelectRow(row.inventory_id)}
												onDeleteRow={() => handleDeleteRow(row.inventory_id)}
												onEditRow={() => handleEditRow(row.item)}
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

function getStatus (qty, minQty) {
	if (qty <= 0) return "out_of_stock";
	if (qty === minQty) return "full";
	if (Math.ceil((minQty / 2.5)) >= qty) return "low_stock"
	return "in_stock"
}

// ----------------------------------------------------------------------

function applyFilter ({ inputData, comparator, filterName, filterStatus }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((product) => product.item.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterStatus.length) {
		inputData = inputData.filter((product) => filterStatus.includes(product.status));
	}

	return inputData;
}
