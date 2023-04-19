import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
const {
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
} = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// utils
import { fTimestamp } from '@/utils/formatTime';
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
import { Link } from '@inertiajs/inertia-react';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';
const { ToolboxTalkTableRow, ToolboxTalkTableToolbar } = await import('@/sections/@dashboard/toolboxtalks/list');
import ToolboxTalkAnalytic from '@/sections/@dashboard/toolboxtalks/ToolboxTalkAnalytic';
import { formatCms } from '@/utils/tablesUtils';
import { endOfMonth } from 'date-fns';
import usePermission from '@/hooks/usePermission';

// ----------------------------------------------------------------------

const TYPES = {
	'All': 0,
	'Civil': 1,
	'Electrical': 2,
	'Mechanical': 3,
	'Camp': 4,
	'Office': 5,
};

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: 'left' },
	{ id: 'description', label: 'Job', align: 'left' },
	{ id: 'conducted_by', label: 'Conducted By', align: 'left' },
	{ id: 'location', label: 'Location', align: 'left' },
	{ id: 'participants_count', label: 'Participants', align: 'left' },
	{ id: 'date_conducted', label: 'Date Conducted', align: 'left' },
	{ id: 'attachment', label: 'Attachment', align: 'left' },
	{ id: '' },
];

const TABLE_HEAD_ALL = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: 'left' },
	{ id: 'description', label: 'Job', align: 'left' },
	{ id: 'conducted_by', label: 'Conducted By', align: 'left' },
	{ id: 'location', label: 'Location', align: 'left' },
	{ id: 'participants_count', label: 'Participants', align: 'left' },
	{ id: 'date_conducted', label: 'Date Conducted', align: 'left' },
	{ id: 'attachment', label: 'Attachment', align: 'left' },
	{ id: 'tbt_type', label: 'TBT Type', align: 'left' },
	{ id: '' },
];


