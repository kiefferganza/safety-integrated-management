import { useEffect, useState } from 'react';
import { useSwal } from '@/hooks/useSwal';
// @mui
const { Card, Table, TableBody, Container, TableContainer } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
import { Inertia } from '@inertiajs/inertia';
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
import Scrollbar from '@/Components/scrollbar';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import { ReportTableRow, ReportTableToolbar } from '@/sections/@dashboard/ppe/list';
import { Divider, Stack, Tab, Tabs } from '@mui/material';
import Label from '@/Components/label/Label';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'contract_no', label: 'Contract No.', align: 'left' },
	{ id: 'location', label: 'Location', align: 'left' },
	{ id: 'conducted_by', label: 'Conducted By', align: 'right' },
	{ id: 'inventory_start_date', label: 'Inventory Date', align: 'left' },
	{ id: 'budget_forcast_date', label: 'Budget Forecast Date', align: 'left' },
	{ id: 'submitted_date', label: 'Submitted Date', align: 'left' },
	{ id: 'submitted_id', label: 'Submitted By', align: 'left' },
	{ id: 'status', label: 'Status', align: 'left' },
	{ id: '' },
];

// ----------------------------------------------------------------------

const PPEReportListPage = ({ inventoryReports = [] }) => {
	const { auth: { user } } = usePage().props;
	const { load, stop } = useSwal();
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
		defaultOrderBy: 'created_at',
		defaultOrder: 'desc'
	});

	const { themeStretch } = useSettingsContext();

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterType, setFilterType] = useState('submitted');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);


	useEffect(() => {
		const data = inventoryReports.map((report) => ({
			...report,
			type: getReportType(report)
		}));
		setTableData(data);
	}, [inventoryReports]);


	const getReportType = (report) => {
		if (report.submitted_id === user?.emp_id) {
			return "submitted";
		}
		if (report.reviewer_id === user?.emp_id && report.status === "in_review") {
			return "";
		}
		if (report.approved_id === user?.emp_id && report.status !== "in_review") {
			return "approve";
		}
		return "";
	}


	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType,
		filterStartDate,
		filterEndDate
	});

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterType !== "submitted" || !!filterStartDate || !!filterEndDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

	const getLengthByType = (type) => tableData.filter((item) => item.type === type).length;

	const TABS = [
		{ value: 'submitted', label: 'Submitted', color: 'default', count: getLengthByType('submitted') },
		{ value: 'review', label: 'Review', color: 'warning', count: getLengthByType('review') },
		{ value: 'approve', label: 'Verify & Approve', color: 'success', count: getLengthByType('approve') },
		{ value: 'control', label: 'Control', color: 'error', count: inventoryReports.length },
	];


	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleDeleteRow = (id) => {
		Inertia.post(route('ppe.management.destroy'), { ids: [id] }, {
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


	const handleFilterType = (_event, value) => {
		setPage(0);
		setFilterType(value);
	}

	const handleResetFilter = () => {
		setFilterName('');
		setFilterType('submitted');
		setFilterStartDate(null);
		setFilterEndDate(null);
	};

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Report List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'PPE',
							href: PATH_DASHBOARD.ppe.root,
						},
						{
							name: 'Report',
							href: PATH_DASHBOARD.ppe.report,
						}
					]}
				/>
				<Card>
					<Stack direction="row" alignItems="center" sx={{ px: 2, bgcolor: 'background.neutral' }}>
						<Tabs
							value={filterType}
							onChange={handleFilterType}
							sx={{ width: 1, flex: .5 }}
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
					</Stack>

					<Divider />

					<ReportTableToolbar
						filterName={filterName}
						onFilterName={handleFilterName}
						isFiltered={isFiltered}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onResetFilter={handleResetFilter}
						onFilterStartDate={(newValue) => {
							if (filterEndDate) {
								setFilterEndDate(null);
							}
							setFilterStartDate(newValue);
						}}
						onFilterEndDate={(newValue) => {
							setFilterEndDate(newValue);
						}}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							rowCount={inventoryReports.length}
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={inventoryReports.length}
									onSort={onSort}
									sx={{ whiteSpace: "nowrap" }}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) =>
											<ReportTableRow
												key={row.id}
												row={row}
												onDeleteRow={() => handleDeleteRow(row.id)}
											/>
										)}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, inventoryReports.length)} />

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
		</>
	)
}

// ----------------------------------------------------------------------

function applyFilter ({ inputData, comparator, filterName, filterType, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((report) => report.form_number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterType !== 'control') {
		inputData = inputData.filter((report) => report.type === filterType);
	}

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(report => new Date(report.submitted_date).setHours(0, 0, 0, 0) >= startDateTimestamp);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(
			(report) =>
				new Date(report.submitted_date).setHours(0, 0, 0, 0) >= startDateTimestamp &&
				new Date(report.submitted_date).setHours(0, 0, 0, 0) <= endDateTimestamp
		);
	}

	return inputData;
}

export default PPEReportListPage