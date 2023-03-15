import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

InspectionTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	onFilterStartDate: PropTypes.func,
	onFilterEndDate: PropTypes.func,
	filterStartDate: PropTypes.instanceOf(Date),
	filterEndDate: PropTypes.instanceOf(Date),
};

export default function InspectionTableToolbar ({
	isFiltered,
	filterName,
	onFilterName,
	onResetFilter,
	filterStartDate,
	filterEndDate,
	onFilterStartDate,
	onFilterEndDate,
}) {
	return (
		<Stack
			spacing={2}
			alignItems="center"
			direction={{
				xs: 'column',
				md: 'row',
			}}
			sx={{ px: 2.5, py: 1 }}
		>
			<DatePicker
				label="Start Date"
				value={filterStartDate}
				onChange={onFilterStartDate}
				inputFormat="dd MMM yyyy"
				openTo="year"
				views={['year', 'month', 'day']}
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
				label="End Date"
				value={filterEndDate}
				onChange={onFilterEndDate}
				inputFormat="dd MMM yyyy"
				openTo="year"
				views={['year', 'month', 'day']}
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
				placeholder="Search inspection"
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
