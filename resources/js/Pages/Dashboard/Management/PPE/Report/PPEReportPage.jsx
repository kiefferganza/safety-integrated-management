import { useEffect, useState } from "react";
import { Link as InertiaLink } from "@inertiajs/inertia-react";
const { PDFViewer } = await import('@react-pdf/renderer');
// mui
const {
	Button,
	Box,
	Container,
	Card,
	Checkbox,
	Dialog,
	DialogActions,
	Divider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Tooltip,
	IconButton,
	useTheme,
	Link
} = await import("@mui/material");
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
	TableSelectedAction,
} from '@/Components/table';
import Scrollbar from "@/Components/scrollbar"
import Label from "@/Components/label";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
import { PATH_DASHBOARD } from "@/routes/paths";
import { fCurrencyNumberAndSymbol } from "@/utils/formatNumber";
import { sentenceCase } from "change-case";
import Image from "@/Components/image/Image";
import Iconify from "@/Components/iconify/Iconify";
import PpePDF from "@/sections/@dashboard/ppe/details/PpePDF";
import { getInventoryStatus } from "@/utils/formatStatuses";
const { NewPpeReport } = await import("@/sections/@dashboard/ppe/portal/NewPpeReport");
const { PpeAnalytic } = await import("@/sections/@dashboard/ppe/PpeAnalytic");
const { PpeReportTableToolbar } = await import("@/sections/@dashboard/ppe/details/PpeReportTableToolbar");

const TABLE_HEAD = [
	{ id: 'item', label: 'Product', align: 'left' },
	{ id: 'inboundTotalQty', label: 'Quantity Received', align: 'center' },
	{ id: 'outboundTotalQty', label: 'Quantity Issued', align: 'center' },
	{ id: 'current_stock_qty', label: 'Remaining Quantity', align: 'center' },
	{ id: 'min_qty', label: 'Reorder Level', align: 'center' },
	{ id: 'item_price', label: 'Price', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center' },
];

const PPEReportPage = ({ inventories, employees, sequence_no, submittedDates }) => {
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

	const [openNewReport, setOpenNewReport] = useState(false);

	const [open, setOpen] = useState(false);

	const handleOpenNewReport = () => {
		setOpenNewReport(true);
	}

	const handleCloseNewReport = () => {
		setSelected([]);
		setOpenNewReport(false);
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


	useEffect(() => {
		if (inventories) {
			const data = inventories.map((inv) => ({
				...inv,
				status: getInventoryStatus(inv.current_stock_qty, inv.min_qty)
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

	const getLengthByStatus = (status) => dataFiltered.filter((item) => item.status === status).length;

	const getPercentByStatus = (status) => (getLengthByStatus(status) / dataFiltered.length) * 100;

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStatus([]);
		setFilterStartDate(null);
		setFilterEndDate(null);
		setPage(0);
	};

	const totals = dataFiltered.reduce((acc, curr) => ({
		totalOrder: acc.totalOrder + (curr?.outboundTotalQty || 0),
		totalReceived: acc.totalReceived + (curr?.inboundTotalQty || 0),
		subtotal: acc.subtotal + (curr.item_price * curr?.min_qty || 0)
	}), {
		totalOrder: 0,
		totalReceived: 0,
		subtotal: 0
	});

	const list = tableData.filter(data => selected.includes(data.inventory_id));

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Generate PPE Report"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'New PPE',
							href: PATH_DASHBOARD.ppe.report,
						},
						{
							name: 'PPE List',
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
								title="Subtotal"
								rawTotal={`IQD ${(totals?.subtotal || 0)?.toLocaleString()}`}
								percent={100}
								icon="mdi:money"
								color={theme.palette.success.main}
							/>

							<PpeAnalytic
								title="In Stock"
								total={getLengthByStatus("in_stock")}
								percent={getPercentByStatus("in_stock")}
								icon="bi:cart-check"
								color={theme.palette.info.main}
							/>

							<PpeAnalytic
								title="Need Reorder"
								total={getLengthByStatus("need_reorder")}
								percent={getPercentByStatus("need_reorder")}
								icon="bi:cart3"
								color={theme.palette.info.main}
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
								<Stack direction="row" spacing={1}>
									<Tooltip title="Preview">
										<IconButton color="primary" onClick={handleOpen}>
											<Iconify icon="eva:eye-fill" />
										</IconButton>
									</Tooltip>
									<Button onClick={handleOpenNewReport}>
										Generate Budget Forecast
									</Button>
								</Stack>
							}
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={dataFiltered.length}
									onSort={onSort}
									sx={{
										borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										whiteSpace: "nowrap",
										'& th': { backgroundColor: 'transparent' },
									}}
									onSelectAllRows={(checked) =>
										onSelectAllRows(
											checked,
											dataFiltered.map((row) => row.inventory_id)
										)
									}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) =>
										<TableRow
											key={row.inventory_id}
											sx={{
												borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
											}}
										>
											<TableCell padding="checkbox">
												<Checkbox
													checked={selected.includes(row.inventory_id)}
													onClick={() => onSelectRow(row.inventory_id)}
												/>
											</TableCell>
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
											<TableCell align="center">
												<Label
													variant="soft"
													color={
														(row.status === 'out_of_stock' && 'error') || (row.status === 'low_stock' && 'warning') || (row.status === 'need_reorder' && 'info') || 'success'
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
			<Dialog fullScreen open={open}>
				<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<DialogActions
						sx={{
							zIndex: 9,
							padding: '12px !important',
							boxShadow: (theme) => theme.customShadows.z8,
						}}
					>
						<Tooltip title="Close">
							<IconButton color="inherit" onClick={handleClose}>
								<Iconify icon="eva:close-fill" />
							</IconButton>
						</Tooltip>
					</DialogActions>

					<Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
						<PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
							<PpePDF report={{ inventories: list }} />
						</PDFViewer>
					</Box>
				</Box>
			</Dialog>
			<NewPpeReport
				open={openNewReport}
				onClose={handleCloseNewReport}
				inventories={list}
				employees={employees}
				sequence_no={sequence_no}
				submittedDates={submittedDates}
			/>
		</>
	)
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

export default PPEReportPage