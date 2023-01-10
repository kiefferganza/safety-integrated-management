import { useState } from 'react';
// @mui
import { Stack, Dialog, TextField, Typography, ListItemButton, InputAdornment, IconButton, ListItemIcon, Checkbox } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import Scrollbar from '@/Components/scrollbar';
import SearchNotFound from '@/Components/search-not-found';


const ToolboxTalkEmployeeDialog = ({ open, selected, onClose, onSelect, participants }) => {
	const [searchEmployee, setSearchEmployee] = useState('');

	const dataFiltered = applyFilter(participants, searchEmployee);

	const isNotFound = !dataFiltered.length && !!searchEmployee;

	const handleSearchEmployee = (event) => {
		setSearchEmployee(event.target.value);
	};

	const handleSelectEmployee = (employee) => {
		onSelect(employee);
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
				<Typography variant="h6"> Select participants </Typography>

				{participants.length > 0 ? (
					<IconButton sx={{ alignSelf: 'flex-end' }} onClick={onClose}>
						<Iconify icon="material-symbols:check" sx={{ color: 'primary.main' }} />
					</IconButton>
				) : (
					<IconButton sx={{ alignSelf: 'flex-end' }} onClick={onClose}>
						<Iconify icon="material-symbols:close" sx={{ color: 'text.disabled' }} />
					</IconButton>
				)}
			</Stack>

			<Stack sx={{ p: 2.5 }}>
				<TextField
					value={searchEmployee}
					onChange={handleSearchEmployee}
					placeholder="Search..."
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			{isNotFound ? (
				<SearchNotFound query={searchEmployee} sx={{ px: 3, pt: 5, pb: 10 }} />
			) : (
				<Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
					{dataFiltered.map((employee, index) => (
						<ListItemButton
							key={employee.employee_id}
							selected={employee.selected}
							onClick={() => handleSelectEmployee(searchEmployee !== "" ? participants.findIndex(p => p.employee_id === employee.employee_id) : index)}
							sx={{
								p: 1.5,
								mb: 1,
								borderRadius: 1,
								alignItems: 'flex-start',
								'&.Mui-selected': {
									bgcolor: 'action.selected',
									'&:hover': {
										bgcolor: 'action.selected',
									},
								},
							}}
						>
							<ListItemIcon>
								<Checkbox
									edge="start"
									tabIndex={-1}
									disableRipple
									checked={employee.selected}
									onChange={() => handleSelectEmployee(searchEmploye !== "" ? participants.findIndex(p => p.employee_id === employee.employee_id) : index)}
								/>
							</ListItemIcon>
							<Stack>
								<Typography variant="subtitle2">{employee?.fullname}</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{employee?.position?.position}
								</Typography>
							</Stack>
						</ListItemButton>
					))}
				</Scrollbar>
			)}
		</Dialog>
	)
}

function applyFilter (array, query) {
	if (query) {
		return array.filter(
			(employee) =>
				`${employee?.firstname} ${employee?.lastname}`.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
				employee?.position?.position.toLowerCase().indexOf(query.toLowerCase()) !== -1
		);
	}

	return array;
}

export default ToolboxTalkEmployeeDialog