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
import { fDate } from '@/utils/formatTime';
import { useSwal } from '@/hooks/useSwal';
import { Inertia } from '@inertiajs/inertia';
import ProjectDetailNewEdit from '@/sections/@dashboard/project-detail/portal/ProjectDetailNewEdit';
import { ProjectDetailTableRow, ProjectDetailTableToolbar } from '@/sections/@dashboard/project-detail/list';


const TABLE_HEAD = [
	{ id: 'index', label: '#', align: 'left' },
	{ id: 'value', label: 'Value', align: 'left' },
	{ id: 'title', label: 'Type', align: 'left' },
	{ id: '' },
];


const ProjectDetailList = ({ projectDetails = [], titles }) => {
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
	const [editDetail, setEditDetail] = useState(null);

	const [tableData, setTableData] = useState([]);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [filterName, setFilterName] = useState('');
	const [filterType, setFilterType] = useState('all');

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType
	});

	const denseHeight = dense ? 56 : 76;

	const isFiltered = filterName !== '' || filterType !== 'all';

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && filterType !== 'all');

	useEffect(() => {
		if (projectDetails) {
			const data = projectDetails.map((d, i) => ({
				index: i + 1,
				...d
			}));
			setTableData(data);
		}
	}, [projectDetails]);

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	}

	const handleFilterType = (e) => {
		setPage(0);
		setFilterType(e.target.value);
	}

	const handleResetFilter = () => {
		setFilterName('');
		setFilterType('all');
	}

	const handleOpenNewDetail = () => setOpenAdd(true);
	const handleCloseNewDetail = () => {
		setEditDetail(null)
		setOpenAdd(false);
	}
	const handleEditDetail = (detail) => {
		setEditDetail(detail);
		setOpenEdit(true);
	}
	const handleCloseEditCompany = () => {
		setEditDetail(null)
		setOpenEdit(false);
	}

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleDeleteRow = (id) => {
		setOpenConfirm(false);
		Inertia.post(route('files.management.delete_project_details'), { ids: [id] }, {
			onStart: () => {
				load("Deleting", "Please wait...");
			},
			onFinish: stop
		});
	}

	const handleDeleteRows = (sel) => {
		setOpenConfirm(false);
		Inertia.post(route('files.management.delete_project_details'), { ids: sel }, {
			onStart: () => {
				load(`Deleting ${selected.length} item`, "Please wait...");
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
					heading="Project Detail"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Folders',
							href: PATH_DASHBOARD.fileManager.root
						},
						{
							name: 'Project Detail',
						},
					]}
					action={
						<Button
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={handleOpenNewDetail}
						>
							New Project Detail
						</Button>
					}
				/>

				<Card>
					<ProjectDetailTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterType={filterType}
						onFilterType={handleFilterType}
						onResetFilter={handleResetFilter}
						titles={titles}
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
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
										<ProjectDetailTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
											onUpdateRow={() => handleEditDetail(row)}
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
			<ProjectDetailNewEdit
				open={openAdd}
				onClose={handleCloseNewDetail}
				titles={titles}
			/>
			{editDetail && (
				<ProjectDetailNewEdit
					dialogTitle='Edit Project Detail'
					open={openEdit}
					onClose={handleCloseEditCompany}
					titles={titles}
					isEdit
					editDetail={editDetail}
				/>
			)}
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
	filterType
}) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter(({ value }) => value.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterType !== 'all') {
		inputData = inputData.filter(data => data.title === filterType);
	}

	return inputData;
}


export default ProjectDetailList