const ToolboxTalkListPage = ({ tbt, moduleName = 'Civil', type = "1", selectType = false, addTypeHeader = false }) => {
	const [hasPermission] = usePermission();
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
		defaultOrderBy: "date_created",
		defaultOrder: "desc"
	});

	const [openConfirm, setOpenConfirm] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const [filterType, setFilterType] = useState([]);

	const { dataFiltered, analytic } = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType,
		filterStartDate,
		filterEndDate
	});

	useEffect(() => {
		const data = tbt?.map(toolbox => ({
			...toolbox,
			id: toolbox.tbt_id,
			cms: formatCms(toolbox),
			attachment: toolbox.file.length > 0 ? "Y" : "N",
			participants_count: toolbox.participants?.length
		}));
		setTableData(data);
	}, [tbt]);


	const denseHeight = dense ? 56 : 76;

	const isFiltered = filterName !== '' || !!filterStartDate || filterEndDate;

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterStartDate);


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

	const handleFilterType = (event) => {
		const {
			target: { value },
		} = event;
		const isAll = value.some(val => val === "All");
		let newVal = typeof value === 'string' ? value.split(',') : value;

		const isAllChecked = filterType.some(val => val === "All");

		if (typeof value !== 'string') {
			if (isAllChecked && !isAll) {
				newVal = [];
			} else if (isAll && (newVal.length === 1 || newVal.at(-1) === "All")) {
				newVal = [
					'All',
					'Civil',
					'Electrical',
					'Mechanical',
					'Camp',
					'Office',
				]
			} else {
				newVal = value.filter(val => val !== "All");
			}
		}
		setPage(0);
		setFilterType(newVal);
	};

	const handleDeleteRow = (id) => {
		Inertia.post(route('toolboxtalk.management.delete'), { ids: [id] }, {
			onStart: () => {
				load("Deleting toolbox talk", "Please wait...");
			},
			onFinish: stop,
			preserveScroll: true
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('toolboxtalk.management.delete'), { ids: selected }, {
			onStart: () => {
				load(`Deleting ${selected.length} toolbox talks`, "Please wait...");
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
		setFilterStartDate(null);
		setFilterEndDate(null);
		setFilterType([]);
	};

	const canCreate = hasPermission("talk_toolbox_create");
	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Toolbox Talk List"
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
						canCreate && (
							<Button
								href={PATH_DASHBOARD.toolboxTalks.new(type)}
								component={Link}
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New ToolboxTalk
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
							<ToolboxTalkAnalytic
								title="Total"
								total={dataFiltered.length}
								percent={100}
								icon="heroicons:document-chart-bar"
								color={theme.palette.info.main}
							/>

							<ToolboxTalkAnalytic
								title="Location"
								total={analytic.location}
								percent={100}
								icon="material-symbols:location-on"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Average Month"
								total={analytic.average}
								percent={100}
								icon="mdi:percent-circle-outline"
								color={theme.palette.warning.main}
							/>

							<ToolboxTalkAnalytic
								title="Man Hours"
								total={analytic.manHours}
								percent={100}
								icon="tabler:clock-hour-3"
								color={theme.palette.warning.main}
							/>

							<ToolboxTalkAnalytic
								title="Manpower"
								total={analytic.manpower}
								percent={100}
								icon="akar-icons:people-group"
								color={theme.palette.success.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<ToolboxTalkTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						filterType={filterType}
						onFilterType={handleFilterType}
						onResetFilter={handleResetFilter}
						selectType={selectType}
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
							numSelected={selected.length}
							rowCount={dataFiltered.length}
							onSelectAllRows={(checked) =>
								onSelectAllRows(
									checked,
									dataFiltered.map((row) => row.id)
								)
							}
							action={
								<Stack direction="row">
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
									headLabel={addTypeHeader ? TABLE_HEAD_ALL : TABLE_HEAD}
									rowCount={tableData.length}
									numSelected={selected.length}
									onSort={onSort}
									onSelectAllRows={(checked) =>
										onSelectAllRows(
											checked,
											dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id)
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
											addTypeHeader={addTypeHeader}
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
	filterType,
	filterStartDate,
	filterEndDate,
}) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);
	let analytic = getAverage(inputData);

	if (filterName) {
		inputData = inputData.filter((toolbox) =>
			toolbox.cms.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			toolbox.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(toolbox => (new Date(toolbox.date_conducted).setHours(0, 0, 0, 0)) >= startDateTimestamp);
	}

	if (filterType.length !== 0 && !filterType.includes("All")) {
		const types = filterType.map(ft => TYPES[ft]);
		inputData = inputData.filter((toolbox) => types.indexOf(+toolbox.tbt_type) !== -1);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter((toolbox) => {
			const dateConducted = new Date(toolbox.date_conducted).setHours(0, 0, 0, 0);
			return (dateConducted >= startDateTimestamp && dateConducted <= endDateTimestamp)
		});
		analytic = getAverage(inputData, filterStartDate, filterEndDate);
	} else {
		analytic = getAverage(inputData);
	}

	return {
		dataFiltered: inputData,
		analytic
	};
}


const currentStartMonth = fTimestamp(new Date(2000, 0, 1));
const currentEndMonth = fTimestamp(endOfMonth(new Date));

function getAverage (data, start = null, end = null) {
	const startMonth = start ? fTimestamp(start) : currentStartMonth;
	const endMonth = end ? fTimestamp(end) : currentEndMonth;
	const locations = [];

	const tbtByMonth = data.reduce((acc, toolbox) => {
		if (fTimestamp(toolbox.date_conducted) >= startMonth && fTimestamp(toolbox.date_conducted) <= endMonth) {
			if (toolbox.date_conducted in acc) {
				// acc[toolbox.date_conducted].hours += toolbox.participants.reduce((acc, curr) => acc += curr.pivot.time || 0, 0);
				acc[toolbox.date_conducted].hours += toolbox.participants.reduce((acc) => acc += 9, 0);
				acc[toolbox.date_conducted].participants += toolbox.participants.length;
				acc[toolbox.date_conducted].location += 1;
			} else {
				acc[toolbox.date_conducted] = {
					// hours: toolbox.participants.reduce((acc, curr) => acc += curr.pivot.time || 0, 0),
					hours: toolbox.participants.reduce((acc) => acc += 9, 0),
					participants: toolbox.participants.length,
				}
			}
			locations.push(toolbox.location.trim());
		}
		return acc;
	}, {});
	const tbtByMonthArr = Object.values(tbtByMonth);

	const calculate = tbtByMonthArr.reduce((acc, curr) => {
		acc.manpower += curr.participants;
		acc.manHoursTotal += curr.hours;
		return acc;
	}, {
		manpower: 0,
		manHoursTotal: 0
	});

	const manHours = calculate.manHoursTotal;
	const average = Math.ceil(calculate.manpower / tbtByMonthArr.length);
	const locationSet = new Set(locations);

	return {
		...calculate,
		location: locationSet.size,
		manHours,
		average
	};
}

export default ToolboxTalkListPage