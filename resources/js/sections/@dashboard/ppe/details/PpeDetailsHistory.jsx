import { useEffect, useState } from "react";
// mui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from "@mui/material"
// utils
import { fDate, fDateTime, fTimestamp } from "@/utils/formatTime";
// Components
import {
	useTable,
	getComparator,
	emptyRows,
	TableNoData,
	TableEmptyRows,
	TableHeadCustom,
	TablePaginationCustom,
} from '@/Components/table';
import Scrollbar from "@/Components/scrollbar"
import Label from "@/Components/label";
import PpeDetailTableToolbar from "./PpeDetailTableToolbar";

const TABLE_HEAD = [
	{ id: 'inventory_bound_id', label: '#', align: 'left' },
	{ id: 'type', label: 'Type', align: 'center' },
	{ id: 'requestedBy', label: 'Requested By', align: 'left' },
	{ id: 'date', label: 'Created', align: 'left' },
	{ id: 'qty', label: 'Quantity', align: 'right' },
	{ id: 'previous_qty', label: 'Previous Quantity', align: 'right' },
	// { id: 'info', label: 'Info', align: 'right' },
];


export const PpeDetailsHistory = ({ bound, filterName, setFilterName }) => {
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
		defaultDense: true,
		defaultRowsPerPage: 25
	});
	const theme = useTheme();
	const [tableData, setTableData] = useState([]);

	const [filterType, setFilterType] = useState("all");

	const [filterStartDate, setFilterStartDate] = useState(null);

	const [filterEndDate, setFilterEndDate] = useState(null);

	useEffect(() => {
		if (bound) {
			const data = bound.map((d) => ({
				...d,
				// info: d.type === "inbound" ? ,
				requestedBy: d?.creator ? d.creator?.fullname : d?.requested_by_location
			}));
			setTableData(data);
		}
	}, [bound]);

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterType,
		filterStartDate,
		filterEndDate
	});

	const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const denseHeight = dense ? 64 : 80;

	const isFiltered = filterStartDate !== null || filterEndDate !== null || filterName !== '' || filterType !== 'all';

	const isNotFound = (!dataFiltered.length && !!filterName) || !dataFiltered.length;

	const handleResetFilter = () => {
		setFilterName('');
		setFilterType('all');
		setFilterStartDate(null);
		setFilterEndDate(null);
		setPage(0);
	};
	return (
		<>
			<PpeDetailTableToolbar
				filterType={filterType}
				onFilterType={(event) => {
					setPage(0);
					setFilterType(event.target.value);
				}}
				filterStartDate={filterStartDate}
				filterEndDate={filterEndDate}
				onFilterStartDate={(newValue) => {
					if (filterEndDate) {
						setFilterEndDate(null);
					}
					setFilterStartDate(newValue);
				}}
				onFilterEndDate={(newValue) => {
					setPage(0);
					setFilterEndDate(newValue);
				}}
				isFiltered={isFiltered}
				onResetFilter={handleResetFilter}
			/>
			<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
				<Scrollbar>
					<Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
						<TableHeadCustom
							order={order}
							orderBy={orderBy}
							headLabel={TABLE_HEAD}
							rowCount={tableData.length}
							onSort={onSort}
							sx={{
								borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
								'& th': { backgroundColor: 'transparent' },
							}}
						/>

						<TableBody>
							{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) =>
								<TableRow
									key={row.inventory_bound_id}
									sx={{
										borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									}}
								>
									<TableCell>{idx + 1}</TableCell>
									<TableCell align="center">
										<Label
											variant="soft"
											color={
												(row.type === 'inbound' && 'success') || (row.type === 'outbound' && 'warning') || 'success'
											}
										>
											{row.type === "inbound" ? "Added" : " Pulled Out"}
										</Label>
									</TableCell>
									<TableCell>{row?.requestedBy}</TableCell>
									<TableCell>{fDateTime(row.date)}</TableCell>
									<TableCell align="right">{`${row.type === "inbound" ? "+" : "-"} (${row.qty})`}</TableCell>
									<TableCell align="right">{row.previous_qty}</TableCell>
								</TableRow>
							)}

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
		</>
	)
}


function applyFilter ({ inputData, comparator, filterName, filterType, filterStartDate, filterEndDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((product) =>
			product?.creator ? product?.creator?.fullname?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 :
				product?.requested_by_location?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
		);
	}

	if (filterType !== "all") {
		inputData = inputData.filter((product) => product.type === filterType);
	}

	if (filterStartDate && !filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(product => new Date(product.date).setHours(0, 0, 0, 0) >= startDateTimestamp);
	}

	if (filterStartDate && filterEndDate) {
		const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
		const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
		inputData = inputData.filter(
			(product) =>
				new Date(product.date).setHours(0, 0, 0, 0) >= startDateTimestamp &&
				new Date(product.date).setHours(0, 0, 0, 0) <= endDateTimestamp
		);
	}
	console.log(inputData)
	return inputData;
}