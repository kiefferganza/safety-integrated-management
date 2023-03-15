import { useState } from 'react';
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
import Iconify from '@/Components/iconify';
// sections
import { InspectionReportTableToolbar } from '@/sections/@dashboard/inspection/list';
import InspectionAnalytic from '@/sections/@dashboard/inspection/InspectionAnalytic';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'section_title', label: 'Description', align: 'left', width: 480 },
	{ id: 'table_name', label: 'Section Title', align: 'left' },
	{ id: 'negative', label: 'Negative', align: 'right' },
	{ id: 'positive', label: 'Positive', align: 'right' },
	{ id: 'closed', label: 'Closed', align: 'right' }
];

// ----------------------------------------------------------------------

const PPEReportListPage = ({ inspectionReport = [] }) => {
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
		defaultRowsPerPage: 40,
		defaultDense: true
	});

	const { themeStretch } = useSettingsContext();
	const theme = useTheme();

	const [filterName, setFilterName] = useState('');

	const [filterType, setFilterType] = useState([]);

	const dataFiltered = applyFilter({
		inputData: inspectionReport,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType
	});

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '' || filterType.length > 0;

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
	};

	const totals = dataFiltered.reduce((acc, curr) => ({
		closed: acc.closed + curr.closed,
		positive: acc.positive + (curr.negative === 0 ? 0 : curr.positive),
		negative: acc.negative + curr.negative
	}), {
		closed: 0,
		positive: 0,
		negative: 0
	});
	console.log(inspectionReport);
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
						isFiltered={isFiltered}
						filterType={filterType}
						onFilterType={handleFilterType}
						onResetFilter={handleResetFilter}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<TableSelectedAction
							dense={dense}
							numSelected={selected.length}
							rowCount={dataFiltered.length}
							onSelectAllRows={(checked) =>
								onSelectAllRows(
									checked,
									dataFiltered.map((row) => row.list_id)
								)
							}
							action={
								<Stack direction="row">
									<Tooltip title="Print">
										<IconButton color="primary">
											<Iconify icon="eva:printer-fill" />
										</IconButton>
									</Tooltip>
								</Stack>
							}
						/>

						<Scrollbar>
							<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
								<TableHeadCustom
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={inspectionReport.length}
									onSort={onSort}
									onSelectAllRows={(checked) =>
										onSelectAllRows(
											checked,
											dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.list_id)
										)
									}
									sx={{
										"&>tr th": { whiteSpace: "nowrap" }
									}}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row) => {
											const isSelected = selected.includes(row.list_id);
											return (
												<TableRow key={row.list_id} hover selected={isSelected} sx={{ width: 1, borderBottom: 1, borderColor: "background.neutral" }}>
													<TableCell padding="checkbox">
														<Checkbox checked={isSelected} onClick={() => onSelectRow(row.list_id)} />
													</TableCell>
													<TableCell onClick={() => onSelectRow(row.list_id)} align="left">{row.section_title}</TableCell>
													<TableCell onClick={() => onSelectRow(row.list_id)} align="left">{row.table_name}</TableCell>
													<TableCell onClick={() => onSelectRow(row.list_id)} align="right">{row.negative}</TableCell>
													<TableCell onClick={() => onSelectRow(row.list_id)} align="right">{row.negative === 0 ? 0 : row.positive}</TableCell>
													<TableCell onClick={() => onSelectRow(row.list_id)} align="right">{row.closed}</TableCell>
												</TableRow>
											)
										})}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, inspectionReport.length)} />

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
			ins.section_title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			ins.table_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterType.length > 0) {
		inputData = inputData.filter((ins) => filterType.indexOf(ins.table_name) !== -1);
	}

	return inputData;
}

export default PPEReportListPage