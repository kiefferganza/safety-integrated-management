import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
const {
	Stack,
	Button,
	TextField,
	InputAdornment,
} = await import('@mui/material');
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

ReportTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	filterStartDate: PropTypes.instanceOf(Date),
	filterEndDate: PropTypes.instanceOf(Date),
	onFilterStartDate: PropTypes.func,
	onFilterEndDate: PropTypes.func,
};

const INPUT_WIDTH = 160;

export default function ReportTableToolbar ({
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
			sx={{ px: 2.5, py: 3 }}
		>
			<DatePicker
				label="Start Date"
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
				label="End Date"
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
				placeholder="Search..."
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
