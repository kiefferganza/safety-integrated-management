import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
const {
	Stack,
	Button,
	Select,
	MenuItem,
	Checkbox,
	TextField,
	InputLabel,
	FormControl,
	OutlinedInput,
	InputAdornment,
} = await import('@mui/material');
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

StoreTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	filterStatus: PropTypes.array,
	onFilterStatus: PropTypes.func,
	statusOptions: PropTypes.array,
	filterStartDate: PropTypes.instanceOf(Date),
	filterEndDate: PropTypes.instanceOf(Date),
	onFilterStartDate: PropTypes.func,
	onFilterEndDate: PropTypes.func,
};

const INPUT_WIDTH = 160;

export default function StoreTableToolbar ({
	isFiltered,
	filterName,
	filterStatus,
	onFilterName,
	statusOptions,
	onResetFilter,
	onFilterStatus,
	filterStartDate,
	onFilterStartDate,
	filterEndDate,
	onFilterEndDate
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
			<FormControl
				sx={{
					width: { xs: 1, md: 260 },
				}}
			>
				<InputLabel sx={{ '&.Mui-focused': { color: 'text.primary' } }}>Status</InputLabel>
				<Select
					multiple
					value={filterStatus}
					onChange={onFilterStatus}
					input={<OutlinedInput label="Status" />}
					renderValue={(selected) => selected.map((value) => sentenceCase(value)).join(', ')}
				>
					{statusOptions.map((option) => (
						<MenuItem
							key={option.value}
							value={option.value}
							sx={{
								p: 0,
								mx: 1,
								my: 0.5,
								borderRadius: 0.75,
								typography: 'body2',
								textTransform: 'capitalize',
								'&:first-of-type': { mt: 0 },
								'&:last-of-type': { mb: 0 },
							}}
						>
							<Checkbox disableRipple size="small" checked={filterStatus.includes(option.value)} />
							{option.label}
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
