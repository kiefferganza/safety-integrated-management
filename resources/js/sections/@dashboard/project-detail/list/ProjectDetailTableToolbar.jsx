import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

ProjectDetailTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	onFilterDate: PropTypes.func,
	filterDate: PropTypes.instanceOf(Date),
	titles: PropTypes.array
};

export default function ProjectDetailTableToolbar ({
	isFiltered,
	filterName,
	onFilterName,
	onResetFilter,
	filterType,
	onFilterType,
	titles
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

			<FormControl sx={{ minWidth: 160 }}>
				<InputLabel id={'select-title'}>Type</InputLabel>
				<Select
					labelId={'select-title'}
					id={'select-title'}
					value={filterType}
					label='Type'
					onChange={onFilterType}
				>
					<MenuItem value="all">All</MenuItem>
					{titles.map((opt, idx) => (
						<MenuItem key={idx} value={opt.value}>{opt?.label}</MenuItem>
					))}
				</Select>
			</FormControl>

			<TextField
				fullWidth
				value={filterName}
				onChange={onFilterName}
				placeholder="Search name"
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
