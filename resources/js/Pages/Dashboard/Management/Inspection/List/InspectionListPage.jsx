import { useEffect, useState } from 'react';
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
	Typography,
	Box,
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
// import EmployeeAnalytic from '@/sections/@dashboard/employee/EmployeeAnalytic';
import { Head, Link } from '@inertiajs/inertia-react';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';
import { employeeName } from '@/utils/formatName';
import { InspectionTableRow, InspectionTableToolbar } from '@/sections/@dashboard/inspection/list';
import InspectionAnalytic from '@/sections/@dashboard/inspection/InspectionAnalytic';
import { differenceInDays } from 'date-fns';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'accompanied_by', label: 'Accompanied', align: 'left' },
	{ id: 'inspected_by', label: 'Submitted', align: 'center' },
	{ id: 'reviewer', label: 'Action', align: 'center' },
	{ id: 'verifier', label: 'Verify', align: 'center' },
	{ id: 'date_issued', label: 'Created', align: 'left' },
	{ id: 'totalObservation', label: 'No. Obs', align: 'right' },
	{ id: 'negativeObservation', label: 'No. Obs closeout', align: 'right' },
	{ id: 'positiveObservation', label: 'No. Positive Obs', align: 'right' },
	{ id: 'status', label: 'Status', align: 'center' },
	{ id: '' },
];


