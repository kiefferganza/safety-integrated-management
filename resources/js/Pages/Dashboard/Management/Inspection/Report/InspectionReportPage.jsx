import { useEffect, useState } from 'react';
// @mui
const { Divider, Card, Table, TableBody, Container, TableContainer, Checkbox, TableCell, TableRow, Stack, Tooltip, IconButton, useTheme } = await import('@mui/material');
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
import Scrollbar from '@/Components/scrollbar';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import { InspectionReportTableToolbar } from '@/sections/@dashboard/inspection/list';
import InspectionAnalytic from '@/sections/@dashboard/inspection/InspectionAnalytic';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'id', label: "Ref #", align: "left" },
	{ id: 'title', label: 'Description', align: 'left', width: 480 },
	{ id: 'table', label: 'Section Title', align: 'left' },
	{ id: 'negative', label: 'Negative', align: 'left' },
	{ id: 'positive', label: 'Positive', align: 'left' },
	{ id: 'closed', label: 'Closed', align: 'left' }
];

// ----------------------------------------------------------------------

const PPEReportListPage = ({ inspectionReport = {}, from = null, to = null }) => {
	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		setPage,
		//
		// selected,
		// setSelected,
		// onSelectRow,
		// onSelectAllRows,
		//
		//
		onSort,
		onChangeDense,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable({
		defaultRowsPerPage: 40,
		defaultDense: true
	});

	const { themeStretch } = useSettingsContext();
	const theme = useTheme();

	const [filterStartDate, setFilterStartDate] = useState(from ? new Date(from) : null);
	const [filterEndDate, setFilterEndDate] = useState(to ? new Date(to) : null);

	const [filterName, setFilterName] = useState('');

	const [filterType, setFilterType] = useState([]);

	const dataFiltered = applyFilter({
		inputData: Object.values(inspectionReport),
		comparator: getComparator(order, orderBy),
		filterName,
		filterType
	});

	useEffect(() => {
		if (from && to) {
			setFilterStartDate(new Date(from));
			setFilterEndDate(new Date(to));
		}
	}, [from, to]);

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterType.length > 0 || (filterStartDate !== null && filterEndDate !== null);

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;


	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterType = (event) => {
		setFilterType(event.target.value);
	}

	const handleResetFilter = () => {
		setFilterName('');
		setFilterType([]);
		setFilterEndDate(null);
		setFilterStartDate(null);
		if (filterStartDate && filterEndDate) {
			Inertia.get(route('inspection.management.report'), {}, {
				preserveScroll: true,
				preserveState: true
			});
		}
	};

	const handleStartDateChange = (newDate) => {
		setFilterStartDate(newDate);
		if (filterEndDate) {
			filterDate(newDate, filterEndDate);
		}
	}

	const handleEndDateChange = (newDate) => {
		setFilterEndDate(newDate);
		if (filterStartDate) {
			filterDate(filterStartDate, newDate);
		}
	}

	const filterDate = (start, end) => {
		const dates = {
			from: format(start, 'yyyy-MM-dd'),
			to: format(end, 'yyyy-MM-dd'),
		}
		Inertia.get(route('inspection.management.report'), dates, {
			preserveScroll: true,
			preserveState: true
		});
	}

	const handleAcceptEndDate = (newDate) => {
		if (filterStartDate) {
			filterDate(filterStartDate, newDate);
		}
	}

	const handleAcceptStartDate = (newDate) => {
		if (filterEndDate) {
			filterDate(newDate, filterEndDate);
		}
	}

	const totals = dataFiltered.reduce((acc, curr) => ({
		closed: acc.closed + curr.closed,
		positive: acc.positive + (curr.negative === 0 ? 0 : curr.positive),
		negative: acc.negative + curr.negative
	}), {
		closed: 0,
		positive: 0,
		negative: 0
	});

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Inspection Report List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Inspection List',
							href: PATH_DASHBOARD.inspection.list,
						},
						{
							name: 'Report'
						}
					]}
				/>
				<Card sx={{ mb: 5 }}>
					<Scrollbar>
						<Stack
							direction="row"
							divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
							sx={{ py: 2 }}
						>
							<InspectionAnalytic
								title="Negative"
								total={totals.negative}
								percent={100}
								icon="heroicons:document-minus"
								color={theme.palette.warning.main}
								itemTitle="total"
							/>

							<InspectionAnalytic
								title="Positive"
								total={totals.positive}
								percent={100}
								icon="heroicons:document-check"
								color={theme.palette.success.main}
								itemTitle="total"
							/>

							<InspectionAnalytic
								title="Closed"
								total={totals.closed}
								percent={100}
								icon="heroicons:document-arrow-up"
								color={theme.palette.info.main}
								itemTitle="total"
							/>
						</Stack>
					</Scrollbar>
				</Card>
				<Card>
					<InspectionReportTableToolbar
						filterName={filterName}
						onFilterName={handleFilterName}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onStartDateChange={handleStartDateChange}
						onEndDateChange={handleEndDateChange}
						isFiltered={isFiltered}
						filterType={filterType}
						onFilterType={handleFilterType}
						onResetFilter={handleResetFilter}
						onAcceptStartDate={handleAcceptStartDate}
						onAcceptEndDate={handleAcceptEndDate}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							// numSelected={selected.length}
							rowCount={dataFiltered.length}
						// onSelectAllRows={(checked) =>
						// 	onSelectAllRows(
						// 		checked,
						// 		dataFiltered.map((row) => row.id)
						// 	)
						// }
						// action={
						// 	<Stack direction="row">
						// 		<Tooltip title="Print">
						// 			<IconButton color="primary">
						// 				<Iconify icon="eva:printer-fill" />
						// 			</IconButton>
						// 		</Tooltip>
						// 	</Stack>
						// }
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={Object.values(inspectionReport).length}
									onSort={onSort}
									// onSelectAllRows={(checked) =>
									// 	onSelectAllRows(
									// 		checked,
									// 		dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id)
									// 	)
									// }
									sx={{
										"&>tr th": { whiteSpace: "nowrap" }
									}}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) => {
											// const isSelected = selected.includes(row.id);
											return (
												<TableRow
													key={row.title}
													hover
													// selected={isSelected}
													sx={{ width: 1, borderBottom: 1, borderColor: "background.neutral" }}
												>
													<TableCell align="left">{row.id > 34 ? "" : "#" + row.id}</TableCell>
													{/* <TableCell padding="checkbox">
														<Checkbox checked={isSelected} />
													</TableCell> */}
													<TableCell align="left">{row.title}</TableCell>
													<TableCell align="left">{row.table}</TableCell>
													<TableCell align="left">{row.negative}</TableCell>
													<TableCell align="left">{row.positive}</TableCell>
													<TableCell align="left">{row.closed}</TableCell>
												</TableRow>
											)
										})}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, Object.values(inspectionReport).length)} />

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
						rowsPerPageOptions={[5, 10, 25, 40]}
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

function applyFilter ({ inputData, comparator, filterName, filterType }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((ins) =>
			ins.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			ins.table.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterType.length > 0) {
		inputData = inputData.filter((ins) => filterType.indexOf(ins.table) !== -1);
	}

	return inputData;
}

export default PPEReportListPage