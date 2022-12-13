import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers';
// @mui
import {
	Stack,
	Button,
	MenuItem,
	TextField,
	InputAdornment,
} from '@mui/material';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

TrainingTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	filterStatus: PropTypes.string,
	onFilterStatus: PropTypes.func,
	statusOptions: PropTypes.array,
};

const INPUT_WIDTH = 160;

export default function TrainingTableToolbar ({
	isFiltered,
	filterName,
	filterStatus,
	onFilterName,
	filterStartDate,
	filterEndDate,
	statusOptions,
	onResetFilter,
	onFilterStatus,
	onFilterStartDate,
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
			<TextField
				fullWidth
				select
				label="Status"
				value={filterStatus}
				onChange={onFilterStatus}
				SelectProps={{
					MenuProps: {
						PaperProps: {
							sx: { maxHeight: 220 },
						},
					},
				}}
				sx={{
					maxWidth: { md: INPUT_WIDTH },
					textTransform: 'capitalize',
				}}
			>
				{statusOptions.map((option) => (
					<MenuItem
						key={option.value}
						value={option.value}
						sx={{
							mx: 1,
							my: 0.5,
							borderRadius: 0.75,
							typography: 'body2',
							textTransform: 'capitalize',
							'&:first-of-type': { mt: 0 },
							'&:last-of-type': { mb: 0 },
						}}
					>
						{option.label}
					</MenuItem>
				))}
			</TextField>

			<DatePicker
				label="Training date"
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

			<DatePicker
				label="Expiration date"
				value={filterEndDate}
				onChange={onFilterEndDate}
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
