import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------

RHFMuiSelect.propTypes = {
	name: PropTypes.string,
};

export default function RHFMuiSelect ({ name, label = "", options = [], ...other }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				// <TextField
				//   {...field}
				//   select
				//   fullWidth
				//   SelectProps={{ native: true }}
				//   error={!!error}
				//   helperText={error?.message}
				//   {...other}
				// >
				//   {children}
				// </TextField>
				<FormControl error={!!error} helperText={error?.message} {...other}>
					<InputLabel id={`select-${label}`}>{label}</InputLabel>
					<Select
						labelId={`select-${label}`}
						id={`select-${label}`}
						value={field.value}
						label={label}
						{...field}
					>
						{options.map((opt, idx) => (
							<MenuItem key={idx} value={opt.value || ''}>{opt?.label || ''}</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
		/>
	);
}
