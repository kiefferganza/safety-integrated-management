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
	TableContainer,
	Typography,
	Box,
	Popover,
} = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// utils/hooks
import { getDocumentReviewStatus, getDocumentStatus } from '@/utils/formatStatuses';
import { useSwal } from '@/hooks/useSwal';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
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
const { Label } = await import('@/Components/label/Label');
const { ConfirmDialog } = await import('@/Components/confirm-dialog/ConfirmDialog');
// sections
const { DocumentAnalytic } = await import('@/sections/@dashboard/document/DocumentAnalytic');
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { DocumentTableRow, DocumentTableToolbar } from '@/sections/@dashboard/document/list';
import usePermission from '@/hooks/usePermission';
import { Backdrop, CircularProgress, Portal } from '@mui/material';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'formNumber', label: 'CMS Number', align: 'left' },
	{ id: 'title', label: 'Title', align: "left" },
	{ id: 'description', label: "Description", align: "left" },
	{ id: 'rev', label: 'Revision', align: 'left' },
	{ id: 'inspected_by', label: 'Submitted by', align: 'left' },
	{ id: 'date_uploaded', label: 'Created', align: 'left' },
	{ id: 'status', label: 'Status', align: 'center' },
	{ id: '' },
];


const DocumentListPage = ({ folder, user }) => {
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
		defaultOrderBy: "date_uploaded",
		defaultOrder: "desc"
	});

	const [loading, setLoading] = useState(false);

	const [anchorLegendEl, setAnchorLegendEl] = useState(null);

	const [openConfirm, setOpenConfirm] = useState(false);

	const [tableData, setTableData] = useState([]);

	const [filterName, setFilterName] = useState('');

	const [filterType, setFilterType] = useState('documentControl');

	const [filterStatus, setFilterStatus] = useState('');

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterStatus,
		filterType,
		filterStartDate,
		filterEndDate
	});

	useEffect(() => {
		const userEmpId = user.employee.employee_id
		const data = folder?.documents?.reduce((acc, curr) => {
			if (curr.employee) {
				const docObj = {
					...curr,
					id: curr.document_id,
					employee: {
						...curr.employee,
						position: curr.employee.position,
						department: curr.employee.department
					},
					docStatus: getDocumentReviewStatus(curr.status)
				};

				if (curr.status == "0") {
					acc.push({ ...docObj, docType: "submitted" });
					const isForApproval = curr.reviewer_sign.length >= curr.reviewer_employees.length;
					if (isForApproval) {
						const stat = curr?.reviewer_employees[0]?.pivot.review_status;
						docObj.docStatus = curr.approval_employee || curr.external_approver?.length > 0 ? { statusText: "FOR APPROVAL", statusClass: "info" } : getDocumentStatus(stat);
					} else {
						const isInReview = curr.reviewer_employees.some(rev => rev.pivot.review_status !== "0");
						if (isInReview) {
							docObj.docStatus = {
								statusText: "FOR REVIEW",
								statusClass: "primary",
							};
						} else {
							docObj.docStatus = getDocumentStatus(curr.status);
						}
					}
					if (curr.external_approver.length === 0) {
						acc.push({ ...docObj, docType: "internal_review" });
					}

				} else {
					if (curr.external_approver.length > 0) {
						acc.push({ ...docObj, docType: "external_review" });
					}
					if (curr.status === "A" || curr.status === "D") {
						acc.push({ ...docObj, docType: "approve" });
					}
					docObj.docStatus = getDocumentReviewStatus(curr.status);
				}
				acc.push({ ...docObj, docType: "documentControl" });
			}
			return acc;
		}, []);
		setTableData(data || []);
	}, [folder]);

	const denseHeight = dense ? 56 : 76;

	const isFiltered = filterName !== '' || !!filterStartDate || !!filterEndDate || filterStatus !== '';

	const isNotFound =
		(!dataFiltered.length && !!filterName) ||
		(!dataFiltered.length && !!filterType) ||
		(!dataFiltered.length && !!filterStatus) ||
		(!dataFiltered.length && !!filterStartDate);
	(!dataFiltered.length && !!filterEndDate);

	const getLengthByType = (type) => tableData.filter((item) => item.docType === type).length;

	const getPercentByType = (type) => (getLengthByType(type) / tableData.filter(doc => doc.docType === 'documentControl').length) * 100;

	const TABS = [
		{ value: 'documentControl', label: 'Total Submitted', color: 'default', count: folder.documents.length },
		{ value: 'submitted', label: 'Latest Submitted', color: 'success', count: getLengthByType('submitted') },
		{ value: 'internal_review', label: 'Internal Review', color: 'warning', count: getLengthByType('internal_review') },
		{ value: 'external_review', label: 'External Review', color: 'warning', count: getLengthByType('external_review') },
		{ value: 'approve', label: 'Approved', color: 'success', count: getLengthByType('approve') }
	];

	const handleOpenConfirm = () => {
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleFilterType = (_event, newValue) => {
		setPage(0);
		setFilterType(newValue);
	};

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleFilterStatus = (_event, newValue) => {
		// if (newValue) {
		// 	setPage(0);
		// 	setFilterStatus(newValue);
		// }
	}

	const handleDeleteRow = (id) => {
		Inertia.post(route('files.management.document.delete'), { ids: [id] }, {
			onStart () {
				load("Deleting document", "Please wait...");
			},
			onFinish () {
				setPage(0);
				stop();
			},
			preserveScroll: true
		});
	};

	const handleDeleteRows = (selected) => {
		Inertia.post(route('files.management.document.delete'), { ids: selected }, {
			onStart () {
				load(`Deleting ${selected.length} documents`, "Please wait...");
			},
			onFinish () {
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
		setFilterStatus('');
	};

	const handlePopoverLegendOpen = (event) => {
		setAnchorLegendEl(event.currentTarget);
	};

	const handlePopoverLegendClose = () => {
		setAnchorLegendEl(null);
	};

	const open = Boolean(anchorLegendEl);

	const canCreate = hasPermission("file_create");
	const canView = hasPermission("file_show");
	return (
		<>
			<Container maxWidth={themeStretch ? false : 'lg'} sx={{ pb: 16 }}>
				<CustomBreadcrumbs
					heading={`${folder.folder_name} Document List`}
					links={[
						{
							name: 'File Manager',
							href: PATH_DASHBOARD.fileManager.root,
						},
						{
							name: folder.folder_name
						},
						{
							name: 'List',
						},
					]}
					action={
						canCreate && (
							<Button
								href={PATH_DASHBOARD.fileManager.newDocument(folder.folder_id)}
								component={Link}
								variant="contained"
								startIcon={<Iconify icon="eva:plus-fill" />}
							>
								New Document
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
							<DocumentAnalytic
								title="Total Submitted"
								total={folder.documents.length}
								percent={100}
								icon="heroicons:document-chart-bar"
								color={theme.palette.info.main}
							/>

							<DocumentAnalytic
								title="Latest Submitted"
								total={getLengthByType('submitted')}
								percent={getPercentByType('submitted')}
								icon="heroicons:document-arrow-up"
								color={theme.palette.success.main}
							/>

							<DocumentAnalytic
								title="Internal Review"
								total={getLengthByType('internal_review')}
								percent={getPercentByType('internal_review')}
								icon="heroicons:document-minus"
								color={theme.palette.warning.main}
							/>

							<DocumentAnalytic
								title="External Review"
								total={getLengthByType('external_review')}
								percent={getPercentByType('external_review')}
								icon="heroicons:document-minus"
								color={theme.palette.warning.main}
							/>

							<DocumentAnalytic
								title="Approved"
								total={getLengthByType('approve')}
								percent={getPercentByType('approve')}
								icon="heroicons:document-check"
								color={theme.palette.info.main}
							/>

							{/* <DocumentAnalytic
								title="Control"
								total={getLengthByType('documentControl')}
								percent={100}
								icon="heroicons:document-magnifying-glass"
								color={theme.palette.success.main}
							/> */}
						</Stack>
					</Scrollbar>
				</Card>

				<Card>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, bgcolor: 'background.neutral' }}>
						<Tabs
							value={filterType}
							onChange={handleFilterType}
						>
							{TABS.map((tab) => (
								<Tab
									key={tab.value}
									value={tab.value}
									label={tab.label}
									icon={
										<Label color={tab.color} sx={{ mr: 1 }}>
											{tab.count}
										</Label>
									}
								/>
							))}
						</Tabs>
						<Tabs
							value={filterStatus}
							onChange={handleFilterStatus}
						>
							<Tab
								label="Legend"
								color="info"
								value={""}
								icon={<Label color="info" sx={{ mr: 1 }}>L</Label>}
								aria-owns={open ? 'mouse-over-popover' : undefined}
								aria-haspopup="true"
								onMouseEnter={handlePopoverLegendOpen}
								onMouseLeave={handlePopoverLegendClose}
							/>
						</Tabs>
					</Stack>

					<Divider />

					<DocumentTableToolbar
						filterName={filterName}
						isFiltered={isFiltered}
						onFilterName={handleFilterName}
						filterStartDate={filterStartDate}
						filterEndDate={filterEndDate}
						onResetFilter={handleResetFilter}
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
									<Tooltip title="Print">
										<IconButton color="primary">
											<Iconify icon="eva:printer-fill" />
										</IconButton>
									</Tooltip>

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
											dataFiltered.filter(d => d.docType !== "documentControl").slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id)
										)
									}
									sx={{
										"&>tr th": { whiteSpace: "nowrap" }
									}}
								/>

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
										<DocumentTableRow
											key={row.id}
											row={row}
											selected={selected.includes(row.id)}
											folder={folder}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => handleDeleteRow(row.id)}
											canView={canView}
											load={setLoading}
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
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorLegendEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverLegendClose}
				disableRestoreFocus
			>
				<Box sx={{ px: 2.5, py: 3 }}>
					<Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>Submitted Document Status:</Typography>
					<Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1.5 }}>
						<Label variant="outlined" color="warning">PENDING = No Action Taken</Label>
						<Label variant="outlined" color="warning">NO OBJECTION WITH COMMENTS = Closed with comments</Label>
					</Stack>
					<Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1.5 }}>
						<Label variant="outlined" color="success">APPROVED w/o COMMENTS = Closed without comments</Label>
						<Label variant="outlined" color="error">FAIL/NOT APPROVED = Closed</Label>
					</Stack>
					<Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1.5 }}>
						<Label variant="outlined" color="info">APPROVED WITH COMMENT/S = Closed with comments</Label>
						<Label variant="outlined" color="primary">REVIEWED = Reviewed By Reviewer</Label>
					</Stack>
					<Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1.5 }}>

					</Stack>
				</Box>
			</Popover>
			<Portal>
				<Backdrop open={loading} sx={{ overflow: "hidden" }}>
					<CircularProgress color="primary" />
				</Backdrop>
			</Portal>
		</>
	);
}

// ----------------------------------------------------------------------

function applyFilter ({
	inputData,
	comparator,
	filterName,
	filterType,
	filterStatus,
	filterStartDate,
	filterEndDate
}) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((doc) =>
			doc.formNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			doc.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
			doc?.description?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterType) {
		inputData = inputData.filter((doc) => doc.docType === filterType);
	}

	if (filterStatus !== '') {
		// if (filterStatus === 'A.D.' || filterStatus === 'O.D.') {
		// 	inputData = inputData.filter((doc) => doc.dueStatus.type === filterStatus);
		// } else {
		// 	inputData = inputData.filter((doc) => doc.status.text === filterStatus);
		// }
	}

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(insp => new Date(insp.date_uploaded).setHours(0, 0, 0, 0) >= startDateTimestamp);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(
			(insp) =>
				new Date(insp.date_uploaded).setHours(0, 0, 0, 0) >= startDateTimestamp &&
				new Date(insp.date_uploaded).setHours(0, 0, 0, 0) <= endDateTimestamp
		);
	}

	return inputData;
}

export default DocumentListPage;