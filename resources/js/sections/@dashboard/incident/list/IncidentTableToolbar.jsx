import PropTypes from 'prop-types';
const { Stack, InputAdornment, TextField, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } = await import('@mui/material');
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 170;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 140
		},
	},
};

IncidentTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	filterCause: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	onFilterCause: PropTypes.func,
	onFilterStartDate: PropTypes.func,
	onFilterEndDate: PropTypes.func,
	filterStartDate: PropTypes.instanceOf(Date),
	filterEndDate: PropTypes.instanceOf(Date),
	types: PropTypes.object
};

export function IncidentTableToolbar ({
	isFiltered,
	filterName,
	onFilterName,
	onResetFilter,
	filterCause,
	onFilterCause,
	filterStartDate,
	filterEndDate,
	onFilterStartDate,
	onFilterEndDate,
	types
}) {
	return (
		<Stack
			spacing={2}
			alignItems="center"
			direction={{
				xs: 'column',
				md: 'row',
			}}
			sx={{ px: 2, py: 1 }}
		>
			<FormControl sx={{ width: 1, maxWidth: 160 }}>
				<InputLabel id="root-cause-label">Root Cause</InputLabel>
				<Select
					labelId="root-cause-label"
					id="root-cause"
					multiple
					value={filterCause}
					onChange={onFilterCause}
					input={<OutlinedInput label="Root Cause" />}
					renderValue={(selected) => selected.join(', ')}
					MenuProps={MenuProps}
					fullWidth
				>
					{types.root_cause.map((cause) => (
						<MenuItem sx={{ px: 0 }} key={cause.id} value={cause.name}>
							<Checkbox checked={filterCause?.indexOf(cause.name) > -1} />
							<ListItemText primary={cause.name} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<DatePicker
				label="Start date"
				value={filterStartDate}
				onChange={onFilterStartDate}
				inputFormat="dd MMM yyyy"
				openTo="year"
				views={['year', 'month', 'day']}
				disableMaskedInput
				renderInput={(params) => (
					<TextField
						{...params}
						fullWidth
						sx={{
							maxWidth: { md: INPUT_WIDTH },
						}}
					/>
				)}
			/>

			<DatePicker
				label="End date"
				value={filterEndDate}
				onChange={onFilterEndDate}
				inputFormat="dd MMM yyyy"
				openTo="year"
				views={['year', 'month', 'day']}
				disableMaskedInput
				minDate={filterStartDate || new Date}
				renderInput={(params) => (
					<TextField
						{...params}
						fullWidth
						sx={{
							maxWidth: { md: INPUT_WIDTH },
						}}
					/>
				)}
			/>

			<TextField
				fullWidth
				value={filterName}
				onChange={onFilterName}
				placeholder="Search toolboxtalks"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
						</InputAdornment>
					),
				}}
			/>

			{isFiltered && (
				<Button
					color="error"
					sx={{ flexShrink: 0 }}
					onClick={onResetFilter}
					startIcon={<Iconify icon="eva:trash-2-outline" />}
				>
					Clear
				</Button>
			)}
		</Stack>
	);
}
