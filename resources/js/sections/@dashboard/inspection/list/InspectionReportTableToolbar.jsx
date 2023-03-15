import PropTypes from 'prop-types';
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
	ListItemText
} = await import('@mui/material');
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

InspectionReportTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	filterType: PropTypes.array,
	onFilterType: PropTypes.func,
};

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

const SECTION_TITLES = [
	"Offices/Welfare Facilities",
	"Monitoring/Control",
	"Site Operations",
	"Environmental",
	"Other"
]

export default function InspectionReportTableToolbar ({
	isFiltered,
	filterName,
	onFilterName,
	onResetFilter,
	filterType = [],
	onFilterType,
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
			<FormControl sx={{ width: 1, maxWidth: 240 }}>
				<InputLabel id="tbt-type-label">Section Title</InputLabel>
				<Select
					labelId="tbt-type-label"
					id="tbt-type"
					multiple
					value={filterType}
					onChange={onFilterType}
					input={<OutlinedInput label="Section Title" />}
					renderValue={(selected) => selected.join(', ')}
					MenuProps={MenuProps}
					fullWidth
				>
					{SECTION_TITLES.map((name) => (
						<MenuItem sx={{ px: 0 }} key={name} value={name}>
							<Checkbox checked={filterType?.indexOf(name) > -1} />
							<ListItemText primary={name} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
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
