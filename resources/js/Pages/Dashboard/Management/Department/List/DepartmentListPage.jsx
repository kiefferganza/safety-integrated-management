import { useEffect, useState } from 'react';
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
import { DepartmentTableRow, DepartmentTableToolbar } from '@/sections/@dashboard/department/list';
import { fDate } from '@/utils/formatTime';
import DepartmentNewEdit from '@/sections/@dashboard/department/portal/DepartmentNewEdit';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';


const TABLE_HEAD = [
	{ id: 'index', label: '#', align: 'left' },
	{ id: 'department', label: 'Department', align: 'center' },
	{ id: 'date_created', label: 'Date Created', align: 'center' },
	{ id: '', label: 'Action', align: 'right' },
];


const DepartmentListPage = ({ departments }) => {
	const { load, stop } = useSwal();
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

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [departmentName, setDepartmentName] = useState('');
	const [editDepartmentData, setEditDepartmentData] = useState(null);

	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (departments && departments.length > 0) {
			const data = departments.map(({ department, date_created, department_id }, index) => ({
				id: department_id,
				index: index + 1,
				department,
				date_created
			}));
			setTableData(data);
		}
	}, [departments]);


	const [openConfirm, setOpenConfirm] = useState(false);

	const [filterName, setFilterName] = useState('');
	const [filterDate, setFilterDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterDate
	});


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

	const handleOpenAddDepartment = () => setOpenAdd(true);
	const handleCloseAddDepartment = () => {
		setDepartmentName("")
		setOpenAdd(false);
	}
	const handleOpenEditDepartment = (dept) => {
		setEditDepartmentData(dept);
		setDepartmentName(dept.department)
		setOpenEdit(true);
	}
	const handleCloseEditDepartment = () => {
		setDepartmentName("")
		setEditDepartmentData(null);
		setOpenEdit(false);
	}

	const handleDepartmentNameChanged = (e) => setDepartmentName(e.target.value);

	const handleCreateDepartment = () => {
		Inertia.post(route('management.department.new'), { department: departmentName }, {
			onStart: () => {
				handleCloseAddDepartment();
				load("Adding new department", "Please wait...");
				setDepartmentName("");
			},
			onFinish: stop
		});
	}

	const handleUpdateDepartment = () => {
		Inertia.post(`/dashboard/department/${editDepartmentData.id}/edit`, { department: departmentName }, {
			onStart: () => {
				handleCloseEditDepartment();
				load("Updating department", "Please wait...");
				setDepartmentName("");
			},
			onFinish: stop
		});
	}

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleDeleteRow = (id) => {
		Inertia.delete(`/dashboard/department/${id}`, {
			onStart: () => {
				load("Deleting department", "Please wait...");
			},
			onFinish: stop
		});
	}

	const handleDeleteRows = (sel) => {
		Inertia.post(route('management.department.delete-multiple'), { ids: sel }, {
			onStart: () => {
				load(`Deleting ${selected.length} departments`, "Please wait...");
			},
			onFinish: () => {
				setSelected([]);
				stop();
			}
		});
	}

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Department List"
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
							name: 'Department List',
						},
					]}
					action={
						<Button
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={handleOpenAddDepartment}
						>
							New Department
						</Button>
					}
				/>

				<Card>
					<DepartmentTableToolbar
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
										<DepartmentTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
											onUpdateRow={() => handleOpenEditDepartment(row)}
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
			<DepartmentNewEdit
				open={openAdd}
				onClose={handleCloseAddDepartment}
				onCreate={handleCreateDepartment}
				onDepartmentChanged={handleDepartmentNameChanged}
				department={departmentName}
			/>
			<DepartmentNewEdit
				title='Edit Department'
				open={openEdit}
				onClose={handleCloseEditDepartment}
				onUpdate={handleUpdateDepartment}
				onDepartmentChanged={handleDepartmentNameChanged}
				department={departmentName}
			/>
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
		inputData = inputData.filter(({ department }) => department.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterDate) {
		const dateFiltered = fDate(filterDate);
		inputData = inputData.filter(({ date_created }) => fDate(date_created) === dateFiltered);
	}

	return inputData;
}


export default DepartmentListPage