import { useEffect, useState } from "react";
import { Link as InertiaLink } from "@inertiajs/inertia-react";
// mui
const { Container, Card, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableRow, useTheme, Link } = await import("@mui/material");
// utils
import { fTimestamp } from "@/utils/formatTime";
// Components
import {
	useTable,
	getComparator,
	emptyRows,
	TableNoData,
	TableEmptyRows,
	TableHeadCustom,
	TablePaginationCustom,
} from '@/Components/table';
import Scrollbar from "@/Components/scrollbar"
import Label from "@/Components/label";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
import { PATH_DASHBOARD } from "@/routes/paths";
import { fCurrencyNumberAndSymbol } from "@/utils/formatNumber";
import { sentenceCase } from "change-case";
import Image from "@/Components/image/Image";
const { PpeAnalytic } = await import("@/sections/@dashboard/ppe/PpeAnalytic");
const { PpeReportTableToolbar } = await import("@/sections/@dashboard/ppe/details/PpeReportTableToolbar");

const TABLE_HEAD = [
	{ id: 'inventory_id', label: '#', align: 'left' },
	{ id: 'item', label: 'Product', align: 'left' },
	{ id: 'inboundTotalQty', label: 'Quantity Received', align: 'center' },
	{ id: 'outboundTotalQty', label: 'Quantity Issued', align: 'center' },
	{ id: 'qty', label: 'Remaining Quantity', align: 'center' },
	{ id: 'min_qty', label: 'Reorder Level', align: 'center' },
	{ id: 'item_price', label: 'Price', align: 'left' },
	{ id: 'outboundMinQty', label: 'Min Order', align: 'left' },
	{ id: 'outboundMaxQty', label: 'Max Order', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center' },
];

const PPEReportPage = ({ inventories }) => {
	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		setPage,
		//
		onSort,
		onChangeDense,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable({
		defaultDense: true,
		defaultRowsPerPage: inventories.length || 5
	});
	const theme = useTheme();
	const { themeStretch } = useSettingsContext();

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState("");

	const [filterStatus, setFilterStatus] = useState([]);

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	useEffect(() => {
		if (inventories) {
			const data = inventories.map((inv) => ({
				...inv,
				status: getStatus(inv.current_stock_qty, inv.min_qty)
			}))
			setTableData(data || []);
		}
	}, [inventories]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterStartDate,
		filterEndDate
	});

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterStatus = (event) => {
		setPage(0);
		setFilterStatus(event.target.value);
	};

	const denseHeight = dense ? 64 : 80;

	const isFiltered = filterStartDate !== null || filterEndDate !== null || filterName !== '' || filterStatus.length !== 0;

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

	const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

	const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus([]);
		setFilterStartDate(null);
		setFilterEndDate(null);
		setPage(0);
	};

	const totals = dataFiltered.reduce((acc, curr) => ({
		totalOrder: acc.totalOrder + (curr?.outboundTotalQty || 0),
		totalReceived: acc.totalReceived + (curr?.inboundTotalQty || 0)
	}), {
		totalOrder: 0,
		totalReceived: 0
	});

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="PPE Report"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{
						name: 'PPE',
						href: PATH_DASHBOARD.ppe.root,
					},
					{ name: 'Report' },
				]}
			/>

			<Card sx={{ mb: 5 }}>
				<Scrollbar>
					<Stack
						direction="row"
						divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
						sx={{ py: 2 }}
					>
						<PpeAnalytic
							title="Total"
							total={dataFiltered.length}
							percent={100}
							icon="ri:luggage-cart-line"
							color={theme.palette.info.main}
						/>

						<PpeAnalytic
							title="Order Quantity"
							total={totals.totalOrder}
							percent={100}
							icon="material-symbols:vertical-align-top"
							color={theme.palette.success.main}
						/>

						<PpeAnalytic
							title="Received Quantity"
							total={totals.totalReceived}
							percent={100}
							icon="material-symbols:vertical-align-bottom"
							color={theme.palette.info.main}
						/>

						<PpeAnalytic
							title="In Stock"
							total={getLengthByStatus("in_stock")}
							percent={getPercentByStatus("in_stock")}
							icon="bi:cart-check"
							color={theme.palette.success.main}
						/>

						<PpeAnalytic
							title="Low Stock"
							total={getLengthByStatus("low_stock")}
							percent={getPercentByStatus("low_stock")}
							icon="bi:cart-dash"
							color={theme.palette.warning.main}
						/>

						<PpeAnalytic
							title="Out Of Stock"
							total={getLengthByStatus("out_of_stock")}
							percent={getPercentByStatus("out_of_stock")}
							icon="carbon:shopping-cart-clear"
							color={theme.palette.error.main}
						/>

						<PpeAnalytic
							title="Full"
							total={getLengthByStatus("full")}
							percent={getPercentByStatus("full")}
							icon="bi:cart-fill"
							color={theme.palette.success.main}
						/>
					</Stack>
				</Scrollbar>
			</Card>

			<Card>
				<PpeReportTableToolbar
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
					isFiltered={isFiltered}
					onResetFilter={handleResetFilter}
				/>
				<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
					<Scrollbar>
						<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
							<TableHeadCustom
								order={order}
								orderBy={orderBy}
								headLabel={TABLE_HEAD}
								rowCount={tableData.length}
								onSort={onSort}
								sx={{
									borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									whiteSpace: "nowrap",
									'& th': { backgroundColor: 'transparent' },
								}}
							/>

							<TableBody>
								{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) =>
									<TableRow
										key={row.inventory_id}
										sx={{
											borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										}}
									>
										<TableCell>{idx + 1}</TableCell>
										<TableCell>
											<Stack direction="row" alignItems="center" spacing={2}>
												<Image
													disabledEffect
													visibleByDefault
													alt={row.item}
													src={row.img_src ? `/storage/media/photos/inventory/${row.img_src}` : '/storage/assets/placeholder.svg'}
													sx={{ borderRadius: 1.5, width: 48, height: 48 }}
												/>
												<Link href={PATH_DASHBOARD.ppe.view(row.slug)} component={InertiaLink} noWrap variant="subtitle2" sx={{ cursor: 'pointer', textTransform: 'capitalize' }}>{row.item}</Link>
											</Stack>
										</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{(row?.inboundTotalQty || 0).toLocaleString()}</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{(row?.outboundTotalQty || 0).toLocaleString()}</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{(row?.current_stock_qty || 0).toLocaleString()}</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{row.min_qty}</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">{fCurrencyNumberAndSymbol(row.item_price, row.item_currency)}</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">
											<span style={{ display: "block" }}>{(row?.outboundMinQty || 0).toLocaleString()} Item</span>
											<span style={{ display: "block" }}>{fCurrencyNumberAndSymbol((row.outboundMinQty || 0) * row.item_price, row.item_currency)}</span>
										</TableCell>
										<TableCell sx={{ whiteSpace: "nowrap" }} align="left">
											<span style={{ display: "block" }}>{(row?.outboundMaxQty || 0).toLocaleString()} Item </span>
											<span style={{ display: "block" }}>{fCurrencyNumberAndSymbol((row.outboundMaxQty || 0) * row.item_price, row.item_currency)}</span>
										</TableCell>
										<TableCell align="center">
											<Label
												variant="soft"
												color={
													(row.status === 'out_of_stock' && 'error') || (row.status === 'low_stock' && 'warning') || 'success'
												}
												sx={{ textTransform: 'capitalize' }}
											>
												{row.status ? sentenceCase(row.status) : ''}
											</Label>
										</TableCell>
									</TableRow>
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
					rowsPerPageOptions={[5, 10, 25, inventories.length || 30]}
				/>
			</Card>
		</Container>
	)
}

function getStatus (qty, minQty) {
	if (qty <= 0) return "out_of_stock";
	if (qty >= minQty) return "full";
	if (minQty >= qty) return "low_stock"
	return "in_stock"
}

function applyFilter ({ inputData, comparator, filterName, filterStatus, filterStartDate, filterEndDate }) {
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

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(product => fTimestamp(new Date(product.date_created)) >= startDateTimestamp);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(
			(product) =>
				fTimestamp(product.date_created) >= startDateTimestamp &&
				fTimestamp(product.date_created) <= endDateTimestamp
		);
	}

	return inputData;
}

export default PPEReportPage