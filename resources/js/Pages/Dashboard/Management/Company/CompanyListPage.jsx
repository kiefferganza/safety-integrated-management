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
import { CompanyTableRow, CompanyTableToolbar } from '@/sections/@dashboard/company/list';
import { fDate } from '@/utils/formatTime';
import CompanyNewEdit from '@/sections/@dashboard/company/portal/CompanyNewEdit';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';


const TABLE_HEAD = [
	{ id: 'index', label: '#', align: 'left' },
	{ id: 'company_name', label: 'Company', align: 'left' },
	{ id: 'date_created', label: 'Date Created', align: 'left' },
	{ id: '' },
];


const CompanyListPage = ({ companies }) => {
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
	const [companyName, setCompanyName] = useState('');
	const [editCompanyData, setEditCompanyData] = useState(null);

	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (companies && companies.length > 0) {
			const data = companies.map(({ company_name, created_at, company_id }, index) => ({
				id: company_id,
				index: index + 1,
				company_name,
				created_at
			}));
			setTableData(data);
		}
	}, [companies]);


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

	const handleOpenAddCompany = () => setOpenAdd(true);
	const handleCloseAddCompany = () => {
		setCompanyName("")
		setOpenAdd(false);
	}
	const handleOpenEditCompany = (comp) => {
		setEditCompanyData(comp);
		setCompanyName(comp.company_name)
		setOpenEdit(true);
	}
	const handleCloseEditCompany = () => {
		setCompanyName("")
		setEditCompanyData(null);
		setOpenEdit(false);
	}

	const handleCompanyNameChanged = (e) => setCompanyName(e.target.value);

	const handleCreateCompany = () => {
		Inertia.post(route('management.company.new'), { company: companyName }, {
			onStart: () => {
				handleCloseAddCompany();
				load("Adding new company", "Please wait...");
				setCompanyName("");
			},
			onFinish: stop
		});
	}

	const handleUpdateCompany = () => {
		Inertia.put(`/dashboard/company/${editCompanyData.id}/edit`, { company: companyName }, {
			onStart: () => {
				handleCloseEditCompany();
				load("Updating company", "Please wait...");
				setCompanyName("");
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
		Inertia.delete(`/dashboard/company/${id}`, {
			onStart: () => {
				load("Deleting company", "Please wait...");
			},
			onFinish: stop
		});
	}

	const handleDeleteRows = (sel) => {
		Inertia.post(route('management.company.delete-multiple'), { ids: sel }, {
			onStart: () => {
				load(`Deleting ${selected.length} companies`, "Please wait...");
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
					heading="Company List"
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
							name: 'Company List',
						},
					]}
					action={
						<Button
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={handleOpenAddCompany}
						>
							New Company
						</Button>
					}
				/>

				<Card>
					<CompanyTableToolbar
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
										<CompanyTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
											onUpdateRow={() => handleOpenEditCompany(row)}
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
			<CompanyNewEdit
				open={openAdd}
				onClose={handleCloseAddCompany}
				onCreate={handleCreateCompany}
				onCompanyChanged={handleCompanyNameChanged}
				company={companyName}
			/>
			<CompanyNewEdit
				title='Edit Company'
				open={openEdit}
				onClose={handleCloseEditCompany}
				onUpdate={handleUpdateCompany}
				onCompanyChanged={handleCompanyNameChanged}
				company={companyName}
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
		inputData = inputData.filter(({ company_name }) => company_name.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterDate) {
		const dateFiltered = fDate(filterDate);
		inputData = inputData.filter(({ created_at }) => fDate(created_at) === dateFiltered);
	}

	return inputData;
}


export default CompanyListPage