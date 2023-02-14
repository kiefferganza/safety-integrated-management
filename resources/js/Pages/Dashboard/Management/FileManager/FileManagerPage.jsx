import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
// @mui
import { Stack, Button, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// utils
import { fTimestamp } from '@/utils/formatTime';
// components
import Iconify from '@/Components/iconify';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import { useTable, getComparator } from '@/Components/table';
import DateRangePicker, { useDateRangePicker } from '@/Components/date-range-picker';
const { ConfirmDialog } = await import('@/Components/confirm-dialog/ConfirmDialog');
// sections
const {
	FileListView,
	FileGridView,
	FileFilterName,
	FileFilterButton,
	FileChangeViewButton,
	FileNewFolderDialog,
} = await import('@/sections/@dashboard/file');
import { capitalize } from 'lodash';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function FileManagerPage ({ folders }) {
	const { load, stop } = useSwal();
	const table = useTable({
		defaultRowsPerPage: 10,
		defaultOrderBy: "id",
		defaultOrder: "asc"
	});

	const {
		startDate,
		endDate,
		onChangeStartDate,
		onChangeEndDate,
		open: openPicker,
		onOpen: onOpenPicker,
		onClose: onClosePicker,
		onReset: onResetPicker,
		isSelected: isSelectedValuePicker,
		isError,
		shortLabel,
	} = useDateRangePicker(null, null);

	const { themeStretch } = useSettingsContext();

	const [newFolderName, setNewFolderName] = useState("");

	const [view, setView] = useState('grid');

	const [filterName, setFilterName] = useState('');

	const [tableData, setTableData] = useState(folders);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [openUploadFile, setOpenUploadFile] = useState(false);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(table.order, table.orderBy),
		filterName,
		filterStartDate: startDate,
		filterEndDate: endDate,
		isError: !!isError,
	});

	// const dataInPage = dataFiltered.slice(
	// 	table.page * table.rowsPerPage,
	// 	table.page * table.rowsPerPage + table.rowsPerPage
	// );

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!endDate && !!startDate);

	const isFiltered = !!filterName || (!!startDate && !!endDate);

	useEffect(() => {
		setTableData(folders)
	}, [folders]);

	const handleChangeView = (_event, newView) => {
		if (newView !== null) {
			setView(newView);
		}
	};

	const handleFilterName = (event) => {
		table.setPage(0);
		setFilterName(event.target.value);
	};

	const handleChangeStartDate = (newValue) => {
		table.setPage(0);
		onChangeStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		table.setPage(0);
		onChangeEndDate(newValue);
	};

	const handleDeleteItem = (id) => {
		const folder = folders.find(f => f.id === +id);
		if (folder) {
			Inertia.post(route('files.management.destroy'), { ids: [id] }, {
				onStart () {
					load(`Deleting ${folder.name}.`, "Please wait");
				},
				onFinish () {
					table.setPage(0);
					table.setSelected([]);
					stop();
				},
				preserveScroll: true
			});
		}
	};

	const handleDeleteItems = (selected) => {
		Inertia.post(route('files.management.destroy'), { ids: selected }, {
			onStart () {
				load(`Deleting ${selected.length} folders.`, "Please wait");
			},
			onFinish () {
				table.setPage(0);
				table.setSelected([]);
				stop();
			},
			preserveScroll: true
		});
	};

	const handleClearAll = () => {
		if (onResetPicker) {
			onResetPicker();
		}
		setFilterName('');
	};

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleOpenUploadFile = () => {
		setOpenUploadFile(true);
	};

	const handleCloseUploadFile = () => {
		setOpenUploadFile(false);
	};

	const handleCreateFolder = () => {
		handleCloseUploadFile();
		if (newFolderName) {
			Inertia.post(route('files.management.create_folder'), { folderName: newFolderName }, {
				preserveScroll: true,
				onStart () {
					load("Creating new folder", "Please wait...");
				},
				onFinish () {
					setNewFolderName("");
					stop();
				}
			});
		}
	}

	return (
		<>
			<Head>
				<title>File Manager</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="File Manager"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{ name: 'File Manager' },
					]}
					action={
						<Button
							variant="contained"
							startIcon={<Iconify icon="eva:cloud-upload-fill" />}
							onClick={handleOpenUploadFile}
						>
							New Folder
						</Button>
					}
				/>

				<Stack
					spacing={2.5}
					direction={{ xs: 'column', md: 'row' }}
					alignItems={{ xs: 'flex-end', md: 'center' }}
					justifyContent="space-between"
					sx={{ mb: 5 }}
				>
					<Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} sx={{ width: 1 }}>
						<FileFilterName filterName={filterName} onFilterName={handleFilterName} />

						<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
							<>
								<FileFilterButton
									isSelected={!!isSelectedValuePicker}
									startIcon={<Iconify icon="eva:calendar-fill" />}
									onClick={onOpenPicker}
								>
									{isSelectedValuePicker ? shortLabel : 'Select Date'}
								</FileFilterButton>

								<DateRangePicker
									variant="calendar"
									startDate={startDate}
									endDate={endDate}
									onChangeStartDate={handleChangeStartDate}
									onChangeEndDate={handleChangeEndDate}
									open={openPicker}
									onClose={onClosePicker}
									isSelected={isSelectedValuePicker}
									isError={isError}
								/>
							</>

							{isFiltered && (
								<Button
									variant="soft"
									color="error"
									onClick={handleClearAll}
									startIcon={<Iconify icon="eva:trash-2-outline" />}
								>
									Clear
								</Button>
							)}
						</Stack>
					</Stack>

					<FileChangeViewButton value={view} onChange={handleChangeView} />
				</Stack>

				{view === 'list' ? (
					<FileListView
						table={table}
						tableData={tableData}
						dataFiltered={dataFiltered}
						onDeleteRow={handleDeleteItem}
						isNotFound={isNotFound}
						onOpenConfirm={handleOpenConfirm}
					/>
				) : (
					<FileGridView
						table={table}
						data={tableData}
						dataFiltered={dataFiltered}
						onDeleteItem={handleDeleteItem}
						onOpenConfirm={handleOpenConfirm}
					/>
				)}
			</Container>

			<FileNewFolderDialog
				folderName={newFolderName}
				onChangeFolderName={(e) => {
					setNewFolderName(capitalize(e.target.value));
				}}
				onCreate={handleCreateFolder}
				open={openUploadFile}
				onClose={handleCloseUploadFile}
			/>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content={
					<>
						Are you sure want to delete <strong> {table.selected.length} </strong> items?
					</>
				}
				action={
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							handleDeleteItems(table.selected);
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

function applyFilter ({ inputData, comparator, filterName, filterStartDate, filterEndDate, isError }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((file) => file.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterStartDate && filterEndDate && !isError) {
		inputData = inputData.filter(
			(file) =>
				fTimestamp(file.dateCreated) >= fTimestamp(filterStartDate) &&
				fTimestamp(file.dateCreated) <= fTimestamp(filterEndDate)
		);
	}

	return inputData;
}
