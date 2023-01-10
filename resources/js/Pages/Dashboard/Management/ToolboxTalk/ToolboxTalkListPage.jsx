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
	TableContainer
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
import { Link } from '@inertiajs/inertia-react';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';
import { ToolboxTalkTableRow, ToolboxTalkTableToolbar } from '@/sections/@dashboard/toolboxtalks/list';
import ToolboxTalkAnalytic from '@/sections/@dashboard/toolboxtalks/ToolboxTalkAnalytic';
import { formatCms } from '@/utils/tablesUtils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: 'left' },
	{ id: 'conducted_by', label: 'Conducted By', align: 'left' },
	{ id: 'location', label: 'Location', align: 'left' },
	{ id: 'participants_count', label: 'Participants', align: 'left' },
	{ id: 'date_conducted', label: 'Date Conducted', align: 'left' },
	{ id: 'status', label: 'Status', align: 'left' },
	{ id: '' },
];


const ToolboxTalkListPage = ({ tbt, moduleName = 'Civil', type = "1" }) => {
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
		// defaultOrderBy: "date_issued",
		// defaultOrder: "desc"
	});

	const [openConfirm, setOpenConfirm] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStatus, setFilterStatus] = useState('all');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterStartDate,
	});

	useEffect(() => {
		const data = tbt?.map(toolbox => ({
			...toolbox,
			id: toolbox.tbt_id,
			cms: formatCms(toolbox),
			participants_count: toolbox.participants?.length,
			status: getStatus(toolbox?.status)
		}));
		setTableData(data);
	}, [tbt]);


	const getStatus = (status) => {
		switch (status) {
			case "0":
				return {
					text: "Incomplete",
					code: "0",
					statusClass: "warning"
				}
			case "1":
				return {
					text: "Completed",
					code: "1",
					statusClass: "success"
				}
			default:
				return {
					text: "Pending",
					statusClass: "default"
				}
		}
	}


	const denseHeight = dense ? 56 : 76;

	const isFiltered = filterName !== '' || !!filterStartDate || filterStatus !== 'all';

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterStatus) ||
		(!dataFiltered.length && !!filterStartDate);

	const getLengthByStatus = (status) => tableData.filter((item) => item.status.code === status).length;

	const TABS = [
		{ value: 'all', label: 'All', color: 'info', count: tableData.length },
		{ value: '1', label: 'Completed', color: 'success', count: getLengthByStatus('1') },
		{ value: '0', label: 'Incomplete', color: 'error', count: getLengthByStatus('0') },
	];

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterStatus = (_event, newValue) => {
		setPage(0);
		setFilterStatus(newValue);
	}

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleDeleteRow = (id) => {
		// Inertia.post(route('inspection.management.delete'), { ids: [id] }, {
		// 	onStart: () => {
		// 		load("Deleting company", "Please wait...");
		// 	},
		// 	onFinish: stop,
		// 	preserveScroll: true
		// });
	};

	const handleDeleteRows = (selected) => {
		// Inertia.post(route('inspection.management.delete'), { ids: selected }, {
		// 	onStart: () => {
		// 		load(`Deleting ${selected.length} companies`, "Please wait...");
		// 	},
		// 	onFinish: () => {
		// 		setSelected([]);
		// 		setPage(0);
		// 		stop();
		// 	},
		// 	preserveScroll: true
		// });
	};

	const handleResetFilter = () => {
		setFilterName('');
		setFilterStartDate(null);
		setFilterStatus('all');
	};

	const ANALYTIC = useMemo(() => {
		return tbt.reduce((acc, curr) => {
			acc.manpower += curr.participants.length;
			acc.manHours += curr.participants.reduce((acc, curr) => acc += curr.pivot.time || 0, 0)
			if (curr.status === "1") {
				acc.completed++;
			} else {
				acc.incomplete++;
			}
			return acc;
		}, {
			manpower: 0,
			manHours: 0,
			completed: 0,
			incomplete: 0,
		});
	}, [tbt]);

	const getStatusPercent = (total) => (total / tableData.length) * 100;

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Inpection List"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: moduleName
						},
						{
							name: 'List',
						},
					]}
					action={
						<Button
							href={PATH_DASHBOARD.toolboxTalks.new(type)}
							component={Link}
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New ToolboxTalk
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
							<ToolboxTalkAnalytic
								title="Total"
								total={tableData.length}
								percent={100}
								icon="heroicons:document-chart-bar"
								color={theme.palette.info.main}
							/>

							<ToolboxTalkAnalytic
								title="Completed"
								total={ANALYTIC.completed}
								percent={getStatusPercent(ANALYTIC.completed)}
								icon="carbon:task-complete"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Incomplete"
								total={ANALYTIC.incomplete}
								percent={getStatusPercent(ANALYTIC.incomplete)}
								icon="ic:baseline-pending-actions"
								color={theme.palette.warning.main}
							/>

							<ToolboxTalkAnalytic
								title="Man Hours"
								total={ANALYTIC.manHours}
								percent={100}
								icon="tabler:clock-hour-3"
								color={theme.palette.warning.main}
							/>

							<ToolboxTalkAnalytic
								title="Participants"
								total={ANALYTIC.manpower}
								percent={100}
								icon="akar-icons:people-group"
								color={theme.palette.success.main}
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

					<ToolboxTalkTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterStartDate={filterStartDate}
						onResetFilter={handleResetFilter}
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
									sx={{
										"&>tr th": { whiteSpace: "nowrap" }
									}}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<ToolboxTalkTableRow
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


// ----------------------------------------------------------------------

function applyFilter ({
	inputData,
	comparator,
	filterName,
	filterStatus,
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
			(toolbox) => toolbox.cms.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterStatus !== 'all') {
		inputData = inputData.filter((toolbox) => toolbox.status.code === filterStatus);
	}

	if (filterStartDate) {
		const filterDate = fDate(filterStartDate);
		inputData = inputData.filter(toolbox => fDate(toolbox.date_conducted) === filterDate);
	}

	return inputData;
}


export default ToolboxTalkListPage