const InspectionListPage = ({ user, inspections }) => {
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
	} = useTable({
		defaultOrderBy: "date_issued",
		defaultOrder: "desc"
	});

	const [openConfirm, setOpenConfirm] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterType, setFilterType] = useState('all');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType,
		filterStartDate,
	});

	useEffect(() => {
		const data = inspections?.map(inspection => ({
			...inspection,
			id: inspection.inspection_id,
			reviewer: employeeName(inspection.reviewer).trim(),
			verifier: employeeName(inspection.verifier).trim(),
			status: getInspectionStatus(inspection.status),
			type: getInspectionType({
				employee_id: inspection.employee_id,
				reviewer_id: inspection.reviewer_id,
				verifier_id: inspection.verifier_id,
				status: inspection.status,
			}),
			totalObservation: getNumberOfObservation(inspection.report_list),
			positiveObservation: getNumberOfPositiveObservation(inspection.report_list),
			negativeObservation: getNumberOfNegativeObservation(inspection.report_list),
			dueStatus: getDueDateStatus(inspection.date_due)
		}));
		setTableData(data || []);
	}, [user, inspections]);


	const getInspectionType = ({ employee_id, reviewer_id, verifier_id, status }) => {
		if (employee_id === user.emp_id) {
			return 'submitted';
		} else if (reviewer_id === user.emp_id && (status === 1 || status === 4)) {
			return 'review';
		} else if (verifier_id === user.emp_id && status === 2) {
			return 'verify';
		} else if (status !== 0) {
			return 'closeout';
		}
		return 'closeout';
	}


	const denseHeight = dense ? 56 : 76;

	const isFiltered =
		filterType !== 'all' || filterName !== '' || !!filterStartDate;

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterType) ||
		(!dataFiltered.length && !!filterStartDate);

	const getLengthByType = (type) => tableData.filter((item) => item.type === type).length;

	const getPercentByType = (type) => (getLengthByType(type) / tableData.length) * 100;

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: tableData.length },
		{ value: 'submitted', label: 'Submitted', color: 'default', count: getLengthByType('submitted') },
		{ value: 'review', label: 'Review', color: 'warning', count: getLengthByType('review') },
		{ value: 'verify', label: 'Verify & Approve', color: 'success', count: getLengthByType('verify') },
		{ value: 'closeout', label: 'Closeout', color: 'error', count: getLengthByType('closeout') }
	];

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterType = (event, newValue) => {
		setPage(0);
		setFilterType(newValue);
	};


	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleDeleteRow = (id) => {
		Inertia.post(route('inspection.management.delete'), { ids: [id] }, {
			onStart: () => {
				load("Deleting company", "Please wait...");
			},
			onFinish: stop,
			preserveScroll: true
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('inspection.management.delete'), { ids: selected }, {
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
		setFilterType('all');
		setFilterStartDate(null);
	};

	return (
		<>
			<Head>
				<title>Inpection: List</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Inpection List"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Inspection'
						},
						{
							name: 'List',
						},
					]}
					action={
						<Button
							href={PATH_DASHBOARD.inspection.new}
							component={Link}
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New Inspection
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
							<InspectionAnalytic
								title="Total"
								total={tableData.length}
								percent={100}
								icon="heroicons:document-chart-bar"
								color={theme.palette.info.main}
							/>

							<InspectionAnalytic
								title="Submitted"
								total={getLengthByType('submitted')}
								percent={getPercentByType('submitted')}
								icon="heroicons:document-magnifying-glass"
								color={theme.palette.success.main}
							/>

							<InspectionAnalytic
								title="Review"
								total={getLengthByType('review')}
								percent={getPercentByType('review')}
								icon="heroicons:document-minus"
								color={theme.palette.warning.main}
							/>

							<InspectionAnalytic
								title="Verify & Approve"
								total={getLengthByType('verify')}
								percent={getPercentByType('verify')}
								icon="heroicons:document-check"
								color={theme.palette.error.main}
							/>

							<InspectionAnalytic
								title="Closeout"
								total={getLengthByType('closeout')}
								percent={getPercentByType('closeout')}
								icon="heroicons:document-arrow-up"
								color={theme.palette.success.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Tabs
						value={filterType}
						onChange={handleFilterType}
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

					<InspectionTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterStartDate={filterStartDate}
						onResetFilter={handleResetFilter}
						onFilterStartDate={(newValue) => {
							setFilterStartDate(newValue);
						}}
						right={
							<Box>
								<Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>Legends:</Typography>
								<Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
									<Label variant="outlined" color="warning">I P = In Progress</Label>
									<Label variant="outlined" color="error">W F C = Waiting For Closure</Label>
									<Label variant="outlined" color="success">C = Closed</Label>
								</Stack>
								<Stack direction="row" justifyContent="space-between" gap={1}>
									<Label variant="outlined" color="error">F R = For Revision</Label>
									<Label variant="outlined" color="success">A.D. = Active Days</Label>
									<Label variant="outlined" color="error">O.D = Overdue Days</Label>
								</Stack>
							</Box>
						}
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
									sx={{
										"&>tr th": { whiteSpace: "nowrap" }
									}}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<InspectionTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
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


const getNumberOfObservation = (reports) => reports.filter(report => report.ref_score !== 0 && report.ref_score !== 4).length;


const getNumberOfPositiveObservation = (reports) => reports.filter(report => report.ref_score === 1).length;

const getNumberOfNegativeObservation = (reports) => reports.filter(report => (report.ref_score === 2 || report.ref_score === 3) && report.item_status !== "2" && report.item_status !== null).length;


const getInspectionStatus = (status) => {
	let result = {
		code: status,
		classType: 'default',
		text: '',
		tooltip: '',
	};
	switch (status) {
		case 1:
		case 0:
			result.classType = 'warning';
			result.text = 'I P';
			result.tooltip = 'In Progress';
			break;
		case 2:
			result.classType = 'error';
			result.text = 'W F C';
			result.tooltip = 'Waiting For Closure';
			break;
		case 3:
			result.classType = 'success';
			result.text = 'C';
			result.tooltip = 'Closed';
			break;
		default:
			result.classType = 'error';
			result.text = 'F R'
			result.tooltip = 'For Revision'
	}
	return result;
}


const getDueDateStatus = (dueDate) => {
	const diff = differenceInDays(new Date(dueDate), new Date);

	if (diff === 0) {
		return {
			text: "A.T.",
			tooltip: "Active Today",
			classType: "warning"
		}
	}

	return {
		text: diff > 0 ? `${diff} A.D.` : `${Math.abs(diff)} O.D.`,
		tooltip: diff > 0 ? `Active ${diff} days` : `Overdue ${Math.abs(diff)}`,
		classType: diff > 0 ? "success" : "error"
	}
}


// ----------------------------------------------------------------------

function applyFilter ({
	inputData,
	comparator,
	filterName,
	filterType,
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
			(inspection) => inspection.form_number.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterType !== 'all') {
		inputData = inputData.filter((inspection) => inspection.type === filterType);
	}

	if (filterStartDate) {
		const filterDate = fDate(filterStartDate);
		inputData = inputData.filter(insp => fDate(insp.date_issued) === filterDate);
	}

	return inputData;
}


export default InspectionListPage