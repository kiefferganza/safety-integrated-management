import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import FormProvider from '@/Components/hook-form';
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
import PositionNew from '@/sections/@dashboard/position/portal/PositionNew';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';


const TABLE_HEAD = [
	{ id: 'index', label: '#', align: 'left' },
	{ id: 'position', label: 'Position', align: 'center' },
	{ id: 'date_created', label: 'Date Created', align: 'center' },
	{ id: '', label: 'Action', align: 'right' },
];

const NewUserSchema = Yup.object().shape({
	positionItems: Yup.array().of(
		Yup.object().shape({
			position: Yup.string().required("Position title is required."),
		})
	)
});

const PositionListPage = ({ positions }) => {
	const { themeStretch } = useSettingsContext();

	const methods = useForm({
		resolver: yupResolver(NewUserSchema),
		defaultValues: {
			positionItems: [{ position: '', id: 0 }],
		}
	});

	const {
		reset,
		setValue,
		handleSubmit
	} = methods;

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

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

	const handleOpenAddPosition = () => setOpenAdd(true);
	const handleCloseAddPosition = () => {
		setOpenAdd(false);
		reset({ positionItems: [{ position: '', id: 0 }] })
	}
	const handleOpenEditPosition = (pos) => {
		setValue("positionItems.0.position", pos.position);
		setValue("positionItems.0.id", pos.id);
		setOpenEdit(true);
	}
	const handleCloseEditPosition = () => {
		setOpenEdit(false);
		reset({ positionItems: [{ position: '', id: 0 }] });
	}


	const handleCreatePosition = ({ positionItems }) => {
		Inertia.post(route('management.position.new'), positionItems, {
			onStart: () => {
				handleCloseAddPosition();
				load("Adding new position", "Please wait...");
			},
			onFinish: stop
		});
	}

	const handleUpdatePosition = ({ positionItems }) => {
		Inertia.post(`/dashboard/position/${positionItems[0].id}/edit`, { position: positionItems[0].position }, {
			onStart: () => {
				handleCloseEditPosition();
				load("Updating position", "Please wait...");
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
		Inertia.delete(`/dashboard/position/${id}`, {
			onStart: () => {
				load("Deleting position", "Please wait...");
			},
			onFinish: stop
		});
	}

	const handleDeleteRows = (sel) => {
		Inertia.post(route('management.position.delete-multiple'), { ids: sel }, {
			onStart: () => {
				load(`Deleting ${selected.length} positions`, "Please wait...");
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
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={handleOpenAddPosition}
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
											onUpdateRow={() => handleOpenEditPosition(row)}
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
			<FormProvider methods={methods}>
				<PositionNew
					open={openAdd}
					onClose={handleCloseAddPosition}
					onCreate={handleCreatePosition}
				/>
			</FormProvider>
			<FormProvider methods={methods}>
				<PositionNew
					title='Edit Position'
					open={openEdit}
					onClose={handleCloseEditPosition}
					onUpdate={handleUpdatePosition}
				/>
			</FormProvider>
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
							handleCloseConfirm();
							handleDeleteRows(selected);
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
		inputData = inputData.filter(({ position }) => position.toLowerCase().includes(filterName.toLowerCase()));
	}

	if (filterDate) {
		const dateFiltered = fDate(filterDate);
		inputData = inputData.filter(({ date_created }) => fDate(date_created) === dateFiltered);
	}

	return inputData;
}


export default PositionListPage