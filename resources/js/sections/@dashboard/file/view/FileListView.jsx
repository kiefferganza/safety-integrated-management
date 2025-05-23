import PropTypes from 'prop-types';
// @mui
import { Table, Tooltip, TableBody, IconButton, TableContainer, Box } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import {
	emptyRows,
	TableNoData,
	TableEmptyRows,
	TableHeadCustom,
	TableSelectedAction,
	TablePaginationCustom,
} from '@/Components/table';
//
import FileTableRow from '../item/FileTableRow';
import { Droppable } from 'react-beautiful-dnd';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'name', label: 'Name', align: 'left' },
	{ id: 'totalDocs', label: 'Documents', align: 'left' },
	{ id: 'totalFiles', label: 'Files', align: 'left' },
	{ id: 'size', label: 'Size', align: 'left' },
	{ id: 'revision_no', label: 'Revisions', align: 'left' },
	{ id: 'dateCreated', label: 'Created', align: 'left' },
	{ id: '' },
];

FileListView.propTypes = {
	table: PropTypes.object,
	isNotFound: PropTypes.bool,
	tableData: PropTypes.array,
	onDeleteRow: PropTypes.func,
	dataFiltered: PropTypes.array,
	onOpenConfirm: PropTypes.func,
};

export default function FileListView ({ table, tableData, isNotFound, onDeleteRow, dataFiltered, onOpenConfirm }) {
	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		//
		selected,
		onSelectRow,
		onSelectAllRows,
		//
		onSort,
		onChangeDense,
		onChangePage,
		onChangeRowsPerPage,
	} = table;

	const denseHeight = dense ? 52 : 72;

	return (
		<>
			<Box sx={{ px: 1, position: 'relative', borderRadius: 1.5, bgcolor: 'background.neutral' }}>
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
						<>
							<Tooltip title="Share">
								<IconButton color="primary">
									<Iconify icon="eva:share-fill" />
								</IconButton>
							</Tooltip>

							<Tooltip title="Delete">
								<IconButton color="primary" onClick={onOpenConfirm}>
									<Iconify icon="eva:trash-2-outline" />
								</IconButton>
							</Tooltip>
						</>
					}
					sx={{
						pl: 1,
						pr: 2,
						top: 8,
						left: 8,
						right: 8,
						width: 'auto',
						borderRadius: 1,
					}}
				/>

				<TableContainer>
					<Table
						size={dense ? 'small' : 'medium'}
						sx={{
							minWidth: 960,
							borderCollapse: 'separate',
							borderSpacing: '0 8px',
							'& .MuiTableCell-head': {
								boxShadow: 'none !important',
							},
						}}
					>
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
							sx={{
								'& .MuiTableCell-head': {
									bgcolor: 'transparent',
								},
							}}
						/>
						<Droppable droppableId="tableRows">
							{(provided) => (
								<TableBody ref={provided.innerRef} {...provided.droppableProps}>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
										<FileTableRow
											index={index}
											key={row.item_order}
											row={row}
											selected={selected.includes(row.id)}
											onSelectRow={() => onSelectRow(row.id)}
											onDeleteRow={() => onDeleteRow(row.id)}
										/>
									))}
									{provided.placeholder}
									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

									<TableNoData isNotFound={isNotFound} />
								</TableBody>
							)}
						</Droppable>
					</Table>
				</TableContainer>
			</Box>

			<TablePaginationCustom
				count={dataFiltered.length}
				page={page}
				rowsPerPage={rowsPerPage}
				onPageChange={onChangePage}
				onRowsPerPageChange={onChangeRowsPerPage}
				//
				dense={dense}
				onChangeDense={onChangeDense}
				sx={{
					'& .MuiTablePagination-root': { borderTop: 'none' },
					'& .MuiFormControlLabel-root': { px: 0 },
				}}
			/>
		</>
	);
}
