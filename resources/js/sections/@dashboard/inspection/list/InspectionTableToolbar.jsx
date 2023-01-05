import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

EmployeeTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	onFilterStartDate: PropTypes.func,
	filterStartDate: PropTypes.instanceOf(Date),
};

export default function EmployeeTableToolbar ({
	isFiltered,
	filterName,
	onFilterName,
	onResetFilter,
	filterStartDate,
	onFilterStartDate,
	right
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
				label="Date Created"
				value={filterStartDate}
				onChange={onFilterStartDate}
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
			{right}
		</Stack>
	);
}
