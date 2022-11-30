import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
// @mui
import {
	Card,
	Table,
	Stack,
	Button,
	Tooltip,
	TableBody,
	Container,
	IconButton,
	TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// Components
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
import { PositionTableRow, PositionTableToolbar } from '@/sections/@dashboard/position/list';


const TABLE_HEAD = [
	{ id: 'index', label: '#', align: 'left' },
	{ id: 'position', label: 'Position', align: 'center' },
	{ id: 'date_created', label: 'Date Created', align: 'center' },
	{ id: '', label: 'Action', align: 'right' },
];


const PositionListPage = ({ positions }) => {

	const { themeStretch } = useSettingsContext();

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
		defaultRowsPerPage: 10
	});

	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (positions && positions.length > 0) {
			const data = positions.map(({ position, date_created, position_id }, index) => ({
				id: position_id,
				index: index + 1,
				position,
				date_created
			}));
			setTableData(data);
		}
	}, [positions]);


	const [openConfirm, setOpenConfirm] = useState(false);

	const [filterName, setFilterName] = useState('');
	const [filterDate, setFilterDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterDate
	});

	const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const denseHeight = dense ? 56 : 76;

	const isFiltered = filterName !== '' || !!filterDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterDate);

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	}

	const handleFilterDate = (newValue) => {
		setPage(0);
		setFilterDate(newValue);
	}

	const handleResetFilter = () => {
		setFilterName('');
		setFilterDate(null);
	}

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleDeleteRow = (id) => {

	}

	const handleDeleteRows = (sel) => { }

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Position List"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Employees',
							href: PATH_DASHBOARD.employee.root,
						},
						{
							name: 'Position List',
						},
					]}
					action={
						<Button
							href={PATH_DASHBOARD.position.new}
							component={Link}
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
						>
							New Position
						</Button>
					}
				/>

				<Card>
					<PositionTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterDate={filterDate}
						onResetFilter={handleResetFilter}
						onFilterDate={handleFilterDate}
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
								/>
								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<PositionTableRow
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
			</Container>
		</>
	)
}

function applyFilter ({
	inputData,
	comparator,
	filterName,
	filterDate
}) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter(({ position }) => position.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterDate) {
		const dateFiltered = fDate(filterDate);
		inputData = inputData.filter(({ date_created }) => fDate(date_created) === dateFiltered);
	}

	return inputData;
}


export default PositionListPage