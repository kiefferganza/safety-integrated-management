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
