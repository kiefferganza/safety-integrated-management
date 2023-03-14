import { useState } from 'react';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'form_number', label: 'CMS Number', align: 'left' },
	{ id: 'contract_no', label: 'Contract No.', align: 'left' },
	{ id: 'location', label: 'Location', align: 'left' },
	{ id: 'conducted_by', label: 'Conducted By', align: 'right' },
	{ id: 'budget_forcast_date', label: 'Budget Forecast Date', align: 'left' },
	{ id: 'inventory_start_date', label: 'Inventory Date', align: 'left' },
	{ id: 'submitted_date', label: 'Submitted Date', align: 'left' },
	{ id: 'submitted_id', label: 'Submitted By', align: 'left' },
	{ id: '' },
];

// ----------------------------------------------------------------------

const PPEReportListPage = ({ inventoryReports = [] }) => {
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

	const [filterName, setFilterName] = useState('');


	const dataFiltered = applyFilter({
		inputData: inventoryReports,
		comparator: getComparator(order, orderBy),
		filterName
	});

	const denseHeight = dense ? 60 : 80;

	const isFiltered = filterName !== '';

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;


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

	const handleResetFilter = () => {
		setFilterName('');
	};

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Product List"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'PPE',
							href: PATH_DASHBOARD.ppe.root,
						},
						{
							name: 'Report',
							href: PATH_DASHBOARD.ppe.report,
						},
						{ name: 'Report List' },
					]}
				/>
				<Card>
					<ReportTableToolbar
						filterName={filterName}
						onFilterName={handleFilterName}
						isFiltered={isFiltered}
						onResetFilter={handleResetFilter}
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

function applyFilter ({ inputData, comparator, filterName, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((product) => product.form_number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	return inputData;
}

export default PPEReportListPage